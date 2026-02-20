import {
	Plugin,
	Widget,
	toWidget,
	toWidgetEditable,
	ButtonView,
} from "ckeditor5";

import NoteCommand from "./NoteCommand";

import PlusIcon from "@ckeditor/ckeditor5-icons/theme/icons/plus.svg?raw";
import { addNoteLabels, updateNotePlaceholders } from "./NotePostFixers.js";

export default class NotePlugin extends Plugin {
	static get requires() {
		return [Widget];
	}

	init() {
		const editor = this.editor;

		// 1️⃣ Register schema
		editor.model.schema.register("note", {
			allowWhere: "$block",
			isObject: true
		});

		editor.model.schema.register("noteTitle", {
			allowIn: "note",
			allowContentOf: "$block",
			isLimit: true
		});

		editor.model.schema.register("noteBody", {
			allowIn: "note",
			allowContentOf: "$root",
			isLimit: true
		});

		// 2️⃣ Register command
		editor.commands.add("insertNote", new NoteCommand(editor));

		// 3️⃣ Add toolbar button
		editor.ui.componentFactory.add("insertNote", (locale) => {
			const view = new ButtonView(locale);

			view.set({ label: "Insert Note", icon: PlusIcon, tooltip: true });

			// Execute the command when the button is clicked
			view.on("execute", () => editor.execute("insertNote"));

			return view;
		});

		// 4️⃣ Conversions
		this._defineConverters(editor);

		// 5️⃣ Post-fixer: view-based labels
		editor.editing.view.document.registerPostFixer((writer) => {
			let changed = false;
			const root = editor.model.document.getRoot();
			for (const note of root.getChildren()) {
				if (note.name === "note") {
					changed = addNoteLabels(note, writer, editor) || changed;
				}
			}
			return changed;
		});

		// 6️⃣ Model post-fixer for placeholders
		editor.model.document.registerPostFixer(writer => updateNotePlaceholders(writer, editor));
	}

	_defineConverters(editor) {
		// NOTE container
		editor.conversion.for("editingDowncast").elementToElement({
			model: "note",
			view: (model, { writer }) => {
				const container = writer.createContainerElement("div", {
					class: "note"
				});
				return toWidget(container, writer);
			}
		});

		// // NOTE title
		editor.conversion.for("editingDowncast").elementToElement({
			model: "noteTitle",
			view: (model, { writer }) => {
				const editable = writer.createEditableElement("div", {
					class: "note-title",
					role: "textbox",
					// "aria-label": "Note title",
					"data-placeholder": "Enter title here..."
				});
				return toWidgetEditable(editable, writer);
			}
		});

		// // NOTE body
		editor.conversion.for("editingDowncast").elementToElement({
			model: "noteBody",
			view: (model, { writer }) => {
				const editable = writer.createEditableElement("div", {
					class: "note-body",
					role: "textbox",
					// "aria-label": "Note content",
					"data-placeholder": "Enter content here..."
				});
				return toWidgetEditable(editable, writer);
			}
		});
	}
}

