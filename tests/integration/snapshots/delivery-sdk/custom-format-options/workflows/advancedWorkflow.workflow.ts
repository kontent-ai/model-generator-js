
            import type { WorkflowCodenames } from './_workflows.js';
           
    
            /*
                * Type representing codename of Advanced workflow
                * 
                * Codename: advanced_workflow
                */
            export type AdvancedWorkflowWorkflowCodename = Extract<WorkflowCodenames, 'advanced_workflow'>;

            /*
                * Type guard for Advanced workflow
                * 
                * Codename: advanced_workflow
            */
            export function isAdvancedWorkflowWorkflowCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowCodename {
                return typeof value === 'string' && value === ('advanced_workflow' satisfies AdvancedWorkflowWorkflowCodename);
            }

            /*
                * Object with all values of Workflow codenames in Advanced workflow
            */
            export const advancedWorkflowStepCodenames = ['draft_b42a7f1', 'step_1', 'step_2', 'published', 'archived', 'scheduled'] as const;;

            /*
                * Type representing Workflow codenames in Advanced workflow
            */
            export type AdvancedWorkflowStepCodenames = typeof advancedWorkflowStepCodenames[number];

            /*
                * Type guard for Workflow codenames in Advanced workflow
            */
            export function isAdvancedWorkflowStepCodename(value: string | undefined | null): value is AdvancedWorkflowStepCodenames {
                return typeof value === 'string' && (advancedWorkflowStepCodenames as readonly string[]).includes(value);
            };
            
            