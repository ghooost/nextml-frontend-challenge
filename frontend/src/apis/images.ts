import { AxiosResponse } from 'axios';
import { nextMl } from './nextml';

export interface NextMLImage {
  image_id: string;
}

type FetchImagesResponse = NextMLImage[];

export const fetchImages = async () => {
  const response = await nextMl.get<unknown, AxiosResponse<FetchImagesResponse>>('/images');
  return response.data;
};

export interface ImageComment {
  id: string;
  image_id: string;
  text: string;
  x: number;
  y: number;
}

type FetchCommentsForImageResponse = ImageComment[];

export const fetchCommentsForImage = async (image_id: string) => {
  const { data } = await nextMl.get<unknown, AxiosResponse<FetchCommentsForImageResponse>>(
    `/images/${image_id}/comments`,
  );
  return data;
};

export type UpdateCommentResponse = {
  id: string;
};

export const createCommentForImage = async (image_id: string, text: string, x: number, y: number) => {
  const { data } = await nextMl.post<unknown, AxiosResponse<UpdateCommentResponse>>(`/images/${image_id}/comments`, {
    text,
    x,
    y,
  });
  return data;
};

export const updateCommentForImage = async (image_id: string, id: string, text: string, x: number, y: number) => {
  const { data } = await nextMl.put<unknown, AxiosResponse<UpdateCommentResponse>>(`/images/${image_id}/comments`, {
    id,
    text,
    x,
    y,
  });
  return data;
};
