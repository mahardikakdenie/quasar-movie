<template>
    <q-dialog :model-value="open" persistent transition-show="flip-down" transition-hide="flip-up" full-width>
        <q-card>
            <q-bar class="" style="padding: 20px;">
                <div>Create Movie</div>

                <q-space />

                <q-btn dense flat icon="close" @click="$emit('close')">
                    <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>
            </q-bar>

            <q-card-section>
                <div>
                    <q-input class="custom-input" label="Title Movie" placeholder="Title Movie" v-model="title"></q-input>
                    <q-input class="custom-input" label="Publish Movie (Year)" placeholder="Publish Movie"
                        :rules="[validYearRule]" v-model="publish"></q-input>
                    <q-input class="custom-input" label="Description" placeholder="Description" type="textarea"
                        v-model="description"></q-input>
                    <q-file :model-value="files" :loading="isLoadingMedia" :disable="isLoadingMedia" label="Pick files" multiple style="margin-top: 50px;" @input="onInputFile" />
                </div>
            </q-card-section>

            <q-card-section class="row justify-end bg-gray">
                <q-btn label="Cancel" rounded flat color="red" @click="$emit('close')" />
                <q-btn label="Create" rounded flat color="gray" @click="handle" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadMedia } from 'src/libs/api/media';
import { AxiosError, AxiosResponse } from 'axios';
import {MediaResponse } from 'src/libs/interface/media-interface';

defineProps({
    open: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(['submit', 'close']);

const files = ref<File | null>(null);
const isLoadingMedia = ref<boolean>(false);

const title = ref<string>('');
const publish = ref<string>('');
const description = ref<string>('');

const validYearRule = (val: string) => {
    const yearRegex = /^(19|20)\d{2}$/;
    return yearRegex.test(val) || 'Please enter a valid year (e.g., 2024)';
};

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
    };

    const err = (e: AxiosError) => {
        console.error('Upload failed:', e);
    };

    // Assuming `MediaParams` can accept the file directly
    uploadMedia({ media: file }, callback, err);
};


const handle = (): void => {
    const form = {
        title: title.value,
        publish: publish.value,
        description: description.value,
        mediaId: mediaId.value,
    }
    emit('submit', form);
};
</script>
