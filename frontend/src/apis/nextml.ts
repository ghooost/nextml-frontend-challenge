import axios from 'axios';

const baseURL = 'http://localhost:8000';

export const nextMl = axios.create({
  baseURL,
});

export const getStaticUrl = (path: string) => `${baseURL}/${path}`;
