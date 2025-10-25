<template>
  <div class="wrapper">
    <AdminNavbar />
    <AdminSidebar />
    <AdminContent :title="pageTitle">
      <router-view />
    </AdminContent>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminNavbar from '../components/AdminNavbar.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import AdminContent from '../components/AdminContent.vue'

// otomatis menampilkan nama route sebagai title
const route = useRoute()
const pageTitle = computed(() => route.name || 'Dashboard')
</script>
