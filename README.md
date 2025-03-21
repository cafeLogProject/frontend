## 프로젝트 개요 (brew scape)

개인의 취향에 맞춰 카페를 탐색하고 기록할 수 있는 웹 서비스

## 기술 스택

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**:
  - Zustand (전역 상태 관리)
  - TanStack Query v5 (서버 상태 관리)

## 주요 기능

### 1. 카페 검색

- 카페명을 기준으로 검색
- 북마크한 카페 검색

### 2. 리뷰 작성

- 사진, 별점, 카테고리를 포함한 리뷰 작성
- 작성 도중 화면을 이탈해도 임시 저장 기능 제공

### 3. 리뷰 탐색

- 별점순, 최신순으로 리뷰 정렬
- 카테고리별 리뷰 검색 (예: 공부하기 좋은 곳, 커피 맛이 좋은 곳, 인테리어, 데이트 추천 등)

### 4. 특정 카페 리뷰 탐색

- 특정 카페의 리뷰만 모아서 탐색 가능

## 페이지

### 1. 로그인

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/로그인.gif" width="700px"  height="800px">

### 2. 홈화면

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/홈화면.gif" width="700px" height="800px">

- 전체 리뷰 조회 (최신순, 평점 높은순)
- 필터로 선택 가능

### 3. 카페정보

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/카페정보.gif" width="700px" height="800px">

- 칩을 클릭해서 카페정보로 이동
- 카페정보 확인 및 북마크 가능

### 4. 장소검색

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/검색.gif" width="700px" height="800px">

### 5. 리뷰작성

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/리뷰작성.gif" width="700px" height="800px">

- 리뷰 작성 도중 나갔을 때 초안으로 저장됨

### 6. 마이페이지

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/마이페이지.gif" width="700px" height="800px">

<img src="https://raw.githubusercontent.com/cafeLogProject/README/main/image/video/fe/마이페이지 수정.gif" width="700px" height="800px">

- 내 정보 조회, 수정 가능
