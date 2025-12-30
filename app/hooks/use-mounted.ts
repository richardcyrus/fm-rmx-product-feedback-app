import { useEffect, useState } from "react";

export const useMounted = (): { hasMounted: boolean } => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(function setMountedState() {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  return { hasMounted };
};
