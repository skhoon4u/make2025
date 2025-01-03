import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import GoalPage from "./pages/GoalPage";
import PlanPage from "./pages/PlanPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TermsPage from "./pages/TermsPage"; // 약관 동의 페이지 추가
import MainPage from "./pages/MainPage";
import EndPage from "./pages/EndPage";

import "./styles/CommonStyles.css"; // 글로벌 스타일로 CommonStyles.css 사용

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/goals" element={<GoalPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/end" element={<EndPage />} />
      </Routes>
    </Router>
  );
}

export default App;
