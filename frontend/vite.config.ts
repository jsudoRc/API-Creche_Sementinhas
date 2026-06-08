import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id:string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Extrai a origem do VITE_API_URL para o proxy (ex: http://localhost:3000)
  // Se não estiver definida, usa localhost:3000 como padrão seguro para dev
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000'

  return {
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
      proxy: {
        // Redireciona as chamadas de API para o backend em desenvolvimento
        // Isso evita erros de CORS quando rodando Vite + backend separados
        '/turmas': { target: apiUrl, changeOrigin: true },
        '/alunos': { target: apiUrl, changeOrigin: true },
        '/matriculas': { target: apiUrl, changeOrigin: true },
        '/responsaveis': { target: apiUrl, changeOrigin: true },
        '/responsaveis-transporte': { target: apiUrl, changeOrigin: true },
        '/contatos-emergencia': { target: apiUrl, changeOrigin: true },
        '/funcionarios': { target: apiUrl, changeOrigin: true },
        '/arquivos': { target: apiUrl, changeOrigin: true },
      },
    },
  }
})