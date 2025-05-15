import type { WorkflowCodenames } from './_workflows.ts';

/*
 * Type representing codename of entity
 *
 * Name: Default
 * Codename: default
 * Type: Workflow
 */
export type DefaultWorkflowCodename = Extract<WorkflowCodenames, 'default'>;

/*
 * Type guard for Default
 *
 * Name: Default
 * Codename: default
 * Type: Workflow
 */
export function isDefaultWorkflowCodename(value: string | undefined | null): value is DefaultWorkflowCodename {
	return typeof value === 'string' && value === ('default' satisfies DefaultWorkflowCodename);
}

/*
 * Array of all codenames
 *
 * Name: Default
 * Type: Workflow step
 */
export const defaultStepCodenames = ['draft', 'published', 'archived', 'scheduled'] as const;

/*
 * Type representing all codenames
 *
 * Name: Default
 * Type: Workflow step
 */
export type DefaultStepCodenames = (typeof defaultStepCodenames)[number];

/*
 * Typeguard for codename
 *
 * Name: Default
 * Type: Workflow step
 */
export function isDefaultStepCodename(value: string | undefined | null): value is DefaultStepCodenames {
	return typeof value === 'string' && (defaultStepCodenames as readonly string[]).includes(value);
}
