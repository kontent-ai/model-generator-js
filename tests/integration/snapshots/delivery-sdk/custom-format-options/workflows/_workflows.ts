
            
            /*
                * Object with all values of Workflow codenames 
            */
            export const workflowCodenames = ['default', 'advanced_workflow'] as const;;

            /*
                * Type representing Workflow codenames 
            */
            export type WorkflowCodenames = typeof workflowCodenames[number];

            /*
                * Type guard for Workflow codenames 
            */
            export function isWorkflowCodename(value: string | undefined | null): value is WorkflowCodenames {
                return typeof value === 'string' && (workflowCodenames as readonly string[]).includes(value);
            };
            
            /*
                * Object with all values of workflow step codenames in Workflow
            */
            export const workflowStepCodenames = ['draft', 'published', 'archived', 'scheduled', 'draft_b42a7f1', 'step_1', 'step_2'] as const;;

            /*
                * Type representing workflow step codenames in Workflow
            */
            export type WorkflowStepCodenames = typeof workflowStepCodenames[number];

            /*
                * Type guard for workflow step codenames in Workflow
            */
            export function isWorkflowStepCodename(value: string | undefined | null): value is WorkflowStepCodenames {
                return typeof value === 'string' && (workflowStepCodenames as readonly string[]).includes(value);
            };