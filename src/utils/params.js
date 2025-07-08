// สร้าง parameters แบบ default สำหรับ search & publication
export function buildSearchParams(query, urlSearchParams) {
    const params = new URLSearchParams();
    params.set('query', query);
    
    // Copy existing params (except 'q')
    for (const [key, value] of urlSearchParams) {
      if (key !== 'q') {
        params.set(key, value);
      }
    }
    
    // Set defaults if not provided
    const defaults = {
      expander: 'relatedsubjects',
      sort: 'relevance',
      includefacets: 'n',
      searchmode: 'all',
      view: 'detailed',
      resultsperpage: '5',
      pagenumber: '1',
      highlight: 'y'
    };
    
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (!params.has(key)) {
        params.set(key, defaultValue);
      }
    }
    
    return params;
  }
  
  export function buildPublicationParams(query, urlSearchParams) {
    const params = new URLSearchParams();
    params.set('query', query);
    
    // Copy existing params (except 'q')
    for (const [key, value] of urlSearchParams) {
      if (key !== 'q') {
        params.set(key, value);
      }
    }
    
    // Set defaults for publication search
    const defaults = {
      sort: 'relevance',
      includefacets: 'y',
      autosuggest: 'n',
      autocorrect: 'n',
      view: 'detailed',
      resultsperpage: '20',
      pagenumber: '1',
      highlight: 'y'
    };
    
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (!params.has(key)) {
        params.set(key, defaultValue);
      }
    }
    
    return params;
  }