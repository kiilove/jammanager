import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  return <div>MainPage</div>;
};

export default MainPage;
