
            import type { WorkflowCodenames } from './_workflows.js';
           
    
            /*
                * Type representing codename of entity
                * 
                * Name: Advanced workflow
        * Codename: advanced_workflow
        * Type: Workflow
                */
            export type AdvancedWorkflowWorkflowCodename = Extract<WorkflowCodenames, 'advanced_workflow'>;

            /*
                * Type guard for Advanced workflow
                * 
                * Name: Advanced workflow
        * Codename: advanced_workflow
        * Type: Workflow
            */
            export function isAdvancedWorkflowWorkflowCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowCodename {
                return typeof value === 'string' && value === ('advanced_workflow' satisfies AdvancedWorkflowWorkflowCodename);
            }

            /*
    * Array of all codenames
    *
    * Name: Advanced workflow
* Type: Workflow step
    */
            export const advancedWorkflowStepCodenames = ['draft_b42a7f1', 'step_1', 'step_2', 'published', 'archived', 'scheduled'] as const;;
           
            /*
    * Type representing all codenames
    *
    * Name: Advanced workflow
* Type: Workflow step
    */
            export type AdvancedWorkflowStepCodenames = typeof advancedWorkflowStepCodenames[number];

            /*
    * Typeguard for codename
    *
    * Name: Advanced workflow
* Type: Workflow step
    */
            export function isAdvancedWorkflowStepCodename(value: string | undefined | null): value is AdvancedWorkflowStepCodenames {
                return typeof value === 'string' && (advancedWorkflowStepCodenames as readonly string[]).includes(value);
            };
            
            