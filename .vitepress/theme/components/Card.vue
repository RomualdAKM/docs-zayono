<template>
  <component
    :is="props.href ? 'a' : 'div'"
    :href="props.href"
    class="zd-card"
  >
    <div v-if="props.icon" class="zd-card-icon">{{ props.icon }}</div>
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

/**
 * Card — a clickable tile used on landing pages (home, SDKs overview,
 * Integrations overview) to surface one entry point per item.
 *
 * Props:
 *   title       — required headline.
 *   description — optional 1-2 line subline. Can also be passed via slot.
 *   href        — when set, the tile becomes an <a>. Internal links
 *                 like `/sdks/php` get client-side routing automatically
 *                 because VitePress hijacks <a> tags.
 *   icon        — single emoji or short string rendered in the rounded
 *                 square top-left badge.
 *   badge       — 'soon' | 'stable' | 'beta' → renders the status pill
 *                 at the bottom of the card. Optional.
 */
const props = defineProps<{
  title: string
  description?: string
  href?: string
  icon?: string
  badge?: 'soon' | 'stable' | 'beta'
}>()

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
