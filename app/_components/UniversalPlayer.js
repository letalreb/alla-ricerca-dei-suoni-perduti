'use client';

import ArchivePlayer from './ArchivePlayer';
import BunnyPlayer from './BunnyPlayer';

/**
 * Universal Player che supporta sia Internet Archive che Bunny.net
 * Priorità: Bunny.net > Internet Archive
 */
export default function UniversalPlayer({ instrument }) {
  // Se disponibile Bunny.net, usalo
  if (instrument.bunnyMethod) {
    return (
      <BunnyPlayer
        bunnyMethod={instrument.bunnyMethod}
        bunnyUrl={instrument.bunnyUrl}
        bunnyEmbedUrl={instrument.bunnyEmbedUrl}
        bunnyVideoGuid={instrument.bunnyVideoGuid}
        title={instrument.name}
      />
    );
  }

  // Altrimenti usa Internet Archive
  if (instrument.archiveId && instrument.embedUrl) {
    return (
      <ArchivePlayer
        archiveId={instrument.archiveId}
        embedUrl={instrument.embedUrl}
        title={instrument.name}
      />
    );
  }

  // Nessun video disponibile
  return (
    <div style={{
      padding: '4rem 2rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      textAlign: 'center',
      color: '#666',
      fontStyle: 'italic'
    }}>
      <p>Video non disponibile</p>
    </div>
  );
}
