import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import MainLayout from "@app/layout/mainLayout/MainLayout";
import Login from "@/pages/Login";
import Main from "@/pages/Main";
import CafeSearch from "@/pages/CafeSearch";
import WriteReview from "@/pages/WriteReview";
import DraftReview from "@/pages/DraftReview";
import CafeInfo from "@/pages/CafeInfo";
import MyPage from "@/pages/MyPage";
import MyPageEdit from "@/pages/MyPageEdit";
import { ProtectedRoute } from "@app/routers/ProtectedRoute";
import styles from "@app/layout/header/Header.module.scss";
import { OAuthRedirect } from "@app/auth/OAuthRedirect";
import NavBtn from "@/shared/ui/navButton/NavBtn";
import DraftCounter from "@shared/ui/draftCounter/DraftCounter";
import { useNavigationStore } from "@shared/store/useNavigationStore";
import { useDraftCountStore } from "@shared/store/useDraftCountStore";
import SelectionModeButton from "@shared/ui/selectionModeButton/SelectionModeButton";
import headerLogo from "@shared/assets/images/logo/logo-header.svg";

import { useProfileStore } from "@shared/store/useProfileStore";
import { useProfileImageApi } from "@shared/api/user/useProfileImagesApi";
import { useUserStore } from "@shared/store/useUserStore";
import { useUserApi } from "@shared/api/user/userApi";
import NotFoundPage from "@/shared/components/NotFoundPage";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import TestError from "@/shared/components/TestError";
import GeneralErrorPage from "@/shared/components/GeneralErrorPage";

export const AppRouter = () => {
  const { isFromFooter } = useNavigationStore();
  const draftCount = useDraftCountStore((state) => state.count);

  const { file, setProfileImageUrl } = useProfileStore();
  const { userData, nicknameError } = useUserStore();
  const { uploadProfileImage, getProfileImage } = useProfileImageApi();
  const { updateUserInfo } = useUserApi();

  const handleCompleteClick = async () => {
    try {
      if (file) {
        await uploadProfileImage(file);
      }

      const { nickname, introduce, userId } = userData;
      await updateUserInfo({ nickname, introduce });
      if (userId) {
        const newImageUrl = await getProfileImage(userId);
        if (newImageUrl) {
          setProfileImageUrl(newImageUrl);
        }
      }
      alert("프로필 수정이 완료되었습니다!");
      window.location.href = "/mypage";
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const routes = createRoutesFromElements(
    
    <Route path="/" element={<Outlet />}>
      <Route
        path="login"
        element={
          <ErrorBoundary>
          <MainLayout
            showHeader={false}
            showFooter={false}
            showBackButton={false}
            showWriteButton={false}
            headerTitle="로그인"
          >
            <Login />
          </MainLayout>
          </ErrorBoundary>
        }
      />

      <Route 
        path="oauth/redirect" 
        element={
          <ErrorBoundary>
          <OAuthRedirect />
          </ErrorBoundary>
        } 
      />

      <Route
        element={
          <ErrorBoundary>
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
          </ErrorBoundary>
        }
      >
        <Route
          index
          element={
            <MainLayout
              showHeader={true}
              showFooter={true}
              showBackButton={false}
              headerTitle={<img src={headerLogo} alt="카페2025 로고" />}
            >
              <Main />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/">Main</Link> }}
        />
        <Route
          path="search"
          element={
            <MainLayout
              showHeader={true}
              showFooter={true}
              showBackButton={true}
              headerTitle="장소 검색"
              rightElement={!isFromFooter ? <DraftCounter /> : null}
            >
              <CafeSearch />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/search">카페 검색</Link> }}
        />
        <Route
          path="review/write"
          element={<WriteReview />}
          handle={{ crumb: <Link to="/review/write">리뷰 작성</Link> }}
        />
        <Route
          path="draft"
          element={
            <MainLayout
              showHeader={true}
              showFooter={false}
              showBackButton={true}
              showWriteButton={false}
              headerTitle="작성 중인 리뷰"
              headerCount={draftCount} // count를 전달
              rightElement={<SelectionModeButton />}
            >
              <DraftReview />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/draft">작성 중인 리뷰</Link> }}
        />
        <Route
          path="cafe/:id"
          element={
            <MainLayout
              showHeader={true}
              showFooter={false}
              showBackButton={true}
              showWriteButton={false}
              headerTitle="카페 정보"
            >
              <CafeInfo />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/cafe">카페 정보</Link> }}
        />
        <Route
          path="mypage"
          element={
            <MainLayout
              showHeader={true}
              showFooter={true}
              showBackButton={false}
              bgColor="rgb(249, 248, 246)"
              rightElement={<NavBtn />}
            >
              <MyPage />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/mypage">마이페이지</Link> }}
        />
        <Route
          path="mypage/edit"
          element={
            <MainLayout
              showHeader={true}
              showFooter={true}
              showBackButton={true}
              showWriteButton={false}
              bgColor="rgb(249, 248, 246)"
              rightElement={
                <button
                  className={`${styles.completeButton} ${styles["completeButton--color"]}`}
                  onClick={handleCompleteClick}
                  disabled={!!nicknameError}
                >
                  완료
                </button>
              }
            >
              <MyPageEdit />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/mypage/edit">마이페이지 수정</Link> }}
        />
        <Route
          path="test/error"
          element={
            <TestError />
          }
          handle={{ crumb: <Link to="/mypage/edit">마이페이지 수정</Link> }}
        />
      </Route>
      <Route
          path="*"
          element={
            <MainLayout
              showHeader={true}
              showFooter={false}
              showBackButton={true}
              showWriteButton={false}
              bgColor="rgb(249, 248, 246)"
            >
              <GeneralErrorPage 
                mainText={"화면을 불러올 수 없어요"} 
                subText={"존재하지 않는 페이지입니다"} 
              />
            </MainLayout>
          }
          handle={{ crumb: <Link to="/notfound">not Found 에러</Link> }}
      />
      </Route>
  );

  return <RouterProvider router={createBrowserRouter(routes)} />;
};
