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
import { handleAdvanceSearch } from './handlers/advancesearch.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Add CORS headers function
      const addCorsHeaders = (response) => {
        const headers = new Headers(response.headers)
        headers.set('Access-Control-Allow-Origin','*')
        headers.set('Access-Control-Allow-Methods','GET,POST,OPTIONS')
        headers.set('Access-Control-Allow-Headers','Content-Type')
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,headers
        })
      }

      // Handle OPTIONS request for CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      switch (url.pathname) {
        case '/search':
          return await handleSearch(request, env);
        case '/publication':
          return await handlePublication(request, env);
        case '/advance-search':
          // Only if user implement advanced search
          if (request.method === 'POST') {
            return await handleAdvanceSearch(request,env)
          }
          return new Response('Method not allowed', {status:405})
        case '/debug':
          const debugInfo = {
            environment: env.ENVIRONMENT || 'production',
            hasKV: !!env.KV,
            hasEBSCO_USER: !!env.EBSCO_USER,
            hasEBSCO_PASS: !!env.EBSCO_PASS,
            hasEBSCO_PROFILE: !!env.EBSCO_PROFILE,
            timestamp: new Date().toISOString()
          }
          return new Response(JSON.stringify(debugInfo,null,2), {
            headers:{'Content-Type':'application/json'}
          });

          case '/health':
            return new Response('OK', {status:200})

          case '/':
            return new Response(`
              <html>
                <head><title>EBSCO Library Search API</title></head>
                <body style="font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>📚 EBSCO Library Search API</h1>
                <h2>Available Endpoints:</h2>
                <ul>
                  <li><code>GET /search?q={query}</code> - Search library resources</li>
                  <li><code>GET /publication?q={query}</code> - Search publications</li>
                  <li><code>POST /advanced-search</code> - Advanced search with JSON body</li>
                  <li><code>GET /health</code> - Health check</li>
                </ul>
                <h2>Search Parameters:</h2>
                <ul>
                  <li><code>q</code> - Search query (required)</li>
                  <li><code>preset</code> - Use preset configuration (general, academic, thai, ebooks, recent, tuLibrary)</li>
                  <li><code>fulltext</code> - Full text only (true/false)</li>
                  <li><code>peer</code> - Peer reviewed only (true/false)</li>
                  <li><code>ebooks</code> - eBooks only (true/false)</li>
                  <li><code>tulibrary</code> - Available in TU Library (true/false)</li>
                  <li><code>lang</code> - Language filter (comma-separated)</li>
                  <li><code>from</code> - Published after year</li>
                  <li><code>to</code> - Published before year</li>
                  <li><code>natural</code> - Parse natural language query (true/false)</li>
                </ul>
                <h2>Examples:</h2>
                <pre>
                  GET /search?q=machine learning&fulltext=true
                  GET /search?q=การเงิน&preset=thai
                  GET /search?q=psychology&from=2020&peer=true
                  GET /search?q=ผู้แต่ง: John Smith&natural=true
                </pre>
              </body>
            </html>
          `, {
            headers: {'Content-Type':'text/html; charset=utf-8'}
          })

        default:
          return new Response('Not Found',{
            status:404,
            headers:{'Content-Type':'text/plain'}
          })
        }
      } catch (error) {
        console.error('Worker error:', error);
        return new Response(
          JSON.stringify({
            error: 'Internal server errorr',
            message: error.message
        }),
        {
            status: 500,
            headers: {'Content-Type':'application/json'}
        }
      );
    } 
  }
};