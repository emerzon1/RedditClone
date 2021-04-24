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
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const database = {};
const generateAccessToken = (username) => {
    return jsonwebtoken_1.default.sign(username, process.env.TOKEN_SECRET);
};
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isAuthorized = yield bcrypt_1.default.compare(req.body.password, database[req.body.username]);
    if (isAuthorized) {
        const token = generateAccessToken(req.body.username);
        res.json(token);
    }
    else {
        res.status(401);
    }
}));
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield bcrypt_1.default.hash(req.body.password, 10);
    const username = req.body.username;
    database[username] = password;
    const token = generateAccessToken(req.body.username);
    res.json(token);
}));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
exports.default = router;
//# sourceMappingURL=auth.js.map