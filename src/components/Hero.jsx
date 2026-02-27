import "../styles/hero.css";
import heroLogo from "../assets/BOHEMIA LATIN DISCO LOGO_1760350671657.png";

export const Hero = () => {
  return (
    <section className="hero">
      <div className="overlay">
        <img src={heroLogo} alt="Latin Disco" className="hero-logo" />
        <h3>BAR DE COPAS</h3>
        <p>
          Donde la noche cobra vida. Cocktails de autor, música en vivo
          y la mejor energía de la ciudad.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => {
            const el = document.getElementById('contacto');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>Síguenos</button>
          <a href="https://wa.me/34641629546" target="_blank" rel="noopener noreferrer">
            <button className="btn-accent">Reservar</button>
          </a>
        </div>
      </div>
    </section>
  )
}
