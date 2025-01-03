// frontend/src/components/Layout.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    alert("로그아웃되었습니다.");
    navigate("/"); // 첫 페이지(로그인)로 이동
  };

  const handleGotoLogin = () => {
    navigate("/"); // 첫 페이지(로그인 페이지)
  };

  // 현재 페이지 경로
  const currentPath = location.pathname;
  // ex) '/', '/register', '/forgot-password', '/goals', '/plan', 등

  /*
    조건별 분기:

    1. 비로그인 상태(token이 없음):
       - /register, /forgot-password 페이지일 때: '로그인' 버튼 보이기
       - 그 외 페이지에서 굳이 버튼을 감출지 여부는 상황에 따라 결정
         (또는 로그인 페이지 자체 '/' 에서는 아무 버튼도 안 보이게 할 수도 있음)

    2. 로그인 상태(token이 있음):
       - 첫 페이지('/')는 로그인 직후에 가는 일이 드물 수 있으나,
         요구사항상 "첫페이지 제외" → 로그아웃 버튼 안 보이게
       - 즉, currentPath !== '/' 이면 '로그아웃' 버튼 보이기
  */

  const renderButton = () => {
    if (!token) {
      // 비로그인 상태
      if (currentPath === "/register" || currentPath === "/forgot-password") {
        return (
          <button style={{ float: "right" }} onClick={handleGotoLogin}>
            로그인
          </button>
        );
      }
      // 그 외 비로그인 상태일 때는 버튼 표시 안 함
      return null;
    } else {
      // 로그인 상태
      // 첫 페이지('/')에서는 로그아웃 버튼 안 보이게
      if (currentPath !== "/") {
        return (
          <button style={{ float: "right" }} onClick={handleLogout}>
            로그아웃
          </button>
        );
      }
      return null;
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <header style={{ borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
        <h1>2025 만들기</h1>
        {renderButton()}
      </header>

      <main>{children}</main>

      <footer
        style={{
          marginTop: "20px",
          borderTop: "1px solid #ccc",
          paddingTop: 10,
        }}
      >
        © 2025 만들기 - All rights reserved
      </footer>
    </div>
  );
};

export default Layout;
