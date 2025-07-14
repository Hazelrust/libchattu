import { test,expect } from "vitest";
import { getEBSCOTokens , authToken , sessionToken } from "./auth";
import dotenv from 'dotenv'

dotenv.config()

const realEnv = {
    KV: {
        get: async (key) => {
            switch (key) {
                case 'EBSCO_USER': return process.env.EBSCO_USER
                case 'EBSCO_PASS': return process.env.EBSCO_PASS
                case 'EBSCO_PROFILE': return process.env.EBSCO_PROFILE
                default : return null
            }
        }
    }
}

test('getEBSCOTokens - real credentials', async () => {
    const userID = process.env.EBSCO_USER
    const password = process.env.EBSCO_PASS
    const profile = process.env.EBSCO_PROFILE

    if (!userID || !password || !profile) {
        throw new Error('Real credentails are missing in environment variables')
    }

    const {authToken, sessionToken} = await getEBSCOTokens(realEnv)

    expect(authToken).toBeTruthy()
    expect(sessionToken).toBeTruthy()

    console.log('Auth Token:', authToken)
    console.log('Session Token', sessionToken);
})
