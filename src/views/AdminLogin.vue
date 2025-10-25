<template>
  <div class="hold-transition login-page" style="height: 100vh;">
    <div class="login-box">
      <div class="login-logo">
        <b>MyApp</b> Admin
      </div>

      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">Silakan masuk untuk melanjutkan</p>

          <form @submit.prevent="handleLogin">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Email"
                v-model="email"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-user"></span>
                </div>
              </div>
            </div>

            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="password"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>

            <div class="row">
              

              <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block">
                  Login
                </button>
              </div>
            </div>
          </form>

          <p v-if="errorMessage" class="text-danger mt-3 text-center">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '../composables/useAuth'
const { setUser } = useAuth()


const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)


// Fungsi login sederhana (mock)
async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/login', {
      email: email.value,
      password: password.value
    })

    if (res.data.success) {

      const { _id, name, email, token, abilities } = res.data.data

      const user = { id: _id, name, email, abilities }

      
      localStorage.setItem('token', token)
      setUser(user)

      router.push('/')
    } else {
      errorMessage.value = res.data.message || 'Incorrect email or password'
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage.value = err.response.data.message
    } else {
      errorMessage.value = 'Something wrong. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>
