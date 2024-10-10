<template>
  <div class="row items-center justify-evenly">
    <div class="empty-movie-list">
      <h2 class="text-white">{{setLang('movie_empty', currLang)}}</h2>
      <div class="row justify-center">
        <q-btn
          :label="setLang('create_movie', currLang)"
          class="add-movie-btn"
          color="green"
          @click="addMovie"
          rounded
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { setLang } from 'src/libs/helper';
import { useRoute } from 'vue-router';
const route = useRoute();

const currLang = computed(() => {
  return route.params.lang as string | undefined; // Use a union type to specify possible values
});

const emit = defineEmits(['open-modal']);

const addMovie = () => {
  emit('open-modal');
};
</script>
