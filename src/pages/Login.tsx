import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/button/ui/Button";
import Logo from "@shared/ui/logo/Logo";
import LogoWrap from "@app/layout/logoWrap/LogoWrap";
import naverLogo from "@shared/assets/images/social-icons/naver-logo.svg";
import googleLogo from "@shared/assets/images/social-icons/google-logo.svg";
import facebookLogo from "@shared/assets/images/social-icons/facebook-logo.svg";
import { useAuthStore } from "@app/auth/useAuthStore";
import axios from "axios";
import styles from "./styles/Login.module.scss";
import { useEffect } from "react";

axios.defaults.withCredentials = true;

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (provider: string) => {
    try {
      await login(provider);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className={styles.loginWrap}>
      <LogoWrap>
        <Logo />
      </LogoWrap>
      <div className={styles.btnWrap}>
        <Button
          className={`${styles.loginBtn} ${styles.naverBtn}`}
          text="네이버로 시작하기"
          imgUrl={naverLogo}
          altText="네이버 로그인"
          onClick={() => handleLogin("naver")}
        />
        <Button
          className={`${styles.loginBtn} ${styles.googleBtn}`}
          text="구글로 시작하기"
          imgUrl={googleLogo}
          altText="구글 로그인"
          onClick={() => handleLogin("google")}
        />
        <Button
          className={`${styles.loginBtn} ${styles.faceBtn}`}
          text="페이스북으로 시작하기"
          imgUrl={facebookLogo}
          altText="페이스북 로그인"
          onClick={() => handleLogin("facebook")}
        />
      </div>
    </div>
  );
};

export default Login;
