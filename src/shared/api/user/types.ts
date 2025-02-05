export interface UserInfoResponse {
  userId: number;
  nickname: string;
  introduce: string;
  email: string;
  isProfileImageExist: boolean;
  profileImage?: string;
}

export interface UserUpdateRequest {
  nickname: string;
  introduce: string;
}

export interface IsExistNicknameResponse {
  nickname: string;
  exist: boolean;
}
