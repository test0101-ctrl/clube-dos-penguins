// script.js (expanded logic for cinematic effects, save system, new ending trigger)

const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const appScreen = document.getElementById("appScreen");
const appContent = document.getElementById("appContent");
const unlockInput = document.getElementById("unlockInput");
const unlockError = document.getElementById("unlockError");
const lockTime = document.getElementById("lockTime");
const endScreen = document.getElementById("endScreen");
const screenElement = document.getElementById("screen"); // Get the screen element for effects

const PASSCODE = "0420";
const SAVE_KEY = "phoneMysterySave";

let gameState = {
  unlocked: false,
  viewedApps: [],
  foundClues: 0,
  totalClues: 8, // Increased total clues for longer play
  gameStartTime: Date.now(),
  secretMessageRead: false,
  browserPasswordFound: false,
  callTriggered: false,
};

// --- Game State & Save System ---
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function loadGame() {
  const save = localStorage.getItem(SAVE_KEY);
  if (save) {
    gameState = JSON.parse(save);
    if (gameState.unlocked) {
      lockScreen.classList.add("hidden");
      homeScreen.classList.remove("hidden");
    }
  }
}

// --- Cinematic Effects ---
function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;
  screenElement.prepend(notification); // Add to the top of the screen
  setTimeout(() => {
    notification.remove();
  }, 5000); // Remove after 5 seconds (includes animation time)
}

function triggerShake() {
  screenElement.classList.add("shake");
  setTimeout(() => {
    screenElement.classList.remove("shake");
  }, 300); // Duration of the shake animation
}

// --- Clock ---
function updateClock() {
  if (!gameState.unlocked) {
    lockTime.textContent = `04:20`; // Fixed to 04:20 until unlocked
  } else {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    lockTime.textContent = `${hrs}:${mins}`;
  }
}

setInterval(updateClock, 1000);
updateClock(); // Call initially to set the 04:20 time

// --- Unlock Phone ---
function unlockPhone() {
  const code = unlockInput.value;
  if (code === PASSCODE) {
    gameState.unlocked = true;
    saveGame();
    lockScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    showNotification("Phone Unlocked!");
    // Trigger initial cinematic sequence or clue
    setTimeout(() => {
      showNotification("New message from 'Unknown'...");
    }, 2000); // 2 seconds after unlock
  } else {
    unlockError.textContent = "Incorrect passcode.";
    triggerShake(); // Cinematic shake
    unlockInput.value = ""; // Clear input on error
  }
}

// --- App Management ---
function openApp(appName) {
  // Mark app as viewed for clue tracking
  if (!gameState.viewedApps.includes(appName)) {
    gameState.viewedApps.push(appName);
    gameState.foundClues++;
    saveGame();
  }

  // Check for game progression triggers
  if (gameState.foundClues >= gameState.totalClues && !gameState.secretMessageRead) {
    // Reveal a new clue or activate a button in the notes app
    showNotification("Something new appeared in Notes!");
    // Ensure the notes app's special button is visible if enough clues are found
    if (document.getElementById("notesUnlockButton")) {
        document.getElementById("notesUnlockButton").classList.remove("hidden");
    }
  }

  homeScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  renderApp(appName);
}

function goHome() {
  appScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}

