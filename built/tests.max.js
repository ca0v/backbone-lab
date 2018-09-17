var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define("node_modules/ceylon/src/interfaces/expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/boolean-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/number-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/string-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/array-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/function-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/object-expectation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/interfaces/expect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("node_modules/ceylon/src/fast-deep-equal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let isArray = Array.isArray;
    let keyList = Object.keys;
    let hasProp = Object.prototype.hasOwnProperty;
    function equal(a, b) {
        if (a === b) {
            return true;
        }
        if (a && b && typeof a == "object" && typeof b == "object") {
            let arrA = isArray(a), arrB = isArray(b), i, length, key;
            if (arrA && arrB) {
                length = a.length;
                if (length !== b.length)
                    return false;
                for (i = length; i-- !== 0;)
                    if (!equal(a[i], b[i]))
                        return false;
                return true;
            }
            if (arrA !== arrB) {
                return false;
            }
            let dateA = a instanceof Date, dateB = b instanceof Date;
            if (dateA !== dateB) {
                return false;
            }
            if (dateA && dateB)
                return a.getTime() === b.getTime();
            let regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
            if (regexpA !== regexpB)
                return false;
            if (regexpA && regexpB)
                return a.toString() === b.toString();
            let keys = keyList(a);
            length = keys.length;
            if (length !== keyList(b).length)
                return false;
            for (i = length; i-- !== 0;)
                if (!hasProp.call(b, keys[i]))
                    return false;
            for (i = length; i-- !== 0;) {
                key = keys[i];
                if (!equal(a[key], b[key]))
                    return false;
            }
            return true;
        }
        return a !== a && b !== b;
    }
    exports.equal = equal;
});
define("node_modules/ceylon/src/assertion-error", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1({ message, expected, actual, showDiff }) {
        const error = new Error(message);
        // Properties used by Mocha and other frameworks to show errors
        error['expected'] = expected;
        error['actual'] = actual;
        error['showDiff'] = showDiff;
        // Set the error name to an AssertionError
        error.name = 'AssertionError';
        return error;
    }
    exports.default = default_1;
});
define("node_modules/ceylon/src/assert", ["require", "exports", "node_modules/ceylon/src/assertion-error"], function (require, exports, assertion_error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    assertion_error_1 = __importDefault(assertion_error_1);
    /**
     * Creates an Assertion, which throws an AssertionError when the condition specified in the assertion parameter equates to false
     *
     * @param {IAssertOptions} { assertion, message, actual, expected }
     */
    const assert = ({ assertion, message, actual, expected }) => {
        if (!assertion) {
            const error = assertion_error_1.default({
                actual,
                expected,
                message,
                showDiff: typeof actual !== 'undefined' && typeof expected !== 'undefined',
            });
            throw error;
        }
    };
    exports.default = assert;
});
define("node_modules/ceylon/src/expectation", ["require", "exports", "node_modules/ceylon/src/fast-deep-equal", "node_modules/ceylon/src/assert"], function (require, exports, fast_deep_equal_1, assert_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    assert_1 = __importDefault(assert_1);
    class Expectation {
        constructor(actual) {
            this.actual = actual;
        }
        /**
         * Asserts that the tested item exists (is not null, undefined, or empty)
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toExist(message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length !== 0,
                    message: message || "Expected array to exist"
                });
            }
            else if (typeof this.actual === "object" && this.actual !== null) {
                assert_1.default({
                    assertion: Object.getOwnPropertyNames(this.actual).length !== 0,
                    message: message || "Expected object to exist"
                });
            }
            else {
                assert_1.default({
                    assertion: typeof this.actual !== "undefined" && this.actual !== null && this.actual !== "",
                    message: message || "Expected item to exist"
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item does not exist (is null, undefined, or empty)
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotExist(message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length === 0,
                    message: message || "Expected array to not exist"
                });
            }
            else if (typeof this.actual === "object" && this.actual !== null) {
                assert_1.default({
                    assertion: Object.getOwnPropertyNames(this.actual).length === 0,
                    message: message || "Expected object to not exist"
                });
            }
            else {
                assert_1.default({
                    assertion: typeof this.actual === "undefined" || this.actual === null || this.actual === "",
                    message: message || "Expected item to not exist"
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item is strictly equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBe(value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: this.actual === value,
                expected: value,
                message: message || `Expected ${JSON.stringify(this.actual)} to be ${JSON.stringify(value)}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is not strictly equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotBe(value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: this.actual !== value,
                expected: value,
                message: message || `Expected ${JSON.stringify(this.actual)} to not be ${JSON.stringify(value)}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is deep equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toEqual(value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: fast_deep_equal_1.equal(this.actual, value),
                expected: value,
                message: message || `Expected ${JSON.stringify(this.actual)} to equal ${JSON.stringify(value)}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is not deep equal to value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotEqual(value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                actual: this.actual,
                assertion: !fast_deep_equal_1.equal(this.actual, value),
                expected: value,
                message: message || `Expected ${JSON.stringify(this.actual)} to not equal ${JSON.stringify(value)}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is true
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeTrue(message) {
            return this.toBe(true, message);
        }
        /**
         * Asserts that the tested item is false
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeFalse(message) {
            return this.toBe(false, message);
        }
        /**
         * Asserts that the tested item is less than value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeLessThan(value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            else {
                assert_1.default({
                    assertion: this.actual < value,
                    message: message || `Expected ${this.actual} to be less than ${value}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item is less than value
         * Alias for toBeLessThan
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeFewerThan(value, message) {
            return this.toBeLessThan(value, message);
        }
        /**
         * Asserts that the tested item is less than or equal to value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeLessThanOrEqualTo(value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual <= value,
                message: message || `Expected ${this.actual} to be less than or equal to ${value}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is less than or equal to value
         * Alias for toBeLessThanOrEqualTo
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeFewerThanOrEqualTo(value, message) {
            return this.toBeLessThanOrEqualTo(value, message);
        }
        /**
         * Asserts that the tested item is greater than value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeGreaterThan(value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual > value,
                message: message || `Expected ${this.actual} to be greater than ${value}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is greater than value
         * Alias for toBeGreaterThan
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeMoreThan(value, message) {
            return this.toBeGreaterThan(value, message);
        }
        /**
         * Asserts that the tested item is greater than or equal to value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeGreaterThanOrEqualTo(value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "number") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a number"
                });
            }
            assert_1.default({
                assertion: this.actual >= value,
                message: message || `Expected ${this.actual} to be greater than or equal to ${value}`
            });
            return this;
        }
        /**
         * Asserts that the tested item is greater than or equal to value
         * Alias for toBeGreaterThanOrEqualTo
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeMoreThanOrEqualTo(value, message) {
            return this.toBeGreaterThanOrEqualTo(value, message);
        }
        /**
         * Asserts that the tested item matches the regular expression
         *
         * @param {RegExp} pattern
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toMatch(pattern, message) {
            assert_1.default({
                assertion: pattern instanceof RegExp,
                message: "[pattern] argument should be a regular expression"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "string") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a string"
                });
            }
            assert_1.default({
                assertion: pattern.test(this.actual),
                message: message || `Expected ${this.actual} to match ${pattern}`
            });
            return this;
        }
        /**
         * Asserts that the tested item does not match the regular expression
         *
         * @param {RegExp} pattern
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotMatch(pattern, message) {
            assert_1.default({
                assertion: pattern instanceof RegExp,
                message: "[pattern] argument should be a regular expression"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "string") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a string"
                });
            }
            assert_1.default({
                assertion: !pattern.test(this.actual),
                message: message || `Expected ${this.actual} to match ${pattern}`
            });
            return this;
        }
        /**
         * Asserts that the tested item includes value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toInclude(value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Item being tested should be a string, array, or object"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.indexOf(value) >= 0,
                    message: message || `Expected ${this.actual} to contain ${value}`
                });
            }
            else if (Array.isArray(this.actual)) {
                // Assume the value is not included
                let included = false;
                for (let i = 0; i < this.actual.length; i++) {
                    if (fast_deep_equal_1.equal(this.actual[i], value)) {
                        included = true;
                        break; // We've found a match, so exit the loop
                    }
                }
                assert_1.default({
                    assertion: included,
                    message: message || `Expected ${JSON.stringify(this.actual)} to contain ${JSON.stringify(value)}`
                });
            }
            else if (typeof this.actual === "object") {
                /*
                 * For this test, it's easier to assume that the value is present,
                 * then set "included" to "false" as soon as one part of the value
                 * is found to be missing
                 */
                let included = true;
                const valueProperties = Object.getOwnPropertyNames(value);
                // Loop through the properties in the value
                for (let i = 0; i < valueProperties.length; i++) {
                    // Check if this.actual has this property
                    if (!this.actual.hasOwnProperty(valueProperties[i])) {
                        included = false;
                        break; // Break the loop early as we've found a property that doesn't exist
                    }
                    // Now check that the value of the property is the same
                    if (!fast_deep_equal_1.equal(this.actual[valueProperties[i]], value[valueProperties[i]])) {
                        included = false;
                    }
                }
                assert_1.default({
                    assertion: included,
                    message: message || `Expected ${JSON.stringify(this.actual)} to contain ${JSON.stringify(value)}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item includes value
         * Alias for toInclude
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toContain(value, message) {
            return this.toInclude(value, message);
        }
        /**
         * Asserts that the tested item does not include value
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toExclude(value, message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Item being tested should be a string, array, or object"
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.indexOf(value) === -1,
                    message: message || `Expected ${this.actual} to not contain ${value}`
                });
            }
            else if (Array.isArray(this.actual)) {
                // Assume the value is not included
                let included = false;
                for (let i = 0; i < this.actual.length; i++) {
                    if (fast_deep_equal_1.equal(this.actual[i], value)) {
                        included = true;
                        break; // We've found a match, so exit the loop
                    }
                }
                assert_1.default({
                    assertion: !included,
                    message: message || `Expected ${JSON.stringify(this.actual)} to not contain ${JSON.stringify(value)}`
                });
            }
            else if (typeof this.actual === "object") {
                // Assume the value is not included
                let included = false;
                const valueProperties = Object.getOwnPropertyNames(value);
                // Loop through the properties in the value
                for (let i = 0; i < valueProperties.length; i++) {
                    // Check if this.actual has this property
                    if (this.actual.hasOwnProperty(valueProperties[i])) {
                        // Now check if the property is the same in value
                        if (fast_deep_equal_1.equal(this.actual[valueProperties[i]], value[valueProperties[i]])) {
                            included = true;
                            break; // Break the loop early as we've found a property that doesn't exist
                        }
                    }
                }
                assert_1.default({
                    assertion: !included,
                    message: message || `Expected ${JSON.stringify(this.actual)} to not contain ${JSON.stringify(value)}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item does not include value
         * Alias for toExclude
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotInclude(value, message) {
            return this.toExclude(value, message);
        }
        /**
         * Asserts that the tested item does not include value
         * Alias for toExclude
         *
         * @param {*} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotContain(value, message) {
            return this.toExclude(value, message);
        }
        /**
         * Asserts that the tested item throws an error
         *
         * @param {*} [error]
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toThrow(error, message) {
            assert_1.default({
                assertion: typeof error === "undefined" ||
                    typeof error === "string" ||
                    error instanceof RegExp ||
                    typeof error === "function",
                message: "[error] argument should be a string, regular expression, or function"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "function") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a function"
                });
            }
            if (typeof error === "undefined") {
                let threw = false;
                try {
                    this.actual();
                }
                catch (e) {
                    threw = true;
                }
                assert_1.default({
                    assertion: threw,
                    message: message || "Expected function to throw"
                });
            }
            else if (typeof error === "string") {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: e.message === error,
                        message: message || `Expected error message to be "${error}""`
                    });
                }
            }
            else if (error instanceof RegExp) {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: error.test(e.message),
                        message: message || `Expected error message to match ${error}`
                    });
                }
            }
            else if (typeof error === "function") {
                try {
                    this.actual();
                }
                catch (e) {
                    assert_1.default({
                        assertion: e instanceof error,
                        message: message || `Expected error to be ${error}`
                    });
                }
            }
            return this;
        }
        /**
         * Asserts that the tested item does not throw an error
         *
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotThrow(message) {
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof this.actual !== "function") {
                throw assert_1.default({
                    assertion: false,
                    message: "Item being tested should be a function"
                });
            }
            let threw = false;
            try {
                this.actual();
            }
            catch (e) {
                threw = true;
            }
            assert_1.default({
                assertion: !threw,
                message: message || "Expected function to not throw"
            });
            return this;
        }
        /**
         * Asserts that the tested item is of the type specified by constructor
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeA(constructor, message) {
            assert_1.default({
                assertion: typeof constructor === "function" || typeof constructor === "string",
                message: "[constructor] argument should be a function or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof constructor === "string") {
                assert_1.default({
                    actual: typeof this.actual,
                    assertion: typeof this.actual === constructor,
                    expected: constructor,
                    message: message || `Expected item to be a ${constructor}`
                });
            }
            else if (typeof constructor === "function") {
                assert_1.default({
                    actual: typeof this.actual,
                    assertion: this.actual instanceof constructor,
                    expected: constructor,
                    message: message || `Expected item to be a ${constructor}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item is of the type specified by constructor
         * Alias for toBeA
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toBeAn(constructor, message) {
            return this.toBeA(constructor, message);
        }
        /**
         * Asserts that the tested item is not of the type specified by constructor
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotBeA(constructor, message) {
            assert_1.default({
                assertion: typeof constructor === "function" || typeof constructor === "string",
                message: "[constructor] argument should be a function or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            if (typeof constructor === "string") {
                assert_1.default({
                    assertion: !(typeof this.actual === constructor),
                    message: message || `Expected item to not be a ${constructor}`
                });
            }
            else if (typeof constructor === "function") {
                assert_1.default({
                    assertion: !(this.actual instanceof constructor),
                    message: message || `Expected item to not be a ${constructor}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item is not of the type specifed by constructor
         *
         * @param {*} constructor
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotBeAn(constructor, message) {
            return this.toNotBeA(constructor, message);
        }
        /**
         * Asserts that the tested item includes key
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toIncludeKey(key, message) {
            assert_1.default({
                assertion: typeof key === "number" || typeof key === "string",
                message: "[key] argument should be a number or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            if (typeof this.actual === "function") {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || `Expected function to have key ${key}`
                });
            }
            else if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || `Expected array to have key ${key}`
                });
            }
            else if (typeof this.actual === "object") {
                assert_1.default({
                    assertion: this.actual.hasOwnProperty(key),
                    message: message || `Expected object to have key ${key}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item includes key
         * Alias for toIncludeKey
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toContainKey(key, message) {
            return this.toIncludeKey(key, message);
        }
        /**
         * Asserts that the tested item includes keys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toIncludeKeys(keys, message) {
            assert_1.default({
                assertion: Array.isArray(keys) && keys.length > 0 && (typeof keys[0] === "number" || typeof keys[0] === "string"),
                message: "[keys] argument should be an array of numbers or strings"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            for (let i = 0; i < keys.length; i++) {
                this.toIncludeKey(keys[i], message);
            }
            return this;
        }
        /**
         * Asserts that the tested item includes keys
         * Alias for toIncludeKeys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toContainKeys(keys, message) {
            return this.toIncludeKeys(keys, message);
        }
        /**
         * Asserts that the tested item does not include key
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toExcludeKey(key, message) {
            assert_1.default({
                assertion: typeof key === "number" || typeof key === "string",
                message: "[key] argument should be a number or string"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            if (typeof this.actual === "function") {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || `Expected function to not have key ${key}`
                });
            }
            else if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || `Expected array to not have key ${key}`
                });
            }
            else if (typeof this.actual === "object") {
                assert_1.default({
                    assertion: !this.actual.hasOwnProperty(key),
                    message: message || `Expected object to not have key ${key}`
                });
            }
            return this;
        }
        /**
         * Asserts that the tested item does not include key
         * Alias for toExcludeKey
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotIncludeKey(key, message) {
            return this.toExcludeKey(key, message);
        }
        /**
         * Asserts that the tested item does not include key
         * Alias for toExcludeKey
         *
         * @param {*} key
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotContainKey(key, message) {
            return this.toExcludeKey(key, message);
        }
        /**
         * Asserts that the tested item does not include keys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toExcludeKeys(keys, message) {
            assert_1.default({
                assertion: Array.isArray(keys) && keys.length > 0 && (typeof keys[0] === "number" || typeof keys[0] === "string"),
                message: "[key] argument should be an array of numbers or strings"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "function" || Array.isArray(this.actual) || typeof this.actual === "object",
                message: "Tested item should be a function, array, or object"
            });
            for (let i = 0; i < keys.length; i++) {
                this.toExcludeKey(keys[i], message);
            }
            return this;
        }
        /**
         * Asserts that the tested item does not include keys
         * Alias for toExcludeKeys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotIncludeKeys(keys, message) {
            return this.toExcludeKeys(keys, message);
        }
        /**
         * Asserts that the tested item does not include keys
         * Alias for toExcludeKeys
         *
         * @param {any[]} keys
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toNotContainKeys(keys, message) {
            return this.toExcludeKeys(keys, message);
        }
        /**
         * Asserts that the tested item has length of value
         *
         * @param {number} value
         * @param {string} [message]
         * @returns {this}
         *
         * @memberOf Expectation
         */
        toHaveLength(value, message) {
            assert_1.default({
                assertion: typeof value === "number",
                message: "[value] argument should be a number"
            });
            assert_1.default({
                assertion: typeof message === "undefined" || typeof message === "string",
                message: "[message] argument should be a string"
            });
            assert_1.default({
                assertion: typeof this.actual === "string" || Array.isArray(this.actual),
                message: `Item being tested should be a string or an array`
            });
            if (typeof this.actual === "string") {
                assert_1.default({
                    assertion: this.actual.length === value,
                    message: message || `Expected string to have length ${value}`
                });
            }
            if (Array.isArray(this.actual)) {
                assert_1.default({
                    assertion: this.actual.length === value,
                    message: message || `Expected array to have length ${value}`
                });
            }
            return this;
        }
    }
    exports.default = Expectation;
});
define("node_modules/ceylon/src/index", ["require", "exports", "node_modules/ceylon/src/expectation", "node_modules/ceylon/src/assert"], function (require, exports, expectation_1, assert_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    expectation_1 = __importDefault(expectation_1);
    exports.assert = assert_2.default;
    /**
     * Creates a new expectation, which allows assertions to be made on the item passed into it
     *
     * @template T
     * @param {T} actual
     * @returns {Expectation<T>}
     */
    const expect = (actual) => {
        return new expectation_1.default(actual);
    };
    exports.default = expect;
});
define("node_modules/ceylon/index", ["require", "exports", "node_modules/ceylon/src/index", "node_modules/ceylon/src/assert", "node_modules/ceylon/src/fast-deep-equal", "node_modules/ceylon/src/assertion-error", "node_modules/ceylon/src/expectation"], function (require, exports, index_1, assert_3, fast_deep_equal_2, assertion_error_2, expectation_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    index_1 = __importDefault(index_1);
    assert_3 = __importDefault(assert_3);
    assertion_error_2 = __importDefault(assertion_error_2);
    expectation_2 = __importDefault(expectation_2);
    exports.expect = index_1.default;
    exports.assert = assert_3.default;
    exports.deepEqual = fast_deep_equal_2.equal;
    exports.AssertionError = assertion_error_2.default;
    exports.Expectation = expectation_2.default;
    exports.default = index_1.default;
});
define("tests/spec/api", ["require", "exports", "backbone", "backbone.marionette", "backbone.radio", "backgrid", "node_modules/ceylon/index"], function (require, exports, backbone_1, backbone_marionette_1, backbone_radio_1, Backgrid, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_1 = __importDefault(backbone_1);
    backbone_marionette_1 = __importDefault(backbone_marionette_1);
    backbone_radio_1 = __importDefault(backbone_radio_1);
    Backgrid = __importStar(Backgrid);
    describe("backbone", () => {
        it("ensures modules exist", () => {
            index_2.expect(backbone_1.default).toExist();
            index_2.expect(backbone_marionette_1.default).toExist();
            index_2.expect(backbone_radio_1.default).toExist();
            index_2.expect(Backgrid).toExist();
        });
        it("ensures backbone API", () => {
            [
                backbone_1.default.$,
                backbone_1.default.ajax,
                backbone_1.default.Collection,
                backbone_1.default.Events,
                backbone_1.default.Model,
                backbone_1.default.Radio,
                backbone_1.default.Router,
                backbone_1.default.View
            ].forEach((n, i) => index_2.expect(n).toExist(i + ""));
        });
        it("ensures marionette API", () => {
            [
                backbone_marionette_1.default.Application,
                backbone_marionette_1.default.AppRouter,
                backbone_marionette_1.default.Behavior,
                backbone_marionette_1.default.Behaviors,
                backbone_marionette_1.default.CollectionView,
                //Marionette.Container,
                backbone_marionette_1.default.Object,
                backbone_marionette_1.default.Region,
                backbone_marionette_1.default.Renderer
            ].forEach((n, i) => index_2.expect(n).toExist(i + ""));
        });
        it("ensures radio API", () => {
            [
                backbone_radio_1.default.Channel,
                //Radio.Commands,
                backbone_radio_1.default.Requests,
                backbone_radio_1.default.VERSION
            ].forEach((n, i) => index_2.expect(n).toExist(i + ""));
        });
        it("ensures backgrid API", () => {
            [
                Backgrid.Body,
                Backgrid.Cell,
                Backgrid.CellEditor,
                Backgrid.CellFormatter,
                Backgrid.Column,
                //Backgrid.Command,
                //Backgrid.DateTimeFormatter,
                Backgrid.EmailFormatter,
                Backgrid.Footer,
                Backgrid.Grid,
                Backgrid.Header,
                Backgrid.InputCellEditor,
                Backgrid.NumberFormatter,
                Backgrid.PercentFormatter,
                Backgrid.Row,
                Backgrid.SelectFormatter
            ].forEach((n, i) => index_2.expect(n).toExist(i + ""));
        });
    });
});
define("tests/spec/backbone-test", ["require", "exports", "backbone", "node_modules/ceylon/src/index"], function (require, exports, backbone_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_2 = __importStar(backbone_2);
    index_3 = __importDefault(index_3);
    describe("backbone", () => {
        it("create a backbone model", () => {
            let model = new backbone_2.default.Model({ name: "backbone" });
            let d = backbone_2.default.$.Deferred();
            model.once("change", () => {
                index_3.default(model.get("name")).toEqual("backbone-test");
                model.destroy();
                d.resolve();
            });
            model.set("name", "backbone-test");
            return d;
        });
        it("create a backbone collection", done => {
            let collection = new backbone_2.default.Collection();
            let models = [1, 2].map(n => new backbone_2.Model({ name: "backbone", id: n }));
            collection.once("update", () => {
                index_3.default(collection.isEmpty()).toBeFalse("has two models");
                collection.once("update", () => {
                    index_3.default(collection.isEmpty()).toBeTrue("collection is empty");
                    done();
                });
                collection.remove(models);
            });
            collection.add(models);
        }).timeout(10);
    });
});
define("tests/index", ["require", "exports", "tests/spec/api", "tests/spec/backbone-test"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=tests.max.js.map