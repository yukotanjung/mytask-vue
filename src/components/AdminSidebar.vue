<style scoped>
.nav-link.active {
  background-color: #007bff !important;
  color: #fff !important;
}
.nav-link.active i {
  color: #fff !important;
}
</style>

<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="#" class="brand-link">
      <span class="brand-text font-weight-light">My Task</span>
    </a>

    <div class="sidebar">
      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
        >
          <!-- Dashboard -->
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              :class="{ active: isActive('/') }"
            >
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>Dashboard</p>
            </router-link>
          </li>

          <!-- Tasks -->
          <li v-if="can('task_read')" class="nav-item">
            <router-link
              to="/tasks"
              class="nav-link"
              :class="{ active: isActive('/tasks') }"
            >
              <i class="nav-icon fas fa-tasks"></i>
              <p>Tasks</p>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'



const route = useRoute()
const { can } = useAuth()

const isActive = (path) => {
  return route.path === path
}
</script>
