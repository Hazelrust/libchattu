// import { test, expect } from "vitest";
// import { buildSearchParams, buildPublicationParams } from "./searchParams";  // Your function path

// test('buildSearchParams - sets the query and defaults', () => {
//   // Create a mock URLSearchParams object
//   const urlSearchParams = new URLSearchParams([
//     ['filter', 'value1'],
//     ['sort', 'asc']
//   ]);

//   const query = 'testQuery';
  
//   // Call the function
//   const result = buildSearchParams(query, urlSearchParams);

//   // Assertions:
//   expect(result.has('query')).toBe(true);  // 'query' should be set
//   expect(result.get('query')).toBe(query);  // 'query' should match the input

//   // Check if the other parameters are set correctly
//   expect(result.get('filter')).toBe('value1');  // 'filter' should be copied from the input params
//   expect(result.get('sort')).toBe('asc');      // 'sort' should be copied from the input params

//   // Default values should be added if not already set
//   expect(result.get('expander')).toBe('relatedsubjects');  // Default value for 'expander'
//   expect(result.get('sort')).toBe('asc');                  // 'sort' should be taken from the input

//   // Make sure 'q' is excluded from the resulting params
//   expect(result.has('q')).toBe(false);  // 'q' should not be included
// });

// test('buildSearchParams - sets default values for missing keys', () => {
//   const urlSearchParams = new URLSearchParams();
//   const query = 'newQuery';

//   // Call the function
//   const result = buildSearchParams(query, urlSearchParams);

//   // Assertions to check default values
//   expect(result.get('expander')).toBe('relatedsubjects');
//   expect(result.get('sort')).toBe('relevance');
//   expect(result.get('includefacets')).toBe('n');
//   expect(result.get('searchmode')).toBe('all');
//   expect(result.get('view')).toBe('detailed');
//   expect(result.get('resultsperpage')).toBe('5');
//   expect(result.get('pagenumber')).toBe('1');
//   expect(result.get('highlight')).toBe('y');
// });

// test('buildPublicationParams - sets the query and defaults', () => {
//   const urlSearchParams = new URLSearchParams([
//     ['filter', 'value1'],
//     ['sort', 'desc']
//   ]);

//   const query = 'pubQuery';
  
//   // Call the function
//   const result = buildPublicationParams(query, urlSearchParams);

//   // Assertions:
//   expect(result.has('query')).toBe(true);
//   expect(result.get('query')).toBe(query);  // 'query' should match the input

//   // Check if the other parameters are set correctly
//   expect(result.get('filter')).toBe('value1');  // 'filter' should be copied from the input params
//   expect(result.get('sort')).toBe('desc');     // 'sort' should be copied from the input params

//   // Default values should be added if not already set
//   expect(result.get('sort')).toBe('desc');                 // 'sort' should be taken from the input
//   expect(result.get('includefacets')).toBe('y');           // Default value for 'includefacets'
//   expect(result.get('autosuggest')).toBe('n');             // Default value for 'autosuggest'
//   expect(result.get('autocorrect')).toBe('n');             // Default value for 'autocorrect'
//   expect(result.get('view')).toBe('detailed');             // Default value for 'view'
//   expect(result.get('resultsperpage')).toBe('20');         // Default value for 'resultsperpage'
//   expect(result.get('pagenumber')).toBe('1');              // Default value for 'pagenumber'
//   expect(result.get('highlight')).toBe('y');               // Default value for 'highlight'
// });

// test('buildPublicationParams - excludes "q" parameter', () => {
//   const urlSearchParams = new URLSearchParams([
//     ['q', 'unwanted'],  // This should be excluded
//     ['filter', 'value1'],
//   ]);

//   const query = 'pubQuery';

//   // Call the function
//   const result = buildPublicationParams(query, urlSearchParams);

//   // Ensure 'q' is excluded from the final parameters
//   expect(result.has('q')).toBe(false);  // 'q' should not be included in the result
// });
