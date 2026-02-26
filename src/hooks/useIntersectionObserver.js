import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null);
  const { threshold = 0.1, rootMargin = '0px' } = options;

  useEffect(() => {
    // Scroll al tope cuando se monta el componente
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Agregar clase scroll-visible cuando entra en viewport
          entry.target.classList.add('scroll-visible');
          // Desconectar una vez visible
          observer.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return ref;
};
