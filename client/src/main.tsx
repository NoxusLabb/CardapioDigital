import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "Sabor Expresso - Cardápio Digital";

createRoot(document.getElementById("root")!).render(<App />);
