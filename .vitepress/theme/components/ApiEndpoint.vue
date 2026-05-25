<template>
  <div class="api-endpoint">
    <span :class="['api-method', method.toLowerCase()]">{{ method }}</span>
    <span class="api-path">{{ path }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  method: string
  path: string
}>()
</script>
