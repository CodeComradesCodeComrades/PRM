import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const upstream = {
	target: process.env.SERVER_URL || 'http://127.0.0.1:3001/',
	secure: true,
	changeOrigin: true,
	logLevel: 'info',
	ws: true,
};

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// connect to a remote backend during web-only development
		proxy: {
		  '/api': upstream
		},
	  },
});
