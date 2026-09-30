import Header from '../_components/Header';
import Footer from '../_components/Footer';
import SetHtmlLang from '../_components/SetHtmlLang';

export const metadata = {
  title: 'In Search of Lost Sounds',
  description: 'A journey through the history of antique musical instruments',
};

export default function EnglishLayout({ children }) {
  return (
    <>
      <SetHtmlLang lang="en" />
      <Header locale="en" />
      <main>{children}</main>
      <Footer locale="en" />
    </>
  );
}
