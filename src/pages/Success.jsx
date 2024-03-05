import { Button, Result, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location?.state.message === "success") {
      setIsLoading(false);
    }
  }, [location]);

  return (
    <>
      {isLoading && (
        <div className="w-full flex h-screen justify-center items-center">
          <Spin />
        </div>
      )}
      {!isLoading && (
        <div className="w-full flex h-screen justify-center items-center">
          <Result
            status="success"
            title="화원가입 완료!"
            subTitle="첫 화면으로 이동합니다."
            extra={[
              <Button key="login" onClick={() => navigate("/")}>
                확인
              </Button>,
            ]}
          />
        </div>
      )}
    </>
  );
};

export default Success;
