import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { API_KEY } from "../../CONFIG";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPass = passInputRef.current.value;

    //Validation

    //Handling SignUp/Login
    setIsLoading(true);
    let API_ENDPOINT = "";
    let REQ_CONFIG = {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPass,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    //SingIn
    if (isLogin) {
      API_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }

    //SingUp
    if (!isLogin) {
      API_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    }

    fetch(API_ENDPOINT, REQ_CONFIG)
      .then((res) => {
        setIsLoading(false);

        if (!res.ok) throw new Error("Authentication Failed!");
        return res?.json();
      })
      .then((data) => {
        authCtx.login(data.idToken);
      })
      .catch((err) => alert(err));
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={passInputRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          <button>
            {isLoading ? "Sending..." : isLogin ? "Login" : "Create Account"}
          </button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
