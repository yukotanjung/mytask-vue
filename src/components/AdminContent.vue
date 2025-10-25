<template>
  <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <h1>{{ title }}</h1>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <slot></slot>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
})
</script>
