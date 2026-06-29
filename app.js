// Indian Version - Interactive Client Logic for LifeBridge AI - Emergency & Disaster Assistant

// State Management
let map = null;
let currentMarkers = [];
let routePolyline = null;
let currentScenario = "mumbai_flood";
let isNetworkOnline = true;
let isMetronomeRunning = false;
let metronomeInterval = null;
let audioCtx = null;
let alarmAudioInterval = null;
let userSOSMarker = null;

// Mock family data (Indian Names)
let familyMembers = [
  { name: "Amit (Father)", status: "SAFE", coords: "19.0780, 72.8750", updated: "10 mins ago" },
  { name: "Priya (Sister)", status: "UNREACHABLE", coords: "19.0620, 72.8580", updated: "2 hours ago" },
  { name: "Rajesh (Uncle)", status: "DANGER", coords: "19.0840, 72.8880", updated: "30 mins ago" }
];

// Mock Community Reports (Indian Context)
let communityReports = [
  { id: 1, title: "Severe Waterlogging near Hindmata", desc: "Water rising rapidly to waist height. Local ward officers turning vehicles around.", severity: "warning", time: "5 mins ago" },
  { id: 2, title: "Devprayag Landslide block (NH-58)", desc: "Heavy boulders blocking Dehradun routes. Route halted by SDRF.", severity: "critical", time: "15 mins ago" },
  { id: 3, title: "Kurla Shelter Capacity Reached", desc: "Kurla Community Center is completely full. People directed to Dadar East.", severity: "critical", time: "40 mins ago" }
];

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  initMap();
  setupEventListeners();
  loadScenario(currentScenario);
  loadFirstAidGuide("cpr");
  updateFamilyBoard();
  updateReportFeed();
  
  // Initialize Lucide vector icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

// 1. Map Initialization (Leaflet.js)
function initMap() {
  const defaultCoords = SCENARIOS[currentScenario].coords;
  const defaultZoom = SCENARIOS[currentScenario].zoom;
  
  map = L.map("map", {
    zoomControl: true,
    attributionControl: false
  }).setView(defaultCoords, defaultZoom);

  // Load beautiful Dark Map Tiles (CartoDB Dark Matter)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19
  }).addTo(map);
}

