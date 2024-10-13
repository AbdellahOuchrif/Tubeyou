# TubeYou - Spotify Playlist Downloader

TubeYou is a Node.js application that allows you to retrieve tracks from a Spotify playlist, search for them on YouTube, and download them as MP3 files. This project uses the Spotify API to access user playlists, the YouTube Data API to find corresponding tracks, and yt-dlp with FFmpeg to download and convert YouTube videos to MP3 format.

## Why I Built This Project

The idea for this project came from a simple need: I wanted to listen to music on the go, without worrying about having an internet connection. Sure, I could just subscribe to Spotify Premium and solve the problem easily, but as a student, managing personal finances is crucial. Subscribing to every service adds up, and I wanted to find a solution that gave me the best of both worlds—listening to music offline and for free.

As a software engineering student, I'm always looking for ways to turn real-world problems into coding challenges. This one seemed like the perfect opportunity. I could solve a personal problem and, at the same time, learn a new technology—Node.js. Although I could have used languages I’m more comfortable with, like PHP or Python, I decided to take this chance to dive into Node.js, a framework I've been curious about for some time.

Building this project has been an exciting journey of trial and error. Along the way, I gained a deeper understanding of working with APIs, handling authentication, and even learned a thing or two about YouTube's quirks. While the project is far from perfect, I’m proud of what I’ve built and the progress I’ve made.

That said, there’s always room for improvement. I’d love to hear your thoughts on the project and any suggestions for how I can take it to the next level. Your feedback would be invaluable as I continue to learn, grow, and refine this project and future ones. Thank you for taking the time to check it out!

## Features

- Fetch tracks from a specific Spotify playlist
- Search for corresponding YouTube videos based on track and artist name
- Download YouTube videos and automatically convert them to MP3
- Store downloaded tracks to avoid duplicates on subsequent downloads

## Prerequisites

Before running the project, you need to have the following installed on your machine:

- Node.js (v14 or higher)
- FFmpeg
- yt-dlp (YouTube Downloader)
- A Spotify Developer Account (for API credentials)
- A Google Developer Account (for YouTube Data API key)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/AbdellahOuchrif/Tubeyou.git
   cd tubeyou
   
2. Install the required dependencies:
   ```bash
   npm install

3. Create a .env file by copying .env.example:
   ```bash
   cp .env.example .env

4. Create a new App in the Spotify Developer Account
   - Set the Redirect URIs
     - http://localhost:5000/callback

5. Create a new project in the Google Cloud Console
   - Search for YouTube Data API v3
   - Activate it

6. Add your API credentials in the .env file:
   ```bash
   - SPOTIFY_CLIENT_ID=your_spotify_client_id
   - SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   - SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
   - YOUTUBE_API_KEY=your_youtube_api_key

7. Make sure FFmpeg and yt-dlp are installed and accessible from your command line:
   - Download FFmpeg: https://ffmpeg.org/download.html
   - Download yt-dlp: https://github.com/yt-dlp/yt-dlp#installation

## Usage
1. Type your playlist's name:
   ```bash
   PLAYLIST_NAME=your_playlist_name

2. Start the server:
   ```bash
   node server.js

3. In your browser, visit http://localhost:5000/login to log in to your Spotify account.
   
4. After logging in, you will be redirected to the /callback route. 
      Once authenticated, you go to the following routes:
         - /getTracks: Fetches tracks from your playlist on Spotify and searches YouTube for corresponding videos.
         - /DownloadAll: Downloads and converts the YouTube videos to MP3 format.
   
5. MP3 files will be saved in a folder named after your playlist under the project directory.

## File Structure

- server.js: Handles the server setup, Spotify authentication, YouTube search, and routing for fetching and downloading tracks.
- downloadtrack.js: Contains the logic for downloading YouTube videos, converting them to MP3 using FFmpeg, and managing downloaded files.
- downloadedTracks.json: Stores a list of previously downloaded track IDs to avoid duplicates.
- .env: Stores environment variables like Spotify and YouTube API credentials.

## API Reference
1. Spotify API
   The project uses the following Spotify API endpoints:
      - GET /v1/me/playlists: Fetches the user’s playlists.
      - GET /v1/playlists/{playlist_id}/tracks: Retrieves tracks from a specific playlist.

2. YouTube Data API
   The project uses the YouTube Data API to search for videos matching the track names:
      - GET /youtube/v3/search: Searches for YouTube videos based on a query.

## Contributing

Feel free to submit issues or pull requests. If you want to contribute, please fork the repository, make changes, and submit a pull request for review.

## License

This project is licensed under the MIT License.
