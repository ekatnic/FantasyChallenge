// index.js
import { AuthProvider } from "react-oidc-context";

import React from "react";
import ReactDOM from "react-dom/client";
// import "./aws-config"; // amplify auth init
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_INESI256k",
  client_id: "6me1ss5grcq9f1nta9lvjb5ijn",
  redirect_uri: "http://localhost:8000/dj-rest-auth/cognito/",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid profile",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
