import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "../styles/navbar.css"
import { Instagram, Phone, Menu, X, MessageCircle } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Usar pequeño delay para evitar que el mismo click cierre el menú
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="logo">LATIN DISCO</div>

      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li onClick={() => handleScroll('inicio')}>Inicio</li>
        <li onClick={() => handleScroll('menu')}>Menú</li>
        <li onClick={() => handleScroll('eventos')}>Eventos</li>
        <li onClick={() => handleScroll('ambiente')}>Galería</li>
        <li onClick={() => handleScroll('contacto')}>Contacto</li>
      </ul>

      <div className="nav-icons">
        <a href="https://www.instagram.com/juliocesarchaconrivera/" title="Instagram"><Instagram size={20} /></a>
        {/* tel: link will open the dialer on mobile devices */}
        <a href="tel:+34641629546" title="Llamar" ><Phone size={20} /></a>
        {/* whatsapp link optional */}
        <a href="https://wa.me/34641629546" title="WhatsApp" target="_blank" rel="noopener noreferrer" style={{marginLeft:6}}>
          <MessageCircle size={20} />
        </a>
        <Link to="/admin" className="admin-link" title="Admin" style={{marginLeft:8, fontSize:12, opacity:0.8}}>Panel</Link>
      </div>
    </nav>
  )
}
