import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/common/status-badge.css";
import "./styles/common/variables.css";
import "./styles/common/base.css";
import "./styles/common/layout.css";
import "./styles/common/buttons.css";
import "./styles/common/responsive.css";
import "./styles/common/card.css";
import "./styles/common/page-header.css";
import "./styles/common/empty-state.css";
import "./styles/common/loading-spinner.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>

        <BrowserRouter>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />

            <AuthProvider>

    <App />

</AuthProvider>

        </BrowserRouter>

    </React.StrictMode>
);