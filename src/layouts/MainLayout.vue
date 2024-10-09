<template>
  <q-layout view="lHh Lpr lFf">
    <BreadcrumbComponents title="movies" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BreadcrumbComponents from 'src/components/BreadcrumbComponents.vue';
export default defineComponent({
  name: 'MainLayout',
  components: {
    BreadcrumbComponents,
  },
  setup () {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };
  }
});
</script>
