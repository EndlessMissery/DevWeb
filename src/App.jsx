import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import SmartZOS from './components/SmartZOS'
import About from './components/About'
import Projects from './components/Projects'
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
          <SmartZOS />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
      </LangProvider>
    </ThemeProvider>
  )
}
