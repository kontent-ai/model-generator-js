import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Person } from './person';
import { type Step } from './step';

/**
 * Generated by '@kontent-ai/model-generator@6.5.0'
 *
 * Session
 * Id: 9dfcd879-0d06-45ca-9b2c-67fd9c6e3b34
 * Codename: session
 */
export type Session = IContentItem<{
    /**
     * Agenda (modular_content)
     * Required: false
     * Id: c6fa7f46-cf83-446d-8e36-830e423292e7
     * Codename: agenda
     */
    agenda: Elements.LinkedItemsElement<Step>;

    /**
     * Assets (asset)
     * Required: false
     * Id: b73d60dc-2dd0-4a5e-9cd2-7ebe705dd1f2
     * Codename: assets
     */
    assets: Elements.AssetsElement;

    /**
     * Checklist (multiple_choice)
     * Required: false
     * Id: c8fa819e-4640-442a-8248-293993b54ee0
     * Codename: checklist
     */
    checklist: Elements.MultipleChoiceElement;

    /**
     * Excercise (rich_text)
     * Required: false
     * Id: b852e079-fd6d-4cfa-b920-7eadb1bffc95
     * Codename: excercise
     */
    excercise: Elements.RichTextElement;

    /**
     * Name (text)
     * Required: false
     * Id: b26de2bb-e9f9-4dfe-a42a-f40f6252cf03
     * Codename: name
     */
    name: Elements.TextElement;

    /**
     * Presenter (modular_content)
     * Required: false
     * Id: d34b6f20-8bb7-49a3-b0d4-6404cafa7bf1
     * Codename: presenter
     */
    presenter: Elements.LinkedItemsElement<Person>;

    /**
     * Summary (rich_text)
     * Required: false
     * Id: 7e506a63-b5d9-4dd6-bb5f-bee9416601bc
     * Codename: summary
     */
    summary: Elements.RichTextElement;
}>;
