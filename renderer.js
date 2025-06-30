const WebTorrent = require('webtorrent');
const client = new WebTorrent();

const statusDiv = document.getElementById('status');
const downloadBtn = document.getElementById('download');
const torrentInput = document.getElementById('torrentId');

downloadBtn.addEventListener('click', () => {
    const torrentId = torrentInput.value.trim();
    if (!torrentId) {
        statusDiv.textContent = 'Please enter a magnet link or torrent URL.';
        return;
    }

    statusDiv.textContent = 'Downloading metadata...';

    client.add(torrentId, { path: './downloads' }, torrent => {
        statusDiv.textContent = `Downloading: ${torrent.name}`;

        torrent.on('download', bytes => {
            statusDiv.textContent = `
                Downloading: ${torrent.name}<br>
                Progress: ${(torrent.progress * 100).toFixed(2)}%<br>
                Speed: ${(torrent.downloadSpeed / (1024 * 1024)).toFixed(2)} MB/s
            `;
        });

        torrent.on('done', () => {
            statusDiv.textContent = `Download complete: ${torrent.name}`;
        });
    });

    client.on('error', err => {
        statusDiv.textContent = `Error: ${err.message}`;
    });
});
