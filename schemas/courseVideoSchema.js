"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryOFcourseSchema = exports.courseVideoSchema = void 0;
const z = __importStar(require("zod"));
exports.courseVideoSchema = z.object({
    id: z.optional(z.string()),
    videoUrl: z.string().nonempty('videoUrl is required'),
    title: z.string().nonempty('title is required'),
    // videoSection: z.string().nonempty('videoSection is required'),
    description: z.string().nonempty('description is required'),
    videoLength: z.string().nonempty('videoLength is required'),
    videoPlayer: z.string().nonempty('videoPlayer is required'),
    suggestion: z.string().nonempty('suggestion is required'),
    courseId: z.string().nonempty('courseId is required'),
});
exports.queryOFcourseSchema = z.object({
    name: z.string().nonempty('name is required'),
    // category: z.string().nonempty('category is required'),
});
