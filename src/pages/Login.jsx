import React, { useContext, useEffect, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { FcGoogle } from "react-icons/fc";
import Logo1 from "../assets/logo/jam_blank.png";
import { Avatar, Divider, Spin, Switch, notification } from "antd";
import { useNavigate } from "react-router-dom";
import useFirebaseAuth from "../hooks/useFireAuth";
import { CurrentLoginContext } from "../context/CurrentLogin";

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const emailLogin = useFirebaseAuth();
  const { currentUser } = useFirebaseAuth();
  const { loginInfo, setLoginInfo } = useContext(CurrentLoginContext);
  // 이메일과 비밀번호 상태 관리를 위한 useState 훅 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    apiType,
    title,
    message,
    placement,
    duration,
    maxCount
  ) => {
    api[apiType]({
      message: title,
      description: message,
      placement,
      duration,
      maxCount,
    });
  };

  const handleLogin = async (propEmail, propPWD) => {
    if (propEmail === "") {
      openNotification("error", "입력오류", "이메일을 입력해주세요", "top", 3);
      return;
    }

    if (propPWD === "") {
      openNotification(
        "error",
        "입력오류",
        "비밀번호를 입력해주세요",
        "top",
        3
      );
      return;
    }
    try {
      await emailLogin
        .logInWithEmail(propEmail.trim(), propPWD.trim(), (data) => {
          setLoginInfo(data);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Login failed: ", error);
      // 로그인 실패 시 적절한 오류 처리 로직을 추가합니다.
    }
  };

  useEffect(() => {
    if (emailLogin.authError !== null) {
      openNotification("error", "로그인에러", emailLogin.authError, "top", 4);
    }
  }, [emailLogin.authError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentUser) {
        // 3초 후 currentUser가 없다면 로그인 상태가 아니라고 판단
        setIsLoading(false);
        // 로그인 페이지에 머물도록 특별한 액션이 필요 없음
      }
    }, 3000);

    if (currentUser) {
      setLoginInfo(currentUser);
      clearTimeout(timer); // currentUser가 확인되면 타이머 취소
      navigate("/"); // 메인 페이지로 이동
    }

    // 컴포넌트가 언마운트되거나 다시 렌더링되기 전에 타이머 정리
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  return (
    <>
      {isLoading && (
        <div className="flex w-full h-screen justify-center items-center ">
          <Spin />
        </div>
      )}
      {!isLoading && !currentUser && (
        <div className="flex w-full h-screen flex-col justify-start items-center bg-gray-100">
          <div
            className="flex gap-y-1 w-full h-screen flex-col justify-start items-center bg-white"
            style={{ maxWidth: "1000px" }}
          >
            <div
              className="flex h-14 justify-end items-center w-full px-5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                <LiaTimesSolid />
              </span>
            </div>
            <div
              className="flex w-full justify-center items-center"
              style={{ height: "110px" }}
            >
              <img src={Logo1} alt="" style={{ width: "80px" }} />
            </div>
            <div className="flex w-full justify-center items-center px-5">
              <div
                className="flex w-full rounded px-6"
                style={{
                  border: "1px solid #cacaca",
                  maxWidth: "500px",
                  height: "50px",
                }}
              >
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none border-none  placeholder:text-sm placeholder:text-gray-300"
                  placeholder="이메일을 입력해주세요."
                />
              </div>
            </div>
            <div className="flex w-full justify-center items-center px-5">
              <div
                className="flex w-full rounded px-6"
                style={{
                  border: "1px solid #cacaca",
                  maxWidth: "500px",
                  height: "50px",
                }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none border-none placeholder:text-sm placeholder:text-gray-300"
                  placeholder="비밀번호 입력해주세요"
                />
              </div>
            </div>
            <div
              className="flex w-full justify-center items-center"
              style={{ height: "50px", maxWidth: "500px" }}
            >
              <div className="flex w-full h-full px-5 md:px-0">
                <div className="flex justify-start items-center gap-x-4 w-1/2">
                  <span className="text-gray-500 text-sm">자동로그인</span>
                  <Switch />
                </div>
                <div className="flex justify-end items-center w-1/2">
                  <span className="text-gray-500 text-sm">
                    이메일/비밀번호 찾기
                  </span>
                </div>
              </div>
            </div>
            <div
              className="flex w-full  justify-center items-center"
              style={{
                maxWidth: "500px",
                height: "50px",
              }}
            >
              <div className="flex w-full h-full px-5 md:px-0">
                <button
                  className=" bg-gray-700 w-full h-full rounded"
                  onClick={() => handleLogin(email, password)}
                >
                  <span
                    className="text-gray-100"
                    style={{ letterSpacing: "20px" }}
                  >
                    로그인
                  </span>
                </button>
              </div>
            </div>
            <div
              className="flex w-full  justify-center items-center"
              style={{
                maxWidth: "500px",
                height: "100px",
              }}
            >
              <div className="flex w-full h-full px-5 md:px-0">
                <Divider>
                  <span className="text-gray-500 font-normal text-base">
                    간편 로그인
                  </span>
                </Divider>
              </div>
            </div>
            <div
              className="flex w-full  justify-center items-center"
              style={{
                maxWidth: "500px",
                height: "50px",
              }}
            >
              <button
                className="bg-white w-14 h-14  rounded-full flex justify-center items-center"
                style={{ border: "1px solid #cacaca" }}
              >
                <FcGoogle className="text-2xl" />
              </button>
            </div>
            <div
              className="flex w-full  justify-center items-center my-10"
              style={{
                maxWidth: "500px",
                height: "50px",
              }}
            >
              <div className="flex w-full h-full px-5 md:px-0">
                <button
                  className=" bg-white w-full h-full rounded"
                  style={{ border: "1px solid" }}
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  <span
                    className="text-gray-800"
                    style={{ letterSpacing: "14px" }}
                  >
                    회원가입
                  </span>
                </button>
              </div>
            </div>
            <div
              className="flex w-full  justify-center items-center"
              style={{
                maxWidth: "500px",
                height: "10px",
              }}
            >
              <div className="flex w-full h-full justify-center items-start px-5 md:px-0">
                <span className="text-gray-400 text-xs ">
                  문의 info@jncore.com
                </span>
              </div>
            </div>
          </div>
          {contextHolder}
        </div>
      )}
    </>
  );
};

export default Login;
