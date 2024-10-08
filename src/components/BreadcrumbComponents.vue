<template>
  <div class="row justify-between" style="margin-bottom: 20px">
    <div class="text-h6 text-white q-mb-md">
      {{ title }}
      <q-icon name="add_circle_outline" size="sm" />
    </div>
    <div class="logout-btn row items-center">
      <div class="language-select">
        <q-select
          v-model="selectedLang"
          :options="languages"
          filled
          bg-color="white"
          dense
          style="width: 200px"
          @update:model-value="changeLanguage"
        />
      </div>
      <q-btn
        flat
        color="white"
        rounded
        label="Logout"
        size="sm"
        icon="exit_to_app"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
defineProps({
  title: {
    type: String,
    default: 'Default Title',
  },
});

const selectedLang = ref<string>('English');
const languages = ref<Array<{ label: string; value: string }>>([
  { label: 'English', value: 'en' },
  { label: 'Indonesia', value: 'id' },
]);

const changeLanguage = (event: { label: string; value: string }) => {
  console.log(event);
  localStorage.setItem('currentLanguage', event?.value);
};
</script>
