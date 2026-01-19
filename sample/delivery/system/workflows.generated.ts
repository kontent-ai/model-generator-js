
export const workflowCodenames = ["default"] as const;

export type WorkflowCodenames = (typeof workflowCodenames)[number];

export function isWorkflowCodename(value: string | undefined | null): value is WorkflowCodenames {
	return typeof value === "string" && (workflowCodenames as readonly string[]).includes(value);
}

export const workflowStepCodenames = ["draft", "review", "ready_to_publish", "published", "archived", "scheduled"] as const;

export type WorkflowStepCodenames = (typeof workflowStepCodenames)[number];

export function isWorkflowStepCodename(value: string | undefined | null): value is WorkflowStepCodenames {
	return typeof value === "string" && (workflowStepCodenames as readonly string[]).includes(value);
}
