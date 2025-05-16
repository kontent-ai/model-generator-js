
            import type { WorkflowCodenames } from './_workflows.js';
           
            /*
* Type representing codename of 'Advanced workflow' workflow
*/
            export type AdvancedWorkflowWorkflowCodename = Extract<WorkflowCodenames, 'advanced_workflow'>;

            /*
* Typeguard for codename of 'Advanced workflow' workflow
*/
            export function isAdvancedWorkflowWorkflowCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowCodename {
                return typeof value === 'string' && value === ('advanced_workflow' satisfies AdvancedWorkflowWorkflowCodename);
            }

            /*
* Array of all workflow step codenames
*/
            export const advancedWorkflowStepCodenames = ['draft_b42a7f1', 'step_1', 'step_2', 'published', 'archived', 'scheduled'] as const;;
           
            /*
* Type representing all workflow step codenames
*/
            export type AdvancedWorkflowStepCodenames = typeof advancedWorkflowStepCodenames[number];;

            /*
* Typeguard for workflow step codename
*/
            export function isAdvancedWorkflowStepCodename(value: string | undefined | null): value is AdvancedWorkflowStepCodenames {
                return typeof value === 'string' && (advancedWorkflowStepCodenames as readonly string[]).includes(value);
            };
            