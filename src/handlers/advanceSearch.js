import { getEBSCOTokens } from "../services/auth"
import { buildSearchParams, LimiterBuilder, SearchPresets } from "../utils/params"
import { createXMLResponse } from "../utils/responses"

export async function handleAdvanceSearch(request, env) {
    const url = new URL(request.url)

    // Parse JSON body for complex queries
    let searchConfig
    try { 
        searchConfig = await request.json()
    } catch (e) {
        return createXMLResponse('<e>Invalid JSON body</e>',400)
    }

    const {query, filters, options} = searchConfig

    if (!query) {
        return createXMLResponse('<e>Missing query in request body </e>',400)
    }

    try {
        const {authToken, sessionToken} = await getEBSCOTokens(env)
    
        // Build complex limiters
        const limiters = new LimiterBuilder()
    
        if (filters) {
            if (filters.contentType) {
                filters.contentType.forEach(type => {
                    switch(type) {
                        case 'fulltext' : limiters.fullTextOnly() 
                        break
                        case 'peer' : limiters.peerReview() 
                        break
                        case 'ebooks' : limiters.eBooksOnly()
                        break
                        case 'pdf' : limiters.pdfOnly()
                        break
                    }
                })
            }

            if (filters.languages) {
                limiters.languages(...filters.languages)
            }

            if (filters.dateRange) {
                limiters.dateRange(filters.dateRange.from, filters.dateRange.to)
            }

            if (filters.authors) {
                limiters.authors.forEach(author => limiters.byAuthor(author))
            }
            if (filters.journals) {
                limiters.journals.forEach(journals => limiters.byJournal(journals))
            }
        }

        // Merge with preset if sepcified
        const finalOptions = {...options}
        if (options?.preset && SearchPresets[options.preset]) {
            Object.assign(finalOptions, SearchPresets[options.preset])
        }

        finalOptions.limiters = limiters

        // Build and execute search
        const params = buildSearchParams(query, new URLSearchParams(), finalOptions)
        const targetUrl = `https://eds-api.ebscohost.com/edsapi/rest/Search?${params.toString()}`

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Accept' : 'application/xml',
                'x-authenticationToken':authToken,
                'x-sessionToken':sessionToken
            }
        })
        
        const data = await response.text()
        return createXMLResponse(data,response.status)
    } catch (err) {
        return createXMLResponse(`<e>${err.message}</e>`,500)
    }
}