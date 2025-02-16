import {Component, ReactNode} from "react";
import GeneralErrorPage from "./GeneralErrorPage";
import MainLayout from "@/app/layout/mainLayout/MainLayout";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {

    constructor(props: { children: ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      // 에러 발생시 hasError를 true로 설정
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      console.log("오류 상세:");
      console.log(error);
    //   console.log(error.response.data.status);
    //   console.log(error.response.data.message);
    }
  
    render() {
      if (this.state.hasError) {
        // return <GeneralErrorPage />;
        return (
          <MainLayout
            showHeader={true}
            showFooter={false}
            showBackButton={true}
            showWriteButton={false}
            // onBackClick={handleBackButtonClick}
            bgColor="rgb(249, 248, 246)"
          >
            <GeneralErrorPage 
              mainText={"서버에 문제가 발생했어요"} 
              subText={"잠시 후 다시 시도해주세요"} 
            />
          </MainLayout>
        );
      }

      return this.props.children;
    }
}

export default ErrorBoundary;
