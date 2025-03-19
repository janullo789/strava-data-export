/* Strava configuration */
const CLIENT_ID = "136103";
const REDIRECT_URI = "https://janullo789.github.io/strava-data-export/";
const STRAVA_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=read,activity:read_all`;
const BACKEND_URL = "https://strav-auth-backend.janullo789.workers.dev";

/* DOM elements */
const connectStravaBtn = document.getElementById("connect-strava");
const statusElem = document.getElementById("status");
const activityListElem = document.getElementById("activity-list");
const paginationControls = document.getElementById("pagination-controls");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfoElem = document.getElementById("page-info");
const downloadBtn = document.getElementById("download-json");

/* Global variables */
let allActivities = [];
let currentPage = 1;
let itemsPerPage = 20;

/* Set Strava OAuth link */
connectStravaBtn.href = STRAVA_AUTH_URL;

/* Fetch activities from Strava API */
async function fetchAllActivities(accessToken) {
    let page = 1;
    let perPage = 200;
    let fetched = [];

    while (true) {
        const response = await fetch(
            `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const data = await response.json();
        if (data.length === 0) break;

        fetched = fetched.concat(data);
        // For testing or limited usage, break after 2 pages:
        if (page >= 2) break;
        page++;
    }
    return fetched;
}

/* Render a single page of activities */
function renderPage(activities, pageNum) {
    activityListElem.innerHTML = "";

    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = activities.slice(startIndex, endIndex);

    pageItems.forEach(activity => {
        const li = document.createElement("li");
        li.innerHTML = `
      <span style="font-weight: 600; color: #ff5500;">
        ${activity.name}
      </span>
      <a href="https://www.strava.com/activities/${activity.id}" target="_blank"
         style="margin-left: 0.5rem; color: #ff5500; text-decoration: underline;">
        (View on Strava)
      </a>
    `;
        activityListElem.appendChild(li);
    });

    pageInfoElem.textContent = `Page ${pageNum} of ${Math.ceil(activities.length / itemsPerPage)}`;

    prevPageBtn.disabled = (pageNum === 1);
    nextPageBtn.disabled = (pageNum === Math.ceil(activities.length / itemsPerPage));
}

/* Main function: obtain token, fetch data, enable pagination */
async function fetchStravaData(code) {
    statusElem.innerText = "Fetching data from Strava...";

    try {
        const response = await fetch(`${BACKEND_URL}/?code=${code}`);
        const tokenData = await response.json();

        if (!tokenData.access_token) throw new Error("No access token");

        allActivities = await fetchAllActivities(tokenData.access_token);

        if (allActivities.length === 0) {
            statusElem.innerText = "No activities found.";
            return;
        }

        currentPage = 1;
        renderPage(allActivities, currentPage);

        // Show pagination
        paginationControls.style.display = "flex";

        // Generate JSON file
        const jsonData = JSON.stringify(allActivities, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        downloadBtn.href = url;
        downloadBtn.download = "strava_activities.json";
        downloadBtn.style.display = "inline-block";

        downloadBtn.addEventListener("click", () => {
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });

        statusElem.innerText = "Data are ready! Browse pages or download JSON.";
    } catch (error) {
        console.error(error);
        statusElem.innerText = "Error while fetching data.";
    }
}

/* Pagination buttons */
prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(allActivities, currentPage);
    }
});

nextPageBtn.addEventListener("click", () => {
    const maxPage = Math.ceil(allActivities.length / itemsPerPage);
    if (currentPage < maxPage) {
        currentPage++;
        renderPage(allActivities, currentPage);
    }
});

/* If "code" param is in URL, start fetching data */
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");
if (code) fetchStravaData(code);
