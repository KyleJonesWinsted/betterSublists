var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    function getSublist(rec, sublistId) {
        return new Sublist(rec, sublistId);
    }
    var Sublist = /** @class */ (function () {
        function Sublist(rec, sublistId) {
            var _this = this;
            this.getLine = function (lineNumber) {
                return new SublistLine(_this, lineNumber);
            };
            this.getRecord = function () {
                return _this.rec;
            };
            this.collect = function () {
                var e_1, _a;
                var arr = [];
                try {
                    for (var _b = __values(_this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var line = _c.value;
                        arr.push(line);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return arr;
            };
            this.forEach = function (closure) {
                var e_2, _a;
                var index = 0;
                var array = _this.collect();
                try {
                    for (var _b = __values(_this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var line = _c.value;
                        closure(line, index, array);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            };
            this.reduce = function (closure, initialValue) {
                var e_3, _a;
                var acc = initialValue;
                var index = 0;
                var array = _this.collect();
                try {
                    for (var _b = __values(_this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var line = _c.value;
                        acc = closure(acc, line, index++, array);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return acc;
            };
            this.map = function (closure) {
                var e_4, _a;
                var mapped = [];
                var index = 0;
                var array = _this.collect();
                try {
                    for (var _b = __values(_this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var line = _c.value;
                        mapped.push(closure(line, index++, array));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return mapped;
            };
            this.filter = function (closure) {
                var e_5, _a;
                var filtered = [];
                var index = 0;
                var array = _this.collect();
                try {
                    for (var _b = __values(_this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var line = _c.value;
                        if (closure(line, index++, array))
                            filtered.push(line);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return filtered;
            };
            this.findIndex = function (closure) {
                var e_6, _a;
                var index = 0;
                var array = _this.collect();
                try {
                    for (var _b = __values(_this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var line = _c.value;
                        if (closure(line, index++, array))
                            return --index;
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return -1;
            };
            this.find = function (closure) {
                var index = _this.findIndex(closure);
                return _this.collect()[index];
            };
            this.rec = rec;
            this._sublistId = sublistId;
        }
        Object.defineProperty(Sublist.prototype, "sublistId", {
            get: function () {
                return this._sublistId;
            },
            enumerable: false,
            configurable: true
        });
        Sublist.prototype[Symbol.iterator] = function () {
            var line, lineCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        line = 0;
                        lineCount = this.rec.getLineCount({ sublistId: this.sublistId });
                        _a.label = 1;
                    case 1:
                        if (!(line < lineCount)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new SublistLine(this, line++)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        };
        return Sublist;
    }());
    var SublistLine = /** @class */ (function () {
        function SublistLine(sublist, lineNumber) {
            var _this = this;
            this.getField = function (fieldId) {
                return new SublistField(_this, fieldId);
            };
            this.getSublist = function () {
                return _this.sublist;
            };
            this.sublist = sublist;
            this._lineNumber = lineNumber;
        }
        Object.defineProperty(SublistLine.prototype, "lineNumber", {
            get: function () {
                return this._lineNumber;
            },
            enumerable: false,
            configurable: true
        });
        return SublistLine;
    }());
    var SublistField = /** @class */ (function () {
        function SublistField(line, fieldId) {
            var _this = this;
            this.getRecord = function () {
                return _this.line.getSublist().getRecord();
            };
            this.getValue = function () {
                return _this.getRecord().getSublistValue({
                    fieldId: _this.fieldId,
                    line: _this.line.lineNumber,
                    sublistId: _this.line.getSublist().sublistId,
                });
            };
            this.setValue = function (newValue) {
                _this.getRecord().setSublistValue({
                    sublistId: _this.line.getSublist().sublistId,
                    line: _this.line.lineNumber,
                    fieldId: _this.fieldId,
                    value: newValue,
                });
                return _this.line;
            };
            this.modifyValue = function (closure) {
                var oldValue = _this.getValue();
                var newValue = closure(oldValue);
                return _this.setValue(newValue);
            };
            this.line = line;
            this.fieldId = fieldId;
        }
        return SublistField;
    }());
    return { getSublist: getSublist, Sublist: Sublist, SublistLine: SublistLine, SublistField: SublistField };
});
