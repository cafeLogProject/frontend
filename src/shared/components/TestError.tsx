import { useApiQuery, useApiMutation } from "@shared/api/hooks/useQuery";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../api/hooks/useApi";



const TestError = () => {
  // useApiQuery를 사용하여 API 호출
  const { data, error, isLoading } = useApiQuery<any>(
    ["testData"],
  //   "/api/images/draftReview?draftReviewId=1&imageId=1000"   
    "/test/http/500"
  );


  // --------------------------------------------
  // const [apiResponse, setApiResponse] = useState<string>("");
  
  // // useApi를 사용하여 API 호출
  // const { get, post } = useApi();
  // const getApiTest = async () => {
  //   const response: string = await get(
  //     `/api/images/draftReview?draftReviewId=1&imageId=1000`, 
  //   );
  // };

  //   useEffect(() => {
  //     getApiTest();
  //   }, []);

  
  // --------------------------------------------


  return (
    <div>
      테스트 페이지
    </div>
  );
};
  

export default TestError;