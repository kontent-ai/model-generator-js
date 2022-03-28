import * as fs from 'fs';
import { yellow } from 'colors';
import { format, Options } from 'prettier';
import { commonHelper } from '../../common-helper';
import { textHelper } from '../../text-helper';
import {
    ContentTypeElements,
    ContentTypeModels,
    LanguageModels,
    ProjectModels,
    TaxonomyModels
} from '@kentico/kontent-management';
import { IGenerateResult } from '../../common-helper';

export class DeliveryProjectGenerator {
    generateProjectModel(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): IGenerateResult {
        const code = this.getProjectModelCode({
            projectInformation: data.projectInformation,
            types: data.types,
            addTimestamp: data.addTimestamp,
            formatOptions: data.formatOptions,
            languages: data.languages,
            taxonomies: data.taxonomies
        });

        this.createFileOnFs(code);

        return {
            filenames: [`./${this.getProjectModelFilename()}`]
        };
    }

    private getProjectComment(projectInformation: ProjectModels.ProjectInformationModel): string {
        let comment: string = `${projectInformation.name}`;

        comment += `\n* Id: ${projectInformation.id}`;
        comment += `\n* Environment: ${projectInformation.environment}`;

        return comment;
    }

    private getContentTypeComment(contentType: ContentTypeModels.ContentType): string {
        let comment: string = `/**`;

        comment += `\n* ${contentType.name}`;
        comment += `\n* Id: ${contentType.id}`;
        comment += `\n* Codename: ${contentType.codename}`;
        comment += `\n*/`;

        return comment;
    }

    private getLanguageComment(language: LanguageModels.LanguageModel): string {
        let comment: string = `/**`;

        comment += `\n* ${language.name}`;
        comment += `\n* Id: ${language.id}`;
        comment += `\n* Codename: ${language.codename}`;
        comment += `\n* Is Active: ${language.isActive ? 'true' : 'false'}`;
        comment += `\n* Is Default: ${language.isDefault}`;
        comment += `\n* Fallback language Id: ${language.fallbackLanguage?.id}`;
        comment += `\n*/`;

        return comment;
    }

    private getElementComment(element: ContentTypeElements.ContentTypeElementModel): string {
        let comment: string = `/**`;

        const isRequired = commonHelper.isElementRequired(element);
        const guidelines = commonHelper.getElementGuidelines(element);
        const name = commonHelper.getElementTitle(element);

        if (name) {
            comment += `\n* ${name} (${element.type})`;
        }

        comment += `\n* Required: ${isRequired ? 'true' : 'false'}`;
        comment += `\n* Id: ${element.id}`;

        if (name) {
            comment += `\n* Codename: ${element.codename}`;
        }

        if (guidelines) {
            comment += `\n*`;
            comment += `\n* ${guidelines}`;
        }

        comment += `\n*/`;

        return comment;
    }

    private getTaxonomyComment(taxonomy: TaxonomyModels.Taxonomy): string {
        let comment: string = `/**`;

        comment += `\n* ${taxonomy.name}`;
        comment += `\n* Id: ${taxonomy.id}`;
        comment += `\n* Codename: ${taxonomy.codename}`;
        comment += `\n*/`;

        return comment;
    }

    private getProjectModelCode(data: {
        projectInformation: ProjectModels.ProjectInformationModel;
        types: ContentTypeModels.ContentType[];
        languages: LanguageModels.LanguageModel[];
        taxonomies: TaxonomyModels.Taxonomy[];
        addTimestamp: boolean;
        formatOptions?: Options;
    }): string {
        const code = `
/**
* ${commonHelper.getAutogenerateNote(data.addTimestamp)}
*
* ${this.getProjectComment(data.projectInformation)}
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
            code += `\n`
            code += `${this.getLanguageComment(language)}\n`;
            code += `${textHelper.toAlphanumeric(language.codename)}: {
                codename: '${language.codename}',
                name: '${commonHelper.escapeNameValue(language.name)}'}`;
            code += `${!isLast ? ',\n' : ''}`;

        }

        return code;
    }

    private getProjectContentTypes(contentTypes: ContentTypeModels.ContentType[]): string {
        let code: string = ``;
        for (let i = 0; i < contentTypes.length; i++) {
            const contentType = contentTypes[i];
            const isLast = i === contentTypes.length - 1;

            code += `\n`
            code += `${this.getContentTypeComment(contentType)}\n`;
            code += `${contentType.codename}: {
                codename: '${contentType.codename}',
                name: '${commonHelper.escapeNameValue(contentType.name)}',
                elements: {${this.getProjectElements(contentType)}}
            }${!isLast ? ',\n' : ''}`;
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

            code += `\n`
            code += `${this.getElementComment(element)}\n`;
            code += `${element.codename}: {
                codename: '${element.codename}',
                name: '${commonHelper.escapeNameValue(name)}'
            }${!isLast ? ',\n' : ''}`;
        }

        return code;
    }

    private getProjectTaxonomies(taxonomies: TaxonomyModels.Taxonomy[]): string {
        let code: string = ``;
        for (let i = 0; i < taxonomies.length; i++) {
            const taxonomy = taxonomies[i];
            const isLast = i === taxonomies.length - 1;

            code += `\n`
            code += `${this.getTaxonomyComment(taxonomy)}\n`;
            code += `${taxonomy.codename}: {
                codename: '${taxonomy.codename}',
                name: '${commonHelper.escapeNameValue(taxonomy.name)}',
                ${this.getProjectTaxonomiesTerms(taxonomy.terms)}
            }${!isLast ? ',\n' : ''}`;
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
            }${!isLast ? ',\n' : ''}`;
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
