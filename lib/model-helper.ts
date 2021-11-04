import {
    IContentType,
    ElementType,
    camelCasePropertyNameResolver,
    pascalCasePropertyNameResolver,
    snakeCasePropertyNameResolver,
    PropertyNameResolver,
    ITaxonomyGroup,
    ILanguage,
    ITaxonomyTerms
} from '@kentico/kontent-delivery';
import { name, version } from '../package.json';
import { format, Options } from 'prettier';
import { PropertyNameResolverType } from './models';

export const kontentProject = {
    contentTypes: {
        article: {
            codename: 'article',
            name: 'Article',
            elements: {
                title: {
                    codename: 'title',
                    name
                }
            }
        }
    },
    languages: {
        cz: {
            codename: 'cz',
            name: 'czech'
        }
    },
    taxonomies: {
        movieType: {
            codename: 'movieType',
            terms: {
                javascript: {
                    codename: 'js',
                    name: 'JavaScript'
                }
            }
        }
    }
};

export class ModelHelper {
    getProjectModelFilename(): string {
        return `_project.ts`;
    }

    getModelFilename(data: { type: IContentType }): string {
        return `${data.type.system.codename}.ts`;
    }

    getProjectModelCode(data: {
        types: IContentType[];
        taxonomies: ITaxonomyGroup[];
        languages: ILanguage[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const code = `
/**
* ${this.getAutogenerateNote(data.addTimestamp)}
*/
export const projectModel = {
    languages: {
        ${this.getProjectLanguages(data.languages)}
    },
    contentTypes: {
        ${this.getProjectContentTypes(data.types)}
    },
    taxonomies: {
        ${this.getProjectTaxonomies(data.taxonomies)}
    }
};
`;

        const formatOptions: Options = data.formatOptions
            ? data.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        // beautify code
        return format(code, formatOptions);
    }

    getModelCode(data: {
        type: IContentType;
        addTimestamp: boolean;
        formatOptions?: Options;
        nameResolver?: PropertyNameResolverType;
        customNameResolver?: PropertyNameResolver;
    }): string {
        const code = `
import { IContentItem, Elements } from '@kentico/kontent-delivery';

/**
 * ${this.getAutogenerateNote(data.addTimestamp)}
*/
export type ${this.toPascalCase(data.type.system.codename)} = IContentItem<{
    ${this.getElementsCode({
        type: data.type,
        nameResolver: data.nameResolver,
        customNameResolver: data.customNameResolver
    })}
}>;
`;
        const formatOptions: Options = data.formatOptions
            ? data.formatOptions
            : {
                  parser: 'typescript',
                  singleQuote: true
              };

        // beautify code
        return format(code, formatOptions);
    }

    private getProjectLanguages(languages: ILanguage[]): string {
        let code: string = ``;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const isLast = i === languages.length - 1;
            code += `${language.system.codename}: {
                codename: '${language.system.codename}',
                name: '${language.system.name}'}
            ${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectContentTypes(contentTypes: IContentType[]): string {
        let code: string = ``;
        for (let i = 0; i < contentTypes.length; i++) {
            const contentType = contentTypes[i];
            const isLast = i === contentTypes.length - 1;
            code += `${contentType.system.codename}: {
                codename: '${contentType.system.codename}',
                name: '${contentType.system.name}',
                elements: {${this.getProjectElements(contentType)}}
            }${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectElements(contentType: IContentType): string {
        let code: string = '';
        for (let i = 0; i < contentType.elements.length; i++) {
            const element = contentType.elements[i];
            const isLast = i === contentType.elements.length - 1;

            code += `${element.codename}: {
                codename: '${element.codename}',
                name: '${element.name}'
            }${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomies(taxonomies: ITaxonomyGroup[]): string {
        let code: string = ``;
        for (let i = 0; i < taxonomies.length; i++) {
            const taxonomy = taxonomies[i];
            const isLast = i === taxonomies.length - 1;
            code += `${taxonomy.system.codename}: {
                codename: '${taxonomy.system.codename}',
                name: '${taxonomy.system.name}',
                ${this.getProjectTaxonomiesTerms(taxonomy.terms)}
            }${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomiesTerms(terms: ITaxonomyTerms[]): string {
        if (terms.length === 0) {
            return `terms: {}`;
        }

        let code: string = `terms: {`;
        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            const isLast = i === terms.length - 1;
            code += `${term.codename}: {
                codename: '${term.codename}',
                name: '${term.name}',
                ${this.getProjectTaxonomiesTerms(term.terms)}
            }${!isLast ? ',' : ''}`;
        }
        code += '}';

        return code;
    }

    private getAutogenerateNote(addTimestamp: boolean): string {
        if (addTimestamp) {
            return `Generated by '${name}@${version}' at '${new Date().toUTCString()}'`;
        }

        return `Generated by '${name}@${version}'`;
    }

    private getElementsCode(data: {
        type: IContentType;
        nameResolver?: PropertyNameResolverType;
        customNameResolver?: PropertyNameResolver;
    }): string {
        let code = '';
        for (let i = 0; i < data.type.elements.length; i++) {
            const element = data.type.elements[i];
            code += `${this.getElementName({
                elementName: element.codename,
                type: data.type.system.codename,
                nameResolver: data.nameResolver,
                customNameResolver: data.customNameResolver
            })}: Elements.${this.mapElementTypeToName(element.type)};`;

            if (i !== data.type.elements.length - 1) {
                code += '\n';
            }
        }

        return code;
    }

    private mapElementTypeToName(elementType: string): string {
        let result: string = '';
        if (elementType.toLowerCase() === ElementType.Text.toLowerCase()) {
            result = 'TextElement';
        } else if (elementType.toLowerCase() === ElementType.Number.toLowerCase()) {
            result = 'NumberElement';
        } else if (elementType.toLowerCase() === ElementType.ModularContent.toLowerCase()) {
            result = `LinkedItemsElement<IContentItem>`;
        } else if (elementType.toLowerCase() === ElementType.Asset.toLowerCase()) {
            result = 'AssetsElement';
        } else if (elementType.toLowerCase() === ElementType.DateTime.toLowerCase()) {
            result = 'DateTimeElement';
        } else if (elementType.toLowerCase() === ElementType.RichText.toLowerCase()) {
            result = 'RichTextElement';
        } else if (elementType.toLowerCase() === ElementType.MultipleChoice.toLowerCase()) {
            result = 'MultipleChoiceElement';
        } else if (elementType.toLowerCase() === ElementType.UrlSlug.toLowerCase()) {
            result = 'UrlSlugElement';
        } else if (elementType.toLowerCase() === ElementType.Taxonomy.toLowerCase()) {
            result = 'TaxonomyElement';
        } else if (elementType.toLowerCase() === ElementType.Custom.toLowerCase()) {
            result = 'CustomElement';
        } else {
            console.warn(`Unsupported element type '${elementType}'`);
        }
        return result;
    }

    private getElementName(config: {
        type: string;
        elementName: string;
        nameResolver?: PropertyNameResolverType;
        customNameResolver?: PropertyNameResolver;
    }): string {
        if (config.customNameResolver) {
            return config.customNameResolver(config.type, config.elementName);
        }
        if (!config.nameResolver) {
            return config.elementName;
        }
        if (config.nameResolver === 'camelCase') {
            return camelCasePropertyNameResolver(config.type, config.elementName);
        }

        if (config.nameResolver === 'pascalCase') {
            return pascalCasePropertyNameResolver(config.type, config.elementName);
        }

        if (config.nameResolver === 'snakeCase') {
            return snakeCasePropertyNameResolver(config.type, config.elementName);
        }

        throw Error(
            `Invalid name resolver '${config.nameResolver}'. Available options are: camelCase, pascalCase, snakeCase`
        );
    }

    private toPascalCase(text: string): string {
        // use element resolver from SDK as it provides required functionality
        return pascalCasePropertyNameResolver('', text);
    }
}

export const modelHelper = new ModelHelper();
