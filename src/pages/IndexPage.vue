<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between" style="margin-bottom: 20px;">
      <div class="text-h6 text-white q-mb-md">
        Movies
        <q-icon name="add_circle_outline" size="sm" />
      </div>
      <div class="logout-btn">
        <!-- <q-btn flat color="white" size="sm" class="q-px-md q-py-xs">
          <span>Logout</span>
          <q-icon name="exit_to_app" class="q-ml-sm" />
        </q-btn> -->
        <q-btn flat color="white" rounded label="Logout" size="sm" icon="exit_to_app" />
      </div>
    </div>

    <!-- Grid layout for movie cards -->
    <div class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card-container">
        <div class="movie-card">
          <img :src="movie.image" alt="Movie image" class="movie-img" />
          <div class="movie-info">
            <div class="text-weight-bold">{{ movie.name }}</div>
            <div class="text-grey">{{ movie.year }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="row justify-center" style="margin-top: 20px;">
      <q-pagination
        v-model="page"
        :max="totalPages"
        :boundary-numbers="true"
        @update:model-value="onPageChange"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// Define the type for a movie
interface Movie {
  id: number;
  name: string;
  year: number;
  image: string;
}

// Movie data
const movies = ref<Movie[]>([
  {
    id: 1,
    name: 'Movie 1',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 2,
    name: 'Movie 2',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 3,
    name: 'Movie 3',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 4,
    name: 'Movie 4',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 5,
    name: 'Movie 5',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 6,
    name: 'Movie 6',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 7,
    name: 'Movie 6',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 8,
    name: 'Movie 6',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 9,
    name: 'Movie 6',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
  {
    id: 10,
    name: 'Movie 6',
    year: 2021,
    image:
      'https://next-ecommerve.vercel.app/_next/image?url=https%3A%2F%2Fi.ibb.co.com%2FD9DjPr9%2Ft-shirt-1.jpg&w=3840&q=75',
  },
]);

// Pagination data
const page = ref<number>(1);
const totalPages = computed(() => Math.ceil(movies.value.length / 6)); // Assuming 6 movies per page

// Handle page change
const onPageChange = (newPage: number): void => {
  page.value = newPage;
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