// 2. Scenario Loader & Updater
function loadScenario(scenarioKey) {
  currentScenario = scenarioKey;
  const scenario = SCENARIOS[scenarioKey];
  if (!scenario) return;

  // Fly to scenario coordinates
  map.setView(scenario.coords, scenario.zoom);

  // Clear existing pins
  currentMarkers.forEach(m => map.removeLayer(m));
  currentMarkers = [];
  if (routePolyline) {
    map.removeLayer(routePolyline);
    routePolyline = null;
  }
  if (userSOSMarker) {
    map.removeLayer(userSOSMarker);
    userSOSMarker = null;
  }

  // Set Slider Metrics based on Scenario Defaults
  document.getElementById("rain-slider").value = scenario.gauges.rain;
  document.getElementById("wind-slider").value = scenario.gauges.wind;
  document.getElementById("seismic-slider").value = scenario.gauges.seismic;
  updateSensorDisplays();

  // Draw Shelter pins (Blue markers)
  scenario.shelters.forEach(shelter => {
    let color = "#00a8ff"; // Available
    if (shelter.status === "Full") color = "#ff3366";
    else if (shelter.status === "Near Capacity") color = "#feca57";

    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker(shelter.coords, { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <h4>${shelter.name}</h4>
      <p><strong>Status:</strong> ${shelter.status}</p>
      <p><strong>Capacity:</strong> ${shelter.occupied} / ${shelter.capacity} beds</p>
      <p><strong>Amenities:</strong> ${shelter.medical ? "🏥 Medical Support | " : ""}${shelter.food ? "🍱 Food | " : ""}${shelter.water ? "💧 Water" : ""}</p>
      <p><strong>Helpline:</strong> <a href="tel:${shelter.phone}" style="color: var(--neon-cyan)">${shelter.phone}</a></p>
    `);
    currentMarkers.push(marker);
  });

  // Draw Hazards (Red/Orange Warning markers)
  scenario.hazards.forEach(hazard => {
    const color = hazard.severity === "critical" ? "#ff3366" : "#ff9f43";
    
    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `<div class="pulse-marker" style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 12px ${color}"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const marker = L.marker(hazard.coords, { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <h4 style="color: ${color}">${hazard.name}</h4>
      <p><strong>Severity:</strong> <span style="text-transform: uppercase; font-weight: 700; color: ${color}">${hazard.severity}</span></p>
      <p>${hazard.description}</p>
    `);
    currentMarkers.push(marker);
  });

  // Draw Safe Escape Route corridors
  if (scenario.safeRoutes && scenario.safeRoutes.length > 0) {
    routePolyline = L.polyline(scenario.safeRoutes, {
      color: "var(--neon-green)",
      weight: 4,
      opacity: 0.7,
      dashArray: "8, 12",
      lineJoin: "round"
    }).addTo(map);
    
    // Animate dash offset for route flow effect
    let offset = 0;
    setInterval(() => {
      offset = (offset + 1) % 20;
      if (routePolyline) {
        routePolyline.setStyle({ dashOffset: offset });
      }
    }, 150);
  }

  // Populate Interactive Checklist
  loadChecklist(scenario.type.toLowerCase());

  // Refresh Supplies Calculation
  calculateSupplies();

  // If Network is offline, reload the offline cached panel list
  if (!isNetworkOnline) {
    populateOfflineShelters();
  }

  // Reset & Welcome chatbot
  resetChat();

  // Sync family coordination coordinates with mock coordinates matching active city
  syncFamilyCoords(scenario.coords);
}

// Sync family coordinates to make simulation realistic
function syncFamilyCoords(baseCoords) {
  familyMembers[0].coords = `${(baseCoords[0] + 0.002).toFixed(4)}, ${(baseCoords[1] - 0.003).toFixed(4)}`;
  familyMembers[1].coords = `${(baseCoords[0] - 0.012).toFixed(4)}, ${(baseCoords[1] + 0.014).toFixed(4)}`;
  familyMembers[2].coords = `${(baseCoords[0] + 0.008).toFixed(4)}, ${(baseCoords[1] + 0.016).toFixed(4)}`;
  updateFamilyBoard();
}

// 3. Event Listeners Setup
function setupEventListeners() {
  // Scenario Dropdown Selection
  document.getElementById("scenario-select").addEventListener("change", (e) => {
    loadScenario(e.target.value);
  });

  // Network Offline Toggle
  document.getElementById("network-status-checkbox").addEventListener("change", (e) => {
    toggleNetworkMode(e.target.checked);
  });

  // Panic SOS trigger
  document.getElementById("panic-sos-btn").addEventListener("click", () => {
    triggerPanicSOS();
  });

  // Environmental sliders
  const sliders = ["rain", "wind", "seismic"];
  sliders.forEach(key => {
    document.getElementById(`${key}-slider`).addEventListener("input", () => {
      updateSensorDisplays();
      checkDangerThresholds();
    });
  });

  // Supply Calculator triggers
  document.getElementById("calc-people").addEventListener("input", calculateSupplies);
  document.getElementById("calc-days").addEventListener("input", calculateSupplies);

  // First aid tab triggers
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      loadFirstAidGuide(e.target.dataset.guide);
    });
  });

  // CPR Metronome Button
  document.getElementById("metronome-toggle-btn").addEventListener("click", toggleCPRMetronome);

  // Chat submit actions
  document.getElementById("send-chat-btn").addEventListener("click", handleUserChatInput);
  document.getElementById("chat-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserChatInput();
  });
  document.getElementById("clear-chat-btn").addEventListener("click", resetChat);

  // Hazard crowd-sourced reports form submit
  document.getElementById("hazard-report-form").addEventListener("submit", handleReportFormSubmit);

  // Family Checkin buttons
  document.getElementById("family-status-safe-btn").addEventListener("click", () => updateSelfSafetyStatus("SAFE"));
  document.getElementById("family-status-danger-btn").addEventListener("click", () => updateSelfSafetyStatus("DANGER"));

  // Dismiss Emergency Alarm button
  document.getElementById("dismiss-alarm-btn").addEventListener("click", dismissAlarmOverlay);

  // Copy SMS button
  document.getElementById("copy-sms-btn").addEventListener("click", copySMSMessage);
  document.getElementById("sms-status-condition").addEventListener("change", generateSMSString);
}

// 4. Environmental Sensor Gauges & Alarm Synthesis
function updateSensorDisplays() {
  const rain = document.getElementById("rain-slider").value;
  const wind = document.getElementById("wind-slider").value;
  const seismic = document.getElementById("seismic-slider").value;

  document.getElementById("rain-val").innerText = `${rain} mm/h`;
  document.getElementById("wind-val").innerText = `${wind} km/h`;
  document.getElementById("seismic-val").innerText = `${seismic} Richter`;

  // Apply danger glows to metric labels if high
  document.getElementById("rain-val").className = rain > 120 ? "gauge-value text-red animate-pulse" : "gauge-value text-blue";
  document.getElementById("wind-val").className = wind > 180 ? "gauge-value text-red animate-pulse" : "gauge-value text-orange";
  document.getElementById("seismic-val").className = seismic > 5.5 ? "gauge-value text-red animate-pulse" : "gauge-value text-red";
}

function checkDangerThresholds() {
  const rain = parseFloat(document.getElementById("rain-slider").value);
  const wind = parseFloat(document.getElementById("wind-slider").value);
  const seismic = parseFloat(document.getElementById("seismic-slider").value);

  let isTriggered = false;
  let reason = "";

  if (rain > 120) {
    isTriggered = true;
    reason = `Critical Flash Flood Warning: Local rainfall rate at ${rain} mm/h exceeds safe threshold (120 mm/h). Danger of high flood levels and floating risks. Seek upper levels.`;
  } else if (wind > 180) {
    isTriggered = true;
    reason = `Super Cyclone landfall warning: Winds reached storm speed of ${wind} km/h. Structural collapses and flying debris probable. Remain indoors.`;
  } else if (seismic > 5.5) {
    isTriggered = true;
    reason = `Severe Rupture Hazard: Earth shaking at Magnitude ${seismic} on Richter scale. Severe risk of wall collaspses. Drop, Cover, and Hold on.`;
  }

  if (isTriggered) {
    triggerAlarmOverlay(reason);
  }
}

function triggerAlarmOverlay(text) {
  const overlay = document.getElementById("alarm-overlay");
  if (overlay.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    document.getElementById("alarm-text").innerText = text;
    
    // Synthesize alarm sound using AudioContext
    startAlarmSound();
  }
}

function dismissAlarmOverlay() {
  document.getElementById("alarm-overlay").classList.add("hidden");
  stopAlarmSound();
}

function startAlarmSound() {
  if (alarmAudioInterval) return;
  
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    alarmAudioInterval = setInterval(() => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Low freq
      osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.4); // Sweep up
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);
    }, 700);
  } catch (err) {
    console.warn("AudioContext error: ", err);
  }
}

// Stop Alarm Siren
function stopAlarmSound() {
  if (alarmAudioInterval) {
    clearInterval(alarmAudioInterval);
    alarmAudioInterval = null;
  }
}

// 5. Supply Estimator logic
function calculateSupplies() {
  const people = parseInt(document.getElementById("calc-people").value) || 1;
  const days = parseInt(document.getElementById("calc-days").value) || 1;

  // Formula constants (Indianized labels)
  const waterLitres = people * days * 4.0;
  const calories = people * days * 2000;
  const powerbanks = Math.ceil((people * days) / 6);
  const medKits = days > 5 || people > 5 ? "2 Advanced Kits" : "1 Advanced Kit";

  document.getElementById("calc-water").innerText = `${waterLitres.toFixed(1)} Litres`;
  document.getElementById("calc-food").innerText = `${calories.toLocaleString()} kcal`;
  document.getElementById("calc-power").innerText = `${powerbanks} Powerbank${powerbanks > 1 ? 's' : ''}`;
  document.getElementById("calc-medical").innerText = medKits;
}

// 6. Emergency Checklist System
function loadChecklist(type) {
  const items = SURVIVAL_CHECKLISTS[type] || SURVIVAL_CHECKLISTS["flood"];
  const container = document.getElementById("checklist-items");
  container.innerHTML = "";

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "checklist-item";
    div.innerHTML = `
      <input type="checkbox" id="chk-${index}">
      <label for="chk-${index}">${item.text}</label>
      ${item.required ? `<span class="badge-required">REQUIRED</span>` : ""}
    `;
    
    // Toggle completed state styles
    div.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        div.classList.add("completed");
      } else {
        div.classList.remove("completed");
      }
      updateChecklistProgress();
    });

    container.appendChild(div);
  });

  updateChecklistProgress();
}

function updateChecklistProgress() {
  const checkboxes = document.querySelectorAll("#checklist-items input[type='checkbox']");
  const checked = document.querySelectorAll("#checklist-items input[type='checkbox']:checked");
  document.getElementById("checklist-progress").innerText = `${checked.length}/${checkboxes.length}`;
}

// 7. Connectivity & Offline / Low-bandwidth mode simulation
function toggleNetworkMode(online) {
  isNetworkOnline = online;
  const statusText = document.getElementById("network-status-text");
  const overlay = document.getElementById("offline-fallback-overlay");
  
  if (online) {
    statusText.innerText = "Online";
    statusText.className = "status-online";
    overlay.classList.add("hidden");
    
    // System message in chatbot
    addBotMessage("Connectivity restored. Reconnected to national location servers and NDMA coordination feeds.");
  } else {
    statusText.innerText = "Offline";
    statusText.className = "status-offline";
    overlay.classList.remove("hidden");
    
    // Load local resources and SMS values
    populateOfflineShelters();
    generateSMSString();
    
    addBotMessage("WARNING: Mobile network disconnected. Switch initiated to Local Emergency Offline cache. You can compile a compressed status SMS to transmit to emergency gateways.");
  }
}

function populateOfflineShelters() {
  const scenario = SCENARIOS[currentScenario];
  const list = document.getElementById("offline-shelters-list");
  list.innerHTML = "";

  if (!scenario) return;

  scenario.shelters.forEach(shelter => {
    const item = document.createElement("div");
    item.className = "cached-shelter-card";
    item.innerHTML = `
      <h4>${shelter.name}</h4>
      <p><strong>Beds:</strong> ${shelter.occupied}/${shelter.capacity} filled (${shelter.status})</p>
      <p><strong>Hotline:</strong> ${shelter.phone}</p>
      <p style="color: var(--neon-cyan)">✓ Local cached verification marker</p>
    `;
    list.appendChild(item);
  });
}

function generateSMSString() {
  const status = document.getElementById("sms-status-condition").value;
  const scenario = SCENARIOS[currentScenario];
  const people = document.getElementById("calc-people").value;
  
  // Create a tight, simulated low-bandwidth SMS coordinate string
  const prefix = "LBAI_ALERT";
  const typeCode = scenario.type.substring(0, 3).toUpperCase();
  const lat = scenario.coords[0].toFixed(4);
  const lng = scenario.coords[1].toFixed(4);
  
  const smsString = `${prefix}//TYPE:${typeCode}//STAT:${status}//LOC:${lat},${lng}//QTY:${people}//SMS_GATEWAY:112`;
  
  document.getElementById("sms-generated-text").value = smsString;
}

function copySMSMessage() {
  const textarea = document.getElementById("sms-generated-text");
  textarea.select();
  document.execCommand("copy");
  
  const feedback = document.getElementById("sms-feedback");
  feedback.classList.remove("hidden");
  setTimeout(() => {
    feedback.classList.add("hidden");
  }, 3000);
}

// 8. CPR Metronome & First Aid Instructions
function loadFirstAidGuide(guideKey) {
  const guide = FIRST_AID_GUIDES[guideKey];
  const contentArea = document.getElementById("firstaid-content");
  const metronomeWrapper = document.getElementById("metronome-wrapper");
  
  if (!guide) return;

  let stepsHTML = `<ol>`;
  guide.steps.forEach(step => {
    stepsHTML += `<li>${step}</li>`;
  });
  stepsHTML += `</ol>`;

  contentArea.innerHTML = `
    <h3 style="color: var(--neon-cyan); margin-bottom: 8px; font-size: 0.85rem">${guide.title}</h3>
    ${stepsHTML}
  `;

  // Only show metronome if the guide supports it (e.g. CPR)
  if (guide.hasMetronome) {
    metronomeWrapper.style.display = "block";
  } else {
    metronomeWrapper.style.display = "none";
  }
}

function toggleCPRMetronome() {
  const btn = document.getElementById("metronome-toggle-btn");
  const box = document.getElementById("metronome-wrapper");

  if (isMetronomeRunning) {
    // Stop metronome
    isMetronomeRunning = false;
    btn.innerText = "Start Pacer";
    btn.classList.remove("active");
    box.classList.remove("active");
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  } else {
    // Start metronome
    isMetronomeRunning = true;
    btn.innerText = "Stop Pacer";
    btn.classList.add("active");
    box.classList.add("active");
    
    // Initialize AudioContext if needed
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // 105 Beats per minute -> 571 ms per beat
    metronomeInterval = setInterval(playMetronomeTick, 571);
  }
}

function playMetronomeTick() {
  // 1. Visual flash
  const indicator = document.getElementById("metronome-visual-indicator");
  indicator.classList.add("flash");
  setTimeout(() => {
    indicator.classList.remove("flash");
  }, 100);

  // 2. Audio Beep
  if (audioCtx && audioCtx.state !== 'suspended') {
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = 900; // high pitch beep
      
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      console.warn("Metronome sound failed: ", e);
    }
  }
}

// 9. AI Chatbot Agent
function resetChat() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";

  const scenario = SCENARIOS[currentScenario];
  const welcomeText = `LifeBridge AI Agent active in <strong>${scenario.name}</strong> scenario.<br>I am ready to consult you. Quick options are available below or type a custom inquiry.`;
  addBotMessage(welcomeText);

  // Populate quick reply chips
  const chipsContainer = document.getElementById("quick-reply-chips");
  chipsContainer.innerHTML = "";

  const quickOptions = [
    { label: "📍 Relief Camp Location", query: "relief camp shelter" },
    { label: "🛣️ Check Safe Routes", query: "safe road highway" },
    { label: "🚑 First Aid Details", query: "medical first aid" },
    { label: "💧 Chlorine & Water Safety", query: "water safe drink chlorine" }
  ];

  quickOptions.forEach(opt => {
    const chip = document.createElement("button");
    chip.className = "reply-chip";
    chip.innerText = opt.label;
    chip.addEventListener("click", () => {
      addUserMessage(opt.label);
      processAIResponse(opt.query);
    });
    chipsContainer.appendChild(chip);
  });
}

function addUserMessage(text) {
  const container = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = "chat-message message-user";
  div.innerText = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addBotMessage(html) {
  const container = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className = "chat-message message-bot";
  div.innerHTML = html;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function handleUserChatInput() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  processAIResponse(text);
}

function processAIResponse(query) {
  // Show typing state indicator
  const container = document.getElementById("chat-messages");
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message message-bot typing-indicator";
  typingDiv.innerHTML = `<span class="pulse-green"></span> <em>Agent is analyzing query...</em>`;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    // Remove typing indicator
    typingDiv.remove();

    // Match keywords
    const lowerQuery = query.toLowerCase();
    let matchedResponse = null;

    for (let item of AI_RESPONSE_DATABASE.keywords) {
      const match = item.keys.some(key => lowerQuery.includes(key));
      if (match) {
        matchedResponse = item.response;
        break;
      }
    }

    if (!matchedResponse) {
      matchedResponse = `<strong>LifeBridge Indian Emergency Protocol:</strong><br>
      Query analyzed. Recommendations:<br>
      - If medical help is needed: Dial **112** (Primary National Emergency Number) or review the **First Aid Desk** panel.<br>
      - If traveling: Use only the **Neon Green roads** marked on the map (monitored by NDRF/State Police).<br>
      - Ensure you have stored at least 4L of drinking water per person and dry foods (like poha or biscuits). Keep phone on ultra battery saving mode.`;
    }

    addBotMessage(matchedResponse);
  }, 600);
}

// 10. Community Reports Feed & Hazard Reporting
function updateReportFeed() {
  const list = document.getElementById("report-feed-list");
  list.innerHTML = "";

  // Display reports in reverse order (newest first)
  const sorted = [...communityReports].reverse();
  
  sorted.forEach(rep => {
    const div = document.createElement("div");
    div.className = `feed-item ${rep.severity}`;
    div.innerHTML = `
      <div class="feed-item-header">
        <span class="feed-item-title">${rep.title}</span>
        <span class="feed-item-time">${rep.time}</span>
      </div>
      <p class="feed-item-desc">${rep.desc}</p>
    `;
    list.appendChild(div);
  });
}

function handleReportFormSubmit(e) {
  e.preventDefault();
  
  const titleInput = document.getElementById("report-title");
  const descInput = document.getElementById("report-desc");
  const severityInput = document.getElementById("report-severity");

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const severity = severityInput.value;

  if (!title || !desc) return;

  const newReport = {
    id: Date.now(),
    title: title,
    desc: desc,
    severity: severity,
    time: "Just now"
  };

  communityReports.push(newReport);
  updateReportFeed();

  // Draw custom warning hazard pin on the center of the active map
  const activeCenter = map.getCenter();
  const color = severity === "critical" ? "#ff3366" : "#ff9f43";
  
  const customIcon = L.divIcon({
    className: "custom-map-pin",
    html: `<div class="pulse-marker" style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 12px ${color}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  const marker = L.marker(activeCenter, { icon: customIcon }).addTo(map);
  marker.bindPopup(`
    <h4 style="color: ${color}">Citizen Report: ${title}</h4>
    <p><strong>Severity:</strong> <span style="text-transform: uppercase; font-weight:700; color:${color}">${severity}</span></p>
    <p>${desc}</p>
    <p style="color: var(--text-muted); font-size: 0.65rem">Reported by community user.</p>
  `);
  
  currentMarkers.push(marker);
  
  // Pan to the new marker
  map.panTo(activeCenter);

  // Clear inputs
  titleInput.value = "";
  descInput.value = "";
  
  addBotMessage(`Crowd alert <strong>"${title}"</strong> logged successfully. Plotted warning marker on your map at center coordinates.`);
}

// 11. Family Safety Coordinator
function updateFamilyBoard() {
  const container = document.getElementById("family-member-list");
  container.innerHTML = "";

  familyMembers.forEach((member) => {
    let badgeClass = "status-safe";
    if (member.status === "DANGER") badgeClass = "status-danger";
    else if (member.status === "UNREACHABLE") badgeClass = "status-unreachable";

    const div = document.createElement("div");
    div.className = "family-member";
    div.innerHTML = `
      <div class="family-member-info">
        <span class="family-name">${member.name}</span>
        <span class="family-coords"><i data-lucide="map-pin" style="width:10px;height:10px;display:inline"></i> Coords: ${member.coords}</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px">
        <span class="family-status-badge ${badgeClass}">${member.status}</span>
        <span style="font-size:0.65rem; color:var(--text-muted)">${member.updated}</span>
      </div>
    `;
    container.appendChild(div);
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function updateSelfSafetyStatus(status) {
  // Update mock database for user's own status
  let me = familyMembers.find(f => f.name.includes("User (Me)"));
  const scenario = SCENARIOS[currentScenario];
  const myCoords = `${scenario.coords[0].toFixed(4)}, ${scenario.coords[1].toFixed(4)}`;

  if (me) {
    me.status = status;
    me.coords = myCoords;
    me.updated = "Just now";
  } else {
    familyMembers.unshift({
      name: "User (Me)",
      status: status,
      coords: myCoords,
      updated: "Just now"
    });
  }

  updateFamilyBoard();

  // Create an alert feed item
  const newReport = {
    id: Date.now(),
    title: `User (Me) Status Update`,
    desc: `User marked status as ${status} at coords [${myCoords}].`,
    severity: status === "SAFE" ? "warning" : "critical",
    time: "Just now"
  };
  
  communityReports.push(newReport);
  updateReportFeed();

  // Draw user position marker on the map (Green if safe, Red if danger)
  if (userSOSMarker) {
    map.removeLayer(userSOSMarker);
  }

  const pinColor = status === "SAFE" ? "#00ff87" : "#ff3366";
  const customIcon = L.divIcon({
    className: "custom-map-pin",
    html: `<div class="pulse-marker" style="background-color: ${pinColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px ${pinColor}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  userSOSMarker = L.marker(scenario.coords, { icon: customIcon }).addTo(map);
  userSOSMarker.bindPopup(`
    <h4>User (Me) Position</h4>
    <p><strong>Status:</strong> <span style="font-weight: 700; color: ${pinColor}">${status}</span></p>
    <p><strong>Coordinates:</strong> ${myCoords}</p>
  `);
  
  map.panTo(scenario.coords);
  
  addBotMessage(`Your safety status updated to <strong>${status}</strong>. Broadcast pin plotted at coordinates <strong>[${myCoords}]</strong>.`);
}

// 12. Panic SOS Broadcast Trigger
function triggerPanicSOS() {
  const scenario = SCENARIOS[currentScenario];
  const myCoords = `${scenario.coords[0].toFixed(4)}, ${scenario.coords[1].toFixed(4)}`;

  // Show visual alerts
  addBotMessage(`🚨 <strong>EMERGENCY SOS BROADCASTED!</strong> Responders & NDRF crews have been paged with your coordinates <strong>[${myCoords}]</strong>. Keep your device active.`);

  // Update status to DANGER
  updateSelfSafetyStatus("DANGER");

  // Play panic ping sound (high-pitch pulse)
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  try {
    let soundCount = 0;
    const interval = setInterval(() => {
      if (soundCount >= 4 || !audioCtx) {
        clearInterval(interval);
        return;
      }
      soundCount++;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    }, 450);
  } catch (err) {
    console.warn("Panic sound error: ", err);
  }
}
