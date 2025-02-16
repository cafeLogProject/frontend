export interface OtherUserInfoRes {
  userId: number;
  nickname: string;
  introduce: string;
  email: string;
  isProfileImageExist: boolean;
  isFollow: boolean;
  follower_cnt: number;
  following_cnt: number;
  review_cnt: number;
}

export interface UserInfoResponse {
  userId: number;
  nickname: string;
  introduce: string;
  email: string;
  isProfileImageExist: boolean;
  follower_cnt: number;
  following_cnt: number;
  review_cnt: number;
}

export interface UserUpdateRequest {
  nickname: string;
  introduce: string;
}

export interface IsExistNicknameResponse {
  nickname: string;
  exist: boolean;
}
