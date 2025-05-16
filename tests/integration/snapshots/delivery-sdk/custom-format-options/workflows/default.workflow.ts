
            import type { WorkflowCodenames } from './_workflows.js';
           
            /*
* Type representing codename of 'Default' workflow
*/
            export type DefaultWorkflowCodename = Extract<WorkflowCodenames, 'default'>;

            /*
* Typeguard for codename of 'Default' workflow
*/
            export function isDefaultWorkflowCodename(value: string | undefined | null): value is DefaultWorkflowCodename {
                return typeof value === 'string' && value === ('default' satisfies DefaultWorkflowCodename);
            }

            /*
* Array of all workflow step codenames
*/
            export const defaultStepCodenames = ['draft', 'published', 'archived', 'scheduled'] as const;;
           
            /*
* Type representing all workflow step codenames
*/
            export type DefaultStepCodenames = typeof defaultStepCodenames[number];;

            /*
* Typeguard for workflow step codename
*/
            export function isDefaultStepCodename(value: string | undefined | null): value is DefaultStepCodenames {
                return typeof value === 'string' && (defaultStepCodenames as readonly string[]).includes(value);
            };
            