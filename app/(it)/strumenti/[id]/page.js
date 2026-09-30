import InstrumentDetail from '../../../_components/InstrumentDetail';

export default async function InstrumentPage({ params }) {
  const { id } = await params;
  return <InstrumentDetail id={id} locale="it" />;
}
