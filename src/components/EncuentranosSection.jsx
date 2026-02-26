import "../styles/encuentrano.css";
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

export const EncuentranosSection = () => {
  const ref = useIntersectionObserver({ threshold: 0.1 });
  return (
    <section className="encuentranos-section" ref={ref}>
      <div className="encuentranos-header">
        <h2>Encuéntranos</h2>
        <p>Te esperamos cada noche</p>
      </div>

      <div className="encuentranos-container">
        <div className="encuentranos-info">
          <div className="info-item">
            <div className="info-icon">
              <MapPin size={24} />
            </div>
            <div className="info-text">
              <h3>Dirección</h3>
              <p>Calle de la Noche 42, Madrid, España</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Phone size={24} />
            </div>
            <div className="info-text">
              <h3>Teléfono</h3>
              <p>+34 641 62 95 46</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Clock size={24} />
            </div>
            <div className="info-text">
              <h3>Horario</h3>
              <p>Jue - Dom: 21:00 - 04:00</p>
            </div>
          </div>

          <div className="social-icons">
            <a href="https://www.instagram.com/juliocesarchaconrivera/" className="social-link">
              <Instagram size={24} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61582688642388&locale=es_ES" className="social-link">
              <Facebook size={24} />
            </a>
            <a href="https://wa.me/34641629546" title="WhatsApp" className="social-link" rel="noopener noreferrer">
              <MessageCircle size={24} />
            </a>
          </div>
        </div>

        <div className="encuentranos-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.1959976814826!2d-3.6899656!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMadrid%2C%20Spain!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "20px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};
