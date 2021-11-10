import { IContentType, ILanguage, ITaxonomyGroup, ITaxonomyTerms } from '@kentico/kontent-delivery';
import * as fs from 'fs';
import { yellow } from 'colors';
import { format, Options } from 'prettier';
import { commonHelper } from '../../common-helper';

export class DeliveryProjectGenerator {
    generateProjectModel(data: {
        types: IContentType[];
        languages: ILanguage[];
        taxonomies: ITaxonomyGroup[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): void {
        const code = this.getProjectModelCode({
            types: data.types,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            languages: data.languages,
            taxonomies: data.taxonomies
        });

        this.createFileOnFs(code);
    }

    private getProjectModelCode(data: {
        types: IContentType[];
        taxonomies: ITaxonomyGroup[];
        languages: ILanguage[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const code = `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
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

    private getProjectLanguages(languages: ILanguage[]): string {
        let code: string = ``;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const isLast = i === languages.length - 1;
            code += `${language.system.codename}: {
                codename: '${language.system.codename}',
                name: '${commonHelper.escapeNameValue(language.system.name)}'}
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
                name: '${commonHelper.escapeNameValue(contentType.system.name)}',
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
                name: '${commonHelper.escapeNameValue(element.name)}'
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
                name: '${commonHelper.escapeNameValue(taxonomy.system.name)}',
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
                name: '${commonHelper.escapeNameValue(term.name)}',
                ${this.getProjectTaxonomiesTerms(term.terms)}
            }${!isLast ? ',' : ''}`;
        }
        code += '}';

        return code;
    }

    private createFileOnFs(code: string): void {
        const classFileName = this.getProjectModelFilename();

        fs.writeFileSync('./' + classFileName, code);

        console.log(`\nProject structure '${yellow(classFileName)}'`);
    }

    private getProjectModelFilename(): string {
        return `_project.ts`;
    }
}

export const deliveryProjectGenerator = new DeliveryProjectGenerator();
