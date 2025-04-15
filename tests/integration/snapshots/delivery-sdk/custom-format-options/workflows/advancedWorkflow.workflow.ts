
import type { WorkflowCodenames } from './_workflows.js';
    
 /**
 * Type representing codename of Advanced workflow Workflow
 * 
* Codename: advanced_workflow
*/
export type AdvancedWorkflowWorkflowCodename = Extract<WorkflowCodenames, 'advanced_workflow'>;

/**
 * Type guard for Advanced workflow entity
 * 
* Codename: advanced_workflow
*/
export function isAdvancedWorkflowWorkflowCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowCodename {
                return typeof value === 'string' && value === ('advanced_workflow' satisfies AdvancedWorkflowWorkflowCodename);
            }

/**
 * Object with all values of workflow step codenames in Advanced workflow
*/
export const advancedWorkflowWorkflowStepCodenames = ['draft_b42a7f1', 'step_1', 'step_2', 'published', 'archived', 'scheduled'] as const;;

/**
 * Type representing workflow step codenames in Advanced workflow
*/
export type AdvancedWorkflowWorkflowStepCodenames = typeof advancedWorkflowWorkflowStepCodenames[number];

/**
 * Type guard for workflow step codenames in Advanced workflow
*/
export function isAdvancedWorkflowWorkflowStepCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowStepCodenames {
                return typeof value === 'string' && (advancedWorkflowWorkflowStepCodenames as readonly string[]).includes(value);
            };