// --- App Content Rendering ---
function renderApp(appName) {
  let content = "";
  switch (appName) {
    case "messages":
      content = `
        <p><strong>Unknown:</strong> It's too late...</p>
        <p><strong>Rowan:</strong> I'm leaving this phone behind. If someone finds it, follow the trail: gallery → files → notes.</p>
        <p><strong>Alice:</strong> You always used 0420 like a joke lol. Stay safe, idiot 💚</p>
        <p><strong>Alice:</strong> Did you check the browser history? There was a weird link... starts with 'anomaly'</p>
        ${gameState.secretMessageRead ? '<p><strong>System Alert:</strong> Decrypted message found in "SECRET/ROWAN/message.txt".</p>' : ''}
        ${gameState.callTriggered ? '<p><strong>Incoming Call:</strong> +41 333 940 2019... (Missed)</p>' : ''}
      `;
      break;
    case "gallery":
      content = `
        <div class="image-entry">
          <p><strong>📸 Clue #1:</strong> File name: X-19B4.CAM - shows blurred screen with folder: <em>SECRET/ROWAN</em></p>
          <img src="https://placehold.co/300x200/222222/00ff88?text=SECRET/ROWAN+(BLURRED)" alt="Blurred folder image" />
          <p>📌 Hidden in metadata: date "04/19", coord: 45.0° N, 122.0° W</p>
        </div>
        <div class="image-entry">
          <p><strong>📸 Clue #2:</strong> Corrupted Image - looks like static but a faint shape is visible.</p>
          <img src="https://placehold.co/300x200/000000/cccccc?text=STATIC+712" alt="Corrupted static image" />
          <p><em>(Examine closely: a sequence of numbers is barely visible: 712)</em></p>
        </div>
      `;
      break;
    case "files":
      content = `
        <div class="file-entry">
          <p><strong>📁 SECRET/ROWAN/missing.txt</strong></p>
          ${gameState.secretMessageRead ? '<p>"My contact, Alice, knows the full story. Her number is in my calls. The final piece is in the browser history, under a search for "Project Simulacra anomaly". The password for that entry starts with \'alpha\'."</p>' : '<p>"Operation Echo failed. I suspect I\'m being watched. The phone holds evidence, but it’s encrypted in layers."</p><button onclick="decryptFile(\'missing.txt\')">Decrypt</button>'}
        </div>
        <div class="file-entry">
          <p><strong>📁 SYSTEM/log_0420.sys</strong></p>
          <p>Audio pattern anomaly. Warning: unauthorized file tampering detected.</p>
        </div>
        <div class="file-entry">
          <p><strong>📁 Documents/Research/subnetwork_712_report.pdf</strong></p>
          <p>A brief report on strange network activities. Keywords: "Project Simulacra", "Subnetwork 712".</p>
        </div>
      `;
      break;
    case "notes":
      content = `
        <p><strong>🔑 Note 1:</strong> "Files opened. Final step: call your last contact... or override timer if all clues found."</p>
        <p><strong>🔑 Note 2:</strong> "The camera shows what's hidden. Check when it glitches."</p>
        <p><strong>🔑 Note 3:</strong> "The browser stores all secrets. Look for 'anomaly' and a three-digit code."</p>
        <button id="notesUnlockButton" class="${gameState.foundClues >= gameState.totalClues ? '' : 'hidden'}" onclick="finalStep()">Initiate Final Contact</button>
      `;
      break;
    case "audio":
      content = `
        <p><em>Encrypted voice log #4</em></p>
        <audio controls>
          <!-- TODO: Place your audio file here. For example: <source src="assets/audio/log4_decoded.mp3" type="audio/mpeg"> -->
          Your browser does not support the audio element.
        </audio>
        <p><strong>Audio Log Text:</strong> "...I repeat: do NOT trust the agency. Project Simulacra is alive. They are tracking devices with subnetwork '712'. The override code is found in the main browser history. It's an old agency password, begins with 'alpha'..."</p>
        <p><em>(Audio ends abruptly with static)</em></p>
      `;
      break;
    case "calls":
      content = `
        <div class="call-entry">
          <p><strong>📞 Missed:</strong> +41 333 940 2019 (Alice)</p>
          <p><strong>📞 Voicemail:</strong> "Rowan, meet me at the old station... they’re watching the networks. I found something important about the 'alpha' network password."</p>
        </div>
        <button onclick="attemptCall('+413339402019')">Call Alice</button>
      `;
      break;
    case "camera":
      content = `
        <p><strong>Camera Glitch Detected</strong></p>
        <img src="https://placehold.co/300x200/FF0000/FFFFFF?text=GLITCH+SIMULACRA+%0AALPHA_712" alt="Camera Glitch showing SIMULACRA and Alpha_712" />
        <p>Glitched overlay reveals word: "SIMULACRA" in lower right corner. A hidden message flickers: "Alpha_712"</p>
      `;
      break;
    case "settings":
      content = `
        <p><strong>Debug Menu:</strong></p>
        <p>✔️ Diagnostics: Phone integrity low</p>
        <p>✔️ Owner ID: ROWAN.LAST.SIGNAL</p>
        <p>✔️ Final coordinate ping: 04/20 04:20</p>
        <button onclick="resetGame()">🔁 Reset Game</button>
      `;
      break;
    case "browser": // New App
      content = `
        <h3>Browser History</h3>
        <p><strong>Search:</strong> "Project Simulacra anomaly"</p>
        <div class="file-entry">
          <p><strong>Site:</strong> <a href="#" onclick="openSecretSite('anomaly-research.net', 'alpha_712')">anomaly-research.net/secret-data</a></p>
          <p><em>Password protected.</em></p>
          <input type="password" id="browserPassword" placeholder="Enter password" />
          <button onclick="checkBrowserPassword()">Access Site</button>
          <p id="browserError" style="color: red;"></p>
        </div>
        <p><strong>Search:</strong> "how to encrypt phone data"</p>
        <p><strong>Visited:</strong> "local news porto"</p>
      `;
      break;
    default:
      content = "<p>App not found.</p>";
  }
  appContent.innerHTML = content;
}

