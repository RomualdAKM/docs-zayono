import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ApiEndpoint from './components/ApiEndpoint.vue'
import ParamTable from './components/ParamTable.vue'
import Card from './components/Card.vue'
import Cards from './components/Cards.vue'
import './custom.css'

/**
 * Global components made available inside every markdown file without
 * needing per-page imports. Pattern matches Stripe/Mintlify-style docs
 * where authors compose pages from a small set of reusable primitives.
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ApiEndpoint', ApiEndpoint)
    app.component('ParamTable', ParamTable)
    app.component('Card', Card)
    app.component('Cards', Cards)
  },
} satisfies Theme
