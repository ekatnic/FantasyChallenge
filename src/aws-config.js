// import { Amplify } from "aws-amplify";

// Amplify.configure({
//   Auth: {
//     region: process.env.REACT_APP_REGION,
//     userPoolId: process.env.REACT_APP_USER_POOL_ID,
//     userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
//     oauth: {
//       domain: process.env.REACT_APP_COGNITO_DOMAIN,
//       // domain: 'your-cognito-domain.auth.us-east-1.amazoncognito.com', // Cognito Hosted UI domain
//       scope: ["email", "openid", "profile"], // Scopes for OAuth
//       redirectSignIn: "http://localhost:8000/dj-rest-auth/cognito/", // Redirect after login
//       redirectSignOut: "http://localhost:8000/dj-rest-auth/cognito/", // Redirect after logout
//       responseType: "code", // OAuth 2.0 response type (code or token)
//     },
//   },
// });

// import { Auth } from "@aws-amplify/auth";

// Auth.configure({
//   region: process.env.REACT_APP_REGION,
//   userPoolId: process.env.REACT_APP_USER_POOL_ID,
//   userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
//   mandatorySignIn: true,
//   authenticationFlowType: "USER_PASSWORD_AUTH",
// });
