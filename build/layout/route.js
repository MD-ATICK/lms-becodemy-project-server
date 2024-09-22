"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../../middlewares/userAuth");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/listLayouts', userAuth_1.authorizeUser, controller_1.getAllLayout);
router.get('/single-layout/:id', userAuth_1.authorizeUser, controller_1.getSingleLayout);
router.put('/set-active-layout/:id', userAuth_1.authorizeUser, controller_1.setActiveLayout);
// # get active layout in client
router.get('/get-client-active-layout', controller_1.getActiveLayoutForClient);
// layoutId : 66ba1949ea95c7fad9de94ca
// # creating things!
router.post('/createLayout', userAuth_1.authorizeUser, controller_1.createLayout);
router.delete('/deleteLayouts', userAuth_1.authorizeUser, controller_1.deleteLayoutsByNameAry);
router.post('/addFaq', userAuth_1.authorizeUser, controller_1.addFaq);
router.delete('/deleteFaq', userAuth_1.authorizeUser, controller_1.deleteFaq);
router.put('/editFaq', userAuth_1.authorizeUser, controller_1.EditFaq);
router.post('/addBanner', userAuth_1.authorizeUser, controller_1.addBanner);
router.post('/addCategory', userAuth_1.authorizeUser, controller_1.addCategory);
router.put('/editCategory', userAuth_1.authorizeUser, controller_1.EditCategory);
router.delete('/deleteCategory', userAuth_1.authorizeUser, controller_1.deleteCategory);
exports.default = router;
