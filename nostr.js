// const socket = new WebSocket('wss://nostr.0x50.tech');
const socket = new WebSocket('wss://relay.damus.io');

socket.onopen = function(event) {
    socket.send('["REQ", "133742069", {"kinds": [30023], "limit": 10}]');
};

socket.onmessage = function(event) {
    const articles = [];
    // const shortTextNotesContainer = document.getElementById('short-text-notes-container');
    const latestPostTitle = document.getElementById('latest-post-title');
    const latestPostReleaseDate = document.getElementById('latest-post-release-date');
    const latestPostSummary = document.getElementById('latest-post-summary');
    const latestPostImage = document.getElementById('latest-post-image');
    const data = JSON.parse(event.data);
    if (data[0] === "EVENT") {
        if(data[2].kind === 30023) {
            const article = {};
            const content = data[2].content;
            for(tag in data[2].tags) {
                if(data[2].tags[tag][0] === "title") {
                    const title = data[2].tags[tag][1];
                    latestPostTitle.innerHTML = title;
                    article.title = title;
                }
                if(data[2].tags[tag][0] === "published_at") {
                    const releaseDate = data[2].tags[tag][1];
                    const date = new Date(releaseDate * 1000);
                    const formattedTime = date.toLocaleString();
                    latestPostReleaseDate.innerHTML = formattedTime;
                }
                if(data[2].tags[tag][0] === "summary") {
                    const summary = data[2].tags[tag][1];
                    latestPostSummary.innerHTML = summary;
                    article.summary = summary;
                }
                if(data[2].tags[tag][0] === "image") {
                    const image = data[2].tags[tag][1];
                    const htmlImage = document.createElement('img');
                    htmlImage.src = image;
                    latestPostImage.appendChild(htmlImage);
                    article.image = image;
                }
            }
            const pubkey = data[2].pubkey;
            const pubkeyShortened = `${pubkey.slice(0, 3)}...${pubkey.slice(-3)}`;
            const createdAt = data[2].created_at;
            const date = new Date(createdAt * 1000);
            const formattedTime = date.toLocaleString();

            article.pubkey = pubkey;
            article.createdAt = createdAt;
            article.content = content;
            articles.push(article);
        }
    }

    console.log(articles)
};