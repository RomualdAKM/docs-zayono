import { defineConfig } from 'vitepress'

/**
 * Sidebar mirroring Moneroo's structure exactly. Keep groups minimal —
 * the merchant cares about Payments, Payouts, SDKs, and Integrations.
 * Dashboard-only concerns (aggregators, routing, customers, FX) are
 * not documented here; they're managed via app.zayono.com.
 */
function sidebarFr() {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'Authentification', link: '/introduction/authentification' },
        { text: 'Format des réponses', link: '/introduction/format-reponses' },
        { text: 'Erreurs', link: '/introduction/erreurs' },
        { text: 'Tests', link: '/introduction/tests' },
        { text: 'Webhooks', link: '/introduction/webhooks' },
      ],
    },
    {
      text: 'Paiements',
      items: [
        { text: 'Initialiser un paiement', link: '/paiements/initialiser' },
        { text: 'Intégration standard', link: '/paiements/integration-standard' },
        { text: 'Vérifier un paiement', link: '/paiements/verifier' },
        { text: 'Retrouver un paiement', link: '/paiements/retrouver' },
        { text: 'Statut', link: '/paiements/statut' },
        { text: 'Méthodes disponibles', link: '/paiements/methodes-disponibles' },
        { text: 'Tests', link: '/paiements/tests' },
      ],
    },
    {
      text: 'Transferts',
      items: [
        { text: 'Initialiser un transfert', link: '/transferts/initialiser' },
        { text: 'Vérifier un transfert', link: '/transferts/verifier' },
        { text: 'Récupérer un transfert', link: '/transferts/recuperer' },
        { text: 'Statut', link: '/transferts/statut' },
        { text: 'Méthodes disponibles', link: '/transferts/methodes-disponibles' },
        { text: 'Tests', link: '/transferts/tests' },
      ],
    },
    {
      text: 'SDKs',
      items: [
        { text: 'Vue d\'ensemble', link: '/sdks/' },
        { text: 'PHP', link: '/sdks/php' },
        { text: 'Node.js', link: '/sdks/node' },
        { text: 'Python', link: '/sdks/python' },
        { text: 'Laravel', link: '/sdks/laravel' },
      ],
    },
    {
      text: 'Intégrations',
      items: [
        { text: 'Vue d\'ensemble', link: '/integrations/' },
        { text: 'WooCommerce', link: '/integrations/woocommerce' },
      ],
    },
  ]
}

function sidebarEn() {
  const t: Record<string, string> = {
    'Introduction': 'Introduction',
    'Authentification': 'Authentication',
    'Format des réponses': 'Response format',
    'Erreurs': 'Errors',
    'Tests': 'Testing',
    'Webhooks': 'Webhooks',
    'Paiements': 'Payments',
    'Initialiser un paiement': 'Initialize a payment',
    'Intégration standard': 'Standard integration',
    'Vérifier un paiement': 'Verify a payment',
    'Retrouver un paiement': 'Retrieve a payment',
    'Statut': 'Status',
    'Méthodes disponibles': 'Available methods',
    'Transferts': 'Payouts',
    'Initialiser un transfert': 'Initialize a payout',
    'Vérifier un transfert': 'Verify a payout',
    'Récupérer un transfert': 'Retrieve a payout',
    'SDKs': 'SDKs',
    'Vue d\'ensemble': 'Overview',
    'PHP': 'PHP',
    'Node.js': 'Node.js',
    'Python': 'Python',
    'Laravel': 'Laravel',
    'Intégrations': 'Integrations',
    'WooCommerce': 'WooCommerce',
  }

  return sidebarFr().map((group: any) => ({
    text: t[group.text] ?? group.text,
    items: group.items.map((item: any) => ({
      text: t[item.text] ?? item.text,
      link: '/en' + item.link,
    })),
  }))
}

export default defineConfig({
  lang: 'fr-FR',
  title: 'Zayono Docs',
  description: 'Documentation officielle de l\'API Zayono — Plateforme d\'agrégation de paiements Mobile Money en Afrique.',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Zayono Docs' }],
    ['meta', { property: 'og:description', content: 'Acceptez Mobile Money et cartes en Afrique avec une seule intégration. SDK PHP, Node.js, Python.' }],
    ['meta', { property: 'og:url', content: 'https://docs.zayono.com' }],
    ['meta', { name: 'theme-color', content: '#2563EB' }],
  ],

  themeConfig: {
    logo: { src: '/logo.svg', width: 28, height: 28 },
    siteTitle: 'Zayono',

    nav: [
      { text: 'Introduction', link: '/introduction/authentification' },
      { text: 'Paiements', link: '/paiements/initialiser' },
      { text: 'Transferts', link: '/transferts/initialiser' },
      { text: 'SDKs', link: '/sdks/' },
      { text: 'Intégrations', link: '/integrations/' },
      { text: 'Dashboard', link: 'https://app.zayono.com' },
    ],

    sidebar: sidebarFr(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zayono' },
    ],

    outline: {
      level: [2, 3],
      label: 'Sur cette page',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
          modal: {
            noResultsText: 'Aucun résultat pour',
            resetButtonTitle: 'Effacer la recherche',
            footer: { selectText: 'Sélectionner', navigateText: 'Naviguer', closeText: 'Fermer' },
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/zayono/zayono-docs/edit/main/:path',
      text: 'Suggérer une amélioration',
    },

    footer: {
      message: 'Documentation officielle de l\'API Zayono',
      copyright: '© 2026 Zayono. Tous droits réservés.',
    },

    docFooter: {
      prev: 'Page précédente',
      next: 'Page suivante',
    },

    lastUpdated: {
      text: 'Dernière mise à jour',
      formatOptions: { dateStyle: 'medium' },
    },

    returnToTopLabel: 'Retour en haut',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Thème',
    lightModeSwitchTitle: 'Passer en mode clair',
    darkModeSwitchTitle: 'Passer en mode sombre',
  },

  locales: {
    root: {
      label: 'Français',
      lang: 'fr-FR',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Zayono Docs',
      description: 'Official Zayono API documentation — Mobile Money payment aggregation across Africa.',
      themeConfig: {
        nav: [
          { text: 'Introduction', link: '/en/introduction/authentification' },
          { text: 'Payments', link: '/en/paiements/initialiser' },
          { text: 'Payouts', link: '/en/transferts/initialiser' },
          { text: 'SDKs', link: '/en/sdks/' },
          { text: 'Integrations', link: '/en/integrations/' },
          { text: 'Dashboard', link: 'https://app.zayono.com' },
        ],
        sidebar: sidebarEn(),
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        editLink: {
          pattern: 'https://github.com/zayono/zayono-docs/edit/main/:path',
          text: 'Suggest an improvement',
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: { dateStyle: 'medium' },
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Reset search',
                footer: { selectText: 'Select', navigateText: 'Navigate', closeText: 'Close' },
              },
            },
          },
        },
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        footer: {
          message: 'Official Zayono API documentation',
          copyright: '© 2026 Zayono. All rights reserved.',
        },
      },
    },
  },
})
