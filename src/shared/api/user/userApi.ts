import { useApi } from "@shared/api/hooks/useApi";
import type {
  OtherUserInfoRes,
  UserInfoResponse,
  UserUpdateRequest,
  IsExistNicknameResponse,
} from "./types";
import { useApiQuery } from "@shared/api/hooks/useQuery";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from 'react';


export const useUserApi = () => {
  const { get, patch, isLoading, error } = useApi();

  const useUserInfo = (id : number) => {
    return useApiQuery<OtherUserInfoRes>(
      ["user", id],
      () => `/api/users/${id}`,
    );
  };

  const useMyInfo = () => {
    return useApiQuery<UserInfoResponse>(
      ["myInfo"],
      () => `/api/my/profile`,
    );
  };

  // useMyInfo 함수로 대체 예정
  const getMyInfo = useCallback(async (options?: {
    onSuccess?: (response: UserInfoResponse) => void;
    onError?: (error: any) => void;
  }) => {
    try {
      const response = await get<UserInfoResponse>(
        "/api/my/profile",
        {},
        {
          onSuccess: options?.onSuccess,
          onError: options?.onError,
        }
      );
      return response;
    } catch (error) {
      console.error("사용자 정보 조회 중 오류 발생:", error);
      throw error;
    }
  }, [get]);

  const updateUserInfo = async (
    request: UserUpdateRequest,
    options?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      await patch(
        "/api/my/profile",
        request,
        {},
        {
          onSuccess: options?.onSuccess,
          onError: options?.onError,
        }
      );
    } catch (error) {
      console.error("사용자 정보 수정 중 오류 발생:", error);
      throw error;
    }
  };

  const checkNicknameExistence = async (
    nickname: string,
    options?: {
      onSuccess?: (response: IsExistNicknameResponse) => void;
      onError?: (error: any) => void;
    }
  ) => {
    try {
      const response = await get<IsExistNicknameResponse>(
        "/api/users/check",
        { params: { nickname } },
        {
          onSuccess: options?.onSuccess,
          onError: options?.onError,
        }
      );
      return response;
    } catch (error) {
      console.error("닉네임 중복 확인 중 오류 발생:", error);
      throw error;
    }
  };

  return {
    useUserInfo,
    getMyInfo,
    useMyInfo,
    updateUserInfo,
    checkNicknameExistence,
    isLoading,
    error,
  };
};
