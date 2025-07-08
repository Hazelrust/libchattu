// login กับ EBSCO
export async function getEBSCOTokens(env) {
    // Get credentials from KV store
    const [userID, password, profile] = await Promise.all([
      env.KV.get('EBSCO_USER'),
      env.KV.get('EBSCO_PASS'),
      env.KV.get('EBSCO_PROFILE')
    ]);
  
    if (!userID || !password || !profile) {
      throw new Error('Missing EBSCO credentials');
    }
    
    // Step 1: Auth
    const authRes = await fetch('https://eds-api.ebscohost.com/Authservice/rest/UIDAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        UserId: userID,
        Password: password
      })
    });
  
    const authData = await authRes.json();
    const authToken = authData.AuthToken;
    if (!authToken) throw new Error("Auth failed");
  
    // Step 2: Create Session
    const sessionRes = await fetch('https://eds-api.ebscohost.com/edsapi/rest/createsession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-authenticationToken': authToken
      },
      body: JSON.stringify({
        Profile: profile,
        Guest: "y"
      })
    });
  
    const sessionData = await sessionRes.json();
    const sessionToken = sessionData.SessionToken;
    if (!sessionToken) throw new Error("Session creation failed");
    
    return { authToken, sessionToken };
  }