import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.css";

import MainNavigationBar from "./Components/NavigationComponents/MainNavigationBar";
import Login from "./Pages/Login";
import Events from "./Pages/Events";
import Bookings from "./Pages/Bookings";

import AuthContext from "./Contexts/AuthContext";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(0);

  function login(token, userId, tokenExpiration, email) {
    setToken(token);
    setUserId(userId);
    setTokenExpiration(tokenExpiration);
    setUserEmail(email);
  }

  function logout() {
    setToken(null);
    setUserId(null);
    setTokenExpiration(0);
    setUserEmail(null);
  }

  const contextObj = {
    token: token,
    userId: userId,
    tokenExpiration: tokenExpiration,
    loginFn: (token, userId, tokenExpiration) =>
      login(token, userId, tokenExpiration),
    logoutFn: () => logout()
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider value={contextObj}>
          <MainNavigationBar />
          <main className="main-container">
            <Switch>
              {!token && <Redirect from="/" to="/login" exact />}
              {!token && <Redirect from="/bookings" to="/login" exact />}
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/login" to="/events" exact />}
              {!token && <Route path="/login" component={Login} />}
              <Route path="/events" component={Events} />
              {token && <Route path="/bookings" component={Bookings} />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
