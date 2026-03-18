import { useEffect, useState } from "react";

export function useUnauthorized() {
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    function handleUnauthorized() {
      setIsUnauthorized(true);
    }

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  return isUnauthorized;
}