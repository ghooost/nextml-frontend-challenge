import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createCommentForImage,
  fetchCommentsForImage,
  fetchImages,
  ImageComment,
  NextMLImage,
  updateCommentForImage,
  UpdateCommentResponse,
} from '../apis/images';

import { RootState } from '.';

export interface ImageCommentWithLocal extends ImageComment {
  isLocal?: boolean;
}

export enum ObjectState {
  undefined,
  loading,
  ready,
  error,
}

interface ImagesSliceState {
  imagesList: NextMLImage[];
  comments: ImageCommentWithLocal[];
  selectedImageId: string;
  imagesListState: ObjectState;
  mainImageState: ObjectState;
  commentsState: ObjectState;
}
const initialState: ImagesSliceState = {
  imagesList: [],
  comments: [],
  selectedImageId: '',
  imagesListState: ObjectState.undefined,
  mainImageState: ObjectState.undefined,
  commentsState: ObjectState.undefined,
};

export const loadImages = createAsyncThunk('images/loadImages', async () => {
  return await fetchImages();
});

export const loadCommentsForImage = createAsyncThunk('images/loadCommentsForImage', async (image_id: string) => {
  return await fetchCommentsForImage(image_id);
});

type SaveCommentParams = ImageCommentWithLocal;

export const saveComment = createAsyncThunk<unknown, SaveCommentParams>('images/saveComment', async (comment) => {
  const { id, image_id, text, x, y } = comment;
  if (comment.isLocal) {
    return await createCommentForImage(image_id, text, x, y);
  } else {
    return await updateCommentForImage(image_id, id, text, x, y);
  }
});

interface createLocalCommentProps {
  text: string;
  x: number;
  y: number;
}

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setselectedImageId: (state, action: PayloadAction<string>) => {
      state.selectedImageId = action.payload;
    },
    setImagesListState: (state, action: PayloadAction<ObjectState>) => {
      state.imagesListState = action.payload;
    },
    setMainImageState: (state, action: PayloadAction<ObjectState>) => {
      state.mainImageState = action.payload;
    },
    setCommentsState: (state, action: PayloadAction<ObjectState>) => {
      state.commentsState = action.payload;
    },
    createLocalCommentForSelectedImage: (state, action: PayloadAction<createLocalCommentProps>) => {
      const { text, x, y } = action.payload;
      state.comments = state.comments.concat({
        text,
        x,
        y,
        id: `tmp${new Date().getTime()}`,
        image_id: state.selectedImageId,
        isLocal: true,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadImages.pending, (state) => {
      state.imagesListState = ObjectState.loading;
    });
    builder.addCase(loadImages.fulfilled, (state, action) => {
      state.imagesListState = ObjectState.ready;
      state.imagesList = action.payload;
    });
    builder.addCase(loadCommentsForImage.pending, (state) => {
      state.commentsState = ObjectState.loading;
    });
    builder.addCase(loadCommentsForImage.fulfilled, (state, action) => {
      state.commentsState = ObjectState.ready;
      const comments = action.payload;
      const loadedImageId = action.meta.arg;
      state.comments = state.comments.filter(({ image_id }) => image_id !== loadedImageId).concat(comments);
    });
    builder.addCase(saveComment.pending, (state, action) => {
      const { id: oldId, text } = action.meta.arg;
      const commentItem = state.comments.find(({ id }) => id === oldId);
      if (!commentItem) {
        return;
      }
      commentItem.text = text;
    });
    builder.addCase(saveComment.fulfilled, (state, action) => {
      const { id: oldId } = action.meta.arg;
      const { id } = action.payload as UpdateCommentResponse;
      const commentItem = state.comments.find(({ id }) => id === oldId);
      if (!commentItem) {
        return;
      }
      commentItem.id = id;
      commentItem.isLocal = false;
    });
  },
});

export const { setselectedImageId, createLocalCommentForSelectedImage, setMainImageState } = imagesSlice.actions;

const selectImagesSlice = ({ images }: RootState) => images;

export const selectImagesList = createSelector(selectImagesSlice, (state) => state.imagesList);

export const selectselectedImageId = createSelector(selectImagesSlice, (state) => state.selectedImageId);

export const selectCommentsForSelectedImage = createSelector(selectImagesSlice, ({ selectedImageId, comments }) =>
  comments.filter(({ image_id }) => image_id === selectedImageId),
);

export const selectCommentById = createSelector(
  [selectImagesSlice, (_, commentId) => commentId],
  ({ comments }, commentId) => comments.find(({ id }) => id === commentId),
);

export const selectImagesListState = createSelector(selectImagesSlice, (state) => state.imagesListState);

export const selectMainImageState = createSelector(selectImagesSlice, (state) => state.mainImageState);

export const selectCommentsState = createSelector(selectImagesSlice, (state) => state.commentsState);
