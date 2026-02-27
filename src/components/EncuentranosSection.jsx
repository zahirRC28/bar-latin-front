import "../styles/encuentrano.css";
import { useState } from "react";
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import img1 from '../assets/referenciaImagen.png';
import img2 from '../assets/referencialmagen2.jpeg';

export const EncuentranosSection = () => {
  const ref = useIntersectionObserver({ threshold: 0.1 });
  const images = [img1, img2];
  const [modalImg, setModalImg] = useState(null); // Para el modal

  return (
    <section className="encuentranos-section" ref={ref}>
      <div className="encuentranos-header">
        <h2>Encuéntranos</h2>
        <p>Te esperamos cada noche</p>
      </div>

      <div className="encuentranos-container">
        {/* Info */}
        <div className="encuentranos-info">
          <div className="info-item">
            <div className="info-icon">
              <MapPin size={24} />
            </div>
            <div className="info-text">
              <h3>Dirección</h3>
              <p>Judimendi Hiribidea, 11, bajo 2, 01003 Vitoria-Gasteiz, Araba</p>
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
              <p>Jue - Dom: 17:00 - 3:00</p>
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

        {/* Mapa + imágenes */}
        <div className="encuentranos-map-images">
          {/* Mapa */}
          <div className="encuentranos-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217.4182714566266!2d-2.6611518315733056!3d42.847089296836074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4fc263cd5bff25%3A0xbb0538db17135be7!2sJudimendi%20Hiribidea%2C%2011%2C%20bajo%202%2C%2001003%20Vitoria-Gasteiz%2C%20Araba!5e0!3m2!1ses-419!2ses!4v1772151912890!5m2!1ses-419!2ses"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: "20px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Imágenes con título */}
          <div className="encuentranos-images-side-wrapper">
            <h3 className="images-title">Imágenes de referencia</h3>
            <div className="encuentranos-images-side">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  onClick={() => setModalImg(img)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para ver imagen completa */}
      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          <img src={modalImg} alt="Imagen completa" className="modal-img" />
        </div>
      )}
    </section>
  );
};
