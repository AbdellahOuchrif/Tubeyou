# TubeYou - Spotify Playlist Downloader

TubeYou is a Node.js application that allows you to retrieve tracks from a Spotify playlist, search for them on YouTube, and download them as MP3 files. This project uses the Spotify API to access user playlists, the YouTube Data API to find corresponding tracks, and yt-dlp with FFmpeg to download and convert YouTube videos to MP3 format.

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
   npm install

3. Create a .env file by copying .env.example:
   cp .env.example .env

4. Add your API credentials in the .env file:
   - SPOTIFY_CLIENT_ID=your_spotify_client_id
   - SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   - SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
   - YOUTUBE_API_KEY=your_youtube_api_key

5. Make sure FFmpeg and yt-dlp are installed and accessible from your command line:

   Download FFmpeg: https://ffmpeg.org/download.html
   Download yt-dlp: https://github.com/yt-dlp/yt-dlp#installation
