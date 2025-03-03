import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useBlocker = (blocker: () => void, enabled = true) => {
  const isModalOpen = useRef(false);
  const hasPushedState = useRef(false);
  const location = useLocation();

  useEffect(() => {
    return () => {
      hasPushedState.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const currentPathname = location.pathname;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = "";
    };

    const handlePopState = (event: PopStateEvent) => {
      if (!isModalOpen.current) {
        event.preventDefault();
        window.history.pushState(null, "", currentPathname);
        blocker();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    if (!hasPushedState.current) {
      window.history.pushState(null, "", currentPathname);
      hasPushedState.current = true;
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      isModalOpen.current = false;
    };
  }, [blocker, enabled, location]);

  const setModalState = (open: boolean) => {
    isModalOpen.current = open;
  };

  return { setModalState };
};
