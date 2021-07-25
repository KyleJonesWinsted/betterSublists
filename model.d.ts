import * as record from '@hitc/netsuite-types/N/record';
declare function getSublist(rec: record.Record, sublistId: string): Sublist;
declare class Sublist implements Iterable<SublistLine> {
    private rec;
    private _sublistId;
    get sublistId(): string;
    constructor(rec: record.Record, sublistId: string);
    getLine: (lineNumber: number) => SublistLine;
    getRecord: () => record.Record;
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
    private sublist;
    private _lineNumber;
    get lineNumber(): number;
    constructor(sublist: Sublist, lineNumber: number);
    getField: (fieldId: string) => SublistField;
    getSublist: () => Sublist;
}
declare class SublistField {
    private line;
    private fieldId;
    constructor(line: SublistLine, fieldId: string);
    private getRecord;
    getValue: () => record.FieldValue;
    setValue: (newValue: record.FieldValue) => SublistLine;
    modifyValue: <T extends record.FieldValue>(closure: (oldValue: T) => T) => SublistLine;
}
declare const _default: {
    getSublist: typeof getSublist;
    Sublist: typeof Sublist;
    SublistLine: typeof SublistLine;
    SublistField: typeof SublistField;
};
export = _default;
