import React, { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "./editor/Editor";
import { insertCitation } from "./citationUtils.js";
import "./App.css";
import "./editor.css";
import "./plugins/NotePlugin.css";

export default function App() {
	const editorRef = useRef(null);

	const citations = [
		{ id: 1, label: "Citation 1" },
		{ id: 2, label: "Citation 2" },
		{ id: 3, label: "Citation 3" }
	];

	return (
		<div style={{ padding: "20px" }}>
			<h2>CKEditor</h2>
			<div style={{ display: "flex", gap: "50px" }}>
				<div>
					<h3>Add Citation</h3>
					<div className="citations-container">
						{citations.map((c) => (
							<button key={c.id} onClick={() => insertCitation(c, editorRef.current)}>
								Insert {c.label}
							</button>
						))}
					</div>

					<div className="main-container">
						<div className="editor-container editor-container_classic-editor">
							<div className="editor-container__editor">
								<CKEditor
									editor={Editor}
									data="<p>Click here, type text, and insert citations.</p>"
									onReady={(editor) => {
										editorRef.current = editor;
										console.log("%cEditor ready", "color: green; font-weight: bold");
									}}
									onChange={() => console.log("%cContent changed", "color: green")}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
