const CLIENT_ID = "136103";
const REDIRECT_URI = "https://janullo789.github.io/strava-data-export/";
const STRAVA_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=read,activity:read_all`;
const BACKEND_URL = "https://strav-auth-backend.janullo789.workers.dev";

document.getElementById("connect-strava").addEventListener("click", () => {
    window.location.href = STRAVA_AUTH_URL;
});

async function fetchAllActivities(accessToken) {
    let allActivities = [];
    let page = 1;
    let perPage = 200;

    while (true) {
        let response = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        let activities = await response.json();
        if (activities.length === 0) break;
        if (page > 2) break;

        allActivities = allActivities.concat(activities);
        page++;
    }
    return allActivities;
}

async function fetchStravaData(code) {
    document.getElementById("status").innerText = "Fetching data from Strava...";

    try {
        let response = await fetch(`${BACKEND_URL}/?code=${code}`);
        let tokenData = await response.json();

        console.log("✅ Backend response:", tokenData); // DEBUG

        if (!tokenData.access_token) {
            throw new Error("❌ Failed to get access token");
        }

        let activities = await fetchAllActivities(tokenData.access_token);

        if (!activities.length) {
            document.getElementById("status").innerText = "No public activities found.";
            return;
        }
        console.log(activities);

        // 🔹 Konwersja do JSON
        let jsonData = JSON.stringify(activities, null, 2);
        let blob = new Blob([jsonData], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        // 🔹 Ustawienia przycisku pobierania
        let downloadBtn = document.getElementById("download-json");
        downloadBtn.href = url;
        downloadBtn.download = "strava_activities.json";
        downloadBtn.style.display = "block";

        // 🔹 Obsługa kliknięcia (jeśli nie działa automatycznie)
        downloadBtn.onclick = () => {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        };

        document.getElementById("status").innerText = "Data ready for download!";
    } catch (error) {
        console.error("❌ Error:", error);
        document.getElementById("status").innerText = "Error fetching data.";
    }
}



const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");
if (code) fetchStravaData(code);
