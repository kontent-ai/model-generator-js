
import type { WorkflowCodenames } from "../system/workflows.generated.js";

export type DefaultWorkflowCodename = keyof Pick<Record<WorkflowCodenames, null>, "default">;

export function isDefaultWorkflowCodename(value: string | undefined | null): value is DefaultWorkflowCodename {
	return typeof value === "string" && value === ("default" satisfies DefaultWorkflowCodename);
}

export const defaultWorkflowStepCodenames = ["draft", "review", "ready_to_publish", "published", "archived", "scheduled"] as const;

export type DefaultWorkflowStepCodenames = (typeof defaultWorkflowStepCodenames)[number];

export function isDefaultWorkflowStepCodename(value: string | undefined | null): value is DefaultWorkflowStepCodenames {
	return typeof value === "string" && (defaultWorkflowStepCodenames as readonly string[]).includes(value);
}
