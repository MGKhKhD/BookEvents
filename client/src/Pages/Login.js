import React, { useState, useContext } from "react";
import AuthContext from "../Contexts/AuthContext";

import "./Login.css";

const Login = () => {
  const [login, useLogin] = useState(true);
  const [message, useMessage] = useState("");
  const auth = useContext(AuthContext);

  let emailEl = React.createRef();
  let passwordEl = React.createRef();
  let passwordConfirmEl = React.createRef();

  function handleSubmit(event) {
    event.preventDefault();

    var email = emailEl.current.value;
    var password = passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      useMessage("Blank entries not allowed.");
      if (email.trim().length === 0) {
        emailEl.current.focus();
      } else {
        passwordEl.current.focus();
      }

      return;
    }

    if (!login) {
      var passwordConfirm = passwordConfirmEl.current.value;
      if (
        passwordConfirm.trim().length === 0 ||
        passwordConfirm.trim() !== password.trim()
      ) {
        passwordEl.current.focus();
        useMessage("Unconfirmed Password. Try again.");
        return;
      }
    }

    const reqBody = {
      query: !login
        ? `
    mutation { createUser(inputUser: {email: "${email}", password: "${password}"}){
        _id
        email
    }}
    `
        : `
    query { login(email: "${email}", password: "${password}"){
        userId
        token
        tokenExpiration
    }}
    `
    };

    fetch("http://localhost:4200/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200) {
          passwordEl.current.focus();
          useMessage("Login Failed");
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(res => {
        //console.log(res);

        if (res.data.login.token) {
          auth.loginFn(
            res.data.login.token,
            res.data.login.userId,
            res.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
        useMessage("Login Failed");
      });
  }

  return (
    <form className="login-form" onSubmit={event => handleSubmit(event)}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="text" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="text" id="password" ref={passwordEl} />
      </div>
      {!login && (
        <div className="form-control">
          <label htmlFor="password">Confirm Password</label>
          <input type="text" id="password" ref={passwordConfirmEl} />
        </div>
      )}
      <div className="form-actions">
        <button type="button" onClick={() => useLogin(!login)}>
          Switch to {!login ? "Login" : "Signup"}
        </button>
        <button type="submit">Submit</button>
      </div>
      {message && <h3 className="warning-message">{message}</h3>}
    </form>
  );
};

export default Login;
