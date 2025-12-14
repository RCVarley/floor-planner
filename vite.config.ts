///// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'
import { nuxtUiIcons } from './src/features/icons/utilities/icons.ts'

export default defineConfig({
  plugins: [
    vue({
      exclude: [
        '*/**/*.old',
      ],
    }),
    vueDevTools({
      launchEditor: 'webstorm',
    }),
    ui({
      ui: {
        input: {
          slots: {
            root: 'xs:w-full'
          }
        },
        icons: nuxtUiIcons
      },
      autoImport: {
        dirs: [
          'src/features/**/composables',
        ],
        imports: [
          {
            '@nuxt/ui': [
              'defineShortcuts',
            ]
          }
        ],
      },
      components: {
        dirs: [
          'src/features/**/components',
        ],
        deep: true,
        exclude: [
          'src/components',
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      "@editor": "/src/features/svgEditor",
      "@floor-plan": "/src/features/floorPlanEditor",
    }
  },
  // test: {
  //   projects: [{
  //     extends: true,
  //     plugins: [
  //       // The plugin will run tests for the stories defined in your Storybook config
  //       // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
  //       storybookTest({
  //         configDir: path.join(dirname, '.storybook')
  //       })
  //     ],
  //     test: {
  //       name: 'storybook',
  //       browser: {
  //         enabled: true,
  //         headless: true,
  //         provider: playwright({}),
  //         instances: [{
  //           browser: 'chromium'
  //         }]
  //       },
  //       setupFiles: ['.storybook/vitest.setup.ts']
  //     }
  //   }]
  // }
});