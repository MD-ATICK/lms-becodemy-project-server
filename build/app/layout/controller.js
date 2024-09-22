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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.addCategory = exports.addBanner = exports.deleteFaq = exports.EditCategory = exports.EditFaq = exports.addFaq = exports.createLayout = exports.deleteLayoutsByNameAry = exports.getAllLayout = exports.getSingleLayout = exports.getActiveLayoutForClient = exports.setActiveLayout = void 0;
const __1 = require("..");
const layoutSchema_1 = require("../../schemas/layoutSchema");
const db_1 = require("../../utils/db");
const response_1 = require("../../utils/response");
const zodErrorToString_1 = require("../../utils/zodErrorToString");
const setActiveLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const layoutId = req.params.id;
        yield db_1.db.layout.updateMany({ data: { isActive: false } });
        const updatedLayout = yield db_1.db.layout.update({ where: { id: layoutId }, data: { isActive: true }, include: { faqs: true, categories: true } });
        if (!updatedLayout)
            throw new Error('layout not updated!');
        yield __1.redis.set("activeLayout", JSON.stringify(updatedLayout));
        const layouts = yield db_1.db.layout.findMany({});
        (0, response_1.successReturn)(res, "UPDATE", layouts);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.setActiveLayout = setActiveLayout;
const getActiveLayoutForClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisLayout = yield __1.redis.get('activeLayout');
        if (redisLayout) {
            return (0, response_1.successReturn)(res, "GET", JSON.parse(redisLayout));
        }
        const layout = yield db_1.db.layout.findFirstOrThrow({
            where: { isActive: true },
            include: { faqs: true, categories: true }
        });
        yield __1.redis.set('activeLayout', JSON.stringify(layout));
        (0, response_1.successReturn)(res, "GET", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getActiveLayoutForClient = getActiveLayoutForClient;
const getSingleLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const layoutId = req.params.id;
        const redisLayout = yield __1.redis.get(layoutId);
        if (redisLayout)
            return (0, response_1.successReturn)(res, "GET", JSON.parse(redisLayout));
        const layout = yield getLayoutById(layoutId);
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "GET", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getSingleLayout = getSingleLayout;
const getAllLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const layouts = yield db_1.db.layout.findMany({});
        (0, response_1.successReturn)(res, "GET", layouts);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.getAllLayout = getAllLayout;
const deleteLayoutsByNameAry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const layoutNameAry = req.body;
        const find = yield db_1.db.layout.findFirst({ where: { layoutName: { in: layoutNameAry }, isActive: true } });
        if (find) {
            throw new Error('you cannot remove active layout! switching it!');
        }
        yield db_1.db.layout.deleteMany({
            where: {
                layoutName: {
                    in: layoutNameAry
                }
            }
        });
        return (0, response_1.successReturn)(res, "DELETE", { message: 'delete successfully' });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteLayoutsByNameAry = deleteLayoutsByNameAry;
const createLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = layoutSchema_1.layoutSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        yield db_1.db.layout.updateMany({ data: { isActive: false } });
        const { layoutName } = data;
        // if (layoutName) {
        //     throw new Error('just fun error!')
        // }
        const findLayout = yield db_1.db.layout.findFirst({ where: { layoutName } });
        if (findLayout) {
            throw new Error('this layout already exist!');
        }
        const layout = yield db_1.db.layout.create({
            data: {
                layoutName,
                isActive: true,
                // faqs: {
                //     create: faq
                // },
                // categories: {
                //     create: category
                // },
                // banners: {
                //     create: banner
                // }
            },
            // include: {
            //     faqs: true,
            //     categories: true,
            //     banners: true
            // }
        });
        yield __1.redis.set('activeLayout', JSON.stringify(layout));
        (0, response_1.successReturn)(res, "POST", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.createLayout = createLayout;
const addFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = layoutSchema_1.faqSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { answer, question, layoutId } = data;
        yield db_1.db.faq.create({
            data: {
                answer,
                question,
                layoutId
            }
        });
        const layout = yield getLayoutById(layoutId);
        if (layout.isActive) {
            yield __1.redis.set('activeLayout', JSON.stringify(layout));
        }
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "POST", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addFaq = addFaq;
const EditFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = layoutSchema_1.faqSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { answer, question, id, layoutId } = data;
        if (!id)
            throw new Error('invalid faq id!');
        yield db_1.db.faq.update({
            where: { id },
            data: {
                answer,
                question,
                layoutId
            }
        });
        const layout = yield getLayoutById(layoutId);
        if (layout.isActive) {
            yield __1.redis.set('activeLayout', JSON.stringify(layout));
        }
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "UPDATE", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.EditFaq = EditFaq;
const EditCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = layoutSchema_1.categorySchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { title, image, id, layoutId } = data;
        if (!id)
            throw new Error('invalid category id!');
        yield db_1.db.category.update({
            where: { id },
            data: {
                title,
                image,
                layoutId
            }
        });
        const layout = yield getLayoutById(layoutId);
        if (layout.isActive) {
            yield __1.redis.set('activeLayout', JSON.stringify(layout));
        }
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "UPDATE", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.EditCategory = EditCategory;
const deleteFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, layoutId } = req.body;
        if (!id)
            throw new Error('id required');
        yield db_1.db.faq.delete({ where: { id } });
        const layout = yield getLayoutById(layoutId);
        if (layout.isActive) {
            yield __1.redis.set('activeLayout', JSON.stringify(layout));
        }
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "DELETE", { message: 'delete faq successfully!' });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteFaq = deleteFaq;
const addBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = layoutSchema_1.bannerSchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { title, subTitle, image, layoutId } = data;
        yield db_1.db.layout.update({
            where: { id: layoutId },
            data: {
                banner: {
                    title,
                    subTitle,
                    image
                }
            },
            include: {
                faqs: true,
                categories: true
            }
        });
        const layout = yield getLayoutById(layoutId);
        if (layout.isActive) {
            yield __1.redis.set('activeLayout', JSON.stringify(layout));
        }
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "POST", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addBanner = addBanner;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, data } = layoutSchema_1.categorySchema.safeParse(req.body);
        if (error)
            return (0, zodErrorToString_1.zodErrorToString)(error.errors);
        const { image, title, layoutId } = data;
        yield db_1.db.category.create({
            data: {
                layoutId,
                title,
                image,
            }
        });
        const layout = yield getLayoutById(layoutId);
        if (layout.isActive) {
            yield __1.redis.set('activeLayout', JSON.stringify(layout));
        }
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "POST", layout);
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.addCategory = addCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deleteCateAry, layoutId } = req.body;
        yield db_1.db.category.deleteMany({ where: { id: { in: deleteCateAry } } });
        const layout = yield getLayoutById(layoutId);
        yield __1.redis.setex(layout.id, 60 * 60, JSON.stringify(layout));
        (0, response_1.successReturn)(res, "DELETE", { message: 'delete category successfully!' });
    }
    catch (error) {
        (0, response_1.errorReturn)(res, error.message);
    }
});
exports.deleteCategory = deleteCategory;
// -----------------  just reuse find ----------------------------
// -----------------  just reuse find ----------------------------
const getLayoutById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const layout = yield db_1.db.layout.findFirst({ where: { id }, include: { faqs: true, categories: true } });
        if (!layout) {
            throw new Error('layout not found');
        }
        return layout;
    }
    catch (error) {
        throw error;
    }
});
