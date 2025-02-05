import { create } from "zustand";
import { UserInfoResponse } from "@/shared/api/user/types";

interface UserStore {
  userData: UserInfoResponse;
  setUserData: (
    updater: UserInfoResponse | ((prev: UserInfoResponse) => UserInfoResponse)
  ) => void;
  nicknameError: string;
  setNicknameError: (error: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: {
    userId: 0,
    nickname: "",
    introduce: "",
    email: "",
    isProfileImageExist: false,
  },
  nicknameError: "",
  setUserData: (updater) =>
    set((state) => ({
      userData:
        typeof updater === "function" ? updater(state.userData) : updater,
    })),
  setNicknameError: (error) => set({ nicknameError: error }),
}));
