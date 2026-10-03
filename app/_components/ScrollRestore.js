'use client';

import { useEffect } from 'react';
import { consumeHomeScroll } from './homeScrollMemory';

export default function ScrollRestore({ locale }) {
  useEffect(() => {
    const savedY = consumeHomeScroll(locale);
    if (savedY !== null && !Number.isNaN(savedY)) {
      window.scrollTo(0, savedY);
    }
  }, [locale]);

  return null;
}
