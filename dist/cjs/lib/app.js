#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require('yargs');
const config_1 = require("./config");
const generator_1 = require("./generator");
const utilities_1 = require("./utilities");
const argv = yargs['argv'];
// user config
const projectId = argv.projectId;
const moduleResolution = argv.moduleResolution;
const codeType = argv.codeType;
const secureAccessKey = argv.secureAccessKey;
const strictPropertyInitalization = argv.strictPropertyInitalization;
const addTimestamp = argv.addTimestamp;
if (!moduleResolution) {
    throw Error(`Please specify 'moduleResolution' argument. Available options are: ${config_1.generatorConfig.moduleOptions.join(',')}`);
}
if (!codeType) {
    throw Error(`Please specify 'codeType' argument. Available options are: ${config_1.generatorConfig.codeOptions.join(',')}`);
}
if (!projectId) {
    throw Error(`Please provide project id using 'projectId' argument`);
}
// init & start generator
const generator = new generator_1.Generator({
    projectId: projectId,
    type: moduleResolution,
    codeType: utilities_1.utilities.getCodeType(codeType),
    moduleResolution: utilities_1.utilities.getModuleResolution(moduleResolution),
    secureAccessKey: secureAccessKey,
    strictPropertyInitalization: strictPropertyInitalization === 'true' ? true : false,
    addTimestamp: addTimestamp === 'true' ? true : false,
});
generator.startModelGenerator();
//# sourceMappingURL=app.js.map