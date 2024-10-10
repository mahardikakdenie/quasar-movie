import { AxiosError, AxiosResponse } from 'axios';
import client from '../http-client';
import { MediaParams, MediaResponse } from '../interface/media-interface';

const endpoint: string = 'media';

/**
 * Uploads media (file) to the specified endpoint using FormData.
 *
 * This function takes in media parameters, a file, and callbacks for handling success and error responses.
 * It utilizes Axios to perform a POST request with a `multipart/form-data` content type, which is necessary for file uploads.
 *
 * @param {MediaParams} params - Additional media parameters to be included in the upload.
 * @param {File} file - The file object to be uploaded.
 * @param {(response: AxiosResponse<MediaResponse>) => void} callback - Callback function to handle a successful response.
 * @param {(error: AxiosError) => void} errCallback - Callback function to handle any errors during the upload process.
 *
 * @returns {void}
 */
export const uploadMedia = (
  params: MediaParams,
  callback: (response: AxiosResponse<MediaResponse>) => void,
  errCallback: (error: AxiosError) => void
): void => {
  const url: string = `${endpoint}/upload`;

  // Create FormData instance and append the file and other params
  const formData = new FormData();
  formData.append('image', params.media);

  // Perform Axios POST request with multipart/form-data header
  client
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse<MediaResponse>) => {
      callback(res);
    })
    .catch((e: AxiosError) => {
      errCallback(e);
    });
};
