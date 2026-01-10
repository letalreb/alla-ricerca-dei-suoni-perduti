'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import styles from './page.module.css';

export default function AcquistaPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    strumento: '',
    messaggio: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Qui puoi aggiungere la logica per inviare il form
    console.log('Form inviato:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h1>{t('thankYou')}</h1>
          <p>{t('requestReceived')}</p>
          <Link href="/" className={styles.backLink}>
            {t('backToCollection')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        {t('backToCollection')}
      </Link>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('purchaseTitle')}</h1>
        <p className={styles.description}>
          {t('purchaseDescription')}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nome" className={styles.label}>{t('firstName')} {t('required')}</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cognome" className={styles.label}>{t('lastName')} {t('required')}</label>
              <input
                type="text"
                id="cognome"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>{t('email')} {t('required')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>{t('phone')}</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="strumento" className={styles.label}>{t('instrumentOfInterest')} {t('required')}</label>
            <input
              type="text"
              id="strumento"
              name="strumento"
              value={formData.strumento}
              onChange={handleChange}
              required
              placeholder={t('instrumentPlaceholder')}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="messaggio" className={styles.label}>{t('message')}</label>
            <textarea
              id="messaggio"
              name="messaggio"
              value={formData.messaggio}
              onChange={handleChange}
              rows="5"
              placeholder={t('messagePlaceholder')}
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            {t('submitRequest')}
          </button>
        </form>
      </div>
    </div>
  );
}
