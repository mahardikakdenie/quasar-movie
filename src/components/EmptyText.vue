<template>
  <div class="row items-center justify-evenly">
    <div class="empty-movie-list">
      <h2>Your movie list is empty</h2>
      <q-btn
        label="Add a new movie"
        class="add-movie-btn"
        color="green"
        @click="addMovie"
        rounded
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const addMovie = () => {
  // Implement the logic for adding a new movie
  console.log('Add a new movie clicked');
};
</script>
