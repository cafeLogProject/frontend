export interface FavoriteCafeInfo {
  cafeId: number;
  cafeName: string;
  location: string;
}

export interface ToggleFavoriteRequest {
  cafeId: number;
  isScrap: boolean;
}

export interface ToggleFavoriteResponse {
  message: string;
}
