import { useEffect, useState } from "react";

export default function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(function handleWindowSizeUpdate() {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height in state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler immediately so state is updated with the initial window size
    handleResize();

    // Remove the event listener on cleanup
    return function removeWindowSizeEventListener() {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependencies ensures that effect is only run on mount

  return windowSize;
}
