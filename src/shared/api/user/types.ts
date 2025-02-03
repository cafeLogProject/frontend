export interface UserInfoResponse {
  userId: number;
  nickname: string;
  introduce: string;
  isProfileImageExist: boolean;
}

export interface UserUpdateRequest {
  nickname: string;
  introduce: string;
}

export interface IsExistNicknameResponse {
  nickname: string;
  isExist: boolean;
}