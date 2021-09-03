import * as record from 'N/record';
declare type Record = record.Record | record.ClientCurrentRecord;
declare function getSublist(rec: Record, sublistId: string): Sublist;
declare class Sublist implements Iterable<SublistLine> {
    private rec;
    private _sublistId;
    get sublistId(): string;
    get record(): Record;
    get lineCount(): number;
    constructor(rec: Record, sublistId: string);
    getLine: (lineNumber: number) => SublistLine;
    getNSSublist: () => record.Sublist;
    addLine: (index: number) => SublistLine;
    addNewLine: () => SublistLine;
    removeLine: (index: number) => void;
    [Symbol.iterator](): Iterator<SublistLine, any, undefined>;
    collect: () => SublistLine[];
    forEach: (callbackfn: (value: SublistLine, index: number, array: SublistLine[]) => void, thisArg?: any) => void;
    reduce: {
        (callbackfn: (previousValue: SublistLine, currentValue: SublistLine, currentIndex: number, array: SublistLine[]) => SublistLine): SublistLine;
        (callbackfn: (previousValue: SublistLine, currentValue: SublistLine, currentIndex: number, array: SublistLine[]) => SublistLine, initialValue: SublistLine): SublistLine;
        <U>(callbackfn: (previousValue: U, currentValue: SublistLine, currentIndex: number, array: SublistLine[]) => U, initialValue: U): U;
    };
    map: <U>(callbackfn: (value: SublistLine, index: number, array: SublistLine[]) => U, thisArg?: any) => U[];
    filter: {
        <S extends SublistLine>(predicate: (value: SublistLine, index: number, array: SublistLine[]) => value is S, thisArg?: any): S[];
        (predicate: (value: SublistLine, index: number, array: SublistLine[]) => unknown, thisArg?: any): SublistLine[];
    };
    findIndex: (predicate: (value: SublistLine, index: number, obj: SublistLine[]) => unknown, thisArg?: any) => number;
    find: {
        <S extends SublistLine>(predicate: (this: void, value: SublistLine, index: number, obj: SublistLine[]) => value is S, thisArg?: any): S | undefined;
        (predicate: (value: SublistLine, index: number, obj: SublistLine[]) => unknown, thisArg?: any): SublistLine | undefined;
    };
    reverse: () => SublistLine[];
    slice: (start?: number | undefined, end?: number | undefined) => SublistLine[];
    splice: {
        (start: number, deleteCount?: number | undefined): SublistLine[];
        (start: number, deleteCount: number, ...items: SublistLine[]): SublistLine[];
    };
}
declare class SublistLine {
    private _sublist;
    private _lineNumber;
    get lineNumber(): number;
    get sublist(): Sublist;
    constructor(sublist: Sublist, lineNumber: number);
    getField: (fieldId: string) => SublistField;
    commit: () => SublistLine;
    cancel: () => Sublist;
}
declare class SublistField {
    private line;
    private fieldId;
    constructor(line: SublistLine, fieldId: string);
    get record(): Record;
    getValue: () => record.FieldValue;
    getText: () => string;
    getSubrecord: () => record.Record;
    setValue: (value: record.FieldValue) => SublistLine;
    setText: (text: string) => SublistLine;
    modifyValue: <T extends record.FieldValue>(closure: (oldValue: T) => T) => SublistLine;
    modifyText: (closure: (oldValue: string) => string) => SublistLine;
    hasSubrecord: () => boolean;
    removeSubrecord: () => SublistLine;
    getNSField: () => record.Field;
    getNSColumn: () => record.Column;
}
export { getSublist, Sublist, SublistLine, SublistField };
