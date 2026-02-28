const clientId = '49ba35c6-96a7-4a60-bc27-c6973c20237b';
const clientSecret = 'pxWto7PZe4jJMh5fGdhwSmrP139rHAPVyzju1U2M';

async function test() {
    try {
        const tokenRes = await fetch('https://api.prokerala.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret
            })
        });
        const auth = await tokenRes.json();

        console.log("Token response:", auth.token_type);

        const apiRes = await fetch('https://api.prokerala.com/v2/astrology/planet-position?datetime=2004-02-12T15:19:21%2B00:00&coordinates=22.3421,87.2341&ayanamsa=1', {
            headers: { Authorization: `Bearer ${auth.access_token}` }
        });
        const data = await apiRes.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}

test();
