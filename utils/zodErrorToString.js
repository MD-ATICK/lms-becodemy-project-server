"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodErrorToString = void 0;
const zodErrorToString = (errors) => {
    if (errors) {
        // errors look like : errors : [ {path : [] , message}]
        const errorMsg = errors.map((err) => `${err.path.join('.')} - ${err.message}`);
        // errorMsg look like : [errorMsg]
        throw new Error(errorMsg.join(' , '));
    }
    else {
        return '';
    }
};
exports.zodErrorToString = zodErrorToString;
