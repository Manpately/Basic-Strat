const form = document.getElementById("uploadForm");
const postsContainer = document.getElementById("postsContainer");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContent = document.getElementById("tabContent");
const postType = document.getElementById("postType");

let audioBlob = null;
let mediaRecorder = null;
let audioChunks = [];

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    postType.value = btn.dataset.type;

    const type = btn.dataset.type;
    switch (type) {
      case "text":
        tabContent.innerHTML = `<textarea name="content" placeholder="Type your message here" required></textarea>`;
        break;
      case "file":
        tabContent.innerHTML = `<input type="file" name="content" required />`;
        break;
      case "link":
      case "gif":
        tabContent.innerHTML = `<input type="url" name="content" placeholder="Paste ${type} URL" required />`;
        break;
      case "image":
        tabContent.innerHTML = `<input type="file" name="content" accept="image/*" required />`;
        break;
      case "voice":
        tabContent.innerHTML = `
          <button type="button" id="startRecord">🎤 Start</button>
          <button type="button" id="stopRecord" disabled>⏹️ Stop</button>
          <div id="audioPreview"></div>
        `;
        setupVoiceRecording();
        break;
      case "folder":
        tabContent.innerHTML = `<input type="file" name="content" webkitdirectory multiple required />`;
        break;
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const type = formData.get("type");
  let content = formData.get("content");

  if (type === "voice" && audioBlob) {
    content = URL.createObjectURL(audioBlob);
  }

  const post = {
    id: Date.now(),
    type,
    content,
    expiry: formData.get("expiry"),
    comments: []
  };

  createPostElement(post);
  audioBlob = null;
  form.reset();
  tabButtons[0].click(); // Reset to Text tab
});

function createPostElement(post) {
  const card = document.createElement("div");
  card.className = "card";

  let contentHTML = "";

  if (post.type === "image") {
    const file = form.querySelector('input[name="content"]').files[0];
    contentHTML = `<img src="${URL.createObjectURL(file)}" alt="Image"/>`;
  } else if (post.type === "voice") {
    contentHTML = `<audio controls src="${post.content}"></audio>`;
  } else if (post.type === "gif" || post.type === "link") {
    contentHTML = `<a href="${post.content}" target="_blank">${post.content}</a>`;
  } else if (post.type === "file") {
    const file = form.querySelector('input[name="content"]').files[0];
    contentHTML = `<p>Uploaded file: ${file.name}</p>`;
  } else if (post.type === "folder") {
    contentHTML = `<p>Folder uploaded successfully.</p>`;
  } else {
    contentHTML = `<p>${post.content}</p>`;
  }

  card.innerHTML = `
    <p><strong>Type:</strong> ${post.type}</p>
    <div class="post-body">${contentHTML}</div>
    <form class="commentForm">
      <input type="text" name="comment" placeholder="Add a comment..." required/>
      <input type="hidden" name="type" value="text"/>
      <button type="submit">Comment</button>
    </form>
    <div class="comments"><strong>Comments:</strong><ul class="commentList"></ul></div>
  `;

  card.querySelector(".commentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const commentText = e.target.comment.value;
    const list = card.querySelector(".commentList");
    const li = document.createElement("li");
    li.textContent = commentText;
    list.appendChild(li);
    e.target.reset();
  });

  postsContainer.prepend(card);
}

function setupVoiceRecording() {
  const startBtn = document.getElementById("startRecord");
  const stopBtn = document.getElementById("stopRecord");
  const audioPreview = document.getElementById("audioPreview");

  startBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(audioBlob);
      audioPreview.innerHTML = `<audio controls src="${audioURL}"></audio>`;
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  stopBtn.onclick = () => {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
}
