// script.js (expanded logic for cinematic effects, save system, new ending trigger, and interactivity)

const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const appScreen = document.getElementById("appScreen");
const appContent = document.getElementById("appContent");
const unlockInput = document.getElementById("unlockInput");
const unlockError = document.getElementById("unlockError");
const lockTime = document.getElementById("lockTime");
const endScreen = document.getElementById("endScreen");
const screenElement = document.getElementById("screen"); // Get the screen element for effects

const PASSCODE = "0420"; // The actual password - double-checked: it's "0420" (a string literal)
const SAVE_KEY = "phoneMysterySave";

// --- Game State ---
let gameState = {
  unlocked: false,
  viewedApps: [],
  foundClues: 0,
  totalClues: 12, // Increased total clues for longer play with new interactions
  gameStartTime: Date.now(),
  secretMessageRead: false,
  browserPasswordFound: false,
  callTriggered: false,
  notesNotificationShown: false, // Flag to prevent repeated notes notifications
  galleryNotesViewed: false,
  // Message conversation states
  conversations: {
    'Unknown': {
      messages: [
        { sender: 'Unknown', text: "It's too late..." },
        { sender: 'Rowan', text: "I'm leaving this phone behind. If someone finds it, follow the trail: gallery → files → notes." }
      ],
      currentStage: 0, // 0: initial, 1: after player reply
      options: [
        { text: "Who is this?", action: "replyToUnknown(1)" },
        { text: "What happened?", action: "replyToUnknown(1)" }
      ]
    },
    'Alice': {
      messages: [
        { sender: 'Alice', text: "You always used 0420 like a joke lol. Stay safe, idiot 💚" },
        { sender: 'Alice', text: "Did you check the browser history? There was a weird link... starts with 'anomaly'" }
      ],
      currentStage: 0, // 0: initial, 1: after player reply to first set
      options: [
        { text: "I found the phone. What's going on?", action: "replyToAlice(1)" }
      ]
    }
    // Add more contacts here if needed
  },
};

