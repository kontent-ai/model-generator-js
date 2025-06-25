
            import type { WorkflowCodenames } from '../system/workflows.generated.js';
           
            /*
* Type representing codename of 'Advanced workflow' workflow
*/
            export type AdvancedWorkflowWorkflowCodename = keyof Pick<Record<WorkflowCodenames, null>, "advanced_workflow">;

            /*
* Typeguard for codename of 'Advanced workflow' workflow
*/
            export function isAdvancedWorkflowWorkflowCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowCodename {
                return typeof value === 'string' && value === ('advanced_workflow' satisfies AdvancedWorkflowWorkflowCodename);
            }

            /*
* Array of all workflow step codenames
*/
            export const advancedWorkflowWorkflowStepCodenames = ['draft_b42a7f1', 'step_1', 'step_2', 'published', 'archived', 'scheduled'] as const;;
           
            /*
* Type representing all workflow step codenames
*/
            export type AdvancedWorkflowWorkflowStepCodenames = typeof advancedWorkflowWorkflowStepCodenames[number];;

            /*
* Typeguard for workflow step codename
*/
            export function isAdvancedWorkflowWorkflowStepCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowStepCodenames {
                return typeof value === 'string' && (advancedWorkflowWorkflowStepCodenames as readonly string[]).includes(value);
            };
            