// import React from "react";
// import Amplify from "@aws-amplify/core";
// import { withAuthenticator } from "@aws-amplify/ui-react";

// Amplify.configure({
//   Auth: {
//     region: process.env.REACT_APP_REGION,
//     userPoolId: process.env.REACT_APP_USER_POOL_ID,
//     userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
//     mandatorySignIn: true,
//   },
// });

// export default withAuthenticator(function Home() {
//   return <h1>Protected Content</h1>;
// });
import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Home Page</h1>
      <p style={styles.text}>Its at the root</p>
      <a></a>
    </div>
  );
};

// Inline styles (optional)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    color: "#333",
    textAlign: "center",
  },
  header: {
    fontSize: "2.5rem",
    margin: "10px 0",
  },
  text: {
    fontSize: "1.2rem",
  },
};

export default Home;
