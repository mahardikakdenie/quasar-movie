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

    <div v-if="movies.length > 0 && !isLoading" class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card-container" style="cursor: pointer">
        <div class="movie-card">
          <img
            v-if="movie.media_parse?.data?.display_url"
            :src="movie.media_parse.data.display_url"
            alt="Movie image"
            class="movie-img"
          />
          <img
            v-else
            src="https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75"
            alt="Default Movie image"
            class="movie-img"
          />
          <div class="movie-info">
            <div class="text-weight-bold row justify-between">
              <span class="text-white">{{ movie.title }}</span>
              <q-icon name="edit" style="font-size: 16px; cursor: pointer;" color="primary" @click="updateMovie(movie)">
                <q-tooltip>Edit Movie</q-tooltip>
              </q-icon>
            </div>
            <div class="text-white">{{ movie.publish }}</div>
          </div>
        </div>
      </div>
    </div>

    <EmptyText v-if="movies.length === 0 && !isLoading" @open-modal="openModal" />

    <div v-if="movies.length > 0" class="row justify-center" style="margin-top: 20px">
      <q-pagination
        v-if="meta.last_page > 1"
        v-model="page"
        :max="meta.last_page"
        :boundary-numbers="true"
        @update:model-value="onPageChange"
      />
    </div>

    <DialogComponent v-model:open="isModalOpen" :type="modalType" :movie="currentMovie" @close="isModalOpen = false" @submit="submit" />
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { AxiosError, AxiosResponse } from 'axios';
import load from 'src/assets/load.gif';
import { getData, createMovies, updateMovies } from 'src/libs/api/movies';
import { setLang } from 'src/libs/helper';
import {
  MovieApiResponse,
  Movie,
  Meta,
  MovieDTO,
  MovieResponses,
} from 'src/libs/interface/movie-interface';
import EmptyText from 'src/components/EmptyText.vue';
import DialogComponent from 'src/components/DialogComponent.vue';

const movies = ref<Movie[]>([]);
const currentMovie = ref<Movie | null>(null);
const meta = ref<Meta>({ status: true, message: 'message.success', code: 200, total: 0, per_page: 0, current_page: 0, last_page: 0, from: 0, to: 0 });

const route = useRoute();
const isModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const page = ref<number>(1);
const modalType = ref<'create' | 'update'>('create');

const currLang = computed(() => route.params.lang as string | undefined);

const openModal = () => {
  isModalOpen.value = true;
  modalType.value = 'create';
};

const updateMovie = (movie: Movie) => {
  currentMovie.value = movie;
  isModalOpen.value = true;
  modalType.value = 'update';
};

const getMovie = () => {
  isLoading.value = true;
  const params = { entities: 'media', limit: 10, page: page.value };
  
  getData(params, (res: AxiosResponse<MovieApiResponse>) => {
    if (res?.data?.meta?.status) {
      movies.value = res.data.data.map(movie => ({
        ...movie,
        media_parse: movie.media?.data ? JSON.parse(movie.media.data) : null,
      }));
      meta.value = res.data.meta;
    }
    isLoading.value = false;
  }, (e: AxiosError) => console.log(e));
};

const submit = (data: MovieDTO, isEdit: boolean, movieId: (number | string), mediaURL: string) => {
  const params: MovieDTO = {
    title: data.title as string,
    publish: data.publish as string,
    description: data.description as string,
    media_id: data.media_id as (string | number),
  };

  isEdit ? updateMovieData(movieId, params, mediaURL) : createMovie(params);
};

const createMovie = (params: MovieDTO) => {
  createMovies(params, (res: AxiosResponse<MovieResponses>) => {
    movies.value.push({
      ...res.data.data,
      media_parse: JSON.parse(res.data.data.media?.data ?? ''),
    });
    isModalOpen.value = false;
  }, (e: AxiosError) => console.log(e));
};

const updateMovieData = (id: (string | number), params: MovieDTO, mediaURL: string) => {
  updateMovies(id, params, (res: AxiosResponse<MovieResponses>) => {
    const index = movies.value.findIndex(movie => movie.id === id);
    if (index !== -1) {
      movies.value[index] = {
        ...res.data.data,
        media_parse: JSON.parse(res.data.data.media?.data ?? ''),
      };
      movies.value[index].media_parse.data.display_url = mediaURL ?? '';
    }
    isModalOpen.value = false;
  }, (e: AxiosError) => console.log(e));
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  getMovie();
};

onMounted(getMovie);
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
