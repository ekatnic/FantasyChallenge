import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EntryList from "./components/EntryList";
import CreateEntry from "./components/CreateEntry";
import Home from "./components/Home";

// function App() {
// return (
// <Router>
//   <Routes>
//     <Route path="/" element={<Home />} />
//     <Route path="/create-entry" element={<CreateEntry />} />
//     <Route path="/view-entry" element={<EntryList />} />
//   </Routes>
// </Router>
// );
// }

// export default App;

// App.js

import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "6me1ss5grcq9f1nta9lvjb5ijn";
    const logoutUri = "<logout uri>";
    const cognitoDomain =
      "https://playoff-showdown.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };
  // // Sign Up Redirect Function
  // const signUpRedirect = () => {
  //   const signupUrl = `${
  //     process.env.REACT_APP_COGNITO_DOMAIN
  //   }/signup?client_id=${
  //     process.env.REACT_APP_CLIENT_ID
  //   }&response_type=code&scope=email+openid&redirect_uri=${encodeURIComponent(
  //     appRedirectUri
  //   )}`;
  //   window.location.href = signupUrl;
  // };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
        {/* <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-entry" element={<CreateEntry />} />
            <Route path="/view-entry" element={<EntryList />} />
          </Routes>
        </Router> */}
      </div>
    );
  }

  return (
    <div>
      <h1>Unprotected Content</h1>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      {/* <button onClick={() => signUpRedirect()}>Sign up</button> */}
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;
