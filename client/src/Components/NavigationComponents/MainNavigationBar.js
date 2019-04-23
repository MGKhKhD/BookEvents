import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";

import "./MainNavigationBar.css";

const MainNavigationBar = props => (
  <AuthContext.Consumer>
    {context => (
      <header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>EventBook</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            {!context.token && (
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            {context.token && (
              <React.Fragment>
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
                <button onClick={context.logoutFn}>Logout</button>
              </React.Fragment>
            )}
          </ul>
        </nav>
      </header>
    )}
  </AuthContext.Consumer>
);

export default MainNavigationBar;
