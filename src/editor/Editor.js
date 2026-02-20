// Editor.js
import {
	ClassicEditor,
	Essentials,
	Paragraph,
	Bold,
	Italic,
	Undo,
	Widget
} from "ckeditor5";

import NotePlugin from "../plugins/NotePlugin";

export default class Editor extends ClassicEditor {
}

Editor.builtinPlugins = [
	Essentials,
	Paragraph,
	Bold,
	Italic,
	Undo,
	Widget,
	NotePlugin
];

Editor.defaultConfig = {
	toolbar: {
		items: [
			"undo",
			"redo",
			"bold",
			"italic",
			"|",
			"insertNote"
		]
	},
	language: "en",
	licenseKey: ""
};
