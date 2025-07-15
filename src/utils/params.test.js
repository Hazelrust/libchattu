import { test, describe, it, expect} from "vitest";
import { buildSearchParams } from "./params";

describe('buildSearchParams', async (urlSearchParams,query) => {

    const urlSearchParams = new urlSearchParams([
        ['filter','value'],['sort','asc']
    ])

    const query = "Test Query"

    test('Should set params as a default', () => {
        expect(buildSearchParams()).toMatchInlineSnapshot()
    })
})