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
exports.categorySchema = exports.faqSchema = exports.bannerSchema = exports.layoutSchema = void 0;
const z = __importStar(require("zod"));
// default single banner , single faq , single category!
exports.layoutSchema = z.object({
    layoutName: z.string().nonempty('layoutName is required'),
    // banner: z.object({
    //     title: z.string().nonempty('banner.title is required'),
    //     subTitle: z.string().nonempty('banner.sub title is required'),
    //     image: z.object({
    //         public_id: z.string().nonempty('banner.image.public_id is required'),
    //         url: z.string().nonempty('banner.image url is required'),
    //     })
    // }),
    // faq: z.object({
    //     question: z.string().nonempty('faq.question is required'),
    //     answer: z.string().nonempty('faq.answer is required'),
    // }),
    // category: z.object({
    //     title: z.string().nonempty('category.title is required'),
    //     image: z.object({
    //         public_id: z.string().nonempty('category.image.public_id is required'),
    //         url: z.string().nonempty('category.image.url is required'),
    //     })
    // }),
});
exports.bannerSchema = z.object({
    layoutId: z.string().nonempty('faq.question is required'),
    title: z.string().nonempty('banner.title is required'),
    subTitle: z.string().nonempty('banner.sub title is required'),
    image: z.object({
        public_id: z.string().nonempty('banner.image.public_id is required'),
        url: z.string().nonempty('banner.image url is required'),
    })
});
exports.faqSchema = z.object({
    layoutId: z.string().nonempty('faq.question is required'),
    question: z.string().nonempty('faq.question is required'),
    answer: z.string().nonempty('faq.answer is required'),
    id: z.optional(z.string())
});
exports.categorySchema = z.object({
    layoutId: z.string().nonempty('faq.question is required'),
    title: z.string().nonempty('category.title is required'),
    image: z.object({
        public_id: z.string().nonempty('category.image.public_id is required'),
        url: z.string().nonempty('category.image.url is required'),
    }),
    id: z.optional(z.string())
});
