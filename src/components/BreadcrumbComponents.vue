<template>
  <div class="row justify-between" style="
  background-color: #002e48; padding: 15px;">
    <div class="text-h6 text-white q-mb-md">
      {{ setLang(title) }}
      <q-icon name="add_circle_outline" size="sm" />
    </div>
    <div class="logout-btn row items-center">
      <div class="language-select">
        <q-select
          v-model="selectedLang"
          :options="languages"
          option-value="value"
          option-label="label"
          class="custom-select"
          dense
          filled
          style="width: 100px"
          @update:model-value="changeLanguage"
        />
      </div>
      <q-btn
        flat
        color="white"
        rounded
        :label="setLang('logout')"
        size="sm"
        icon="exit_to_app"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import langs from 'src/libs/languages.json'; // Adjust the path if necessary
import { useRoute, useRouter } from 'vue-router';

// Define the structure of your translations
type LanguageKey = 'en' | 'id'; // Define allowed language keys

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Assuming langs is of type Translations
const translations = langs as Translations;

defineProps({
  title: {
    type: String,
    default: 'Default Title',
  },
});

const selectedLang = ref<LanguageKey>('en'); // Set default language to 'en'
const languages = ref<Array<LanguageKey>>([
  'id',
  'en'
]);

const setLang = (text: string): string => {
  const currentLang: LanguageKey = (localStorage.getItem('currentLanguage') as LanguageKey) ?? 'en';
  
  console.log('🚀 ~ setLang ~ currentLang:', currentLang);
  
  // Use the typed structure to index safely
  const translation = translations[currentLang]?.[text];

  if (!translation) {
    console.warn('Warning: The requested translation for the key "' + text + '" is not available. Please ensure that all necessary translations are provided.');
  }

  
  return translation || text; // Return the original text if the translation is not found
};

const router = useRouter();
const route = useRoute();
const changeLanguage = (event: LanguageKey) => {
  console.log('Language changed to:', event);

  // Store the selected language in localStorage
  localStorage.setItem('currentLanguage', event);

  // Get the current path
  const currentPath = route.fullPath;

  // Create a regex to match the current language prefix
  const langRegex = /^\/(en|id)/;

  // Replace the current language with the selected language
  const newPath = currentPath.replace(langRegex, `/${event}`);

  // Navigate to the new path
  router.push(newPath);
};

onMounted(() => {
  const langFromStorage = localStorage.getItem('currentLanguage') as LanguageKey;
  selectedLang.value = langFromStorage || 'en'; // Use stored language or default to 'en'
});
</script>

<style lang="scss">
.custom-select {
  .q-field {
    &__inner {
      // border: 1px solid #ddd;
      border-radius: 15px;
      display: flex;
      justify-content: center;

      span, i {
        color: white;
      }
    }
  }
}
</style>
