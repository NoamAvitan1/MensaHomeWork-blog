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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const http_1 = __importDefault(require("http"));
dotenv.config();
//import middlewares
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
//routes
const user_1 = __importDefault(require("./routes/user"));
const blog_1 = __importDefault(require("./routes/blog"));
//creae an express app
const app = (0, express_1.default)();
//midlewares
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
//routes
app.use("/user", user_1.default);
app.use("/blog", blog_1.default);
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the environment variables');
    process.exit(1); // Exit the process if MONGO_URI is not defined
}
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    // Create an HTTP server
    const server = http_1.default.createServer(app);
    // Start the server
    server.listen(process.env.PORT, () => {
        console.log(`server listening on port ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log(err);
});
