/* eslint-disable react/prop-types */
import Header from './_components/Header';
import Footer from './_components/Footer';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.allaricercadeisuoniperduti.com'),
  title: 'Alla Ricerca dei Suoni Perduti',
  description: 'Un viaggio attraverso la storia degli strumenti musicali antichi',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Lato:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}