import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({mode})=>{const env=loadEnv(mode,'.','');return {plugins:[tailwindcss(),react()],server:{port:5174,strictPort:true,proxy:{'/api':{target:env.DEV_API_TARGET||'https://movieanimebackend.onrender.com',changeOrigin:true}}}};});
