import React, { createContext, useEffect, useState } from "react";

export const CurrentLoginContext = createContext();

const testLoginInfo = {
  userUid: "12345",
  userGroup: "admin",
  userLevel: "admin",
  compName: "제이앤코어",
  userName: "테스트맨",
};
export const CurrentLoginProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState({});
  const [memberSettings, setMemberSettings] = useState({});

  return (
    <CurrentLoginContext.Provider
      value={{ loginInfo, setLoginInfo, memberSettings, setMemberSettings }}
    >
      {children}
    </CurrentLoginContext.Provider>
  );
};
