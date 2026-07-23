document.addEventListener("DOMContentLoaded", () => {
  const videoPlayer = document.getElementById("videoPlayer");
  const videoSource = document.getElementById("videoSource");
  const videoTitle = document.getElementById("videoTitle");
  const errorMessage = document.getElementById("errorMessage");
  const errorDetails = document.getElementById("errorDetails");

  // 1. Get video name from URL (Supports ?v=name, #name, or /video/name)
  let videoName = getVideoNameFromUrl();

  if (!videoName) {
    showError("No video specified in the address bar. Try adding ?v=yourvideo");
    return;
  }

  // 2. Automatically add .mp4 if the user didn't specify an extension
  if (!videoName.includes(".")) {
    videoName += ".mp4";
  }

  // 3. Build relative path to assets folder
  const videoPath = `./assets/${videoName}`;
  
  // Set Title & Video Source
  videoTitle.textContent = `Playing: ${videoName}`;
  videoSource.src = videoPath;

  // Infer basic MIME type
  if (videoName.endsWith(".webm")) videoSource.type = "video/webm";
  else if (videoName.endsWith(".ogg")) videoSource.type = "video/ogg";
  else videoSource.type = "video/mp4";

  // Reload player with new source
  videoPlayer.load();

  // Handle file load errors (e.g., video doesn't exist in /assets)
  videoPlayer.addEventListener("error", () => {
    showError(`Could not load "${videoName}". Make sure the file exists in your /assets folder.`);
  }, true);

  function showError(message) {
    videoTitle.textContent = "Error";
    videoPlayer.style.display = "none";
    errorMessage.style.display = "block";
    errorDetails.textContent = message;
  }

  // Helper function to extract name from parameters, hashes, or path
  function getVideoNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    
    // Checks for ?v=name or ?video=name
    let name = params.get("v") || params.get("video");

    // Checks for #name (e.g. site.com/#myvideo)
    if (!name && window.location.hash) {
      name = window.location.hash.substring(1);
    }

    // Checks for path (e.g. site.com/video/myvideo)
    if (!name) {
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && lastSegment !== "video" && !lastSegment.endsWith(".html")) {
        name = lastSegment;
      }
    }

    return name ? decodeURIComponent(name) : null;
  }
});
