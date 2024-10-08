import client from '../http-client';
import { AxiosResponse, AxiosError } from 'axios';
import { MovieParams, MovieApiResponse } from '../interface/movie-interface';

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
