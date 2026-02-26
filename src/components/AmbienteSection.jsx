import "../styles/ambiente.css";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
// import asset images directly so bundler resolves them
import amb1 from '../assets/ambiente1.jpg';
import amb2 from '../assets/ambiente2.jpg';
import amb3 from '../assets/ambiente3.jpg';
import amb4 from '../assets/ambiente4.jpg';
import amb5 from '../assets/ambiente5.jpg';

export const AmbienteSection = () => {
  const ref = useIntersectionObserver({ threshold: 0.1 });

  const ambiences = [
    { image: amb1 },
    { image: amb2 },
    { image: amb3 },
    { image: amb4 },
    { image: amb5 }
  ];

  return (
    <section className="ambiente-section" ref={ref}>
      <div className="ambiente-header">
        <h2>El Ambiente</h2>
        <p>Vive la experiencia Bar Latin Disco</p>
      </div>

      <div className="ambiente-grid">
        {ambiences.map((item, idx) => (
          <div key={idx} className="ambiente-card">
            <img src={item.image} alt="Ambiente" />
            {/* overlay kept for hover effect but no title text */}
            <div className="ambiente-overlay" />
          </div>
        ))}
      </div>
    </section>
  );
};
