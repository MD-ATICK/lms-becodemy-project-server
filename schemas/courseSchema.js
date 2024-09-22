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
exports.uploadImageSchema = exports.courseSchema = void 0;
const z = __importStar(require("zod"));
const courseVideoSchema = z.array(z.object({
    id: z.string().optional(), // Make id optional
    videoUrl: z.string().nonempty('videoUrl is required'),
    title: z.string().nonempty('title is required'),
    // videoSection: z.string().nonempty('videoSection is required'),
    description: z.string().nonempty('description is required'),
    videoLength: z.string().nonempty('videoLength is required'),
    videoPlayer: z.string().nonempty('videoPlayer is required'),
    suggestion: z.string().nonempty('suggestion is required'),
})).min(1, { message: "at least one video is required" });
exports.courseSchema = z.object({
    id: z.string().optional(), // Make id optional
    name: z.string().nonempty('name is required'),
    description: z.string().nonempty('name is required'),
    price: z.number(),
    expectationPrice: z.number(),
    thumbnail: z.object({ public_id: z.string(), url: z.string() }),
    tags: z.array(z.string()).min(1, { message: 'at least one tag is required' }),
    level: z.string().nonempty('level is required'),
    demoUrl: z.string().nonempty('demoUrl is required'),
    benefits: z.array(z.object({ title: z.string() })).nonempty('benefits is required'),
    prerequisites: z.array(z.object({ title: z.string() })).nonempty('prerequisites is required'),
    courseSections: z.array(z.object({ id: z.optional(z.string()), title: z.string(), courseVideos: courseVideoSchema })).min(1, { message: 'at least one course section is required' })
});
exports.uploadImageSchema = z.object({
    folder: z.string().nonempty('folders is required'),
    image: z.string().nonempty('thumbnail is required'),
    destroy_public_id: z.optional(z.string()),
});
