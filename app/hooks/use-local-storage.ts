import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStorageValue(key: string, defaultValue: any) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(
    function saveToLocalStorage() {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key, value]
  );

  return [value, setValue];
};
