import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { UserProvider } from "./context/profileContext"

axios.defaults.withCredentials = true;


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="499348321855-fnedlnu6qk87hie9thu98q1b0q4a143t.apps.googleusercontent.com">
    <UserProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </UserProvider>
  </GoogleOAuthProvider>
);
