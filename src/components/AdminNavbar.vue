<template>
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button">
          <i class="fas fa-bars"></i>
        </a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link to="/dashboard" class="nav-link">Home</router-link>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ms-auto">
      <li class="nav-item d-none d-sm-inline-block">
        <a href="#" class="dropdown-item text-danger" @click.prevent="logout">
              <i class="fas fa-sign-out-alt me-2"></i> Logout
            </a>
      </li>
    </ul>
  </nav>
</template>



<script setup>
import api from '../api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

async function logout() {
  const token = localStorage.getItem('token')

  try {
    
    await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Gagal logout!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
  }
}
</script>

