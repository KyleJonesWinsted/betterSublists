import * as record from 'N/record';
type Record = record.Record | record.ClientCurrentRecord;
declare function getSublist(rec: Record, sublistId: string, isDynamic?: boolean | null): Sublist;
declare class Sublist implements Iterable<SublistLine> {
    private rec;
    private _sublistId;
    private _isDynamic;
    get sublistId(): string;
    get record(): Record;
    get isDynamic(): boolean;
    constructor(rec: Record, sublistId: string, isDynamic?: boolean | null);
    lineCount: () => number;
    getLine: (lineNumber: number) => SublistLine;
    getCurrentLine: () => SublistLine;
    getNSSublist: () => record.Sublist;
    addLine: (index: number) => SublistLine;
    addNewLine: () => SublistLine;
    removeLine: (index: number) => void;
    [Symbol.iterator](): Iterator<SublistLine, any, undefined>;
    collect: () => SublistLine[];
    forEach: (callbackFn: (value: SublistLine, index: number, array: SublistLine[]) => void) => void;
    reduce: <T>(callbackfn: (previousValue: T, currentValue: SublistLine, currentIndex: number, array: SublistLine[]) => T, initialValue: T) => T;
    map: <U>(callbackfn: (value: SublistLine, index: number, array: SublistLine[]) => U) => U[];
    filter: (predicate: (value: SublistLine, index: number, array: SublistLine[]) => boolean) => SublistLine[];
    findIndex: (predicate: (value: SublistLine, index: number, obj: SublistLine[]) => unknown) => number;
    find: (predicate: (value: SublistLine, index: number, obj: SublistLine[]) => boolean) => SublistLine | undefined;
    reverse: () => SublistLine[];
    slice: (start?: number | undefined, end?: number | undefined) => SublistLine[];
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
    get isDynamic(): boolean;
    getValue: () => record.FieldValue;
    getText: () => string;
    getSubrecord: () => record.Record;
    setValue: (value: record.FieldValue, ignoreFieldChange?: boolean) => SublistLine;
    setText: (text: string) => SublistLine;
    modifyValue: <T extends record.FieldValue>(closure: (oldValue: T) => T) => SublistLine;
    modifyText: (closure: (oldValue: string) => string) => SublistLine;
    hasSubrecord: () => boolean;
    removeSubrecord: () => SublistLine;
    getNSField: () => record.Field;
    getNSColumn: () => record.Column;
}
export { getSublist, Sublist, SublistLine, SublistField };
