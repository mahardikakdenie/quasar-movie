export interface MovieParams {
  entities?: string;
  limit?: string | number;
  device_name?: string; // Optional additional field, if needed
}

// Interface for the metadata of the response
export interface Meta {
  status: boolean;
  message: string;
  code: number;
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

// Interface for the pagination links
interface Links {
  next: string | null;
  prev: string | null;
  first: string;
  last: string;
}

// Interface for media data
export interface MediaData {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
}

// Interface for media object
interface Media {
  id: number;
  data: string; // Serialized JSON string containing MediaData
  created_at: string;
  updated_at: string;
}

// Interface for movie data
export interface Movie {
  id: number;
  title: string;
  publish: string;
  description: string;
  created_at: string;
  updated_at: string;
  media_id: number | null;
  media: Media | null;
  media_parse?: {
    id: number;
    data: { display_url: string };
    created_at: string;
    updated_at: string;
  };
}

// Interface for the entire API response
export interface MovieApiResponse {
  meta: Meta;
  links: Links;
  data: Movie[];
}

// Define the response type if the structure of the response is known
export interface MovieResponses {
  data: Movie;
  meta: {
    status: boolean;
  };
}

export interface MovieDTO {
  title: string;
  publish: string;
  description: string;
  media_id: number | string;
}
