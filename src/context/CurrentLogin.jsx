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
  const [grouped, setGrouped] = useState({});
  const [media, setMedia] = useState({
    isDesktopOrLaptop: true,
    isTablet: false,
    isMobile: false,
    isRetinal: false,
  });

  return (
    <CurrentLoginContext.Provider
      value={{
        loginInfo,
        setLoginInfo,
        memberSettings,
        setMemberSettings,
        grouped,
        setGrouped,
        media,
        setMedia,
      }}
    >
      {children}
    </CurrentLoginContext.Provider>
  );
};
