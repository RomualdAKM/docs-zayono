<template>
  <table class="param-table">
    <thead>
      <tr>
        <th>Parametre</th>
        <th>Type</th>
        <th>Requis</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in params" :key="p.name">
        <td>
          <span :class="['param-name', { nested: p.nested }]">{{ p.name }}</span>
        </td>
        <td><span class="param-type">{{ p.type }}</span></td>
        <td>
          <span :class="['param-required', p.required ? 'yes' : 'no']">
            {{ p.required ? 'Requis' : 'Optionnel' }}
          </span>
        </td>
        <td>{{ p.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  params: Array<{
    name: string
    type: string
    required: boolean
    description: string
    nested?: boolean
  }>
}>()
</script>
