import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { imagesSlice } from './images';

export const store = configureStore({
  reducer: {
    images: imagesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
