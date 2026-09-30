import Header from '../_components/Header';
import Footer from '../_components/Footer';

export default function ItalianLayout({ children }) {
  return (
    <>
      <Header locale="it" />
      <main>{children}</main>
      <Footer locale="it" />
    </>
  );
}
