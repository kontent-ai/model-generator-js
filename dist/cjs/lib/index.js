#!/usr/bin/env node
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
const yargs = require('yargs');
const generator_1 = require("./generator");
const argv = yargs['argv'];
// user config
const projectId = argv.projectId;
const secureAccessKey = argv.secureAccessKey;
const addTimestamp = argv.addTimestamp;
if (!projectId) {
    throw Error(`Please provide project id using 'projectId' argument`);
}
// init & start generator
const generator = new generator_1.Generator({
    projectId: projectId,
    secureAccessKey: secureAccessKey,
    addTimestamp: addTimestamp === 'true' ? true : false
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    yield generator.generateModelsAsync();
});
run();
//# sourceMappingURL=index.js.map