export interface TagCategory {
  menu: Array<{ id: number }>;
  interior: Array<{ id: number }>;
}

export interface ReviewResponse {
  reviewId: number;
  content: string; 
  rating: number;
  visitDate: string;
  imageIds: string[];
  // tags: TagCategory;
  tagIds: number[];
  cafeId: number;
  userId: number;
  nickname: string;
  isProfileImageExist: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  cafeId: number;
  rating: number;
  visitDate: string;
  content: string;
  imageIds: string[];
  draftId: number;
  // tagIds: {
  //   menu: Array<{ id: number }>;
  //   interior: Array<{ id: number }>;
  // };
  tagIds: number[];
}

export interface ShowCafeReviewRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ShowReviewResponse {
  reviewId: number;
  content: string;
  rating: number;
  visitDate: string;
  imageIds: string[];
  tagIds: number[];
  cafeId: number;
  cafeName: string;
  userId: number;
  nickname: string;
  isProfileImageExist: boolean;
  createdAt: string;
}

export interface ShowReviewListRequest {
  sort?: string;
  limit?: number;
  timestamp?: string;
  tagIds?: number[];
  rating?: number;
}

export interface ShowUserReviewRequest {
  limit?: number;
  timestamp?: string;
}

export interface DraftReviewResponse {
  draftReviewId: number;
  content: string;
  rating: number;
  visitDate: string;
  imageIds: string[];
  tagIds: number[];
  cafeId: number;
}

export interface CreateDraftReviewRequest {
  content?: string;
  rating?: number;
  visitDate?: string;
  imageIds?: string[];
  tagIds?: number[];
  cafeId: number;
}

export interface UpdateDraftReviewRequest {
  content?: string;
  rating?: number;
  visitDate?: string;
  tagIds?: number[];
}

export interface ShowUserDraftReviewResponse {
  draftReviewId: number;
  modifiedAt: string;
  cafeName: string; 
  cafeId: number;
  content?: string;
  rating?: number;
  visitDate?: string;
  imageIds?: number[];
  tagIds?: number[];
}