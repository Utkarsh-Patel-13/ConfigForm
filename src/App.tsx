import { useState } from "react";
import "./App.css";
import StartPage from "./pages/StartPage";

type View =
	| { screen: "start" }
	| { screen: "editing"; path: string; kind: "project" | "file" };

function App() {
	const [view, setView] = useState<View>({ screen: "start" });

	return (
		<>
			{view.screen === "start" ? (
				<StartPage
					onOpen={(path, kind) => setView({ screen: "editing", path, kind })}
				/>
			) : (
				<div className="p-4">
					<button
						type="button"
						className="btn btn-ghost btn-sm"
						onClick={() => setView({ screen: "start" })}
					>
						← Close Project
					</button>
					<div className="mt-4">Editing: {view.path}</div>
				</div>
			)}
		</>
	);
}

export default App;
