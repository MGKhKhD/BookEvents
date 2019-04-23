import React from "react";

export default React.createContext({
  userId: null,
  token: null,
  tokenExpiration: 0,
  email: null,
  loginFn: (token, userId, tokenExpiration) => {},
  logoutFn: () => {}
});
