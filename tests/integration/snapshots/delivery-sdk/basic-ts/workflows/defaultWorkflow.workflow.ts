import type { WorkflowCodenames } from './_workflows.ts';

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
export const defaultWorkflowStepCodenames = ['draft', 'published', 'archived', 'scheduled'] as const;

/*
 * Type representing all workflow step codenames
 */
export type DefaultWorkflowStepCodenames = (typeof defaultWorkflowStepCodenames)[number];

/*
 * Typeguard for workflow step codename
 */
export function isDefaultWorkflowStepCodename(value: string | undefined | null): value is DefaultWorkflowStepCodenames {
	return typeof value === 'string' && (defaultWorkflowStepCodenames as readonly string[]).includes(value);
}
