<template>
  <q-dialog
    :model-value="open"
    persistent
    transition-show="flip-down"
    transition-hide="flip-up"
    full-width
  >
    <q-card>
      <q-bar class="" style="padding: 20px">
        <div>Create Movie</div>

        <q-space />

        <q-btn dense flat icon="close" @click="$emit('close')">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div>
          <q-input
            class="custom-input"
            label="Title Movie"
            placeholder="Title Movie"
            v-model="title"
          />
          <q-input
            class="custom-input"
            label="Publish Movie (Year)"
            placeholder="Publish Movie"
            :rules="[validYearRule]"
            v-model="publish"
          />
          <q-input
            class="custom-input"
            label="Description"
            placeholder="Description"
            type="textarea"
            v-model="description"
          />
          <q-file
            v-if="!mediaURL"
            :model-value="files"
            :loading="isLoadingMedia"
            :disable="isLoadingMedia"
            label="Pick files"
            multiple
            style="margin-top: 50px"
            @input="onInputFile"
          />
          <div v-else>
            <div class="row justify-center">
              <q-img
                :src="mediaURL"
                style="width: 100px; margin-top: 30px; border-radius: 8px"
              ></q-img>
            </div>
            <div
              class="row justify-center"
              style="margin-top: 10px; border-radius: 8px"
            >
              <q-btn label="Hapus Media" color="primary" outline @click="mediaURL = ''" />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row justify-end bg-gray">
        <q-btn
          label="Cancel"
          rounded
          flat
          color="red"
          @click="$emit('close')"
        />
        <q-btn label="Create" :disable="isBtnDisabled" rounded flat color="gray" @click="handle" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, PropType, computed } from 'vue';
import { uploadMedia } from 'src/libs/api/media';
import { AxiosError, AxiosResponse } from 'axios';
import { MediaResponse } from 'src/libs/interface/media-interface';
import { Movie } from 'src/libs/interface/movie-interface';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  movie: {
    type: Object as PropType<Movie | null>,
    default: null,
  },
});

const emit = defineEmits(['submit', 'close']);

const files = ref<File | null>(null);
const isLoadingMedia = ref<boolean>(false);

const title = ref<string>('');
const publish = ref<string>('');
const description = ref<string>('');
const mediaURL = ref<string>('');

const validYearRule = (val: string) => {
  const yearRegex = /^(19|20)\d{2}$/;
  return yearRegex.test(val) || 'Please enter a valid year (e.g., 2024)';
};

const isBtnDisabled = computed(() => isLoadingMedia.value);

const mediaId = ref<string | number>(0);

const onInputFile = (event: Event) => {
  isLoadingMedia.value = true;
  const target = event.target as HTMLInputElement;
  const dataFiles = target.files; // This gets the FileList from the input event

  if (!dataFiles || dataFiles.length === 0) {
    console.error('No file selected.');
    return;
  }

  const file = dataFiles[0]; // Get the first file from the FileList
  files.value = file;

  const callback = (res: AxiosResponse<MediaResponse>) => {
    isLoadingMedia.value = false;
    const data = res?.data?.data;
    mediaId.value = data.id;
    mediaURL.value = JSON.parse(data.data).data.display_url;
    console.log('🚀 ~ callback ~ mediaURL.value:', mediaURL.value)
  };

  const err = (e: AxiosError) => {
    console.error('Upload failed:', e);
  };

  // Assuming `MediaParams` can accept the file directly
  uploadMedia({ media: file }, callback, err);
};

const isEdit = computed<boolean>(() => props.movie ? true : false);

watch(
  () => props.open,
  () => {
    if (props.movie) {
      title.value = props.movie.title;
      description.value = props.movie.description;
      publish.value = props.movie.publish;
      mediaURL.value = props.movie.media_parse?.data.display_url ?? '';
      mediaId.value = props.movie.media_id ?? 0;
    }
  }
);

const handle = (): void => {
  const form = {
    title: title.value,
    publish: publish.value,
    description: description.value,
    media_id: mediaId.value,
  };
  emit('submit', form, isEdit.value, props.movie?.id, mediaURL.value);

  title.value = '';
  publish.value = '';
  description.value = '';
  mediaId.value = 0;
  files.value = null;
};
</script>
