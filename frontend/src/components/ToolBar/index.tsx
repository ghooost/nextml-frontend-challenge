import { useSelector } from 'react-redux';
import {
  ObjectState,
  loadImages,
  selectImagesList,
  selectImagesListState,
  selectMainImageState,
  selectselectedImageId,
  setselectedImageId,
} from '../../store/images';
import { useAppDispatch } from '../../store';
import { useEffect } from 'react';
import { ImageThumbnail } from '../ImageThumbnail';

import styles from './styles.module.css';

export const ToolBar = () => {
  const dispatch = useAppDispatch();
  const imagesListState = useSelector(selectImagesListState);
  const mainImageState = useSelector(selectMainImageState);
  const selectedImageId = useSelector(selectselectedImageId);
  const imagesList = useSelector(selectImagesList);

  useEffect(() => {
    dispatch(loadImages());
  }, [dispatch]);

  const handleClick = (image_id: string) => {
    dispatch(setselectedImageId(image_id));
  };

  return (
    <section className={styles.toolBar}>
      {imagesListState !== ObjectState.ready && <section className={styles.loading}>Loading...</section>}
      {imagesListState === ObjectState.ready && (
        <section className={styles.items}>
          {imagesList.map(({ image_id }) => (
            <ImageThumbnail
              key={image_id}
              image_id={image_id}
              isSelected={image_id === selectedImageId}
              onClick={handleClick}
            />
          ))}
        </section>
      )}
      {mainImageState === ObjectState.ready && (
        <section className={styles.info}>
          <p>Drag picture</p>
          <p>Drag with Option/Alt to zoom</p>
          <p>DblClick to add comment</p>
        </section>
      )}
    </section>
  );
};
