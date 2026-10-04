import type { APIRoute } from 'astro';
import { SITE_TITLE } from '../consts';

// Web app manifest (name and icons when the site is added to a phone's home screen)
export const GET: APIRoute = () =>
	new Response(
		JSON.stringify(
			{
				name: SITE_TITLE,
				short_name: SITE_TITLE,
				start_url: '/',
				display: 'minimal-ui',
				background_color: '#ffffff',
				theme_color: '#ffffff',
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				],
			},
			null,
			'\t',
		),
		{ headers: { 'Content-Type': 'application/manifest+json' } },
	);
