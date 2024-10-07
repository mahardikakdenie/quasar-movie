<template>
    <q-layout>
      <q-page-container>
        <q-page class="login">
          <div class="border">
            <h3>Signin</h3>
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
                <q-checkbox right-label v-model="left" label="Remember me" color="teal" class="custom-checkbox" />
            </div>
              <div style="width: 100%">
                <q-btn
                  class="custom-btn"
                  label="Login"
                  type="submit"
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
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  const left = ref(false);
  
  const handleLogin = () => {
    // Implement your login logic here
    console.log('Email:', email.value);
    console.log('Password:', password.value);
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
