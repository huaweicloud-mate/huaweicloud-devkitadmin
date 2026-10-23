import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'
import baseConfig from './vite.config'

export default defineConfig((env) => {
  const base: any = typeof baseConfig === 'function' ? (baseConfig as any)(env) : baseConfig
  return {
    ...base,
    server: { ...(base.server ?? {}), https: {} },
    plugins: [...(base.plugins ?? []), basicSsl()],
  }
})