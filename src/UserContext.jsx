import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  //const [authInfo, setAuthInfo] = useState({ auth: false, userId: "" });

  const [authInfo, setAuthInfo] = useState(() => {
    const storedAuthInfo = localStorage.getItem("authInfo");
    return storedAuthInfo
      ? JSON.parse(storedAuthInfo)
      : { auth: false, userId: "" };
  });

  useEffect(() => {
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
  }, [authInfo]);

  return (
    <UserContext.Provider value={{ authInfo, setAuthInfo }}>
      {children}
    </UserContext.Provider>
  );
};
