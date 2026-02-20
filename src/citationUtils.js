export const insertCitation = (citation, editor) => {
	if (!editor) return;

	editor.editing.view.focus();

	console.log("%c🔘 [Fixed] Insert citation:", "color: green; font-weight: bold", citation);

	editor.model.change((writer) => {
		const root = editor.model.document.getRoot();

		// 1️⃣ Inline citation
		const sel = editor.model.document.selection;
		const inlineNode = writer.createText(`[Citation ${citation.id}]`, { bold: true });
		editor.model.insertContent(inlineNode, sel);
		console.log(
			`%c✅ [Fixed] Inline citation inserted (batchId: ${writer.batch?.id})`,
			"color: green",
			{ inlineNode }
		);

		// 2️⃣ References container
		let refContainer = null;
		for (const child of root.getChildren()) {
			if (child.is("element") && child.name === "references") {
				refContainer = child;
				break;
			}
		}
		if (!refContainer) {
			refContainer = writer.createElement("references");
			editor.model.insertContent(refContainer, writer.createPositionAt(root, "end"));
			console.log(
				`%c✅ [Fixed] Created references container (batchId: ${writer.batch?.id})`,
				"color: green",
				{ refContainer }
			);
		}

		// 3️⃣ Reference item
		const referenceItem = writer.createElement("referenceItem", { "data-id": citation.id });
		writer.insertText(`${citation.id}. ${citation.label} [delete]`, referenceItem);
		editor.model.insertContent(referenceItem, writer.createPositionAt(root, "end"));
		editor.model.insertContent(writer.createText("\n"), writer.createPositionAt(root, "end"));
		console.log(
			`%c✅ [Fixed] Reference item inserted (batchId: ${writer.batch?.id})`,
			"color: green",
			{ referenceItem }
		);

		console.log("%c💡 Single batch for citation insertion", "color: green; font-weight: bold");
		console.log("%cBatch undoable?", "color: green", writer.batch?.isUndoable);
	});
};