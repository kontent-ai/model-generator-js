import type { WorkflowCodenames } from "../system/workflows.generated.js";

export type AdvancedWorkflowWorkflowCodename = keyof Pick<Record<WorkflowCodenames, null>, "advanced_workflow">;

export function isAdvancedWorkflowWorkflowCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowCodename {
	return typeof value === "string" && value === ("advanced_workflow" satisfies AdvancedWorkflowWorkflowCodename);
}

export const advancedWorkflowWorkflowStepCodenames = ["draft_b42a7f1", "step_1", "step_2", "published", "archived", "scheduled"] as const;

export type AdvancedWorkflowWorkflowStepCodenames = (typeof advancedWorkflowWorkflowStepCodenames)[number];

export function isAdvancedWorkflowWorkflowStepCodename(value: string | undefined | null): value is AdvancedWorkflowWorkflowStepCodenames {
	return typeof value === "string" && (advancedWorkflowWorkflowStepCodenames as readonly string[]).includes(value);
}
