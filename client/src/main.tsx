import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "remixicon/fonts/remixicon.css"
import { AiProvider } from "@/hooks/use-ai"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AiProvider>
      <App />
    </AiProvider>
  </React.StrictMode>,
)
