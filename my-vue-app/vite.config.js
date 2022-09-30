import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import acnBuildPlugin from '../dist/index.mjs'

export default defineConfig({
  plugins: [vue(), acnBuildPlugin()]
})
