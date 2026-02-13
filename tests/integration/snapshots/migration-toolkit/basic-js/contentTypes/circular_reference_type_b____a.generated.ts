import type { MigrationElementModels } from "@kontent-ai/migration-toolkit";
import type { CoreMigrationItem } from "../migration.generated.js";

/*
 * Circular reference type B -> A
 *
 * Codename: circular_reference_type_b____a
 * Id: 919bdcad-fe8e-4f56-9a63-346154b6f6e2
 */
export type CircularReferenceTypeBAItem = CoreMigrationItem<
	"circular_reference_type_b____a",
	{
		/*
		 * Items
		 *
		 * Codename: items
		 * Id: 019714f7-8c50-492b-8e5c-f7c3d7e2529b
		 * Type: modular_content
		 * Required: false
		 * Allowed content types: circular_reference_type_a_b
		 */
		readonly items: MigrationElementModels.LinkedItemsElement;
	}
>;
