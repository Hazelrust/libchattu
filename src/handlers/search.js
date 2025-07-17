import { getEBSCOTokens } from '../services/auth.js';
import { buildSearchParams, SearchPresets, LimiterBuilder, parseNaturalQuery } from '../utils/params.js';
import { createXMLResponse } from '../utils/responses.js';

// สำหรับค้นหาคล้าย ๆ One Search
export async function handleSearch(request, env) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  
  if (!searchQuery) {
    return createXMLResponse('<error>Missing query parameter "q"</error>', 400);
  }
  
  try {
    // Get tokens
    const { authToken, sessionToken } = await getEBSCOTokens(env);
    
    // Detect special parameters
    const options = {}

    // // Check for preset
    // const presets = url.searchParams.get('preset')
    // if (presets && SearchPresets[presets]) {
    //   Object.assign(options, SearchPresets[presets])
    // }

    // // Check for natural language
    // if (url.searchParams.get('natural') === 'true') {
    //   options.parseNatural = true
    // }

    // Build limiters from URL params
    const limiters = new LimiterBuilder()

    // // Content filters
    // if (url.searchParams.get('fulltext') === 'true') limiters.fullTextOnly()
    // if (url.searchParams.get('peer') === 'true') limiters.peerReview()
    // if (url.searchParams.get('ebooks') === 'true') limiters.eBooksOnly()
    // if (url.searchParams.get('tulibrary') === 'true') limiters.availibleInLibrary()

    // Lanugage filter
    const langs = url.searchParams.get('lang')
      if (langs) {
        limiters.languages(...langs.split(''))
      }

    // Date filter
    const dateFrom = url.searchParams.get('from')
    const dateTo = url.searchParams.get('to')
    if (dateFrom && dateTo) {
      limiters.dateRange(dateFrom,dateTo)
    } else if (dateFrom) {
      limiters.publishAfter(dateFrom)
    }

    // Add limiters to options if any
    const limiterString = limiters.build()
    if (limiterString) {
      options.limiters = limiters
    }

    // Build search URL with parameters
    const params = buildSearchParams(searchQuery, url.searchParams, options);
    const targetUrl = `https://eds-api.ebscohost.com/edsapi/rest/Search?${params.toString()}`;
    

    // Log for debugging [remove later naja]
    console.log('Search URL', targetUrl)

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