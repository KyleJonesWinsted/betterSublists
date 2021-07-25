"use strict";
function getSublist(rec, sublistId) {
    return new Sublist(rec, sublistId);
}
class Sublist {
    constructor(rec, sublistId) {
        this.getLine = (lineNumber) => {
            return new SublistLine(this, lineNumber);
        };
        this.getRecord = () => {
            return this.rec;
        };
        this.collect = () => {
            const arr = [];
            for (const line of this) {
                arr.push(line);
            }
            return arr;
        };
        this.forEach = (closure) => {
            let index = 0;
            const array = this.collect();
            for (const line of this)
                closure(line, index, array);
        };
        this.reduce = (closure, initialValue) => {
            let acc = initialValue;
            let index = 0;
            const array = this.collect();
            for (const line of this) {
                acc = closure(acc, line, index++, array);
            }
            return acc;
        };
        this.map = (closure) => {
            const mapped = [];
            let index = 0;
            const array = this.collect();
            for (const line of this) {
                mapped.push(closure(line, index++, array));
            }
            return mapped;
        };
        this.filter = (closure) => {
            const filtered = [];
            let index = 0;
            const array = this.collect();
            for (const line of this) {
                if (closure(line, index++, array))
                    filtered.push(line);
            }
            return filtered;
        };
        this.findIndex = (closure) => {
            let index = 0;
            const array = this.collect();
            for (const line of this) {
                if (closure(line, index++, array))
                    return --index;
            }
            return -1;
        };
        this.find = (closure) => {
            const index = this.findIndex(closure);
            return this.collect()[index];
        };
        this.rec = rec;
        this._sublistId = sublistId;
    }
    get sublistId() {
        return this._sublistId;
    }
    *[Symbol.iterator]() {
        let line = 0;
        const lineCount = this.rec.getLineCount({ sublistId: this.sublistId });
        while (line < lineCount) {
            yield new SublistLine(this, line++);
        }
    }
}
class SublistLine {
    constructor(sublist, lineNumber) {
        this.getField = (fieldId) => {
            return new SublistField(this, fieldId);
        };
        this.getSublist = () => {
            return this.sublist;
        };
        this.sublist = sublist;
        this._lineNumber = lineNumber;
    }
    get lineNumber() {
        return this._lineNumber;
    }
}
class SublistField {
    constructor(line, fieldId) {
        this.getRecord = () => {
            return this.line.getSublist().getRecord();
        };
        this.getValue = () => {
            return this.getRecord().getSublistValue({
                fieldId: this.fieldId,
                line: this.line.lineNumber,
                sublistId: this.line.getSublist().sublistId,
            });
        };
        this.setValue = (newValue) => {
            this.getRecord().setSublistValue({
                sublistId: this.line.getSublist().sublistId,
                line: this.line.lineNumber,
                fieldId: this.fieldId,
                value: newValue,
            });
            return this.line;
        };
        this.modifyValue = (closure) => {
            const oldValue = this.getValue();
            const newValue = closure(oldValue);
            return this.setValue(newValue);
        };
        this.line = line;
        this.fieldId = fieldId;
    }
}
module.exports = { getSublist, Sublist, SublistLine, SublistField };
