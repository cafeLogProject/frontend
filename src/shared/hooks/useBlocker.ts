import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useBlocker = (blocker: () => void, enabled = true) => {
  const isModalOpen = useRef<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isModalOpen.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (!isModalOpen.current) {
        event.preventDefault();
        window.history.pushState(null, '', location.pathname);
        blocker();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push initial state
    window.history.pushState(null, '', location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      isModalOpen.current = false;
    };
  }, [blocker, enabled, location.pathname]);

  const setModalState = (open: boolean) => {
    isModalOpen.current = open;
  };

  return { setModalState };
};