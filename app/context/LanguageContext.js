'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  it: {
    // Header
    siteTitle: "Alla Ricerca dei Suoni Perduti",
    siteSubtitle: "La collezione di strumenti musicali",
    navCollection: "Collezione",
    navPurchase: "Acquista",
    
    // Homepage
    heroTitle: "La Collezione",
    heroSubtitle: "Scopri 92 strumenti musicali storici",
    
    // Instrument Detail
    backToCollection: "← Torna alla collezione",
    instrumentNumber: "N.",
    author: "Autore:",
    location: "Luogo:",
    year: "Anno:",
    listenTitle: "Ascolta lo strumento",
    noMediaAvailable: "File audio non ancora disponibile per questo strumento.",
    previous: "← Precedente",
    next: "Successivo →",
    notFound: "Strumento non trovato",
    
    // Purchase Page
    purchaseTitle: "Acquista uno Strumento",
    purchaseDescription: "Compila il form per richiedere informazioni sull'acquisto di uno strumento della collezione. Ti contatteremo al più presto per fornirti tutti i dettagli.",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Email",
    phone: "Telefono",
    instrumentOfInterest: "Strumento di interesse",
    message: "Messaggio",
    messagePlaceholder: "Scrivi qui eventuali note o domande...",
    submitRequest: "Invia Richiesta",
    thankYou: "Grazie per il tuo interesse!",
    requestReceived: "Abbiamo ricevuto la tua richiesta e ti contatteremo al più presto.",
    required: "*",
    instrumentPlaceholder: "Es: Fortepiano a coda Anton Walter, Vienna, ca. 1789",
    
    // Footer
    footerText: "© 2024 Alla Ricerca dei Suoni Perduti. Tutti i diritti riservati."
  },
  en: {
    // Header
    siteTitle: "In Search of Lost Sounds",
    siteSubtitle: "The musical instruments collection",
    navCollection: "Collection",
    navPurchase: "Purchase",
    
    // Homepage
    heroTitle: "The Collection",
    heroSubtitle: "Discover 92 historical musical instruments",
    
    // Instrument Detail
    backToCollection: "← Back to collection",
    instrumentNumber: "No.",
    author: "Maker:",
    location: "Location:",
    year: "Year:",
    listenTitle: "Listen to the instrument",
    noMediaAvailable: "Audio file not yet available for this instrument.",
    previous: "← Previous",
    next: "Next →",
    notFound: "Instrument not found",
    
    // Purchase Page
    purchaseTitle: "Purchase an Instrument",
    purchaseDescription: "Fill out the form to request information about purchasing an instrument from the collection. We will contact you as soon as possible with all the details.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    instrumentOfInterest: "Instrument of interest",
    message: "Message",
    messagePlaceholder: "Write any notes or questions here...",
    submitRequest: "Submit Request",
    thankYou: "Thank you for your interest!",
    requestReceived: "We have received your request and will contact you as soon as possible.",
    required: "*",
    instrumentPlaceholder: "Ex: Fortepiano Anton Walter, Vienna, ca. 1789",
    
    // Footer
    footerText: "© 2024 In Search of Lost Sounds. All rights reserved."
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('it');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'it' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'it' ? 'en' : 'it';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
