import { useState } from "react";
import "./App.css";
import EditorPage from "./pages/EditorPage";
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
				<EditorPage
					projectPath={view.path}
					onClose={() => setView({ screen: "start" })}
				/>
			)}
		</>
	);
}

export default App;
