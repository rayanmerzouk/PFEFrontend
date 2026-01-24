import React, { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Écoute les changements de largeur
    mql.addEventListener("change", onChange);

    // Définir la valeur initiale
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Nettoyage
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
