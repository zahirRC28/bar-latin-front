import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { MenuSection } from '../components/MenuSection'
import { EventsSection } from '../components/EventsSection'
import { AmbienteSection } from '../components/AmbienteSection'
import { EncuentranosSection } from '../components/EncuentranosSection'
import { Footer } from '../components/Footer'
import "../styles/home.css";

export const Home = () => {
  return (
    <div className='principal'>
      <Navbar />
      <div id='inicio'><Hero /></div>
      <div id='menu'><MenuSection /></div>
      <div id='eventos'><EventsSection /></div>
      <div id='ambiente'><AmbienteSection /></div>
      <div id='contacto'><EncuentranosSection /></div>
      <Footer />
    </div>
  )
}
