import { useState, useEffect, useRef } from "react";
import "../styles/events.css";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import useEvents from "../hooks/useEvents";

export const EventsSection = () => {
  const ref = useIntersectionObserver({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const touchStartX = useRef(null);

  const { items: events, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents().catch(() => {});
  }, []);

  // Ensure events array sorted by date
  const sortedEvents = (events || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Disparar animación cuando cambia el índice
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // if number of events is small or viewport changes, reset index to 0
  useEffect(() => {
    const slotCount = isMobile ? 1 : 3;
    if (sortedEvents.length <= slotCount) {
      setCurrentIndex(0);
    } else if (currentIndex >= sortedEvents.length) {
      setCurrentIndex(0);
    }
  }, [sortedEvents.length, isMobile, currentIndex]);

  // Manejar touch para swipe en móvil
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    
    touchStartX.current = null;
  };

  // Obtener eventos visibles: 1 en móvil, 3 en desktop
  const getVisibleEvents = () => {
    const list = sortedEvents;
    if (!list || list.length === 0) return [];
    const eventCount = isMobile ? 1 : 3;
    // if we have fewer or equal events than slots, just return them (no wrap/duplicado)
    if (list.length <= eventCount) {
      return list;
    }
    const visible = [];
    for (let i = 0; i < eventCount; i++) {
      visible.push(list[(currentIndex + i) % list.length]);
    }
    return visible;
  };

  const handlePrev = () => {
    const len = sortedEvents.length || 0;
    setCurrentIndex((prev) => (prev === 0 ? Math.max(len - 1, 0) : prev - 1));
  };

  const handleNext = () => {
    const len = sortedEvents.length || 0;
    setCurrentIndex((prev) => (prev === Math.max(len - 1, 0) ? 0 : prev + 1));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const visibleEvents = getVisibleEvents();

  return (
    <>
      <section className="events-section" ref={ref}>
        <div className="events-header">
          <h2>Próximos Eventos</h2>
          <p>No te pierdas lo que viene</p>
        </div>
        {sortedEvents.length === 0 ? (
          <div className="no-events">Sin eventos por el momento</div>
        ) : (
          <>
            <div className="events-carousel">
              {sortedEvents.length > (isMobile ? 1 : 3) && (
                <button className="carousel-btn prev" onClick={handlePrev} aria-label="Evento anterior">
                  <ChevronLeft size={32} />
                </button>
              )}

              <div 
                className={`events-container ${isAnimating ? 'animating' : ''}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {visibleEvents.map((event, idx) => (
                  <div 
                    key={idx} 
                    className="event-card"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="event-image">
                      <img src={event.mediaUrl || event.image || ''} alt={event.title} />
                      <div className="event-overlay"></div>
                      <div className="event-click-hint">Ver imagen</div>
                    </div>
                    <div className="event-info">
                      <div className="event-date">
                        <Calendar size={18} />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <h3>{event.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {sortedEvents.length > (isMobile ? 1 : 3) && (
                <button className="carousel-btn next" onClick={handleNext} aria-label="Próximo evento">
                  <ChevronRight size={32} />
                </button>
              )}
            </div>

            <div className="carousel-indicators">
              {sortedEvents.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Evento ${idx + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal para ver imagen completa */}
      {selectedEvent && (
        <div className="event-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={32} />
            </button>
            <img src={selectedEvent.mediaUrl || selectedEvent.image || ''} alt={selectedEvent.title} />
            <div className="modal-info">
              <h2>{selectedEvent.title}</h2>
              <div className="modal-date">
                <Calendar size={20} />
                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
