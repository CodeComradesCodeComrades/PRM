<<<<<<< HEAD
import express from "express";
import sirv from 'sirv';
import { existsSync, fstat } from 'fs'

const app = express();
const port = 3001;

async function start() {
  if (existsSync("../svelte/build/handler.js") && process.env.NODE_ENV == "Production") {
    let { handler } = await import("../../svelte/build/handler.js")
    app.use(handler);
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

}

start();
=======
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
const fs_1 = __importDefault(require("fs"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = 3001;
function start() {
    if (fs_1.default.existsSync("../svelte/build/handler.mjs") && process.env.NODE_ENV == "production") {
        // @ts-expect-error
        Promise.resolve().then(() => __importStar(require("../../svelte/build/handler.mjs"))).then(({ handler }) => {
            app.use(handler);
        });
    }
    app.use("/routes", routes_1.default);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
exports.default = start;
start();
>>>>>>> 0657227... Fabis Gedöns
