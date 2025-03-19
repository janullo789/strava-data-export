export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const code = url.searchParams.get("code");

            if (!code) {
                return new Response(JSON.stringify({ error: "No code provided" }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                    status: 400,
                });
            }

            // ✅ Secret data
            const CLIENT_ID = env.CLIENT_ID;
            const CLIENT_SECRET = env.CLIENT_SECRET;

            const response = await fetch("https://www.strava.com/oauth/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                }),
            });

            const data = await response.json();

            return new Response(JSON.stringify(data), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: "Internal server error" }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                status: 500,
            });
        }
    },
};
