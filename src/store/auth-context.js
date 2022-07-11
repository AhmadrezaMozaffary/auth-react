import React, { useCallback, useEffect, useState } from "react";

let timer = null;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calcRemainingTime = (expTime) => {
  const curTime = new Date().getTime();
  const adjExpTime = new Date(expTime).getTime();
  return adjExpTime - curTime;
};

const retriveToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedTime = localStorage.getItem("expTime");
  const rmTime = calcRemainingTime(storedTime);

  if (rmTime <= 36000) {
    localStorage.clear();
    return null;
  }

  return { token: storedToken, duration: storedTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retriveToken();
  const initialToken = tokenData?.token;

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("expTime");

    if (timer) clearTimeout(timer);
  }, []);

  const loginHandler = (token, expTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expTime", expTime);

    const remainingTime = calcRemainingTime(expTime);

    timer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      timer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const ctxValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
