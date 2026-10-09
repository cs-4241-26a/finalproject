import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { ModelProvider } from "./context/ModelContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ModelProvider>
                <App />
            </ModelProvider>
        </BrowserRouter>
    </StrictMode>,
);