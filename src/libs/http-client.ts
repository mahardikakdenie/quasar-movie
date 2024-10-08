import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const url: string | null | undefined =
  process.env.QUASAR_API_BASE_URL ?? 'http://api.movie.test/api';
console.log(
  'process.env.VUE_API_BASE_URL -> ',
  process.env.QUASAR_API_BASE_URL
);

const token: string | null = localStorage.getItem('token');

// Response handler global
const globalResponseHandler = (response: AxiosResponse): AxiosResponse =>
  response;

// Error handler global
const globalErrorHandler = (error: AxiosError): Promise<never> => {
  const status = error.response?.status;
  const isTokenExpired = status === 401;

  if (isTokenExpired) {
    // Menghapus token dari localStorage jika token sudah kadaluarsa
    localStorage.removeItem('token');
    localStorage.removeItem('oo_token');

    // Memastikan originalRequest ada sebelum mengakses headers
    const originalRequest: AxiosRequestConfig | undefined = error.config;

    if (originalRequest && originalRequest.headers) {
      delete originalRequest.headers.Authorization;
    }

    // Redirect ke halaman login atau halaman utama
    window.location.href = '/';
  }

  return Promise.reject(error);
};

// Membuat instance client Axios
const client = axios.create({
  baseURL: url,
  headers: {
    Authorization: token ? `Bearer ${token}` : '', // Memastikan token ada sebelum menambahkan Bearer
  },
});

// Menambahkan interceptor untuk response
client.interceptors.response.use(globalResponseHandler, globalErrorHandler);

export default client;
