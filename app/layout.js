/* eslint-disable react/prop-types */
import Header from './_components/Header';
import Footer from './_components/Footer';
import './globals.css';

export const metadata = {
  title: 'Giulini Family Estates',
  description: 'Discover the historic and cultural identity of the Giulini family properties.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}