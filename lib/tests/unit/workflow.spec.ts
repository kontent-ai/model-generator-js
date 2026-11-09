import { WorkflowModels } from "@kontent-ai/management-sdk";
import { describe, expect, it } from "vitest";
import { getAllWorkflowSteps, getWorkflowSteps } from "../../core/workflow.utils.js";

const createWorkflow = (codename: string): Readonly<WorkflowModels.Workflow> =>
	new WorkflowModels.Workflow({
		id: codename,
		name: codename,
		codename,
		scopes: [],
		steps: [
			{ id: `${codename}_draft`, name: "Draft", codename: `${codename}_draft`, color: "gray", transitions_to: [], role_ids: [] },
			{ id: `${codename}_review`, name: "Review", codename: `${codename}_review`, color: "red", transitions_to: [], role_ids: [] },
		],
		scheduledStep: { id: `${codename}_scheduled`, name: "Scheduled", codename: `${codename}_scheduled` },
		publishedStep: {
			id: `${codename}_published`,
			name: "Published",
			codename: `${codename}_published`,
			create_new_version_role_ids: [],
			unpublish_role_ids: [],
		},
		archivedStep: { id: `${codename}_archived`, name: "Archived", codename: `${codename}_archived`, role_ids: [] },
		_raw: {} as WorkflowModels.Workflow["_raw"],
	});

describe("Workflow - getWorkflowSteps", () => {
	it("Returns all steps in the order they appear in the Kontent.ai UI", () => {
		expect(getWorkflowSteps(createWorkflow("a")).map((step) => step.codename)).toStrictEqual([
			"a_draft",
			"a_review",
			"a_scheduled",
			"a_published",
			"a_archived",
		]);
	});
});

describe("Workflow - getAllWorkflowSteps", () => {
	it("Returns steps of all workflows", () => {
		expect(getAllWorkflowSteps([createWorkflow("a"), createWorkflow("b")]).map((step) => step.codename)).toStrictEqual([
			"a_draft",
			"a_review",
			"a_scheduled",
			"a_published",
			"a_archived",
			"b_draft",
			"b_review",
			"b_scheduled",
			"b_published",
			"b_archived",
		]);
	});

	it("Returns empty array for no workflows", () => {
		expect(getAllWorkflowSteps([])).toStrictEqual([]);
	});
});
