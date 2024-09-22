"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootGet = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const courseSchema_1 = require("../schemas/courseSchema");
const response_1 = require("./response");
const zodErrorToString_1 = require("./zodErrorToString");
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = courseSchema_1.uploadImageSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        if (data.destroy_public_id) {
            yield cloudinary_1.default.v2.uploader.destroy(data.destroy_public_id);
        }
        const myCloud = yield cloudinary_1.default.v2.uploader.upload(data.image, { folder: data.folder, width: 800 });
        (0, response_1.successReturn)(res, "POST", { public_id: myCloud.public_id, url: myCloud.secure_url });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.uploadImage = uploadImage;
const rootGet = (req, res) => {
    try {
        (0, response_1.successReturn)(res, "GET", { message: 'please save red blood! 17 july' });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
};
exports.rootGet = rootGet;
