const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const appScreen = document.getElementById("appScreen");
const appContent = document.getElementById("appContent");
const unlockInput = document.getElementById("unlockInput");
const unlockError = document.getElementById("unlockError");
const lockTime = document.getElementById("lockTime");

const PASSCODE = "0420";

function updateClock() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  lockTime.textContent = `${hrs}:${mins}`;
}

setInterval(updateClock, 1000);
updateClock();

function unlockPhone() {
  const code = unlockInput.value;
  if (code === PASSCODE) {
    lockScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
  } else {
    unlockError.textContent = "Incorrect passcode.";
  }
}

function openApp(appName) {
  homeScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  let content = "";

  switch (appName) {
    case "messages":
      content = `
        <p><strong>Unknown:</strong> Did you find it yet?</p>
        <p><strong>Unknown:</strong> Don't trust what you see in the photos...</p>
        <p><strong>Alice:</strong> 04/20 was your favorite number combo lol. Hope you remember that.</p>
      `;
      break;
    case "gallery":
      content = `
        <div class="image-entry">
          <p><strong>📸 [Corrupted image]</strong></p>
          <p>🗺 Coordinates found: 51.5074° N, 0.1278° W</p>
        </div>
        <div class="image-entry">
          <img src="https://via.placeholder.com/150/000000/00ff88?text=Distorted" alt="Corrupted" />
        </div>
      `;
      break;
    case "notes":
      content = `
        <p>"Remember: the signal weakens when close to the truth."<br>- Observer</p>
        <p>Decryption Key: 91B3-A7XZ</p>
        <p>Hint: Alice always used 0420 for silly things.</p>
      `;
      break;
    case "audio":
      content = `
        <p><em>Playing voice log...</em><br>"They're coming... the signal isn't safe..."</p>
        <audio controls>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      `;
      break;
    case "calls":
      content = `
        <div class="call-entry">
          <p><strong>Incoming call:</strong> Unknown Number</p>
          <p>Time: 2:34 AM</p>
          <p>Status: Missed</p>
        </div>
        <div class="call-entry">
          <p><strong>Voicemail:</strong></p>
          <p>"You were warned. This is your last chance."</p>
        </div>
      `;
      break;
    case "camera":
      content = `
        <p><strong>Camera App</strong></p>
        <p>Error: Camera failed to load (static distortion effect).</p>
        <p><em>Access denied. System integrity compromised.</em></p>
      `;
      break;
    default:
      content = "<p>App not found.</p>";
  }

  appContent.innerHTML = content;
}

function goHome() {
  appScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}
