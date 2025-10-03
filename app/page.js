import Hero from './_components/Hero';
import PropertyCard from './_components/PropertyCard';

const properties = [
  {
    slug: 'casa-giulini-milan',
    name: 'Casa Giulini',
    location: 'Milan',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center',
  },
  {
    slug: 'tenuta-la-marchesa',
    name: 'Tenuta La Marchesa',
    location: 'Novi Ligure, Alessandria',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
  },
  {
    slug: 'tenuta-pietra-porzia',
    name: 'Tenuta di Pietra Porzia',
    location: 'Frascati, Rome',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
  },
  {
    slug: 'villa-giulini-forte-dei-marmi',
    name: 'Villa Giulini',
    location: 'Forte dei Marmi, Lucca',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&crop=center',
  },
  {
    slug: 'villa-giulini-sori',
    name: 'Villa Giulini',
    location: 'Sori, Genoa',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Our Properties</h2>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {properties.map((prop) => (
            <PropertyCard key={prop.slug} property={prop} />
          ))}
        </div>
      </div>
    </>
  );
}