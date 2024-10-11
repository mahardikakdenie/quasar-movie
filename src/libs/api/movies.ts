import client from '../http-client';
import { AxiosResponse, AxiosError } from 'axios';
import {
  MovieParams,
  MovieApiResponse,
  MovieDTO,
  MovieResponses,
} from '../interface/movie-interface';

const endpoint: string = 'movie';

// Login function converted to TypeScript without using `any`
export const getData = (
  params: MovieParams, // More specific type for `params`
  callback: (response: AxiosResponse<MovieApiResponse>) => void,
  errCallback: (error: AxiosError) => void
): void => {
  client
    .get<MovieApiResponse>(endpoint, { params })
    .then((res: AxiosResponse) => {
      callback(res);
    })
    .catch((e: AxiosError) => {
      errCallback(e);
    });
};

export const createMovies = (
  params: MovieDTO,
  callback: (response: AxiosResponse<MovieResponses>) => void,
  errCallback: (error: AxiosError) => void
): void => {
  client
    .post(endpoint, params)
    .then((res: AxiosResponse) => {
      callback(res);
    })
    .catch((e: AxiosError) => {
      errCallback(e);
    });
};

export const updateMovies = (
  id: string | number,
  params: MovieDTO,
  callback: (response: AxiosResponse<MovieResponses>) => void,
  errCallback: (error: AxiosError) => void
): void => {
  client
    .put(`${endpoint}/${id}`, params)
    .then((res: AxiosResponse) => {
      callback(res);
    })
    .catch((e: AxiosError) => {
      errCallback(e);
    });
};
