// Field-specific search
export function field(fieldCode, value) {
  return `${fieldCode}:${value}`
}

// Boolean operators
export function and(...queries) {
  return queries.filter(q => q).join(' AND ')
}

export function or(...queries) {
  return queries.filter(q => q).join(' OR ')
}

export function not(...queries) {
  return `NOT ${query}`
}

export function parseNaturalQuery(query) {
  // Pattern finder
    const patterns = [
    { regex: /ผู้แต่ง[:\s]+(.+?)(?:\s|$)/i, field: 'AU' },
    { regex: /author[:\s]+(.+?)(?:\s|$)/i, field: 'AU' },
    { regex: /ชื่อเรื่อง[:\s]+(.+?)(?:\s|$)/i, field: 'TI' },
    { regex: /title[:\s]+(.+?)(?:\s|$)/i, field: 'TI' },
    { regex: /หัวข้อ[:\s]+(.+?)(?:\s|$)/i, field: 'SU' },
    { regex: /subject[:\s]+(.+?)(?:\s|$)/i, field: 'SU' },
    { regex: /หัวเรื่อง[:\s]+(.+?)(?:\s|$)/i, field: 'SU' },
    { regex: /เกี่ยวกับ[:\s]+(.+?)(?:\s|$)/i, field: 'SU' },
    { regex: /ISBN[:\s]+(.+?)(?:\s|$)/i, field: 'IB' },
    { regex: /ISSN[:\s]+(.+?)(?:\s|$)/i, field: 'IS' }
  ];

  let processedQuery = query
  patterns.forEach(({regex, field}) => {
    processedQuery = processedQuery.replace(regex, (match,value) => {
     return `${field}:${value.trim()}`
    })
  })
  
  return processedQuery
}


//* Limiter Builder

export class LimiterBuilder {
  constructor() {
    this.limiters = []
  }

  // Content type limiter
  fullTextOnly() {
    this.limiters.push('FT:y')
    return this
  }

  peerReview() {
    this.limiters.push('RV:y')
    return this
  }

  withReferences() {
    this.limiters.push('FR:y')
    return this
  }

  catalogOnly() {
    this.limiters.push('FC:y')
    return this
  }

  availibleInLibrary() {
    this.limiters.push('FT1:y')
    return this
  }

  // Format Limiter
  pdfOnly() {
    this.limiters.push('FM:y')
    return this
  }

  htmlOnly() {
    this.limiters.push('FM10:y')
    return this
  }

  eBooksOnly() {
    this.limiters.push('FM20:y')
    return this
  }

  EPUBeBooksOnly() {
    this.limiters.push('FM30:y')
    return this
  }

  // Date Limiter
  // Old one
  // dateRange(fromYear, toYear) {
  //   if (fromYear && toYear) {
  // // build full ISO dates and use a slash as the range separator
  //   const from = `${fromYear}-01`;
  //   const to   = `${toYear}-12-31`;
  //   this.limiters.push(`DT1:${from}/${to}`)
  //   }
  //   return this
  // }  

  // publishAfter(year) {
  //   const currentYear = new Date().getFullYear()
  //   return this.dateRange(year, currentYear)  
  // }

  // New one
  dateRange(fromYm, toYm) {
    if (fromYm && toYm) {
      this.limiters.push(`DT1:${fromYm}/${toYm}`);
    }
    return this;
  }

  // Helper if you still want “publish after X” semantics
  publishAfter(fromYm) {
    const now      = new Date();
    const pad      = n => String(n).padStart(2, '0');
    const toYm     = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    return this.dateRange(fromYm, toYm);
  }

  // Language Limiter
  languages(...langs) {
    if (langs.length > 0 ) {
      this.limiters.push(`LA99:${langs.join(',')}`)
    }
    return this
  }

  // Specific field Limiters
  byAuthor(author) {
    this.limiters.push(`AU:${author}`)
    return this
  } 

  byTitle(title) {
    this.limiters.push(`TI:${title}`)
    return this
  }
  
  byJournal(journal) {
    this.limiters.push(`SO:${journal}`)
    return this
  }

  // Build limiter string
  build() {
    return this.limiters.join(',')
  }
}

