
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

/**
 * Object containing all Workflow codenames
 */
export const workflowValues = ['default'] as const;

/**
 * Type representing Workflow codenames
 */
export type WorkflowCodenames = (typeof workflowValues)[number];

/**
 * Type guard for Workflow codenames
 */
export function isWorkflow(value: string | undefined | null): value is WorkflowCodenames {
    return typeof value === 'string' && (workflowValues as readonly string[]).includes(value);
}
