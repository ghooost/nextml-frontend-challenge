import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageCommentWithLocal,
  ObjectState,
  createLocalCommentForSelectedImage,
  loadCommentsForImage,
  saveComment,
  selectCommentsForSelectedImage,
  selectMainImageState,
  selectselectedImageId,
  setMainImageState,
} from '../../store/images';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { CommentItem } from '../CommentItem';
import { getStaticUrl } from '../../apis/nextml';

import styles from './styles.module.css';

interface DrawLocation {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export const ImageScene = () => {
  const dispatch = useAppDispatch();
  const selectedImageId = useSelector(selectselectedImageId);
  const mainImageState = useSelector(selectMainImageState);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const comments = useSelector(selectCommentsForSelectedImage);

  const [drawLocation, setDrawLocation] = useState<DrawLocation>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  const handleDragStart = (event: React.MouseEvent) => {
    if (mainImageState !== ObjectState.ready) {
      return;
    }
    setIsScaling(event.altKey);
    setIsDragging(!event.altKey);
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
  };

  const handleDragEnd = () => {
    if (mainImageState !== ObjectState.ready) {
      return;
    }
    setIsDragging(false);
    setIsScaling(false);
  };

  const handleDrag = (event: React.MouseEvent) => {
    if (mainImageState !== ObjectState.ready) {
      return;
    }
    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;
    setDragStartX(event.clientX);
    setDragStartY(event.clientY);
    if (isDragging) {
      setDrawLocation(({ offsetX, offsetY, scale }) => {
        return {
          offsetX: offsetX + deltaX,
          offsetY: offsetY + deltaY,
          scale,
        };
      });
      return;
    }

    if (isScaling) {
      setDrawLocation(({ offsetX, offsetY, scale }) => {
        const scaleX = Math.abs(deltaX);
        const scaleSign = scaleX === deltaX ? 1 : -1;
        const newScale = scale + scaleSign * scaleX * 0.01;
        const newScaleFinal = Math.min(Math.max(0.1, newScale), 4);

        const newOffsetX = dragStartX - ((dragStartX - offsetX) / scale) * newScaleFinal;
        const newOffsetY = dragStartY - ((dragStartY - offsetY) / scale) * newScaleFinal;

        return {
          offsetX: newOffsetX,
          offsetY: newOffsetY,
          scale: newScaleFinal,
        };
      });
      return;
    }
  };

  const handleDblClick = (event: React.MouseEvent) => {
    if (mainImageState !== ObjectState.ready) {
      return;
    }
    dispatch(
      createLocalCommentForSelectedImage({
        text: 'Type you note here',
        x: (-drawLocation.offsetX + event.clientX) / drawLocation.scale,
        y: (-drawLocation.offsetY + event.clientY) / drawLocation.scale,
      }),
    );
  };

  useEffect(() => {
    // resize canvas with window
    const updateCanvasSize = () => {
      if (!rootRef.current) {
        return;
      }
      setCanvasWidth(rootRef.current.clientWidth);
      setCanvasHeight(rootRef.current.clientHeight);
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    // load image
    const handleImageLoad = (loadedImage: HTMLImageElement) => {
      setImageWidth(loadedImage.width);
      setImageHeight(loadedImage.height);

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      setCtx(canvas.getContext('2d'));
      dispatch(setMainImageState(ObjectState.ready));
    };

    if (!selectedImageId) {
      return;
    }

    dispatch(setMainImageState(ObjectState.loading));
    dispatch(loadCommentsForImage(selectedImageId));
    const newImage = new Image();
    newImage.src = getStaticUrl(`images/${selectedImageId}`);
    newImage.onload = () => handleImageLoad(newImage);
    setImage(newImage);
    return () => {
      newImage.onload = null;
    };
  }, [dispatch, selectedImageId]);

  useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (mainImageState !== ObjectState.ready || !image) {
      return;
    }

    ctx.drawImage(
      image,
      drawLocation.offsetX,
      drawLocation.offsetY,
      imageWidth * drawLocation.scale,
      imageHeight * drawLocation.scale,
    );
  }, [
    ctx,
    image,
    imageWidth,
    imageHeight,
    canvasWidth,
    canvasHeight,
    drawLocation.offsetX,
    drawLocation.offsetY,
    drawLocation.scale,
    mainImageState,
  ]);

  const handleSaveComment = useCallback(
    (comment: ImageCommentWithLocal) => {
      dispatch(saveComment(comment));
    },
    [dispatch],
  );

  return (
    <div
      ref={rootRef}
      className={styles.root}
      draggable="false"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      onDoubleClick={handleDblClick}
    >
      <div
        className={styles.comments}
        style={{
          transform: `translate(${drawLocation.offsetX}px, ${drawLocation.offsetY}px)`,
        }}
      >
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} scale={drawLocation.scale} onSave={handleSaveComment} />
        ))}
      </div>
      <canvas ref={canvasRef} className={styles.canvas} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};
