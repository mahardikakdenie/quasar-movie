<template>
  <q-dialog
    :model-value="open"
    persistent
    transition-show="flip-down"
    transition-hide="flip-up"
    full-width
  >
    <q-card>
      <q-bar style="padding: 20px">
        <div>{{ labelModal }}</div>
        <q-space />
        <q-btn dense flat icon="close" @click="$emit('close')">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div>
          <q-input
            class="custom-input"
            :label="setLang('title')"
            :placeholder="setLang('title')"
            :rules="[validateInput]"
            v-model="title"
          />
          <q-input
            class="custom-input"
            :label="setLang('publish')"
            :placeholder="setLang('publish')"
            :rules="[validYearRule]"
            v-model="publish"
          />
          <q-input
            class="custom-input"
            :label="setLang('description')"
            :placeholder="setLang('description')"
            type="textarea"
            :rules="[validateInput]"
            v-model="description"
          />

          <q-file
            v-if="!mediaURL"
            :model-value="files"
            :loading="isLoadingMedia"
            :disable="isLoadingMedia"
            :label="setLang('files')"
            multiple
            style="margin-top: 50px"
            @input="onInputFile"
          />

          <div v-else>
            <div class="row justify-center">
              <q-img
                :src="mediaURL"
                style="width: 100px; margin-top: 30px; border-radius: 8px"
              />
            </div>
            <div
              class="row justify-center"
              style="margin-top: 10px; border-radius: 8px"
            >
              <q-btn
                label="Hapus Media"
                color="primary"
                outline
                @click="mediaURL = ''"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row justify-end bg-gray">
        <q-btn
          :label="setLang('cancel')"
          rounded
          flat
          color="red"
          @click="$emit('close')"
        />
        <q-btn
          :label="labelModal"
          :disable="isBtnDisabled"
          rounded
          flat
          color="gray"
          @click="handle"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, PropType } from 'vue';
import { uploadMedia } from 'src/libs/api/media';
import { AxiosError, AxiosResponse } from 'axios';
import { MediaResponse } from 'src/libs/interface/media-interface';
import { Movie } from 'src/libs/interface/movie-interface';
import langs from 'src/libs/languages.json'; // Adjust the path if necessary

// Define props
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  movie: {
    type: Object as PropType<Movie | null>,
    default: null,
  },
  type: {
    type: String,
    default: '',
  },
});

// Define the structure of your translations
type LanguageKey = 'en' | 'id'; // Define allowed language keys

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Assuming langs is of type Translations
const translations = langs as unknown as Translations;

// Define emits
const emit = defineEmits(['submit', 'close']);

// Reactive references
const files = ref<File | null>(null);
const isLoadingMedia = ref<boolean>(false);
const title = ref<string>('');
const publish = ref<string>('');
const description = ref<string>('');
const mediaURL = ref<string>('');
const mediaId = ref<string | number>(0);

// Validation rule for year input
const validYearRule = (val: string) => {
  const yearRegex = /^(19|20)\d{2}$/;
  return yearRegex.test(val) || setLang('validate_publish');
};

const validateInput = (val: string): boolean | string => {
  return val !== null && val !== '' ? true : setLang('validate_input');
};


// Button disable state
const isBtnDisabled = computed(
  () =>
    isLoadingMedia.value ||
    !title.value ||
    !description.value ||
    !publish.value ||
    !mediaURL.value ||
    !mediaId.value
);

const labelModal = computed<string>(() => props.type === 'create' ? setLang('create_movie') : setLang('update_novie') );

const setLang = (text: string): string => {
  const currentLang: LanguageKey =
    (localStorage.getItem('currentLanguage') as LanguageKey) ?? 'en';

  // Use the typed structure to index safely
  const translation = translations[currentLang]?.[text];

  if (!translation) {
    console.warn(
      'Warning: The requested translation for the key "' +
        text +
        '" is not available. Please ensure that all necessary translations are provided.'
    );
  }

  return translation || text; // Return the original text if the translation is not found
};

// Handle file input
const onInputFile = (event: Event) => {
  isLoadingMedia.value = true;
  const target = event.target as HTMLInputElement;
  const dataFiles = target.files;

  if (!dataFiles || dataFiles.length === 0) {
    console.error('No file selected.');
    return;
  }

  const file = dataFiles[0];
  files.value = file;

  const callback = (res: AxiosResponse<MediaResponse>) => {
    isLoadingMedia.value = false;
    const data = res?.data?.data;
    mediaId.value = data.id;
    mediaURL.value = JSON.parse(data.data).data.display_url;
  };

  const err = (e: AxiosError) => {
    console.error('Upload failed:', e);
    isLoadingMedia.value = false;
  };

  uploadMedia({ media: file }, callback, err);
};

// Watch for prop changes
watch(
  () => props.open,
  () => {
    if (props.movie) {
      title.value = props.movie.title;
      description.value = props.movie.description;
      publish.value = props.movie.publish;
      mediaURL.value = props.movie.media_parse?.data.display_url ?? '';
      mediaId.value = props.movie.media_id ?? 0;
    } else {
      // Reset values when the dialog is closed
      title.value = '';
      publish.value = '';
      description.value = '';
      mediaURL.value = '';
      mediaId.value = 0;
      files.value = null;
    }
  }
);

// Handle form submission
const handle = (): void => {
  const form = {
    title: title.value,
    publish: publish.value,
    description: description.value,
    media_id: mediaId.value,
  };
  emit(
    'submit',
    form,
    !!props.movie && props.type === 'update',
    props.movie?.id,
    mediaURL.value
  );
};
</script>
