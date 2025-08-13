import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace my-username and my-repo with your actual repo name
export default defineConfig({
  plugins: [react()],
  base: '/sat-words/',  // <-- IMPORTANT for GitHub Pages
})

