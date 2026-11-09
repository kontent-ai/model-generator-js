import type { WorkflowModels } from "@kontent-ai/management-sdk";

type Workflow = Readonly<WorkflowModels.Workflow>;

export type WorkflowStep = Workflow["steps"][number] | Workflow["scheduledStep"] | Workflow["publishedStep"] | Workflow["archivedStep"];

/**
 * Returns all steps of a workflow, including the scheduled, published and archived steps.
 * The order reflects the order in which the steps appear in the Kontent.ai UI.
 */
export function getWorkflowSteps(workflow: Workflow): readonly WorkflowStep[] {
	return [...workflow.steps, workflow.scheduledStep, workflow.publishedStep, workflow.archivedStep];
}

export function getAllWorkflowSteps(workflows: readonly Workflow[]): readonly WorkflowStep[] {
	return workflows.flatMap(getWorkflowSteps);
}
