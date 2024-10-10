<template>
  <q-page class="q-pa-lg">

    <div v-if="movies.length > 0" class="row justify-end" style="margin-bottom: 15px">
      <q-btn color="primary" flat rounded @click="openModal">
        {{ setLang('create_movie', currLang) }}
        <q-icon name="add" style="font-size: 13px"></q-icon>
      </q-btn>
    </div>

    <div v-if="isLoading" class="row justify-center">
      <q-img :src="load" class="custom-gif"></q-img>
    </div>

    <!-- Grid layout for movie cards -->
    <div v-if="movies.length > 0 && !isLoading" class="movie-grid">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-card-container"
        style="cursor: pointer"
      >
        <div class="movie-card">
          <img
            v-if="
              movie.media_parse &&
              movie.media_parse.data &&
              movie.media_parse.data.display_url
            "
            :src="movie.media_parse.data.display_url"
            alt="Movie image"
            class="movie-img"
          />
          <img
            v-else
            src="https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75"
            alt="Movie image"
            class="movie-img"
          />
          <div class="movie-info">
            <div class="text-weight-bold row justify-between">
              <span class="text-white">
                {{ movie.title }}
              </span>
              <q-icon name="edit" style="font-size: 16px; cursor: pointer;" color="primary" @click="updateMovie(movie)">
                <q-tooltip> Edit Movie </q-tooltip>
              </q-icon>
            </div>
            <div class="text-white">{{ movie.publish }}</div>
          </div>
        </div>
      </div>
    </div>

    <EmptyText v-if="movies.length < 0 && !isLoading" @open-modal="openModal" />

    <!-- Pagination -->
    <div v-if="movies.length > 0" class="row justify-center" style="margin-top: 20px">
      <q-pagination
        v-if="meta.last_page > 1"
        v-model="page"
        :max="meta.last_page"
        :boundary-numbers="true"
        @update:model-value="onPageChange"
      />
    </div>
    <DialogComponent v-model:open="isModalOpen" :movie="currentMovie" @close="isModalOpen = false" @submit="submit" />
  </q-page>
</template>

<script lang="ts" setup>
import { AxiosError, AxiosResponse } from 'axios';
import load from 'src/assets/load.gif';
import {
  MovieApiResponse,
  Movie,
  Meta,
MovieDTO,
MovieResponses,
} from 'src/libs/interface/movie-interface';
import { ref, onMounted, computed } from 'vue';
import { getData, createMovies } from 'src/libs/api/movies';
import { setLang } from 'src/libs/helper';
import { useRoute } from 'vue-router';
import EmptyText from 'src/components/EmptyText.vue';
import DialogComponent from 'src/components/DialogComponent.vue';

// Define the type for a movie
// Movie data

const movies = ref<Movie[]>([]);
const currentMovie = ref<Movie | null>(null);
const meta = ref<Meta>({
  status: true,
  message: 'message.success',
  code: 200,
  total: 0,
  per_page: 0,
  current_page: 0,
  last_page: 0,
  from: 0,
  to: 0,
});

const route = useRoute();

const isModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false)

const currLang = computed<string | undefined>(() => route.params.lang as string | undefined);

const openModal = () => {
  isModalOpen.value = true;
};

const updateMovie = (movie: Movie) => {
  currentMovie.value = movie;
  isModalOpen.value = true;
}

const getMovie = () => {
  const params = {
    entities: 'media',
    limit: 10,
    page: page.value,
  };
  isLoading.value = true;
  const callback = (res: AxiosResponse<MovieApiResponse>) => {
    if (res?.data?.meta?.status) {
      movies.value = res?.data?.data.map((movie) => ({
        ...movie,
        media_parse: movie.media?.data ? JSON.parse(movie.media?.data) : null,
      }));
      
      meta.value = res?.data?.meta;
      isLoading.value = false;
    }
  };

  const err = (e: AxiosError) => console.log(e);

  getData(params, callback, err);
};

const submit = (data: MovieDTO, isEdit: boolean) => {
  const params: MovieDTO = {
    title: data?.title as string,
    publish: data?.publish as string, 
    description: data?.description as string,
    media_id: data?.media_id as (string | number),
  };

  if (isEdit) {
    
  } else {
    createMovie(params);
  }
};

const createMovie = (params: MovieDTO) => {
  const callback = (res: AxiosResponse<MovieResponses>): void => {
    console.log(res);
    const data = {
      ...res.data.data as unknown as Movie,
      media_parse: JSON.parse(res?.data?.data?.media?.data ?? ''),
    }

    movies.value.push(data);

    isModalOpen.value = false;
  };

  const err = (e: AxiosError) => {
    console.log(e);
  };

  createMovies(params, callback, err);
};

onMounted(() => {
  getMovie();
});

// Pagination data
const page = ref<number>(1);
// const totalPages = computed(() => Math.ceil(movies.value.length / 6)); // Assuming 6 movies per page

// Handle page change
const onPageChange = (newPage: number): void => {
  page.value = newPage;
  getMovie();
  // Here you would normally fetch the data for the new page
};
</script>

<style>
.q-page {
  background-color: #002e48;
  min-height: 100vh;
  padding-bottom: 30px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
}

.movie-card-container {
  display: flex;
  justify-content: center;
}

.movie-card {
  background-color: #09384f;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  max-width: 300px;
}

.movie-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  margin-top: 12px;
}

.text-grey {
  color: #b0bec5;
}

.q-btn {
  font-weight: bold;
  text-transform: none;
}

.q-icon {
  font-size: 1.5rem;
}

.custom-gif {
  width: 200px !important;
}
</style>
