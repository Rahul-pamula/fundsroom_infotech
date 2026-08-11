import axios from 'axios';
import { env } from '../config/env';
import { storage } from '../utils/storage';

export const http = axios.create({
  baseURL: env.apiBaseUrl,
});

http.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

