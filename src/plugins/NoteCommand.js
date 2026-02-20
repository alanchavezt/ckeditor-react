import { Command } from "ckeditor5";

export default class NoteCommand extends Command {
	execute() {
		const editor = this.editor;

		editor.model.change(writer => {
			const note = writer.createElement("note");
			const title = writer.createElement("noteTitle");
			const body = writer.createElement("noteBody");
			const paragraph = writer.createElement("paragraph");

			writer.append(title, note);
			writer.append(body, note);
			writer.append(paragraph, body);

			editor.model.insertContent(note);
			writer.setSelection(paragraph, "in");
		});
	}

	refresh() {
		this.isEnabled = true;
	}
}
