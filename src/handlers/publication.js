import { getEBSCOTokens } from '../services/auth.js';
import { buildPublicationParams } from '../utils/params.js';
import { createXMLResponse } from '../utils/responses.js';

export async function handlePublication(request, env) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  
  if (!searchQuery) {
    return createXMLResponse('<error>Missing query parameter "q"</error>', 400);
  }
  
  try {
    // Get tokens
    const { authToken, sessionToken } = await getEBSCOTokens(env);
    
    // Build publication search URL with parameters
    const params = buildPublicationParams(searchQuery, url.searchParams);
    const targetUrl = `https://eds-api.ebscohost.com/edsapi/publication/search?${params.toString()}`;
    
    // Make request to EBSCO
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml',
        'x-authenticationToken': authToken,
        'x-sessionToken': sessionToken,
      }
    });

    // Return response
    const data = await response.text();
    return createXMLResponse(data, response.status);
    
  } catch (err) {
    return createXMLResponse(`<error>${err.message}</error>`, 500);
  }
}