require('dotenv').config();
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const SpotifyWebApi = require('spotify-web-api-node');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { downloadAndConvert } = require('./downloadtrack'); // Import the downloadAndConvert function

// Spotify and YouTube API credentials

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({
  version: 'v3',
  auth: youtubeApiKey
});


let youtubeUrls = [];
let accessToken = null;
let playlistName = "ENIM SI SIHT"; // Your playlist name

// Path to the JSON file where we'll store downloaded track IDs
const downloadedTracksFilePath = path.join(__dirname, 'downloadedTracks.json');

// Function to get downloaded tracks from JSON file
function getDownloadedTracks() {
  if (fs.existsSync(downloadedTracksFilePath)) {
    const data = fs.readFileSync(downloadedTracksFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
}

// Function to save downloaded track IDs to JSON file
function saveDownloadedTracks(trackIds) {
  fs.writeFileSync(downloadedTracksFilePath, JSON.stringify(trackIds, null, 2), 'utf-8');
}

// Server setup
http.createServer((req, res) => {
  if (req.url === '/login') {
    const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-read-private', 'playlist-read-collaborative']);
    res.writeHead(302, { Location: authorizeURL });
    res.end();
  } else if (req.url.startsWith('/callback')) {
    const code = querystring.parse(req.url.split('?')[1]).code;
    spotifyApi.authorizationCodeGrant(code).then(data => {
      accessToken = data.body.access_token;
      spotifyApi.setAccessToken(accessToken);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('Logged in! Go to /getTracks to get playlist tracks or /DownloadAll to download them.');
    }).catch(err => {
      console.error('Error during authorization:', err);
      res.writeHead(500);
      res.end('Authorization failed.');
    });
  } else if (req.url === '/getTracks') {
    spotifyApi.getUserPlaylists().then(data => {
      const playlists = data.body.items;
      const foundPlaylist = playlists.find(playlist => playlist.name === playlistName);

      if (foundPlaylist) {
        const playlistId = foundPlaylist.id;
        spotifyApi.getPlaylistTracks(playlistId).then(trackData => {
          const tracks = trackData.body.items;

          const trackPromises = tracks.map(trackItem => {
            const trackId = trackItem.track.id;
            const trackName = trackItem.track.name;
            const artists = trackItem.track.artists.map(artist => artist.name).join(', ');

            return searchYouTube(`${trackName} by ${artists}`).then(youtubeResults => {
              if (youtubeResults.length > 0) {
                const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeResults[0].id.videoId}`;
                youtubeUrls.push({ youtubeUrl, trackName, trackId });
              }
              return { track: trackName, artists };
            });
          });

          Promise.all(trackPromises).then(results => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
          });
        });
      } else {
        res.writeHead(404);
        res.end('Playlist not found.');
      }
    }).catch(err => {
      console.error('Error fetching playlists:', err);
      res.writeHead(500);
      res.end('Failed to fetch playlists.');
    });
  } else if (req.url === '/DownloadAll') {
    if (youtubeUrls.length === 0) {
      res.writeHead(400);
      res.end('No YouTube URLs available. Please fetch tracks first via /getTracks.');
      return;
    }

    const downloadedTracks = getDownloadedTracks(); // Get list of already downloaded track IDs

    const downloadPromises = youtubeUrls.map(({ youtubeUrl, trackName, trackId }) => {
      return new Promise((resolve, reject) => {
        if (!downloadedTracks.includes(trackId)) {
          // If the track hasn't been downloaded yet
          downloadAndConvert(youtubeUrl, playlistName, (mp3Path) => {
            console.log(`Downloaded and converted: ${trackName} to ${mp3Path}`);
            downloadedTracks.push(trackId); // Add the track ID to the downloaded list
            saveDownloadedTracks(downloadedTracks); // Save the updated list to JSON file
            resolve(`Downloaded and converted: ${trackName} to ${mp3Path}`);
          });
        } else {
          console.log(`Skipping ${trackName}, already downloaded.`);
          resolve(`Skipped: ${trackName} (already downloaded)`);
        }
      });
    });

    Promise.all(downloadPromises)
      .then(results => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(results.join('\n'));
      })
      .catch(err => {
        console.error('Error downloading tracks:', err);
        res.writeHead(500);
        res.end('Error occurred while downloading tracks.');
      });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

// Function to search YouTube for a track
function searchYouTube(query) {
  return youtube.search.list({
    part: 'snippet',
    q: query,
    maxResults: 1
  }).then(response => response.data.items).catch(err => {
    console.error('YouTube search error:', err);
    return [];
  });
}





