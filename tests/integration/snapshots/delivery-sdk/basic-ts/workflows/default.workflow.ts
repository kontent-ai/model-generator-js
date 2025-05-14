import type { WorkflowCodenames } from './_workflows.ts';

/*
 * Type representing codename of Default
 *
 * Codename: default
 */
export type DefaultWorkflowCodename = Extract<WorkflowCodenames, 'default'>;

/*
 * Type guard for Default
 *
 * Codename: default
 */
export function isDefaultWorkflowCodename(value: string | undefined | null): value is DefaultWorkflowCodename {
	return typeof value === 'string' && value === ('default' satisfies DefaultWorkflowCodename);
}

/*
 * Object with all values of Workflow codenames in Default
 */
export const defaultStepCodenames = ['draft', 'published', 'archived', 'scheduled'] as const;

/*
 * Type representing Workflow codenames in Default
 */
export type DefaultStepCodenames = (typeof defaultStepCodenames)[number];

/*
 * Type guard for Workflow codenames in Default
 */
export function isDefaultStepCodename(value: string | undefined | null): value is DefaultStepCodenames {
	return typeof value === 'string' && (defaultStepCodenames as readonly string[]).includes(value);
}
