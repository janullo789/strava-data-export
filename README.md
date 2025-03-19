# Data Export
**Data Export** is a non-commercial web application that allows you to export Strava activity data in **JSON format**. This project was created with a focus on students and researchers at **AGH University of Science and Technology**, enabling them to download their activity records for further analysis, study, and academic research.

## Key Features
Real-time fetching of Strava data:
- No external server is used to store your information.
- Immediate download of data in JSON format.
- Pagination for easier navigation of large activity lists.
- Simple and transparent interface, adhering to Strava API guidelines.

## How It Works
Authorize your Strava account by clicking the Connect with Strava button.
The application retrieves all your activities directly from Strava in real-time.
You can browse your activities via pagination and optionally download all your data in JSON format.

## Data Security
No data is stored on any external server.
All retrieval happens directly from Strava using secure API requests.
Once downloaded, the JSON file is yours to analyze, share, or archive.
**Non-Commercial & Educational Use**

Strava Data Export is independent and **not** affiliated with or sponsored by Strava. This application is intended strictly for educational and research purposes and follows Strava’s API usage guidelines.

## Cloudflare Worker for API Security
To ensure **safe handling of sensitive credentials** (such as `client_secret`), this project utilizes **Cloudflare Workers** as a proxy.  
Instead of exposing private API keys on GitHub Pages, the authentication process is handled server-side on **Cloudflare**, keeping credentials **secure and hidden**.

### How Cloudflare Worker Protects Your Data:
- Prevents storing secrets (e.g., `client_secret`) in public repositories.
- Acts as a **secure middleware** between Strava and the frontend application.
- Ensures **CORS compatibility**, allowing the frontend to communicate safely with the Strava API.

You can find the worker's source code in the **cloudflare-worker.js** file. If you plan to deploy your own version, make sure to configure **Cloudflare Environment Variables** for:
- `CLIENT_ID`
- `CLIENT_SECRET`

## Contributing
Pull requests and suggestions are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License – see the LICENSE file for details.

## Contact
For questions or feedback, please reach out to skwarko@student.agh.edu.pl.
##
Enjoy quick and secure access to your Strava activity data with **Data Export**!