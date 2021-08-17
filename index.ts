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

    getLine = (lineNumber: number): SublistLine => {
        return new SublistLine(this, lineNumber);
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

    forEach = (closure: (line: SublistLine, index?: number, array?: SublistLine[]) => void): void => {
        let index = 0;
        const array = this.collect();
        for (const line of this) closure(line, index, array);
    }

    reduce = <T>(
        closure: (
            accumulator: T,
            line: SublistLine,
            index?: number,
            array?: SublistLine[]
        ) => T, initialValue: T
    ): T => {
        let acc = initialValue;
        let index = 0;
        const array = this.collect();
        for (const line of this) {
            acc = closure(acc, line, index++, array);
        }
        return acc;
    }

    map = <T>(closure: (line: SublistLine, index?: number, array?: SublistLine[]) => T): T[] => {
        const mapped = [];
        let index = 0;
        const array = this.collect();
        for (const line of this) {
            mapped.push(closure(line, index++, array));
        }
        return mapped;
    }

    filter = (
        closure: (line: SublistLine, index?: number, array?: SublistLine[]) => boolean
    ): SublistLine[] => {
        const filtered = [];
        let index = 0;
        const array = this.collect();
        for (const line of this) {
            if (closure(line, index++, array)) filtered.push(line);
        }
        return filtered;
    }

    findIndex = (
        closure: (line: SublistLine, index?: number, array?: SublistLine[]) => boolean
    ): number => {
        let index = 0;
        const array = this.collect();
        for (const line of this) {
            if (closure(line, index++, array)) return --index;
        }
        return -1;
    }

    find = (
        closure: (line: SublistLine, index?: number, array?: SublistLine[]) => boolean
    ): SublistLine | undefined => {
        const index = this.findIndex(closure);
        return this.collect()[index];
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
}

export { getSublist, Sublist, SublistLine, SublistField };
