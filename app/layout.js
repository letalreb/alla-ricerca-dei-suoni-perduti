/* eslint-disable react/prop-types */
import Header from './_components/Header';
import Footer from './_components/Footer';
import './globals.css';

export const metadata = {
  title: 'Alla Ricerca dei Suoni Perduti',
  description: 'Un viaggio attraverso la storia e la musica, alla scoperta degli strumenti musicali antichi e del patrimonio culturale della famiglia Giulini.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}