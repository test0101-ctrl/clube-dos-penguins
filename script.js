const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const appScreen = document.getElementById("appScreen");
const appContent = document.getElementById("appContent");
const unlockInput = document.getElementById("unlockInput");
const unlockError = document.getElementById("unlockError");
const lockTime = document.getElementById("lockTime");
const endScreen = document.getElementById("endScreen");

const PASSCODE = "0420";
let foundOwner = false;

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
        <p><strong>Unknown:</strong> It's too late...</p>
        <p><strong>Rowan:</strong> I'm leaving this phone behind. If someone finds it, follow the trail: gallery → files → notes.</p>
        <p><strong>Alice:</strong> You always used 0420 like a joke lol. Stay safe, idiot 💚</p>
      `;
      break;
    case "gallery":
      content = `
        <div class="image-entry">
          <p><strong>📸 Clue #1:</strong> File name: X-19B4.CAM - shows blurred screen with folder: <em>SECRET/ROWAN</em></p>
          <img src="https://via.placeholder.com/150/111111/00ff88?text=Clue1" alt="Clue 1" />
        </div>
        <div class="image-entry">
          <p>📌 Hidden in metadata: date "04/19", coord: 45.0° N, 122.0° W</p>
        </div>
      `;
      break;
    case "files":
      content = `
        <div class="file-entry">
          <p><strong>📁 SECRET/ROWAN/missing.txt</strong></p>
          <p>"Operation Echo failed. I suspect I'm being watched. The phone holds evidence, but it’s encrypted in layers."</p>
        </div>
        <div class="file-entry">
          <p><strong>📁 SYSTEM/log_0420.sys</strong></p>
          <p>Audio pattern anomaly. Warning: unauthorized file tampering detected.</p>
        </div>
      `;
      break;
    case "notes":
      content = `
        <p><strong>🔑 Note 1:</strong> "Files opened. Final step: call your last contact... but only at 04:20."</p>
        <p><strong>🔑 Note 2:</strong> "The camera shows what's hidden. Check when it glitches."</p>
        <button onclick="finalStep()">Make final call</button>
      `;
      break;
    case "audio":
      content = `
        <p><em>Encrypted voice log #4</em></p>
        <audio controls>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
        </audio>
        <p>"...I repeat: do NOT trust the agency. Project Simulacra is alive."</p>
      `;
      break;
    case "calls":
      content = `
        <div class="call-entry">
          <p><strong>📞 Missed:</strong> +41 333 940 2019</p>
          <p><strong>📞 Voicemail:</strong> "Rowan, meet me at the old station... they’re watching the networks."</p>
        </div>
      `;
      break;
    case "camera":
      content = `
        <p><strong>Camera Glitch Detected</strong></p>
        <p>Glitched overlay reveals word: "SIMULACRA" in lower right corner.</p>
      `;
      break;
    case "settings":
      content = `
        <p><strong>Debug Menu:</strong></p>
        <p>✔️ Diagnostics: Phone integrity low</p>
        <p>✔️ Owner ID: ROWAN.LAST.SIGNAL</p>
        <p>✔️ Final coordinate ping: 04/20 04:20</p>
      `;
      break;
    default:
      content = "<p>App not found.</p>";
  }

  appContent.innerHTML = content;
}

function finalStep() {
  const now = new Date();
  if (now.getHours() === 4 && now.getMinutes() === 20) {
    foundOwner = true;
    appScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
  } else {
    alert("The call only works at 04:20. Try again later.");
  }
}

function goHome() {
  appScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
        }
        