// สร้าง parameters แบบ default สำหรับ search & publication
export function buildSearchParams(query, urlSearchParams, options = {}) {
    const params = new URLSearchParams();


    // Parse natural lanugage query if needed
    const processedQuery = options.parseNatural ? parseNaturalQuery(query) : query
    params.set('query', processedQuery);
    
    // Copy existing params (except 'q')
    for (const [key, value] of urlSearchParams) {
      if (key !== 'q' && !/^query-\d+$/.test(key)) {
        params.set(key, value);
      }
    }
    
    // Set defaults if not provided
    // const defaults = {
    //   expander: 'relatedsubjects',
    //   sort: 'relevance',
    //   includefacets: 'n',
    //   searchmode: 'all',
    //   view: 'detailed',
    //   resultsperpage: '10',
    //   pagenumber: '1',
    //   highlight: 'y'
    // };
    
    const defaults = getSmartDefaults(processedQuery, options)

    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (!params.has(key)) {
        params.set(key, defaultValue);
      }
    }

    // Add limiters if provided
    if (options.limiters) {
      const existingLimiters = params.get('limiter') || ''
      const newLimiters = options.limiters instanceof LimiterBuilder
        ? options.limiters.build()
        : options.limiters

      const combinedLimiters = existingLimiters
        ? `${existingLimiters},${newLimiters}`
        : newLimiters

      params.set('limiter',combinedLimiters)
    }
    
    return params;
  }
  
  export function buildPublicationParams(query, urlSearchParams, options = {}) {
    const params = new URLSearchParams()
    
    const processedQuery = options.parseNatural ? parseNaturalQuery(query) : query
    params.set('query', processedQuery);
    
    // Copy existing params (except 'q')
    for (const [key, value] of urlSearchParams) {
      if (key !== 'q') {
        params.set(key, value);
      }
    }
    
    // Set defaults for publication search
    const defaults = {
      sort: options.sort || 'relevance',
      includefacets: 'y',
      autosuggest: 'y',
      autocorrect: 'y',
      view: options.view || 'detailed',
      resultsperpage: '20',
      pagenumber: '1',
      highlight: 'y'
    };
    
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (!params.has(key)) {
        params.set(key, defaultValue);
      }
    }

    // Add limiter for publication

    if (options.limiters) {
      params.set('limiter',
        options.limiters instanceof LimiterBuilder
          ? options.limiters.build()
          : options.limiters
      )
    }
    
    return params;
  }

  export function getSmartDefaults(query, options = {}) {
    const defaults = {
      sort: 'relevance',
      includefacets: 'n',
      view: 'detailed',
      resultsperpage: '10',
      pagenumber: '1',
      highlight: 'y',
    }

    // Detect query complexity and adjust searchmode
    const hasFieldCodes = /\b[A-Z]{2}:/.test(query)
    const hasBoolean = /\b(AND|OR|NOT)\b/.test(query)
  
    if (hasBoolean) {
      defaults.searchmode = 'bool'
      defaults.expander = 'fulltext'
    } else if (hasFieldCodes) {
      defaults.searchmode = 'all'
      defaults.expander = 'fulltext'
    } else {
      defaults.searchmode = options.searchmode || 'all'
      defaults.expander = 'fulltext,relatedsubjects'
    }

    // Adjust based on content preferences
    if (options.preferPeerReviewed) {
      defaults.sort = 'date' // Recent peer-reviewed first
    }

    if (options.preferFullText) {
      defaults.expander = 'fulltext'
    }

    return defaults
  }


  // Preset Configurations

  export const SearchPresets = {
    general: {
      searchmode: 'smart',
      expander: 'fulltext,relatedsubjects'
    },

    academic: {
      searchmode: 'all',
      limiters: new LimiterBuilder()
        .peerReview()
        .fullTextOnly()
        .publishAfter("2020-01-01/2025-12-31")
        .build()
    },

    thai: {
      searchmode: 'all',
      limiters: new LimiterBuilder()
        .languages('Thai')
        .build()
    },

    ebooks: {
      searchmode: 'all',
      limiters: new LimiterBuilder()
        .eBooksOnly()
        .fullTextOnly()
        .build()
    },
    
    recent: {
      sort: 'date',
      limiters: new LimiterBuilder()
        .publishAfter("2020-01-01/2025-12-31")
        .build()
    },

    tuLibrary: {
      searchmode: 'all',
      limiters: new LimiterBuilder()
        .catalogOnly()
        .availibleInLibrary()
        .build()
    }
  }