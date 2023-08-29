import { useEffect, useState } from 'react';
import { getStaticUrl } from '../../apis/nextml';

import styles from './styles.module.css';

interface ImageThumbnailProps {
  image_id: string;
  isSelected: boolean;
  onClick: (image_id: string) => void;
}
export function ImageThumbnail({ image_id, isSelected, onClick }: ImageThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<HTMLImageElement | null>(null);
  const classNames = [styles.root, isSelected ? styles.selected : ''];

  useEffect(() => {
    const handleImageLoad = (loadedImage: HTMLImageElement) => {
      setThumbnail(loadedImage);
    };

    setThumbnail(null);
    const image = new Image();
    image.src = getStaticUrl(`images/${image_id}/thumb`);
    image.onload = () => handleImageLoad(image);
  }, [image_id]);
  return (
    <figure onClick={() => onClick(image_id)} className={classNames.join(' ')}>
      {thumbnail === null ? (
        <div className={styles.placeholder} />
      ) : (
        <img src={thumbnail.src} alt={image_id} className={styles.thumbnail} />
      )}
      <figcaption className={styles.caption}>{image_id}</figcaption>
    </figure>
  );
}
