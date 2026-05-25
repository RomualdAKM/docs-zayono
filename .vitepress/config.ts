import { defineConfig } from 'vitepress'

/**
 * Sidebar groups are shared between the / and /en/ locales — the labels
 * change, the link paths get the `/en` prefix for English. Keeping the
 * declarative shape in helpers avoids drift between the two trees.
 */
function sidebarFr() {
  return [
    {
      text: 'Commencer',
      items: [
        { text: 'Bienvenue', link: '/guide/introduction' },
        { text: 'Démarrage rapide', link: '/guide/demarrage-rapide' },
        { text: 'Authentification', link: '/guide/authentification' },
        { text: 'Applications', link: '/guide/applications' },
        { text: 'Environnements', link: '/guide/environnements' },
        { text: 'Format des réponses', link: '/guide/format-reponses' },
        { text: 'Gestion des erreurs', link: '/guide/gestion-erreurs' },
        { text: 'Idempotence', link: '/guide/idempotence' },
        { text: 'Limites de débit', link: '/guide/limites-debit' },
        { text: 'Réglages par application', link: '/guide/reglages' },
      ],
    },
    {
      text: 'Paiements',
      items: [
        { text: 'Introduction', link: '/paiements/introduction' },
        { text: 'Initialiser un paiement', link: '/paiements/initialiser' },
        { text: 'Vérifier un paiement', link: '/paiements/verifier' },
        { text: 'Récupérer un paiement', link: '/paiements/recuperer' },
        { text: 'Statuts de paiement', link: '/paiements/statuts' },
        { text: 'Numéros de test', link: '/paiements/testing' },
      ],
    },
    {
      text: 'Transferts',
      items: [
        { text: 'Introduction', link: '/transferts/introduction' },
        { text: 'Initialiser un transfert', link: '/transferts/initialiser' },
        { text: 'Vérifier un transfert', link: '/transferts/verifier' },
        { text: 'Récupérer un transfert', link: '/transferts/recuperer' },
        { text: 'Méthodes disponibles', link: '/transferts/methodes-disponibles' },
        { text: 'Testing', link: '/transferts/testing' },
      ],
    },
    {
      text: 'Checkout',
      items: [
        { text: 'Page hébergée', link: '/checkout/introduction' },
        { text: 'Personnalisation', link: '/checkout/personnalisation' },
        { text: 'Templates (Abidjan / Cotonou / Default)', link: '/checkout/templates' },
      ],
    },
    {
      text: 'Webhooks',
      items: [
        { text: 'Introduction', link: '/webhooks/introduction' },
        { text: 'Événements', link: '/webhooks/evenements' },
        { text: 'Vérification de signature', link: '/webhooks/verification-signature' },
        { text: 'Gérer les endpoints', link: '/webhooks/endpoints' },
        { text: 'Replay & livraisons', link: '/webhooks/replay' },
      ],
    },
    {
      text: 'Clients',
      items: [
        { text: 'Lister les clients', link: '/clients/lister' },
        { text: 'Récupérer un client', link: '/clients/recuperer' },
      ],
    },
    {
      text: 'Routage & Méthodes',
      items: [
        { text: 'Introduction routage', link: '/routage/introduction' },
        { text: 'Règles de routage', link: '/routage/regles' },
        { text: 'Opérateurs par pays', link: '/methodes/operateurs' },
        { text: 'Méthodes disponibles', link: '/methodes/methodes-disponibles' },
        { text: 'Santé du routage', link: '/routage/sante' },
      ],
    },
    {
      text: 'Taux de change',
      items: [
        { text: 'Lister les taux', link: '/taux-change/lister' },
        { text: 'Convertir un montant', link: '/taux-change/convertir' },
        { text: 'Devises supportées', link: '/taux-change/devises' },
      ],
    },
    {
      text: 'Agrégateurs',
      items: [
        { text: 'Introduction', link: '/agregateurs/introduction' },
        { text: 'Configurations', link: '/agregateurs/configurations' },
        { text: 'Configurer Hub2', link: '/agregateurs/hub2' },
        { text: 'Tester la connexion', link: '/agregateurs/tester' },
      ],
    },
    {
      text: 'SDKs',
      items: [
        { text: 'Vue d\'ensemble', link: '/sdks/' },
        { text: 'PHP SDK', link: '/sdks/php' },
        { text: 'Laravel SDK', link: '/sdks/laravel' },
        { text: 'Node.js / TypeScript SDK', link: '/sdks/node' },
        { text: 'Python SDK', link: '/sdks/python' },
      ],
    },
    {
      text: 'Intégrations',
      items: [
        { text: 'Vue d\'ensemble', link: '/integrations/' },
        { text: 'WooCommerce', link: '/integrations/woocommerce' },
        { text: 'Shopify', link: '/integrations/shopify' },
        { text: 'PrestaShop', link: '/integrations/prestashop' },
        { text: 'Magento', link: '/integrations/magento' },
      ],
    },
    {
      text: 'API Reference',
      items: [
        { text: 'Introduction', link: '/api/introduction' },
        { text: 'Conventions', link: '/api/conventions' },
        { text: 'Paiements', link: '/api/payments' },
        { text: 'Transferts', link: '/api/payouts' },
        { text: 'Checkout', link: '/api/checkout' },
        { text: 'Webhooks', link: '/api/webhooks' },
        { text: 'Clients', link: '/api/customers' },
        { text: 'Routage', link: '/api/routing' },
        { text: 'Taux de change', link: '/api/exchange-rates' },
      ],
    },
    {
      text: 'Ressources',
      items: [
        { text: 'Pays supportés', link: '/ressources/pays-supportes' },
        { text: 'Codes d\'erreur', link: '/ressources/codes-erreur' },
        { text: 'Limites techniques', link: '/ressources/limites' },
        { text: 'Statut système', link: '/ressources/statut' },
        { text: 'Changelog', link: '/ressources/changelog' },
        { text: 'FAQ', link: '/ressources/faq' },
      ],
    },
  ]
}

