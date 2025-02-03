interface ICoordinate {
  readonly latitude: number;
  readonly longitude: number;
}

export interface ICafeDescription {
  id: number;
  readonly name: string;
  readonly category?: string;
  readonly isClosedDown?: boolean;
  readonly address?: string;
  readonly roadAddress?: string;
  readonly mapx?: string;
  readonly mapy?: string;
  readonly link?: string;
  // 프론트엔드에서 추가로 사용하는 속성
  readonly imageIds?: number[];
  readonly avgStar?: number;
  readonly profileImg?: string;
  readonly isScrap?: boolean;
}

export interface INaverLocalApiResponse {
  title?: string;
  link?: string;
  category?: string;
  description?: string;
  telephone?: string;
  address?: string;
  roadAddress?: string;
  mapx?: string;
  mapy?: string;
}

export interface ICafeApiResponse {
  cafeName: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
  link: string;
  avgRating: number;
  _closed_down: boolean;
  isScrap: boolean;
}
