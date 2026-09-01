import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export default defineConfig({
  base: '/devkitadmin/',
  plugins: [
    vue(),
    Components(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/@types/auto-imports.d.ts',
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/var.scss" as *;\n`,
      },
    },
  },
  server: {
    https: false,
    host: '0.0.0.0',
    port: 3002,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})