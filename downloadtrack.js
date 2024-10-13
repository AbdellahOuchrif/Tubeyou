const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to create a directory if it doesn't exist
const createPlaylistFolder = (folderName) => {
    const folderPath = path.join(__dirname, folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Created folder: ${folderPath}`);
    } else {
        console.log(`Folder already exists: ${folderPath}`);
    }

    return folderPath;
};

const downloadAndConvert = (youtubeUrl, playlistName, callback) => {
    console.log('Downloading video...');

    // First, get the video title
    exec(`yt-dlp --get-title ${youtubeUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error retrieving video title: ${error.message}`);
            return;
        }

        const videoTitle = stdout.trim();
        const sanitizedTitle = videoTitle.replace(/[<>:"\/\\|?*]+/g, ''); // Sanitize title for filenames
        
        // Ensure the playlist folder exists
        const playlistFolderPath = createPlaylistFolder(playlistName);
        
        const outputPath = path.join(playlistFolderPath, `${sanitizedTitle}.mp4`);

        // Download the video
        exec(`yt-dlp -f mp4 -o "${outputPath}" ${youtubeUrl}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading video: ${error.message}`);
                return;
            }
            console.log('Video downloaded successfully.');
            if (fs.existsSync(outputPath)) {
                // Convert the video to MP3
                convertToMp3(outputPath, sanitizedTitle, playlistFolderPath, (mp3Path) => {
                    console.log(`MP3 saved at: ${mp3Path}`);
                    deleteVideoFile(outputPath); // Delete the video after conversion
                    callback(mp3Path); // Callback after everything is done
                });
            } else {
                console.error('Video download failed. File not found.');
            }
        });
    });
};

const convertToMp3 = (videoPath, title, folderPath, callback) => {
    console.log('Converting to MP3...');
    const mp3OutputPath = path.join(folderPath, `${title}.mp3`);

    exec(`ffmpeg -i "${videoPath}" -q:a 0 -map a "${mp3OutputPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error converting to MP3: ${error.message}`);
            return;
        }
        console.log('Conversion to MP3 completed.');
        callback(mp3OutputPath);
    });
};

const deleteVideoFile = (videoPath) => {
    fs.unlink(videoPath, (error) => {
        if (error) {
            console.error(`Error deleting video file: ${error.message}`);
        } else {
            console.log(`Deleted video file: ${videoPath}`);
        }
    });
};

module.exports = {
    downloadAndConvert
};