/**
 * English sidebar — mirrors the FR tree, swaps labels + prefixes links
 * with `/en`. Stays in sync because both are generated from the same
 * structural template above.
 */
function sidebarEn() {
  // Translation table — keeps the EN sidebar from drifting out of sync
  // with the FR one. Add a new key here when you add a new group/page.
  const t: Record<string, string> = {
    'Commencer': 'Get started',
    'Bienvenue': 'Welcome',
    'Démarrage rapide': 'Quickstart',
    'Authentification': 'Authentication',
    'Applications': 'Applications',
    'Environnements': 'Environments',
    'Format des réponses': 'Response format',
    'Gestion des erreurs': 'Errors',
    'Idempotence': 'Idempotency',
    'Limites de débit': 'Rate limits',
    'Réglages par application': 'Application settings',
    'Paiements': 'Payments',
    'Introduction': 'Introduction',
    'Initialiser un paiement': 'Initialize a payment',
    'Vérifier un paiement': 'Verify a payment',
    'Récupérer un paiement': 'Retrieve a payment',
    'Statuts de paiement': 'Payment statuses',
    'Numéros de test': 'Test numbers',
    'Transferts': 'Payouts',
    'Initialiser un transfert': 'Initialize a payout',
    'Vérifier un transfert': 'Verify a payout',
    'Récupérer un transfert': 'Retrieve a payout',
    'Méthodes disponibles': 'Available methods',
    'Testing': 'Testing',
    'Checkout': 'Checkout',
    'Page hébergée': 'Hosted page',
    'Personnalisation': 'Customisation',
    'Templates (Abidjan / Cotonou / Default)': 'Templates (Abidjan / Cotonou / Default)',
    'Webhooks': 'Webhooks',
    'Événements': 'Events',
    'Vérification de signature': 'Signature verification',
    'Gérer les endpoints': 'Manage endpoints',
    'Replay & livraisons': 'Replay & deliveries',
    'Clients': 'Customers',
    'Lister les clients': 'List customers',
    'Récupérer un client': 'Retrieve a customer',
    'Routage & Méthodes': 'Routing & Methods',
    'Introduction routage': 'Routing introduction',
    'Règles de routage': 'Routing rules',
    'Opérateurs par pays': 'Operators by country',
    'Santé du routage': 'Routing health',
    'Taux de change': 'Exchange rates',
    'Lister les taux': 'List rates',
    'Convertir un montant': 'Convert an amount',
    'Devises supportées': 'Supported currencies',
    'Agrégateurs': 'Aggregators',
    'Configurations': 'Configurations',
    'Configurer Hub2': 'Configure Hub2',
    'Tester la connexion': 'Test connection',
    'SDKs': 'SDKs',
    'Vue d\'ensemble': 'Overview',
    'PHP SDK': 'PHP SDK',
    'Laravel SDK': 'Laravel SDK',
    'Node.js / TypeScript SDK': 'Node.js / TypeScript SDK',
    'Python SDK': 'Python SDK',
    'Intégrations': 'Integrations',
    'WooCommerce': 'WooCommerce',
    'Shopify': 'Shopify',
    'PrestaShop': 'PrestaShop',
    'Magento': 'Magento',
    'API Reference': 'API Reference',
    'Conventions': 'Conventions',
    'Routage': 'Routing',
    'Ressources': 'Resources',
    'Pays supportés': 'Supported countries',
    'Codes d\'erreur': 'Error codes',
    'Limites techniques': 'Technical limits',
    'Statut système': 'System status',
    'Changelog': 'Changelog',
    'FAQ': 'FAQ',
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
  // Default locale is FR (the merchant base is francophone Africa). EN
  // lives under `/en/*` for the international audience. Keeping FR as
  // the root means existing inbound links + search snippets continue
  // to resolve without redirects.
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
    // OpenGraph — bare minimum so a link share on Slack/X shows a card.
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Zayono Docs' }],
    ['meta', { property: 'og:description', content: 'Acceptez Mobile Money et cartes en Afrique avec une seule intégration. SDK PHP, Node.js, Python.' }],
    ['meta', { property: 'og:url', content: 'https://docs.zayono.com' }],
    ['meta', { name: 'theme-color', content: '#2563EB' }],
  ],

  themeConfig: {
    logo: { src: '/logo.svg', width: 28, height: 28 },
    siteTitle: 'Zayono',

    // Top nav — high-level entry points. The sidebar handles the deep
    // structure inside each section.
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'SDKs', link: '/sdks/' },
      { text: 'API Reference', link: '/api/introduction' },
      { text: 'Intégrations', link: '/integrations/' },
      {
        text: 'Ressources',
        items: [
          { text: 'Pays supportés', link: '/ressources/pays-supportes' },
          { text: 'Codes d\'erreur', link: '/ressources/codes-erreur' },
          { text: 'Statut système', link: '/ressources/statut' },
          { text: 'Changelog', link: '/ressources/changelog' },
        ],
      },
      {
        text: 'Dashboard',
        link: 'https://app.zayono.com',
      },
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
      pattern: 'https://github.com/zayono/zayono/edit/main/docs/:path',
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

  // Bilingual structure. The EN tree lives under /en/* — themeConfig
  // overrides per-locale labels + sidebars + nav. When the user switches
  // language, VitePress maps the current path /paiements/initialiser ↔
  // /en/payments/initialize-a-payment using `link` map below.
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
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'SDKs', link: '/en/sdks/' },
          { text: 'API Reference', link: '/en/api/introduction' },
          { text: 'Integrations', link: '/en/integrations/' },
          {
            text: 'Resources',
            // Path note: EN files live under `docs/en/ressources/*` (FR
            // folder name preserved so the existing sidebarEn() generator
            // works without a slug translation map). The previous values
            // here used `/en/resources/*` which 404'd. R2 audit fix.
            items: [
              { text: 'Supported countries', link: '/en/ressources/pays-supportes' },
              { text: 'Error codes', link: '/en/ressources/codes-erreur' },
              { text: 'System status', link: '/en/ressources/statut' },
              { text: 'Changelog', link: '/en/ressources/changelog' },
            ],
          },
          {
            text: 'Dashboard',
            link: 'https://app.zayono.com',
          },
        ],
        sidebar: sidebarEn(),
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        editLink: {
          pattern: 'https://github.com/zayono/zayono/edit/main/docs/:path',
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
