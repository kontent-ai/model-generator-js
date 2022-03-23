import * as fs from 'fs';
import { yellow } from 'colors';
import { format, Options } from 'prettier';
import { commonHelper } from '../../common-helper';
import { textHelper } from '../../text-helper';
import { ContentTypeModels, LanguageModels, TaxonomyModels } from '@kentico/kontent-management';

export class DeliveryProjectGenerator {
    generateProjectModel(data: {
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
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
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
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

    private getProjectLanguages(languages: LanguageModels.LanguageModel[]): string {
        let code: string = ``;
        for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            const isLast = i === languages.length - 1;
            code += `${textHelper.toAlphanumeric(language.codename)}: {
                codename: '${language.codename}',
                name: '${commonHelper.escapeNameValue(language.name)}'}
            ${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectContentTypes(contentTypes: ContentTypeModels.ContentType[]): string {
        let code: string = ``;
        for (let i = 0; i < contentTypes.length; i++) {
            const contentType = contentTypes[i];
            const isLast = i === contentTypes.length - 1;
            code += `${contentType.codename}: {
                codename: '${contentType.codename}',
                name: '${commonHelper.escapeNameValue(contentType.name)}',
                elements: {${this.getProjectElements(contentType)}}
            }${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectElements(contentType: ContentTypeModels.ContentType): string {
        let code: string = '';
        const elementsWithName = contentType.elements.filter((m) => (m as any)['name']);
        for (let i = 0; i < elementsWithName.length; i++) {
            const element = elementsWithName[i];
            const isLast = i === elementsWithName.length - 1;
            const name = (element as any)['name'];

            if (!name) {
                throw Error(`Element '${element.codename}' needs to have a name property`);
            }

            code += `${element.codename}: {
                codename: '${element.codename}',
                name: '${commonHelper.escapeNameValue(name)}'
            }${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomies(taxonomies: TaxonomyModels.Taxonomy[]): string {
        let code: string = ``;
        for (let i = 0; i < taxonomies.length; i++) {
            const taxonomy = taxonomies[i];
            const isLast = i === taxonomies.length - 1;
            code += `${taxonomy.codename}: {
                codename: '${taxonomy.codename}',
                name: '${commonHelper.escapeNameValue(taxonomy.name)}',
                ${this.getProjectTaxonomiesTerms(taxonomy.terms)}
            }${!isLast ? ',' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomiesTerms(terms: TaxonomyModels.Taxonomy[]): string {
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
