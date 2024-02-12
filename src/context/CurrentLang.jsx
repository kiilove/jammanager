import React, { createContext, useEffect, useState } from "react";

export const CurrentLangContext = createContext();

export const CurrentLangProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("ko");

  // useEffect(() => {
  //   console.log(currentLang);
  // }, [currentLang]);

  return (
    <CurrentLangContext.Provider value={{ currentLang, setCurrentLang }}>
      {children}
    </CurrentLangContext.Provider>
  );
};
