export interface FollowResponse {
    message: string,
}

export interface UserFollowRequest {
    limit : number,
    cursor? : number | null,
}

export interface UserFollowResponse {
    "userId": number,
    "nickname": string,
    "isProfileImageExist": true | false,
    "follower_cnt": number,
    "review_cnt": number,
    "followId": number,
    "isFollow": 2 | 1 | 0,
}