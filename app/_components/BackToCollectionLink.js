'use client';

import Link from 'next/link';
import { clearHomeScroll } from './homeScrollMemory';

export default function BackToCollectionLink({ href, className, children }) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        clearHomeScroll();
        window.scrollTo(0, 0);
      }}
    >
      {children}
    </Link>
  );
}
