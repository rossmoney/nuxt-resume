const googleFontsLink =
  'https://fonts.googleapis.com/css?family=Bitter:400,400i,700&display=swap';

const config = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Ross Money - Résumé',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: "Ross Money's résumé. Built with NuxtJS and Tailwind CSS.",
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'Ross Money - Résumé',
      },
      {
        property: 'og:description',
        content: "Ross Money's résumé. Built with NuxtJS and Tailwind CSS.",
      },
      // {
      //  property: 'og:image',
      //  content: 'https://www.rossmoney.me/screenshot.png',
      // },
      {
        property: 'og:image:type',
        content: 'image/png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        name: 'msapplication-TileColor',
        content: '#2d89ef',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    link: [
      {
        rel: 'preconnect',
        crossorigin: true,
        href: googleFontsLink,
      },
      {
        rel: 'stylesheet',
        href: googleFontsLink,
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
    script: [
      {
        src: 'google-analytics-setup.js',
        body: true,
        class: 'do-not-strip',
      },
      {
        src: 'https://www.google-analytics.com/analytics.js',
        async: true,
        body: true,
        class: 'do-not-strip',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/utilities.css', '@/assets/css/global.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/global-data'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  env: {
    isProduction: Boolean(process.env.GITHUB_ACTIONS),
    githubActions: {
      timestamp: new Date().toISOString(),
      repositoryUrl: process.env.GITHUB_REPOSITORY,
      commitSha: process.env.GITHUB_SHA,
    },

    // // comment above and uncomment below
    // // to simulate production environment
    // isProduction: true,
    // gitlabCi: {
    //   timestamp: new Date().toISOString(),
    //   projectUrl: 'https://github.com/rossmoney/nuxt-resume',
    //   commitSha: 'c6d21f92',
    // },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
};

export default config;
