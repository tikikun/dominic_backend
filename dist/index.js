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
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/downloadfile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uri = String(req.query.uri);
    const folderName = req.query.folderName ? String(req.query.folderName) : '';
    console.log(folderName);
    if (!uri) {
        return res.send(JSON.stringify({
            message: "Uri is required to download thing",
        }));
    }
    console.log(req.method, req.url, `Here is the uri for the file ${uri}`);
    try {
        const aria_response = yield sendMagnetToAria2c(uri, folderName);
        if ("error" in aria_response) {
            console.log("send the issue");
            res.send(JSON.stringify({
                message: `There is error,Issue:${aria_response.error.message}`,
            }));
        }
        else {
            res.send(JSON.stringify({
                message: `Success, the job ID is: ${aria_response.id}`,
            }));
        }
    }
    catch (error) {
        console.log(error);
        res.send(JSON.stringify({
            message: `There is strange error, here is log ${error}`,
        }));
    }
}));
/**
 * Lists the contents of a directory and returns the result as a JSON response.
 *
 * @param req - Express.js request object
 * @param res - Express.js response object
 *
 * @returns JSON response with a list of filenames in the directory. In case of an error, returns a JSON response with a 500 status code and an error message.
 */
app.get("/listfiles", (req, res) => {
    try {
        const files = fs.readdirSync("/Volumes/Tuandisk");
        const folders = [];
        for (const file of files) {
            const stats = fs.statSync(`/Volumes/Tuandisk/${file}`);
            if (stats.isDirectory()) {
                folders.push(file);
            }
        }
        res.json(folders);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
app.get("/alantest", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("thunghiem auth");
    res.send("thunghiem nay ");
}));
app.get('/downloads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('http://localhost:6800/jsonrpc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: 'aria2.tellActive',
                id: 'downloads',
                jsonrpc: '2.0'
            })
        });
        const data = yield response.json();
        res.json(data.result);
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
function sendMagnetToAria2c(uri, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        const rootDir = '/Volumes/Tuandisk';
        const aria2cUrl = "http://localhost:6800/jsonrpc";
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log(`${rootDir}/${folder}`);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: id,
                method: "aria2.addUri",
                params: [[uri], { dir: `${rootDir}/${folder}` }],
            }),
        };
        const response = yield fetch(aria2cUrl, options);
        const data = yield response.json();
        console.log(data);
        return data;
    });
}
