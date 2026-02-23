// NotePostFixers.js
let nextId = 1;
const generateId = () => `note-${nextId++}`;

/**
 * Insert a label span in the view before the editable element
 */
export const insertLabel = (element, writer, id, labelType) => {
	const labelInsertPosition = writer.createPositionBefore(element);

	const labelContainer = writer.createUIElement(
		"span",
		{ class: `note-${labelType}-label`, id: `${id}-label` },
		(domDoc) => {
			const domEl = labelContainer.toDomElement(domDoc);
			domEl.textContent = labelType === "title" ? "Title" : "Content";
			return domEl;
		}
	);

	writer.insert(labelInsertPosition, labelContainer);
};

/**
 * Add labels to a single note element
 */
export const addNoteLabels = (noteModel, writer, editor) => {
	const noteView = editor.editing.mapper.toViewElement(noteModel);
	if (!noteView) return false;

	const titleEditable = noteView.getChild(0);
	const bodyEditable = noteView.getChild(1);
	let titleLabelFound = false;
	let bodyLabelFound = false;

	for (const child of noteView.getChildren()) {
		if (child.is("element", "span")) {
			if (child.hasClass("note-title-label")) titleLabelFound = true;
			if (child.hasClass("note-body-label")) bodyLabelFound = true;
		}
	}

	let modified = false;

	if (titleEditable && !titleLabelFound) {
		let id = titleEditable.getAttribute("id") || generateId();
		writer.setAttribute("id", id, titleEditable);
		insertLabel(titleEditable, writer, id, "title");
		writer.setAttribute("aria-labelledby", `${id}-label`, titleEditable);
		modified = true;
	}

	if (bodyEditable && !bodyLabelFound) {
		let id = bodyEditable.getAttribute("id") || generateId();
		writer.setAttribute("id", id, bodyEditable);
		insertLabel(bodyEditable, writer, id, "body");
		writer.setAttribute("aria-labelledby", `${id}-label`, bodyEditable);
		modified = true;
	}

	return modified;
};

export const updateNotePlaceholders = (writer, editor) => {
	let changed = false;
	const root = editor.model.document.getRoot();

	const hasTextContent = (element) => {
		for (const child of element.getChildren()) {
			if (child.is("$text") && child.data.trim()) {
				return true;
			}

			if (child.is("element")) {
				for (const grandChild of child.getChildren()) {
					if (grandChild.is("$text") && grandChild.data.trim()) {
						return true;
					}
				}
			}
		}
		return false;
	};

	for (const note of root.getChildren()) {
		if (note.name !== "note") continue;

		const title = note.getChild(0);
		const body = note.getChild(1);

		/* ───────── Title ───────── */

		if (title) {
			if (title.isEmpty && !title.hasAttribute("data-placeholder")) {
				writer.setAttribute("data-placeholder", "Enter title here...", title);
				changed = true;
			} else if (!title.isEmpty && title.hasAttribute("data-placeholder")) {
				writer.removeAttribute("data-placeholder", title);
				changed = true;
			}
		}

		/* ───────── Body (FIXED PROPERLY) ───────── */

		if (body) {
			const hasText = hasTextContent(body);

			if (!hasText && !body.hasAttribute("data-placeholder")) {
				writer.setAttribute("data-placeholder", "Enter content here...", body);
				changed = true;
			} else if (hasText && body.hasAttribute("data-placeholder")) {
				writer.removeAttribute("data-placeholder", body);
				changed = true;
			}
		}
	}

	return changed;
};