// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.getElementById("cameraFeed");
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        alert("Camera not accessible!");
        console.error(err);
    });

// Detect mood & fetch songs
document.getElementById("detectBtn").addEventListener("click", async () => {
    const video = document.getElementById("cameraFeed");

    // Capture current frame
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert frame to base64
    const base64Image = canvas.toDataURL("image/jpeg");

    try {
        // Send image to backend
        debugger;
        const res = await fetch("http://127.0.0.1:5000/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image })
        });

        const data = await res.json();

        if (data.error) {
            alert("Error: " + data.error);
            return;
        }

        // Display detected mood
        document.getElementById("moodText").innerText =
            "Mood: " + data.mood.charAt(0).toUpperCase() + data.mood.slice(1);

        // Display songs
        const list = document.getElementById("songList");
        list.innerHTML = "";
        data.songs.forEach(song => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = song.url;
            a.target = "_blank";
            a.innerText = "Song:" + " " + song.song_name + " , " + "Artist:" + " " + song.artist;
            li.appendChild(a);
            list.appendChild(li);
        });

    } catch (err) {
        alert("Error fetching mood or songs!");
        console.error(err);
    }
});
