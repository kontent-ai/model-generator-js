
/** 
* This file has been auto-generated by '@kontent-ai/model-generator@8.1.0'.
* 
* (c) Kontent.ai
*  
* -------------------------------------------------------------------------------
* 
* Project: Movie Database
* Environment: Production
* Id: da5abe9f-fdad-4168-97cd-b3464be2ccb9
* 
* -------------------------------------------------------------------------------
**/

import type { WorkflowCodenames } from './core.workflow.js';

/**
 * Type representing codename of Default entity
 *
 * Codename: default
 * Id: 00000000-0000-0000-0000-000000000000
 */
export type DefaultWorkflowCodename = Extract<WorkflowCodenames, 'default'>;

/**
 * Type guard for Default entity
 *
 * Codename: default
 * Id: 00000000-0000-0000-0000-000000000000
 */
export function isDefaultWorkflowCodename(value: string | undefined | null): value is DefaultWorkflowCodename {
    return typeof value === 'string' && value === ('default' satisfies DefaultWorkflowCodename);
}

/**
 * Object with all values of workflow step codenames in Default
 */
export const defaultWorkflowStepCodenames = ['draft', 'review', 'ready_to_publish', 'published', 'archived', 'scheduled'] as const;

/**
 * Type representing workflow step codenames in Default
 */
export type DefaultWorkflowStepCodenames = (typeof defaultWorkflowStepCodenames)[number];

/**
 * Type guard for workflow step codenames in Default
 */
export function isDefaultWorkflowStepCodename(value: string | undefined | null): value is DefaultWorkflowStepCodenames {
    return typeof value === 'string' && (defaultWorkflowStepCodenames as readonly string[]).includes(value);
}
