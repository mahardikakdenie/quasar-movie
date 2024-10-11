<template>
  <q-layout>
    <q-page-container>
      <q-page class="login">
        <div class="border">
          <h3>Signin</h3>
          <div
            v-if="message"
            class="row justify-between"
            style="
              border: 1px solid #dddd;
              padding: 10px;
              border-radius: 10px;
              margin-bottom: 10px;
            "
          >
            <span style="color: white">
              {{ message }}
            </span>
            <div
              class="row items-center"
              @click="message = ''"
              style="cursor: pointer"
            >
              <q-icon name="close" style="font-size: 20px; color: white" />
            </div>
          </div>
          <q-form @submit.prevent="handleLogin">
            <div class="q-mb-md">
              <q-input
                rounded
                class="custom-input"
                outlined
                v-model="email"
                label="Email"
                input-style="border-color: red"
                type="email"
                placeholder="Masukan Email"
                required
              />
            </div>
            <div class="q-mb-md">
              <q-input
                rounded
                class="custom-input"
                outlined
                v-model="password"
                label="Password"
                type="password"
                placeholder="Masukan Password"
                required
              />
            </div>
            <div class="row justify-center my-3">
              <q-checkbox
                right-label
                v-model="left"
                label="Remember me"
                color="teal"
                class="custom-checkbox"
              />
            </div>
            <div style="width: 100%">
              <q-btn
                class="custom-btn"
                label="Login"
                :disable="isLoading"
                rounded
                @click="handleLogin"
              />
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { AxiosError, AxiosResponse } from 'axios';
import { login } from 'src/libs/api/auth';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const left = ref(false);
const message = ref('');
const isLoading = ref<boolean>(false);

const handleLogin = () => {
  // Implement your login logic here
  isLoading.value = true;
  const params = {
    email: email.value,
    password: password.value,
  };
  
  const callback = (
    res: AxiosResponse<{
      meta: { status: boolean; message: string };
      data: string;
    }>
  ) => {
    if (res?.data?.meta?.status) {
      isLoading.value = false;
      const token = res.data.data;
      
      localStorage.setItem('token', token);
      const lang = localStorage.getItem('currentLanguage') ?? 'en';
      
      // Redirect dan refresh halaman
      window.location.href = `/${lang}`;
    } else {
      message.value = res?.data?.meta?.message;
    }
  };
  const err = (e: AxiosError) => {
    isLoading.value = false;
    console.log(e);
  };

  login(params, callback, err);
};
</script>

<style lang="scss">
.login {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #224956; /* Latar belakang tetap */

  .border {
    padding: 30px;
    width: 600px;
    border-radius: 10px;
    background-color: transparent; /* Transparan */

    h3 {
      color: #fff; /* Warna teks lebih gelap untuk kontras */
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
  }
}

.custom-input {
  .q-field__control {
    border-color: white !important; /* Warna border putih */
    background-color: #224956; /* Latar belakang input transparan */
  }

  .q-input__inner {
    color: #333;
    padding: 10px;
  }

  .q-field__label {
    color: white; /* Warna label putih agar terlihat kontras */
  }

  .q-field__bottom {
    display: none; /* Menghilangkan garis bawah */
  }

  &:hover .q-field__control {
    border-color: #2ad17e; /* Warna border saat hover */
  }

  input {
    color: white !important;
  }
}

.custom-btn {
  width: 100%;
  padding: 13px;
  background-color: #2ad17e !important; /* Warna tombol hijau */
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;

  &:hover {
    background-color: #228b5b; /* Warna tombol saat hover */
  }
}

.custom-checkbox {
  .q-checkbox__label {
    color: white;
  }

  .q-checkbox__bg {
    border: 1px solid white !important;
  }
}
</style>
