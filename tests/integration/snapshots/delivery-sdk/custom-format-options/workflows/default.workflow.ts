
import type { WorkflowCodenames } from './_workflows.js';
    
 /**
 * Type representing codename of Default Workflow
 * 
* Codename: default
*/
export type DefaultWorkflowCodename = Extract<WorkflowCodenames, 'default'>;

/**
 * Type guard for Default entity
 * 
* Codename: default
*/
export function isDefaultWorkflowCodename(value: string | undefined | null): value is DefaultWorkflowCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultWorkflowCodename);
            }

/**
 * Object with all values of workflow step codenames in Default
*/
export const defaultWorkflowStepCodenames = ['draft', 'published', 'archived', 'scheduled'] as const;;

/**
 * Type representing workflow step codenames in Default
*/
export type DefaultWorkflowStepCodenames = typeof defaultWorkflowStepCodenames[number];

/**
 * Type guard for workflow step codenames in Default
*/
export function isDefaultWorkflowStepCodename(value: string | undefined | null): value is DefaultWorkflowStepCodenames {
                return typeof value === 'string' && (defaultWorkflowStepCodenames as readonly string[]).includes(value);
            };

