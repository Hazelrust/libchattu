import { test, describe, it, expect} from "vitest";
import { buildSearchParams } from "./params";

describe('buildSearchParams', async () => {

    // const urlSearchParams = new urlSearchParams([
    //     ['filter','value'],['sort','asc']
    // ])
    
    const query = "Test Query"

    const params = new URLSearchParams();
    params.set('query', query);
    
    // Copy existing params (except 'q')
    for (const [key, value] of urlSearchParams) {
      if (key !== 'q') {
        params.set(key, value);
      }
    }

    test('Should set params as a default', () => {
        expect(buildSearchParams(query,params)).toMatchInlineSnapshot()
    })
})