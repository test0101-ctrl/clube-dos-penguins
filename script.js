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
      content = "<p><strong>Unknown:</strong> Did you find it yet?</p><p><strong>Unknown:</strong> Don't trust what you see in the photos...</p>";
      break;
    case "gallery":
      content = "<p>📸 [Corrupted image]<br>🗺 Coordinates found: 51.5074° N, 0.1278° W</p>";
      break;
    case "notes":
      content = "<p>"Remember: the signal weakens when close to the truth."
                <br>- Observer</p>";
      break;
    case "audio":
      content = "<p><em>Playing voice log...</em><br>\"They're coming... the signal isn't safe...\"</p>";
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
