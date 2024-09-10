import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [userId, setUserId] = useState("");

  return (
    <UserContext.Provider value={{ auth, setAuth, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
