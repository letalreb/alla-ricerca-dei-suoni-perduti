/* eslint-disable react/prop-types */
import Image from 'next/image';
import styles from './propertyPage.module.css';

const propertyData = {
  'casa-giulini-milan': {
    name: 'Casa Giulini in Milan',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center'
    ],
    description: `A significant part of the musical instrument collection is housed in Milan, at Casa Giulini, where guests can admire painted harpsichords, harps from the time of Marie Antoinette and the Empire period, richly decorated psalteries, and mandolins. All the instruments are in perfect playing condition and preserve the charm of the "lost sound." In the quiet of a discreet garden in the heart of Milan, the Green Room features a collection of antique wooden stamps used to print fabrics, and the Blue Room is decorated with theatrical backdrops.`,
  },
  'tenuta-la-marchesa': {
    name: 'Tenuta La Marchesa',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center'
    ],
    description: `The La Marchesa Estate, now a national monument, dates back to the mid-sixteenth century. It covers 76 hectares, including 58 hectares of vineyards, ancient woodlands, and a lake adorned with lotus flowers. It features a charming farmhouse with a swimming pool and produces Gavi and native red wines.`,
  },
  'tenuta-pietra-porzia': {
    name: 'Tenuta di Pietra Porzia',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop&crop=center'
    ],
    description: `This historic villa was built in 1946 by architect Ugo Luccichenti and remains a protected national monument. The estate stretches across 60 hectares of vineyards and olive groves with extraordinary views over Rome. A magnificent cypress-lined avenue, nearly one kilometer long, separates the villa from the wine cellar complex built in 1892.`,
  },
  'villa-giulini-forte-dei-marmi': {
    name: 'Villa Giulini in Forte dei Marmi',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&crop=center'
    ],
    description: `Located in the heart of "Roma Imperiale," this villa was built in 1938 by Guglielmo Ulrich. It overlooks the Fiumetto river, made famous by the paintings of Carlo Carrà. The dense vegetation creates a natural screen, turning the gardens into leafy theaters that echo historic Tuscan villas.`,
  },
  'villa-giulini-sori': {
    name: 'Villa Giulini in Sori',
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=600&h=400&fit=crop&crop=center'
    ],
    description: `Built in the 1960s for our family, this clifftop villa unfolds through a series of glass hexagons, each offering a different view of the sea. It embodies the rationalist architectural style of its age, with breathtaking views of Mount Portofino. The ground floor opens to the sea, and the "garden-terrace" is adorned with vibrant Bougainvillea.`,
  },
};

// eslint-disable-next-line react/prop-types
export default function PropertyPage({ params }) {
  const property = propertyData[params.slug];

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="container">
      <h1 className={styles.title}>{property.name}</h1>
      <p className={styles.description}>{property.description}</p>
      <div className={styles.imageGallery}>
        {property.images.map((img, index) => (
          <Image key={`${property.name}-${index}`} src={img} alt={`${property.name} image ${index + 1}`} width={600} height={400} className={styles.image} />
        ))}
      </div>
    </div>
  );
}