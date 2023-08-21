import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="748877239146-fqfhc6j2ufs19vidct9apgnldffq4g3n.apps.googleusercontent.com">
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <Router>
                    <App />
                </Router>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
)
