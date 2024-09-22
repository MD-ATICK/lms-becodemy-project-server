"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const cloudinary_1 = require("cloudinary");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ioredis_1 = __importDefault(require("ioredis"));
const socketServer_1 = require("../socketServer");
const uploadImage_1 = require("../utils/uploadImage");
const route_1 = __importDefault(require("./admin/route"));
const route_2 = __importDefault(require("./course-video/route"));
const route_3 = __importDefault(require("./course/route"));
const route_4 = __importDefault(require("./layout/route"));
const route_5 = __importDefault(require("./notification/route"));
const route_6 = __importDefault(require("./order/route"));
const route_7 = __importDefault(require("./question/route"));
const route_8 = __importDefault(require("./review/route"));
const route_9 = __importDefault(require("./user/route"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = 9999;
dotenv_1.default.config();
app.use((0, cors_1.default)({ origin: ["http://localhost:3000"], credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
    secure: true,
});
// redos connect
exports.redis = new ioredis_1.default({
    host: 'redis-12262.c17.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 12262,
    password: 'pq3rLMQI42cFerIkUFfdGVUkTm9UWF4X'
});
app.get('/', uploadImage_1.rootGet);
app.post('/upload-image', uploadImage_1.uploadImage);
app.use('/admin', route_1.default);
app.use('/auth', route_9.default);
app.use('/course', route_3.default);
app.use('/course-video', route_2.default);
app.use('/question', route_7.default);
app.use('/review', route_8.default);
app.use('/order', route_6.default);
app.use('/notification', route_5.default);
app.use('/layout', route_4.default);
(0, socketServer_1.initSocketServer)(server);
server.listen(port, () => {
    console.log("🟢 server listening on port : http://localhost:9999");
});
app.all("*", (req, res) => {
    const error = new Error(`Route ${req.originalUrl} is not found.`);
    res.status(404).send({ error: error.message });
});
