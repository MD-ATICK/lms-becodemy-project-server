"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorReturn = exports.successReturn = void 0;
const successReturn = (res, status, body) => {
    const code = {
        "GET": 200,
        "POST": 201,
        "UPDATE": 202,
        "DELETE": 203,
        "EXPIRED": 223,
    };
    return res.status(code[status]).json(body);
};
exports.successReturn = successReturn;
const errorReturn = (res, error) => {
    return res.status(400).json({ error });
};
exports.errorReturn = errorReturn;
