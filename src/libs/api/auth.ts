import client from '../http-client';
import { AxiosResponse, AxiosError } from 'axios';

// Define the type for `params` based on the parameters required for login
export interface LoginParams {
  email: string;
  password: string;
  device_name?: string; // Optional additional field, if needed
}

// Define the response type if the structure of the response is known
export interface LoginResponse {
  data: string;
  meta: {
    status: boolean;
  };
}

const endpoint: string = 'auth';

// Login function converted to TypeScript without using `any`
export const login = (
  params: LoginParams, // More specific type for `params`
  callback: (
    response: AxiosResponse<{
      meta: { status: boolean; message: string };
      data: string;
    }>
  ) => void, // Using `AxiosResponse` with type `LoginResponse`
  errCallback: (error: AxiosError) => void // Using `AxiosError` for error handling
): void => {
  const url: string = `${endpoint}/login`;

  client
    .post<LoginResponse>(url, params)
    .then((res: AxiosResponse) => {
      callback(res); // Call the callback with a response of type `AxiosResponse<LoginResponse>`
    })
    .catch((e: AxiosError) => {
      errCallback(e); // Call the error callback with an error of type `AxiosError`
    });
};
