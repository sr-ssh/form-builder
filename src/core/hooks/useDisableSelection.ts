import { useEffect } from "react";

export const useDisableSelection = () => {
  useEffect(() => {
    const handleSelect = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("selectstart", handleSelect);
    return () => {
      window.removeEventListener("selectstart", handleSelect);
    };
  }, []);
};
