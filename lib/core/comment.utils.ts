import { EnvironmentModels } from '@kontent-ai/management-sdk';
import { libMetadata } from '../meta/index.js';

export function wrapComment(comment: string): string {
    return `/**${toSafeComment(comment)}*/`;
}

export function toSafeComment(text: string): string {
    const replaceContent = '';
    return text.replace(/\/\*/g, replaceContent).replace(/\*\//g, replaceContent);
}

export function getEnvironmentInfoComment(data: {
    readonly addTimestamp?: boolean;
    readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
}): string {
    return `
/** 
* This file has been auto-generated by '${libMetadata.name}@${libMetadata.version}'.
* 
* (c) Kontent.ai
*  
* -------------------------------------------------------------------------------
* 
* Project: ${toSafeComment(data.environmentInfo.name)}
* Environment: ${toSafeComment(data.environmentInfo.environment)}
* Id: ${data.environmentInfo.id}${data.addTimestamp ? `\n* Generated: ${new Date().toLocaleString()}` : ''}
* 
* -------------------------------------------------------------------------------
**/`;
}