// --- Specific Game Actions ---

function decryptFile(fileName) {
  if (fileName === "missing.txt") {
    // This could be unlocked by finding a specific clue, like the "712" from the gallery
    if (gameState.viewedApps.includes("gallery") && gameState.viewedApps.includes("audio") && gameState.viewedApps.includes("camera")) {
      gameState.secretMessageRead = true;
      gameState.foundClues++; // Count as another clue
      saveGame();
      showNotification("File Decrypted: New information in 'missing.txt'!");
      renderApp("files"); // Re-render the app to show new content
    } else {
      showNotification("Insufficient data to decrypt. Look for more clues!");
    }
  }
}

function checkBrowserPassword() {
  const passwordInput = document.getElementById("browserPassword");
  const errorDisplay = document.getElementById("browserError");
  const enteredPassword = passwordInput.value;

  if (enteredPassword === "alpha_712") { // Password from camera glitch and audio log
    gameState.browserPasswordFound = true;
    gameState.foundClues++; // Count as another clue
    saveGame();
    errorDisplay.textContent = "Access Granted! New information found.";
    // This could trigger the final step or reveal a crucial final clue
    showNotification("Critical data accessed! Check Notes or Calls for next step.");
    // Re-render browser content or show new button
    passwordInput.disabled = true;
    document.querySelector('#browser button').disabled = true;
    // Potentially auto-trigger final step if all conditions met
    if (gameState.foundClues >= gameState.totalClues && gameState.browserPasswordFound && gameState.secretMessageRead) {
      setTimeout(finalStep, 2000); // Auto-trigger end after 2 seconds
    }
  } else {
    errorDisplay.textContent = "Incorrect password.";
    triggerShake();
  }
}

function attemptCall(number) {
  // This could be the final trigger if all other clues are found
  if (gameState.foundClues >= gameState.totalClues && gameState.browserPasswordFound && gameState.secretMessageRead) {
    gameState.callTriggered = true;
    saveGame();
    showNotification("Attempting call...");
    setTimeout(() => {
      showNotification("Call failed. Voicemail activated. Listen closely.");
      // This could then lead to the end screen after a short delay
      setTimeout(finalStep, 3000);
    }, 2000);
  } else {
    showNotification("No one is answering. You need more information to make this call matter.");
  }
}

function finalStep() {
  const elapsed = (Date.now() - gameState.gameStartTime) / 1000;

  // Ensure minimum playtime and all critical clues are found
  if (elapsed >= 600 && gameState.foundClues >= gameState.totalClues && gameState.browserPasswordFound && gameState.secretMessageRead) {
    appScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    showNotification("Case Solved! Accessing final transmission...");
  } else if (elapsed < 600) {
    // Using a modal instead of alert for better UX
    displayModal(`You need to investigate more clues and play for at least ${Math.ceil((600 - elapsed) / 60)} more minutes.`, "Hold On!");
  } else {
    displayModal("You need to find all critical clues before initiating the final contact.", "Missing Clues!");
  }
}

// Custom Modal for Messages (instead of alert)
function displayModal(message, title = "Message") {
  const modalHtml = `
    <div id="customModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div style="background: #222; padding: 20px; border-radius: 10px; border: 2px solid #00ff88; color: white; text-align: center; width: 80%; max-width: 400px;">
        <h3 style="color: #00ff88; margin-top: 0;">${title}</h3>
        <p>${message}</p>
        <button onclick="document.getElementById('customModal').remove()" style="background-color: #00ff88; border: none; padding: 10px 20px; font-size: 1rem; color: #000; cursor: pointer; border-radius: 8px; margin-top: 15px;">OK</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}


function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

// --- Initialize Game ---
loadGame();
          
