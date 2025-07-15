/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import { handleSearch } from './handlers/search.js'
import { handlePublication } from './handlers/publication.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      switch (url.pathname) {
        case '/search':
          return await handleSearch(request, env);
        case '/publication':
          return await handlePublication(request, env);
        default:
          return new Response('Not Found', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(`<error>${error.message}</error>`, {
        status: 500,
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};