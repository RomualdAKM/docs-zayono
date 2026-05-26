<template>
  <component
    :is="props.href ? 'a' : 'div'"
    :href="props.href"
    class="zd-card"
  >
    <div v-if="props.icon" class="zd-card-icon">
      <img v-if="iconIsPath" :src="props.icon" :alt="props.title" />
      <span v-else>{{ props.icon }}</span>
    </div>
    <div class="zd-card-title">{{ props.title }}</div>
    <div v-if="$slots.default || props.description" class="zd-card-desc">
      <slot>{{ props.description }}</slot>
    </div>
    <span v-if="props.badge" class="zd-card-badge" :class="`zd-badge-${props.badge}`">
      {{ badgeLabel }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description?: string
  href?: string
  icon?: string
  badge?: 'soon' | 'stable' | 'beta'
}>()

const iconIsPath = computed(() => !!props.icon && props.icon.startsWith('/'))

const badgeLabel = computed(() => {
  if (!props.badge) return ''
  const labels: Record<string, string> = {
    soon: 'Bientôt',
    stable: 'Stable',
    beta: 'Beta',
  }
  return labels[props.badge] ?? props.badge
})
</script>
