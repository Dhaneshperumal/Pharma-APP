import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Gets the current route

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the page to the top whenever the route changes
  }, [pathname]); // Runs every time pathname changes (route change)

  return null;
};

export default ScrollToTop;
