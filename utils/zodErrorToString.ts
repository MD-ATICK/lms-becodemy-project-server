import { ZodIssue } from "zod";

export const zodErrorToString = (errors: ZodIssue[]): string => {
    if (errors) {
        // errors look like : errors : [ {path : [] , message}]
        const errorMsg = errors.map((err) => `${err.path.join('.')} - ${err.message}`)
        // errorMsg look like : [errorMsg]
        throw new Error(errorMsg.join(' , '))
    } else {
        return ''
    }
}