// --- Game State & Save System ---
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function loadGame() {
  const save = localStorage.getItem(SAVE_KEY);
  if (save) {
    const loadedState = JSON.parse(save);
    // Merge loaded state with default state to ensure new properties are added
    gameState = { ...gameState, ...loadedState };

    if (gameState.unlocked) {
      lockScreen.classList.add("hidden");
      homeScreen.classList.remove("hidden");
      // Ensure clock updates to real time after unlock if loaded as unlocked
      updateClock();
    } else {
      // Ensure clock stays at 04:20 if still locked after loading
      updateClock();
    }
    // Ensure the notes app's special button is visible if enough clues are found
    if (gameState.foundClues >= gameState.totalClues && document.getElementById("notesUnlockButton")) {
      document.getElementById("notesUnlockButton").classList.remove("hidden");
    }
  } else {
    // If no save, ensure clock starts at 04:20
    updateClock();
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
  // FIX: Always show 04:20 on lock screen unless explicitly unlocked
  if (!gameState.unlocked) {
    lockTime.textContent = `04:20`;
  } else {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    lockTime.textContent = `${hrs}:${mins}`;
  }
}

setInterval(updateClock, 1000); // Keep interval running


// --- Unlock Phone ---
function unlockPhone() {
  const code = unlockInput.value;
  // IMPORTANT: Use .trim() to remove any accidental leading/trailing whitespace
  const trimmedCode = code.trim();

  // *** Extensive Debugging Logs - Copy-paste these to me! ***
  console.group("Unlock Attempt Details (Please provide this entire block)");
  console.log("Input field raw value (inside quotes):", `'${code}'`);
  console.log("Input field trimmed value (inside quotes):", `'${trimmedCode}'`);
  console.log("Expected PASSCODE value (inside quotes):", `'${PASSCODE}'`);
  console.log("Type of trimmedCode:", typeof trimmedCode);
  console.log("Type of PASSCODE:", typeof PASSCODE);
  console.log("Length of trimmedCode:", trimmedCode.length);
  console.log("Length of PASSCODE:", PASSCODE.length);
  console.log("Comparison (trimmedCode === PASSCODE):", trimmedCode === PASSCODE);
  console.groupEnd();

  if (trimmedCode === PASSCODE) {
    gameState.unlocked = true;
    saveGame();
    lockScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    showNotification("Phone Unlocked!");
    // Immediately update clock to real time after successful unlock
    updateClock();
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
  // Mark app as viewed for clue tracking - only if not already viewed for this app
  // This is a general app view, specific interactions will increment clues further
  if (!gameState.viewedApps.includes(appName)) {
    gameState.viewedApps.push(appName);
    gameState.foundClues++; // Viewing an app is a basic clue
    saveGame();
  }

  // BUG FIX: Only show notes notification once when threshold is met
  if (gameState.foundClues >= gameState.totalClues && !gameState.notesNotificationShown) {
    showNotification("Something new appeared in Notes!");
    gameState.notesNotificationShown = true;
    saveGame(); // Save state of notification shown
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
  appScreen.scrollTop = 0; // Reset scroll position when going home
  homeScreen.classList.remove("hidden");
}

// --- Messaging System ---
function renderMessagesApp() {
  let contactsHtml = `<h3>Messages</h3><div class="message-contact-list">`;
  for (const contactName in gameState.conversations) {
    const convo = gameState.conversations[contactName];
    // Display last message from the last actor (could be player or other)
    const lastMessage = convo.messages[convo.messages.length - 1];
    contactsHtml += `
      <div class="message-contact-item" onclick="openChat('${contactName}')">
        <span>${contactName}</span>
        <span class="status">${lastMessage.text.substring(0, 30)}...</span>
      </div>
    `;
  }
  contactsHtml += `</div>`;
  appContent.innerHTML = contactsHtml;
}

function openChat(contactName) {
  const convo = gameState.conversations[contactName];
  let chatHtml = `
    <h3 style="margin-top:0;">${contactName}</h3>
    <div class="chat-view">
      <div class="chat-messages" id="chatMessages">
  `;
  convo.messages.forEach(msg => {
    const senderClass = msg.sender === 'Rowan' || msg.sender === 'Unknown' || msg.sender === 'Alice' ? 'sender-other' : 'sender-player';
    chatHtml += `<div class="chat-message ${senderClass}">${msg.text}</div>`;
  });
  chatHtml += `</div>`; // Close chat-messages

  // Add options if available for the current stage
  if (convo.options && convo.options.length > 0) {
    chatHtml += `<div class="message-options">`;
    convo.options.forEach(option => {
      chatHtml += `<button onclick="${option.action}">${option.text}</button>`;
    });
    chatHtml += `</div>`;
  }
  chatHtml += `</div>`; // Close chat-view
  appContent.innerHTML = chatHtml;

  // Scroll to bottom of messages after rendering
  setTimeout(() => {
    const chatMessagesDiv = document.getElementById('chatMessages');
    if (chatMessagesDiv) {
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
  }, 50); // Small delay to ensure content is rendered
}

// Player replies will update conversation state and add new messages
function replyToUnknown(stage) {
  const convo = gameState.conversations['Unknown'];
  if (stage === 1 && convo.currentStage === 0) {
    convo.messages.push({ sender: 'You', text: "Who is this?" });
    convo.currentStage = 1;
    convo.options = []; // No more options for this thread, or add new ones
    gameState.foundClues++; // Player interaction is a clue
    saveGame();
    showNotification("New message from 'Unknown'!"); // Subtle hint for next message
    // Simulate a reply after a short delay
    setTimeout(() => {
        convo.messages.push({ sender: 'Unknown', text: "Your query has been noted. Do not interfere further." });
        openChat('Unknown'); // Re-render to show update
        saveGame();
    }, 1500);
  }
  openChat('Unknown'); // Always open chat after reply
}

function replyToAlice(stage) {
  const convo = gameState.conversations['Alice'];
  if (stage === 1 && convo.currentStage === 0) {
    convo.messages.push({ sender: 'You', text: "I found the phone. What's going on?" });
    convo.currentStage = 1;
    convo.options = []; // No more options for this stage
    gameState.foundClues++; // Player interaction is a clue
    saveGame();
    showNotification("Alice is typing...");
    setTimeout(() => {
        convo.messages.push({ sender: 'Alice', text: "OMG! You found it! Rowan was onto something big, a 'Project Simulacra'. They left more clues... look for 'Alpha_712' in images or audio logs. It's a password!" });
        // Add more follow-up messages from Alice to extend conversation
        setTimeout(() => {
            convo.messages.push({ sender: 'Alice', text: "And there's a hidden sketch in the gallery. Rowan mentioned it had a new delivery route." });
            convo.messages.push({ sender: 'Alice', text: "I'll try calling again later. Stay safe!" });
            openChat('Alice'); // Re-render to show update
            saveGame();
        }, 1500); // Alice's second message
    }, 1500); // Alice's first message
  }
  openChat('Alice'); // Always open chat after reply
}


// --- App Content Rendering ---
function renderApp(appName) {
  let content = "";
  switch (appName) {
    case "messages":
      renderMessagesApp(); // Calls the new rendering function for messages
      return; // Exit after rendering messages app
    case "gallery":
      content = `
        <h3>Gallery</h3>
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
        <div class="image-entry">
          <p><strong>🏞️ Personal Photo:</strong> "Camping trip last summer. Good times."</p>
          <img src="https://placehold.co/300x200/888800/FFFFFF?text=Camping+Trip" alt="Camping Trip" />
        </div>
        <div class="image-entry">
          <p><strong>🏠 Personal Photo:</strong> "My old apartment."</p>
          <img src="https://placehold.co/300x200/444444/FFFFFF?text=Old+Apartment" alt="Old Apartment" />
        </div>
        ${gameState.galleryNotesViewed ? `
          <div class="image-entry">
            <p><strong>📝 Note from Rowan:</strong> "Found this. It's the old warehouse, new delivery route."</p>
            <img src="https://placehold.co/300x200/FF00FF/000000?text=Warehouse+Sketch" alt="Warehouse Sketch" />
            <p><em>(A rough sketch of a building with arrows, one pointing to 'Dock B')</em></p>
          </div>
        ` : `<button onclick="triggerGalleryNote()">Load More Personal Photos</button>`}
      `;
      break;
    case "files":
      content = `
        <h3>Files</h3>
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
        <h3>Notes</h3>
        <p><strong>🔑 Note 1:</strong> "Files opened. Final step: call your last contact... or override timer if all clues found."</p>
        <p><strong>🔑 Note 2:</strong> "The camera shows what's hidden. Check when it glitches."</p>
        <p><strong>🔑 Note 3:</strong> "The browser stores all secrets. Look for 'anomaly' and a three-digit code."</p>
        <p><strong>🔑 Note 4:</strong> "Alice's messages hold more recent intel. Reply to her to get the full picture."</p>
        <button id="notesUnlockButton" class="${gameState.foundClues >= gameState.totalClues ? '' : 'hidden'}" onclick="finalStep()">Initiate Final Contact</button>
      `;
      break;
    case "audio":
      content = `
        <h3>Audio</h3>
        <p><em>Encrypted voice log #4</em></p>
        <audio controls>
          <!-- TODO: Place your audio file here: <source src="assets/audio/log4_decoded.mp3" type="audio/mpeg"> -->
          Your browser does not support the audio element.
        </audio>
        <p><strong>Audio Log Text:</strong> "...I repeat: do NOT trust the agency. Project Simulacra is alive. They are tracking devices with subnetwork '712'. The override code is found in the main browser history. It's an old agency password, begins with 'alpha'..."</p>
        <p><em>(Audio ends abruptly with static)</em></p>
      `;
      break;
    case "calls":
      content = `
        <h3>Calls</h3>
        <div class="call-entry">
          <p><strong>📞 Missed:</strong> +41 333 940 2019 (Alice)</p>
          <p><strong>📞 Voicemail:</strong> "Rowan, meet me at the old station... they’re watching the networks. I found something important about the 'alpha' network password."</p>
        </div>
        <button onclick="attemptCall('+413339402019')">Call Alice</button>
      `;
      break;
    case "camera":
      content = `
        <h3>Camera</h3>
        <p><strong>Camera Glitch Detected</strong></p>
        <img src="https://placehold.co/300x200/FF0000/FFFFFF?text=GLITCH+SIMULACRA+%0AALPHA_712" alt="Camera Glitch showing SIMULACRA and Alpha_712" />
        <p>Glitched overlay reveals word: "SIMULACRA" in lower right corner. A hidden message flickers: "Alpha_712"</p>
      `;
      break;
    case "settings":
      content = `
        <h3>Settings</h3>
        <p><strong>Debug Menu:</strong></p>
        <p>✔️ Diagnostics: Phone integrity low</p>
        <p>✔️ Owner ID: ROWAN.LAST.SIGNAL</p>
        <p>✔️ Final coordinate ping: 04/20 04:20</p>
        <button onclick="resetGame()">🔁 Reset Game</button>
      `;
      break;
    case "browser":
      content = `
        <h3>Browser History</h3>
        <p><strong>Search:</strong> "Project Simulacra anomaly"</p>
        <div class="file-entry">
          <p><strong>Site:</strong> <a href="#" onclick="checkBrowserPassword()">anomaly-research.net/secret-data</a></p>
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

function triggerGalleryNote() {
    if (!gameState.galleryNotesViewed) { // Ensure this only counts as a clue once
        gameState.galleryNotesViewed = true;
        gameState.foundClues++;
        saveGame();
        showNotification("New note discovered in Gallery!");
    }
    renderApp('gallery'); // Re-render gallery to show new content
}

function decryptFile(fileName) {
  if (fileName === "missing.txt") {
    // Requires Alice's conversation to be advanced to stage 1 (where she gives the password hint)
    if (gameState.viewedApps.includes("gallery") && gameState.viewedApps.includes("audio") && gameState.viewedApps.includes("camera") && gameState.conversations.Alice.currentStage >= 1) {
      if (!gameState.secretMessageRead) { // Ensure clue is only incremented once
        gameState.secretMessageRead = true;
        gameState.foundClues++;
        saveGame();
        showNotification("File Decrypted: New information in 'missing.txt'!");
      }
      renderApp("files"); // Re-render the app to show new content
    } else {
      displayModal("Insufficient data to decrypt. You need more clues, try talking to Alice in messages!", "Decryption Failed");
    }
  }
}

function checkBrowserPassword() {
  const passwordInput = document.getElementById("browserPassword");
  const errorDisplay = document.getElementById("browserError");
  const enteredPassword = passwordInput.value;

  if (enteredPassword === "alpha_712") { // Password from camera glitch and audio log
    if (!gameState.browserPasswordFound) { // Ensure clue is only incremented once
      gameState.browserPasswordFound = true;
      gameState.foundClues++;
      saveGame();
      showNotification("Critical data accessed! Check Notes or Calls for next step.");
    }
    errorDisplay.textContent = "Access Granted! New information found.";
    passwordInput.disabled = true;
    document.querySelector('#browser button').disabled = true;
    if (gameState.foundClues >= gameState.totalClues && gameState.browserPasswordFound && gameState.secretMessageRead) {
      setTimeout(finalStep, 2000); // Auto-trigger end after 2 seconds
    }
  } else {
    errorDisplay.textContent = "Incorrect password.";
    triggerShake();
  }
}

function attemptCall(number) {
  // Ensure Alice's conversation is advanced and other critical clues found
if (gameState.foundClues >= gameState.totalClues && gameState.browserPasswordFound && gameState.secretMessageRead && gameState.conversations.Alice.currentStage >= 1) {
    if (!gameState.callTriggered) { // Ensure this only triggers once
      gameState.callTriggered = true;
      gameState.foundClues++; // Triggering call is a clue
      saveGame();
      showNotification("Attempting call...");
      setTimeout(() => {
        showNotification("Call failed. Voicemail activated. Listen closely.");
        setTimeout(finalStep, 3000);
      }, 2000);
    }
  } else {
    displayModal("No one is answering. You need more information to make this call matter, especially from Alice's messages.", "Call Failed");
  }
}

function finalStep() {
  // Removed elapsed time check for easier playtesting
  if (gameState.foundClues >= gameState.totalClues && gameState.browserPasswordFound && gameState.secretMessageRead && gameState.conversations.Alice.currentStage >= 1 && gameState.galleryNotesViewed && gameState.callTriggered) {
    appScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    showNotification("Case Solved! Accessing final transmission...");
  } else {
    displayModal("You need to find all critical clues before initiating the final contact. Have you explored all messages and gallery notes, and attempted the call?", "Missing Clues!");
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
// This ensures updateClock is called immediately, before loadGame,
// so the 04:20 time is shown from the very beginning.
updateClock();
loadGame();
