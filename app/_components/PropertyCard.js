/* eslint-disable react/prop-types */
import Link from 'next/link';
import Image from 'next/image';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.slug}`} className={styles.card}>
      <Image src={property.imageUrl} alt={property.name} width={400} height={300} className={styles.image} />
      <div className={styles.content}>
        <h3>{property.name}</h3>
        <p>{property.location}</p>
      </div>
    </Link>
  );
}