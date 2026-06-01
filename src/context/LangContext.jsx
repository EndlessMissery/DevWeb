import { createContext, useContext, useState } from 'react'
import { i18n } from '../i18n'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('cs')
  const t = i18n[lang]
  const toggle = () => setLang(l => l === 'cs' ? 'en' : 'cs')

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
