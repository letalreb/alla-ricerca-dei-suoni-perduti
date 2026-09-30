import InstrumentDetail from '../../../_components/InstrumentDetail';

export default async function EnglishInstrumentPage({ params }) {
  const { id } = await params;
  return <InstrumentDetail id={id} locale="en" />;
}
