import Colors from 'colors';
import { commonHelper } from '../../common-helper.js';
import { getMapContentTypeToDeliveryTypeName, getMapContentTypeIdToObject, getMapContentTypeToFileName, getMapElementToName, getMapTaxonomyName, getMapTaxonomyToFileName, getMapTaxonomyIdTobject, getMapContentTypeSnippetToDeliveryTypeName, getMapContentTypeSnippetToFileName, getMapContentTypeSnippetIdToObject } from './delivery-mappers.js';
import { textHelper } from '../../text-helper.js';
export class DeliveryContentTypeGenerator {
    deliveryNpmPackageName = '@kontent-ai/delivery-sdk';
    async generateModelsAsync(data) {
        const typeFiles = [];
        const snippetFiles = [];
        let addNewLineAfterResolvers = false;
        if (data.elementResolver) {
            addNewLineAfterResolvers = true;
            console.log(`Using '${Colors.yellow(data.elementResolver instanceof Function ? 'custom' : data.elementResolver)}' name resolver for content type elements`);
        }
        if (data.contentTypeFileNameResolver) {
            addNewLineAfterResolvers = true;
            console.log(`Using '${Colors.yellow(data.contentTypeFileNameResolver instanceof Function ? 'custom' : data.contentTypeFileNameResolver)}' name resolver for content type filenames`);
        }
        if (data.contentTypeSnippetFileNameResolver) {
            addNewLineAfterResolvers = true;
            console.log(`Using '${Colors.yellow(data.contentTypeSnippetFileNameResolver instanceof Function
                ? 'custom'
                : data.contentTypeSnippetFileNameResolver)}' name resolver for content type snippet filenames`);
        }
        if (data.contentTypeResolver) {
            addNewLineAfterResolvers = true;
            console.log(`Using '${Colors.yellow(data.contentTypeResolver instanceof Function ? 'custom' : data.contentTypeResolver)}' name resolver for content types`);
        }
        if (data.contentTypeSnippetResolver) {
            addNewLineAfterResolvers = true;
            console.log(`Using '${Colors.yellow(data.contentTypeSnippetResolver instanceof Function ? 'custom' : data.contentTypeSnippetResolver)}' name resolver for content type snippets`);
        }
        if (addNewLineAfterResolvers) {
            console.log('');
        }
        for (const contentTypeSnippet of data.snippets) {
            try {
                const file = this.createContentTypeSnippetModel({
                    outputDir: data.outputDir,
                    snippet: contentTypeSnippet,
                    snippets: data.snippets,
                    taxonomies: data.taxonomies,
                    typeFolderName: data.typeFolderName,
                    typeSnippetsFolderName: data.typeSnippetsFolderName,
                    taxonomyFolderName: data.taxonomyFolderName,
                    contentTypeSnippetNameMap: getMapContentTypeSnippetToDeliveryTypeName(data.contentTypeSnippetResolver),
                    contentTypeSnippetFileNameMap: getMapContentTypeSnippetToFileName(data.contentTypeSnippetFileNameResolver),
                    contentTypeNameMap: getMapContentTypeToDeliveryTypeName(data.contentTypeResolver),
                    contentTypeObjectMap: getMapContentTypeIdToObject(data.types),
                    contentTypeSnippetObjectMap: getMapContentTypeSnippetIdToObject(data.snippets),
                    contentTypeFileNameMap: getMapContentTypeToFileName(data.contentTypeFileNameResolver),
                    elementNameMap: getMapElementToName(data.elementResolver),
                    optionalElements: data.optionalElements ?? false,
                    taxonomyNameMap: getMapTaxonomyName(data.taxonomyResolver),
                    taxonomyFileNameMap: getMapTaxonomyToFileName(data.taxonomyFileResolver),
                    taxonomyObjectMap: getMapTaxonomyIdTobject(data.taxonomies),
                    addTimestamp: data.addTimestamp,
                    addEnvironmentInfo: data.addEnvironmentInfo,
                    moduleResolution: data.moduleResolution
                });
                snippetFiles.push(file);
            }
            catch (error) {
                console.error(error);
                throw Error(`Failed to process content type snippet '${contentTypeSnippet.codename}' (${contentTypeSnippet.name})`);
            }
        }
        for (const type of data.types) {
            try {
                const file = this.createContentTypeModel({
                    moduleResolution: data.moduleResolution,
                    outputDir: data.outputDir,
                    type: type,
                    snippets: data.snippets,
                    taxonomies: data.taxonomies,
                    typeFolderName: data.typeFolderName,
                    typeSnippetsFolderName: data.typeSnippetsFolderName,
                    taxonomyFolderName: data.taxonomyFolderName,
                    contentTypeSnippetNameMap: getMapContentTypeSnippetToDeliveryTypeName(data.contentTypeSnippetResolver),
                    contentTypeSnippetFileNameMap: getMapContentTypeSnippetToFileName(data.contentTypeSnippetFileNameResolver),
                    contentTypeNameMap: getMapContentTypeToDeliveryTypeName(data.contentTypeResolver),
                    contentTypeObjectMap: getMapContentTypeIdToObject(data.types),
                    contentTypeFileNameMap: getMapContentTypeToFileName(data.contentTypeFileNameResolver),
                    contentTypeSnippetObjectMap: getMapContentTypeSnippetIdToObject(data.snippets),
                    elementNameMap: getMapElementToName(data.elementResolver),
                    optionalElements: data.optionalElements ?? false,
                    taxonomyNameMap: getMapTaxonomyName(data.taxonomyResolver),
                    taxonomyFileNameMap: getMapTaxonomyToFileName(data.taxonomyFileResolver),
                    taxonomyObjectMap: getMapTaxonomyIdTobject(data.taxonomies),
                    addTimestamp: data.addTimestamp,
                    addEnvironmentInfo: data.addEnvironmentInfo
                });
                typeFiles.push(file);
            }
            catch (error) {
                console.error(error);
                throw Error(`Failed to process content type '${type.codename}' (${type.name})`);
            }
        }
        return {
            contentTypeFiles: typeFiles,
            snippetFiles: snippetFiles
        };
    }
    getContentTypeImports(data) {
        const imports = [];
        const contentTypeSnippetExtensions = [];
        const processedTypeIds = [];
        const processedTaxonomyIds = [];
        const extendedElements = this.getExtendedElements({
            elementNameMap: data.elementNameMap,
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap
        });
        for (const extendedElement of extendedElements) {
            const element = extendedElement.element;
            if (element.type === 'taxonomy') {
                const taxonomy = this.extractUsedTaxonomy(element, data.taxonomyObjectMap);
                if (!taxonomy) {
                    continue;
                }
                if (processedTaxonomyIds.includes(taxonomy.id)) {
                    continue;
                }
                processedTaxonomyIds.push(taxonomy.id);
                const taxonomyName = data.taxonomyNameMap(taxonomy);
                const fileName = `../${data.taxonomyFolderName}${data.taxonomyFileNameMap(taxonomy, false)}`;
                imports.push(commonHelper.getImportStatement({
                    moduleResolution: data.moduleResolution,
                    filePath: fileName,
                    importValue: `type ${taxonomyName}`,
                    isExternalLib: false
                }));
            }
            else if (element.type === 'modular_content' || element.type === 'subpages') {
                // extract referenced types
                const referencedTypes = this.extractLinkedItemsAllowedTypes(element, data.contentTypeObjectMap);
                for (const referencedType of referencedTypes) {
                    if (processedTypeIds.includes(referencedType.id)) {
                        // type was already processed, no need to import it multiple times
                        continue;
                    }
                    // filter 'self referencing' types as they don't need to be imported
                    if (data.contentType?.id === referencedType.id) {
                        continue;
                    }
                    processedTypeIds.push(referencedType.id);
                    const typeName = data.contentTypeNameMap(referencedType);
                    const fileName = `${data.contentTypeFileNameMap(referencedType, false)}`;
                    const filePath = data.contentTypeSnippet
                        ? `../${data.typeFolderName}${fileName}`
                        : `./${fileName}`;
                    imports.push(commonHelper.getImportStatement({
                        moduleResolution: data.moduleResolution,
                        filePath: filePath,
                        importValue: `type ${typeName}`,
                        isExternalLib: false
                    }));
                }
            }
            else if (element.type === 'snippet') {
                const contentTypeSnipped = this.extractUsedSnippet(element, data.contentTypeSnippetObjectMap);
                const typeName = data.contentTypeSnippetNameMap(contentTypeSnipped);
                const filePath = `../${data.typeSnippetsFolderName}${data.contentTypeSnippetFileNameMap(contentTypeSnipped, false)}`;
                imports.push(commonHelper.getImportStatement({
                    moduleResolution: data.moduleResolution,
                    filePath: filePath,
                    importValue: `type ${typeName}`,
                    isExternalLib: false
                }));
                contentTypeSnippetExtensions.push(typeName);
            }
        }
        return {
            imports: commonHelper.sortAlphabetically(imports, (item) => item),
            contentTypeSnippetExtensions: contentTypeSnippetExtensions,
            processedElements: extendedElements
        };
    }
    getModelCode(data) {
        const importResult = this.getContentTypeImports({
            elementNameMap: data.elementNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeSnippetNameMap: data.contentTypeSnippetNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeSnippetFileNameMap: data.contentTypeSnippetFileNameMap,
            contentTypeSnippetObjectMap: data.contentTypeSnippetObjectMap,
            taxonomyFileNameMap: data.taxonomyFileNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            snippets: data.snippets,
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            typeFolderName: data.typeFolderName,
            typeSnippetsFolderName: data.typeSnippetsFolderName,
            taxonomyFolderName: data.taxonomyFolderName,
            moduleResolution: data.moduleResolution
        });
        const topLevelImports = ['type IContentItem'];
        if (importResult.processedElements.filter((m) => m.type !== 'snippet' && m.type !== 'guidelines').length) {
            // add 'Elements' import only if there is > 1 elements in content type
            topLevelImports.push('type Elements');
        }
        let code = commonHelper.getImportStatement({
            moduleResolution: data.moduleResolution,
            filePath: this.deliveryNpmPackageName,
            importValue: `${topLevelImports.join(', ')}`,
            isExternalLib: true
        });
        if (importResult.imports.length) {
            for (const importItem of importResult.imports) {
                code += `${importItem}`;
            }
            code += `\n`;
        }
        let comment = '';
        let typeName = '';
        let typeExtends = '';
        if (data.contentType) {
            comment = this.getContentTypeComment(data.contentType);
            typeName = data.contentTypeNameMap(data.contentType);
            if (importResult.contentTypeSnippetExtensions.length) {
                typeExtends = `& ${importResult.contentTypeSnippetExtensions.join(' & ')}`;
            }
        }
        else if (data.contentTypeSnippet) {
            comment = this.getContentTypeSnippetComment(data.contentTypeSnippet);
            typeName = data.contentTypeSnippetNameMap(data.contentTypeSnippet);
        }
        code += `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
*
* ${comment}
*/
export type ${typeName} = IContentItem<{
    ${this.getElementsCode({
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            optionalElements: data.optionalElements,
            snippets: data.snippets,
            elementNameMap: data.elementNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            taxonomies: data.taxonomies
        })}
}>${typeExtends};
`;
        return code;
    }
    createContentTypeModel(data) {
        const filename = `${data.outputDir}${data.typeFolderName}${data.contentTypeFileNameMap(data.type, true)}`;
        const code = this.getModelCode({
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeSnippetFileNameMap: data.contentTypeSnippetFileNameMap,
            contentTypeSnippetNameMap: data.contentTypeSnippetNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeSnippetObjectMap: data.contentTypeSnippetObjectMap,
            contentType: data.type,
            contentTypeSnippet: undefined,
            optionalElements: data.optionalElements,
            snippets: data.snippets,
            taxonomies: data.taxonomies,
            typeFolderName: data.typeFolderName,
            typeSnippetsFolderName: data.typeSnippetsFolderName,
            taxonomyFolderName: data.taxonomyFolderName,
            addTimestamp: data.addTimestamp,
            addEnvironmentInfo: data.addEnvironmentInfo,
            elementNameMap: data.elementNameMap,
            taxonomyFileNameMap: data.taxonomyFileNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            moduleResolution: data.moduleResolution
        });
        return {
            filename: filename,
            text: code
        };
    }
    createContentTypeSnippetModel(data) {
        const filename = `${data.outputDir}${data.typeSnippetsFolderName}${data.contentTypeSnippetFileNameMap(data.snippet, true)}`;
        const code = this.getModelCode({
            contentTypeFileNameMap: data.contentTypeFileNameMap,
            contentTypeSnippetFileNameMap: data.contentTypeSnippetFileNameMap,
            contentTypeSnippetNameMap: data.contentTypeSnippetNameMap,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            contentTypeSnippetObjectMap: data.contentTypeSnippetObjectMap,
            contentType: undefined,
            contentTypeSnippet: data.snippet,
            snippets: data.snippets,
            taxonomies: data.taxonomies,
            typeFolderName: data.typeFolderName,
            typeSnippetsFolderName: data.typeSnippetsFolderName,
            taxonomyFolderName: data.taxonomyFolderName,
            addTimestamp: data.addTimestamp,
            addEnvironmentInfo: data.addEnvironmentInfo,
            elementNameMap: data.elementNameMap,
            optionalElements: data.optionalElements,
            taxonomyFileNameMap: data.taxonomyFileNameMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap,
            moduleResolution: data.moduleResolution
        });
        return {
            filename: filename,
            text: code
        };
    }
    getContentTypeComment(contentType) {
        let comment = `${contentType.name}`;
        comment += `\n* Id: ${contentType.id}`;
        comment += `\n* Codename: ${contentType.codename}`;
        return comment;
    }
    getContentTypeSnippetComment(contentTypeSnippet) {
        let comment = `${contentTypeSnippet.name}`;
        comment += `\n* Id: ${contentTypeSnippet.id}`;
        comment += `\n* Codename: ${contentTypeSnippet.codename}`;
        return comment;
    }
    getElementComment(extendedElement, taxonomies) {
        const element = extendedElement.element;
        const isRequired = commonHelper.isElementRequired(element);
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element, taxonomies);
        const codename = commonHelper.getElementCodename(element);
        let comment = '/**';
        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }
        comment += `\n* Required: ${isRequired ? 'true' : 'false'}`;
        comment += `\n* Id: ${element.id}`;
        if (codename) {
            comment += `\n* Codename: ${codename}`;
        }
        if (extendedElement.snippet) {
            comment += `\n* From snippet: ${extendedElement.snippet.name}`;
            comment += `\n* Snippet codename: ${extendedElement.snippet.codename}`;
        }
        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${textHelper.removeLineEndings(guidelines)}`;
        }
        comment += '\n*/';
        return comment;
    }
    getElementsCode(data) {
        const extendedElements = this.getExtendedElements({
            elementNameMap: data.elementNameMap,
            contentType: data.contentType,
            contentTypeSnippet: data.contentTypeSnippet,
            contentTypeNameMap: data.contentTypeNameMap,
            contentTypeObjectMap: data.contentTypeObjectMap,
            taxonomyNameMap: data.taxonomyNameMap,
            taxonomyObjectMap: data.taxonomyObjectMap
        });
        let code = '';
        for (let i = 0; i < extendedElements.length; i++) {
            const extendedElement = extendedElements[i];
            const element = extendedElement.element;
            const codename = commonHelper.getElementCodename(element);
            if (!codename) {
                throw Error(`Invalid codename for element '${element.id}'`);
            }
            const elementName = extendedElement.mappedName;
            if (!elementName) {
                // skip element if its not resolver
                continue;
            }
            if (!extendedElement.mappedType) {
                // element type not supported
                continue;
            }
            const isRequired = commonHelper.isElementRequired(extendedElement.element);
            code += `${this.getElementComment(extendedElement, data.taxonomies)}\n`;
            code += `${elementName}${!isRequired && data.optionalElements ? '?' : ''}: Elements.${extendedElement.mappedType};`;
            if (i !== extendedElements.length - 1) {
                code += '\n\n';
            }
        }
        return code;
    }
    mapElementType(data) {
        const elementType = data.element.type;
        let mappedType;
        if (elementType === 'text') {
            mappedType = 'TextElement';
        }
        else if (elementType === 'number') {
            mappedType = 'NumberElement';
        }
        else if (elementType === 'modular_content' || elementType === 'subpages') {
            mappedType = `LinkedItemsElement<${this.getLinkedItemsAllowedTypes(data.element, data.contentTypeNameMap, data.contentTypeObjectMap).join(' | ')}>`;
        }
        else if (elementType === 'asset') {
            mappedType = 'AssetsElement';
        }
        else if (elementType === 'date_time') {
            mappedType = 'DateTimeElement';
        }
        else if (elementType === 'rich_text') {
            mappedType = 'RichTextElement';
        }
        else if (elementType === 'multiple_choice') {
            mappedType = 'MultipleChoiceElement';
        }
        else if (elementType === 'url_slug') {
            mappedType = 'UrlSlugElement';
        }
        else if (elementType === 'taxonomy') {
            const taxonomyName = this.getTaxonomyTypeName(data.element, data.taxonomyNameMap, data.taxonomyObjectMap);
            if (taxonomyName) {
                mappedType = `TaxonomyElement<${taxonomyName}>`;
            }
            else {
                mappedType = `TaxonomyElement`;
            }
        }
        else if (elementType === 'custom') {
            mappedType = 'CustomElement';
        }
        else if (elementType === 'snippet') {
            mappedType = undefined;
        }
        else {
            mappedType = undefined;
        }
        return {
            mappedType: mappedType,
            type: elementType,
            snippet: data.snippet,
            element: data.element,
            mappedName: data.elementNameMap(data.element)
        };
    }
    getExtendedElements(data) {
        const extendedElements = [];
        const elements = data.contentType ? data.contentType.elements : data.contentTypeSnippet?.elements ?? [];
        for (const element of elements) {
            extendedElements.push(this.mapElementType({
                element: element,
                elementNameMap: data.elementNameMap,
                contentTypeNameMap: data.contentTypeNameMap,
                contentTypeObjectMap: data.contentTypeObjectMap,
                taxonomyNameMap: data.taxonomyNameMap,
                taxonomyObjectMap: data.taxonomyObjectMap,
                snippet: undefined
            }));
        }
        return commonHelper.sortAlphabetically(extendedElements, (item) => item.mappedName ?? '');
    }
    getTaxonomyTypeName(element, taxonomyNameMap, taxonomyObjectMap) {
        const taxonomy = this.extractUsedTaxonomy(element, taxonomyObjectMap);
        if (!taxonomy) {
            return undefined;
        }
        return taxonomyNameMap(taxonomy);
    }
    getLinkedItemsAllowedTypes(element, contentTypeNameMap, contentTypeObjectMap) {
        const allowedTypes = this.extractLinkedItemsAllowedTypes(element, contentTypeObjectMap);
        if (!allowedTypes.length) {
            return ['IContentItem'];
        }
        const allowedTypeNames = allowedTypes.map((m) => contentTypeNameMap(m)) ?? [];
        return allowedTypeNames;
    }
    extractLinkedItemsAllowedTypes(element, contentTypeObjectMap) {
        const allowedTypeIds = [];
        const codename = commonHelper.getElementCodename(element);
        if (element.type === 'modular_content') {
            const linkedItemsElement = element;
            if (linkedItemsElement?.allowed_content_types?.length) {
                allowedTypeIds.push(...(linkedItemsElement.allowed_content_types?.map((m) => m.id) ?? []));
            }
        }
        else if (element.type === 'subpages') {
            const subpagesItemsElement = element;
            if (subpagesItemsElement?.allowed_content_types?.length) {
                allowedTypeIds.push(...(subpagesItemsElement.allowed_content_types?.map((m) => m.id) ?? []));
            }
        }
        else {
            throw Error(`Expected 'modular_content' or 'subpages' but got '${element.type}' for element '${codename}' with id '${element.id}'`);
        }
        return allowedTypeIds.map((id) => contentTypeObjectMap(id));
    }
    extractUsedSnippet(element, contentTypeSnippetObjectMap) {
        if (element.type !== 'snippet') {
            throw Error(`Expected 'snippet' but got '${element.type}' for element '${element.codename}'`);
        }
        const snippetElement = element;
        const snippedId = snippetElement.snippet.id;
        if (!snippedId) {
            throw Error(`Invalid snippet id for taxonomy element '${element.id}'`);
        }
        return contentTypeSnippetObjectMap(snippedId);
    }
    extractUsedTaxonomy(element, taxonomyObjectMap) {
        const codename = commonHelper.getElementCodename(element);
        if (element.type !== 'taxonomy') {
            throw Error(`Expected 'taxonomy' but got '${element.type}' for element '${codename}' with id '${element.id}'`);
        }
        const taxonomyElement = element;
        const taxonomyGroupId = taxonomyElement.taxonomy_group.id;
        if (!taxonomyGroupId) {
            throw Error(`Invalid taxonomy group id for taxonomy element '${element.id}'`);
        }
        return taxonomyObjectMap(taxonomyGroupId);
    }
}
export const deliveryContentTypeGenerator = new DeliveryContentTypeGenerator();
//# sourceMappingURL=delivery-content-type.generator.js.map