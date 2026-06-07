import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ProjectShowcase from './components/ProjectShowcase'
import About from './components/About'
import Skills from './components/Skills'
import Contact from './components/Contact'
import './App.css'

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Nav />
        <main>
          <Hero />
          <ProjectShowcase />
          <About />
          <Skills />
          <Contact />
        </main>
      </LangProvider>
    </ThemeProvider>
  )
}
