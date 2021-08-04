import * as record from 'N/record';

function getSublist(rec: record.Record, sublistId: string): Sublist {
    return new Sublist(rec, sublistId);
}

class Sublist implements Iterable<SublistLine> {
    private rec: record.Record;
    private _sublistId: string;

    get sublistId() {
        return this._sublistId;
    }

    constructor(rec: record.Record, sublistId: string) {
        this.rec = rec;
        this._sublistId = sublistId;
    }

    getLine = (lineNumber: number): SublistLine => {
        return new SublistLine(this, lineNumber);
    }

    getRecord = (): record.Record => {
        return this.rec;
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
    private sublist: Sublist;
    private _lineNumber: number;

    get lineNumber() {
        return this._lineNumber;
    }

    constructor(sublist: Sublist, lineNumber: number) {
        this.sublist = sublist;
        this._lineNumber = lineNumber;
    }

    getField = (fieldId: string): SublistField => {
        return new SublistField(this, fieldId);
    }

    getSublist = (): Sublist => {
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

    private getRecord = (): record.Record => {
        return this.line.getSublist().getRecord();
    }

    getValue = (): record.FieldValue => {
        return this.getRecord().getSublistValue({
            fieldId: this.fieldId,
            line: this.line.lineNumber,
            sublistId: this.line.getSublist().sublistId,
        });
    }

    getText = (): string => {
        return this.getRecord().getSublistText({
            fieldId: this.fieldId,
            line: this.line.lineNumber,
            sublistId: this.line.getSublist().sublistId,
        });
    }

    setValue = (newValue: record.FieldValue): SublistLine => {
        this.getRecord().setSublistValue({
            sublistId: this.line.getSublist().sublistId,
            line: this.line.lineNumber,
            fieldId: this.fieldId,
            value: newValue,
        });
        return this.line;
    }

    modifyValue = <T extends record.FieldValue>(closure: (oldValue: T) => T): SublistLine => {
        const oldValue = this.getValue() as T;
        const newValue = closure(oldValue);
        return this.setValue(newValue);
    }
}

export = { getSublist, Sublist, SublistLine, SublistField };
