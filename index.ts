import * as record from 'N/record';

type Record = record.Record | record.ClientCurrentRecord;

function getSublist(rec: Record, sublistId: string): Sublist {
    return new Sublist(rec, sublistId);
}

class Sublist implements Iterable<SublistLine> {
    private rec: Record;
    private _sublistId: string;

    get sublistId() {
        return this._sublistId;
    }

    get record(): Record {
        return this.rec;
    }

    constructor(rec: Record, sublistId: string) {
        this.rec = rec;
        this._sublistId = sublistId;
    }

    lineCount = (): number => {
        return this.rec.getLineCount({ sublistId: this.sublistId });
    }

    getLine = (lineNumber: number): SublistLine => {
        return new SublistLine(this, lineNumber);
    }

    getNSSublist = (): record.Sublist => {
        return this.rec.getSublist({ sublistId: this.sublistId });
    }

    addLine = (index: number): SublistLine => {
        this.rec.insertLine({ line: index, sublistId: this.sublistId });
        return this.getLine(index);
    }

    addNewLine = (): SublistLine => {
        return this.addLine(this.lineCount());
    }

    removeLine = (index: number): void => {
        this.rec.removeLine({ line: index, sublistId: this.sublistId });
    }

    *[Symbol.iterator](): Iterator<SublistLine, any, undefined> {
        let line = 0;
        const lineCount = this.rec.getLineCount({ sublistId: this.sublistId });
        while (line < lineCount) {
            yield new SublistLine(this, line++);
        }
    }

    collect = (): SublistLine[] => {
        const arr = [];
        for (const line of this) {
            arr.push(line);
        }
        return arr;
    }

    forEach = (callbackFn: (value: SublistLine, index: number, array: SublistLine[]) => void): void => {
        this.collect().forEach(callbackFn);
    }

    reduce = <T>(callbackfn: (previousValue: T, currentValue: SublistLine, currentIndex: number, array: SublistLine[]) => T, initialValue: T): T => {
        return this.collect().reduce(callbackfn, initialValue);
    }

    map = <U>(callbackfn: (value: SublistLine, index: number, array: SublistLine[]) => U): U[] => {
        return this.collect().map(callbackfn);
    }

    filter = (predicate: (value: SublistLine, index: number, array: SublistLine[]) => boolean): SublistLine[] => {
        return this.collect().filter(predicate);
    }

    findIndex = (predicate: (value: SublistLine, index: number, obj: SublistLine[]) => unknown): number => {
        return this.collect().findIndex(predicate);
    }

    find = (predicate: (value: SublistLine, index: number, obj: SublistLine[]) => boolean): SublistLine | undefined => {
        return this.collect().find(predicate);
    }

    reverse = (): SublistLine[] => {
        return this.collect().reverse();
    }

    slice = (start?: number | undefined, end?: number | undefined): SublistLine[] => {
        return this.collect().slice(start, end);
    }
}

class SublistLine {
    private _sublist: Sublist;
    private _lineNumber: number;

    get lineNumber() {
        return this._lineNumber;
    }

    get sublist(): Sublist {
        return this._sublist;
    }

    constructor(sublist: Sublist, lineNumber: number) {
        this._sublist = sublist;
        this._lineNumber = lineNumber;
    }

    getField = (fieldId: string): SublistField => {
        return new SublistField(this, fieldId);
    }

    commit = (): SublistLine => {
        if (this.sublist.record.isDynamic) {
            this.sublist.record.commitLine({ sublistId: this.sublist.sublistId })
        }
        return this;
    }

    cancel = (): Sublist => {
        this.sublist.record.cancelLine({ sublistId: this.sublist.sublistId });
        return this.sublist;
    }
}

class SublistField {
    private line: SublistLine;
    private fieldId: string;

    constructor(line: SublistLine, fieldId: string) {
        this.line = line;
        this.fieldId = fieldId;
    }

    get record(): Record {
        return this.line.sublist.record;
    }

    getValue = (): record.FieldValue => {
        return this.record.getSublistValue({
            fieldId: this.fieldId,
            line: this.line.lineNumber,
            sublistId: this.line.sublist.sublistId,
        });
    }

    getText = (): string => {
        return this.record.getSublistText({
            fieldId: this.fieldId,
            line: this.line.lineNumber,
            sublistId: this.line.sublist.sublistId,
        });
    }

    getSubrecord = (): record.Record => {
        const rec = this.record;
        const fieldId = this.fieldId;
        const line = this.line.lineNumber;
        const sublistId = this.line.sublist.sublistId;
        if (rec.isDynamic || !("getSublistSubrecord" in rec)) {
            rec.selectLine({ sublistId, line });
            return rec.getCurrentSublistSubrecord({ sublistId, fieldId });
        } else {
            return rec.getSublistSubrecord({ sublistId, fieldId, line });
        } 
    }

    setValue = (value: record.FieldValue): SublistLine => {
        const rec = this.record;
        const sublistId = this.line.sublist.sublistId;
        const line = this.line.lineNumber;
        const fieldId = this.fieldId;
        if (rec.isDynamic || !("setSublistValue" in rec)) {
            rec.selectLine({ sublistId, line });
            rec.setCurrentSublistValue({ sublistId, fieldId, value });
        } else {
            rec.setSublistValue({ sublistId, fieldId, line, value });
        }
        return this.line;
    }

    setText = (text: string): SublistLine => {
        const rec = this.record;
        const sublistId = this.line.sublist.sublistId;
        const line = this.line.lineNumber;
        const fieldId = this.fieldId;
        if (rec.isDynamic || !("setSublistText" in rec)) {
            rec.selectLine({ sublistId, line });
            rec.setCurrentSublistText({ sublistId, fieldId, text });
        } else {
            rec.setSublistText({ sublistId, fieldId, line, text });
        }
        return this.line;
    }

    modifyValue = <T extends record.FieldValue>(closure: (oldValue: T) => T): SublistLine => {
        const oldValue = this.getValue() as T;
        const newValue = closure(oldValue);
        return this.setValue(newValue);
    }

    modifyText = (closure: (oldValue: string) => string): SublistLine => {
        const oldValue = this.getText();
        const newValue = closure(oldValue);
        return this.setText(newValue);
    }

    hasSubrecord = (): boolean => {
        return this.record.hasSublistSubrecord({
            fieldId: this.fieldId,
            line: this.line.lineNumber,
            sublistId: this.line.sublist.sublistId,
        });
    }

    removeSubrecord = (): SublistLine => {
        if ('removeSublistSubrecord' in this.record) {
            this.record.removeSublistSubrecord({
                fieldId: this.fieldId,
                line: this.line.lineNumber,
                sublistId: this.line.sublist.sublistId,
            });
        } else {
            this.record.removeCurrentSublistSubrecord({
                fieldId: this.fieldId,
                sublistId: this.line.sublist.sublistId,
            });
        }
        return this.line;
    }

    getNSField = (): record.Field => {
        return this.line.sublist.record.getSublistField({
            sublistId: this.line.sublist.sublistId,
            fieldId: this.fieldId,
            line: this.line.lineNumber,
        });
    }

    getNSColumn = (): record.Column => {
        return this.line.sublist.getNSSublist().getColumn({ fieldId: this.fieldId });
    }
}

export { getSublist, Sublist, SublistLine, SublistField };
