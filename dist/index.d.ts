import * as record from 'N/record';
declare function getSublist(rec: record.Record, sublistId: string): Sublist;
declare class Sublist implements Iterable<SublistLine> {
    private rec;
    private _sublistId;
    get sublistId(): string;
    get record(): record.Record;
    constructor(rec: record.Record, sublistId: string);
    getLine: (lineNumber: number) => SublistLine;
    [Symbol.iterator](): Iterator<SublistLine, any, undefined>;
    collect: () => SublistLine[];
    forEach: (closure: (line: SublistLine, index?: number | undefined, array?: SublistLine[] | undefined) => void) => void;
    reduce: <T>(closure: (accumulator: T, line: SublistLine, index?: number | undefined, array?: SublistLine[] | undefined) => T, initialValue: T) => T;
    map: <T>(closure: (line: SublistLine, index?: number | undefined, array?: SublistLine[] | undefined) => T) => T[];
    filter: (closure: (line: SublistLine, index?: number | undefined, array?: SublistLine[] | undefined) => boolean) => SublistLine[];
    findIndex: (closure: (line: SublistLine, index?: number | undefined, array?: SublistLine[] | undefined) => boolean) => number;
    find: (closure: (line: SublistLine, index?: number | undefined, array?: SublistLine[] | undefined) => boolean) => SublistLine | undefined;
}
declare class SublistLine {
    private _sublist;
    private _lineNumber;
    get lineNumber(): number;
    get sublist(): Sublist;
    constructor(sublist: Sublist, lineNumber: number);
    getField: (fieldId: string) => SublistField;
    commit: () => SublistLine;
}
declare class SublistField {
    private line;
    private fieldId;
    constructor(line: SublistLine, fieldId: string);
    get record(): record.Record;
    getValue: () => record.FieldValue;
    getText: () => string;
    getSubrecord: () => record.Record;
    setValue: (value: record.FieldValue, commit?: boolean) => SublistLine;
    setText: (text: string) => SublistLine;
    modifyValue: <T extends record.FieldValue>(closure: (oldValue: T) => T) => SublistLine;
    modifyText: (closure: (oldValue: string) => string) => SublistLine;
}
export { getSublist, Sublist, SublistLine, SublistField };
