<template>
  <q-page class="q-pa-lg">
    <BreadcrumbComponents title="Movies" />

    <div class="row justify-end" style="margin-bottom: 15px;">
      <q-btn color="primary" flat rounded>
        Buat Movie
        <q-icon name="add" style="font-size: 13px;"></q-icon>
      </q-btn>
    </div>

    <!-- Grid layout for movie cards -->
    <div class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card-container" style="cursor: pointer;">
        <div class="movie-card">
          <img v-if="movie.media_parse && movie.media_parse.data && movie.media_parse.data.display_url" :src="movie.media_parse.data.display_url" alt="Movie image" class="movie-img" />
          <img v-else src="https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75" alt="Movie image" class="movie-img" />
          <div class="movie-info">
            <div class="text-weight-bold row justify-between">
              <span>
                {{ movie.title }}
              </span>
              <q-icon name="edit" style="font-size: 16px;" color="primary">
                <q-tooltip>
                  Edit Movie
                </q-tooltip>
              </q-icon>
            </div>
            <div class="text-grey">{{ movie.publish }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="row justify-center" style="margin-top: 20px;">
      <q-pagination
        v-model="page"
        :max="meta.last_page"
        :boundary-numbers="true"
        @update:model-value="onPageChange"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { AxiosError, AxiosResponse } from 'axios';
import { MovieApiResponse, Movie, Meta } from 'src/libs/interface/movie-interface';
import { ref, onMounted } from 'vue';
import { getData } from 'src/libs/api/movies';
import BreadcrumbComponents from 'src/components/BreadcrumbComponents.vue';

// Define the type for a movie
// Movie data

const movies = ref<Movie[]>([]);
const meta = ref<Meta>({
  'status': true,
  'message': 'message.success',
  'code': 200,
  'total': 0,
  'per_page': 0,
  'current_page': 0,
  'last_page': 0,
  'from': 0,
  'to': 0
});

const getMovie = () => {
  const params = {
    entities: 'media',
    limit: 10,
    page: page.value,
  };
  const callback = (res: AxiosResponse<MovieApiResponse>) => {
    if (res?.data?.meta?.status) {
      movies.value = res?.data?.data.map(movie => ({
        ...movie,
        media_parse: movie.media?.data ? JSON.parse(movie.media?.data) : null,
      }));

      meta.value = res?.data?.meta;
    }
  };

  const err = (e:AxiosError) => console.log(e);

  getData(params, callback, err);
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

<style scoped>
.q-page {
  background-color: #002e48;
  min-height: 100vh;
  padding-bottom: 30px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
</style>
