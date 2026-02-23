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

const licenseKey = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;

if (!licenseKey) {
	console.warn("⚠️ CKEditor license key is missing");
}

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
	licenseKey
};
