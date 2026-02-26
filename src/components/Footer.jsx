import "../styles/footer.css";
import { Instagram, Facebook, Phone } from "lucide-react";
import logoFooter from "../assets/BOHEMIA LATIN DISCO LOGO_1760350671657.png";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

export const Footer = () => {
  const ref = useIntersectionObserver({ threshold: 0.1 });
  return (
    <footer className="footer" ref={ref}>
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logoFooter} alt="Latin Disco Logo" className="footer-logo-img" />
          <p>BAR & LOUNGE</p>
        </div>

        <div className="footer-links"></div>

        <div className="footer-social">
          <a href="https://www.instagram.com/juliocesarchaconrivera/" className="social-icon">
            <Instagram size={20} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61582688642388&locale=es_ES" className="social-icon">
            <Facebook size={20} />
          </a>
          <a href="tel:+34641629546" title="Llamar" className="social-icon">
            <Phone size={20} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Latin Disc Bar & Lounge. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
