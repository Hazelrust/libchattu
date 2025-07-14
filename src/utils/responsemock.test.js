import { describe, expect, it, test } from "vitest";
import { createXMLResponse } from "./responses";

describe('CreateXMLResponse', async () => {

    test('Should create response with correct headers', () => {

        const response = createXMLResponse(`<data>test</data>`)

        expect(response.headers.get('Content-Type')).toBe('application/xml');
        expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');

    })

    test('Should set status code', () => {
        // const XMLresponse = createXMLResponse(`<error>Not Found</error>`)
        expect(createXMLResponse()).toMatchInlineSnapshot(`
          Response {
            Symbol(state): {
              "aborted": false,
              "cacheState": "",
              "headersList": HeadersList {
                "cookies": null,
                Symbol(headers map): Map {
                  "content-type" => {
                    "name": "Content-Type",
                    "value": "application/xml",
                  },
                  "access-control-allow-origin" => {
                    "name": "Access-Control-Allow-Origin",
                    "value": "*",
                  },
                },
                Symbol(headers map sorted): null,
              },
              "rangeRequested": false,
              "requestIncludesCredentials": false,
              "status": 200,
              "statusText": "",
              "timingAllowPassed": false,
              "timingInfo": null,
              "type": "default",
              "urlList": [],
            },
            Symbol(headers): Headers {},
          }
        `)
    })
} )