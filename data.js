// Indian Version Data repository for LifeBridge AI - Emergency & Disaster Assistant

const SCENARIOS = {
  mumbai_flood: {
    id: "mumbai_flood",
    name: "Mumbai Monsoon Floods",
    type: "Flood",
    coords: [19.0760, 72.8777],
    zoom: 12,
    description: "Severe waterlogging and heavy rainfall exceeding 200mm in suburbs due to monsoon depression. High tide alert (4.8m) issued for marine areas and low-lying spots.",
    gauges: { rain: 145, wind: 55, seismic: 0.0 },
    shelters: [
      {
        id: "s1",
        name: "Dadar East Municipal School",
        coords: [19.0178, 72.8478],
        capacity: 600,
        occupied: 520,
        medical: true,
        food: true,
        water: true,
        status: "Near Capacity",
        phone: "+91 22 2413 5555"
      },
      {
        id: "s2",
        name: "Andheri West Sports Complex Base",
        coords: [19.1290, 72.8258],
        capacity: 1200,
        occupied: 450,
        medical: true,
        food: true,
        water: true,
        status: "Available",
        phone: "+91 22 2623 5556"
      },
      {
        id: "s3",
        name: "Kurla Community Center",
        coords: [19.0728, 72.8826],
        capacity: 400,
        occupied: 400,
        medical: false,
        food: true,
        water: true,
        status: "Full",
        phone: "+91 22 2503 9999"
      }
    ],
    hazards: [
      {
        id: "h1",
        name: "Milan Subway Flooding",
        coords: [19.0880, 72.8420],
        description: "Water depth at 5 feet. Impassable for all vehicles. Subway fully closed.",
        severity: "critical"
      },
      {
        id: "h2",
        name: "Dadar TT Circle Cable Fail",
        coords: [19.0220, 72.8430],
        description: "High tension wire snapped and lying on waterlogged street. High electrocution risk.",
        severity: "critical"
      },
      {
        id: "h3",
        name: "WEH Landslide near Jogeshwari",
        coords: [19.1360, 72.8590],
        description: "Small mudslide has blocked two lanes of Western Express Highway northbound.",
        severity: "warning"
      }
    ],
    safeRoutes: [
      [19.1290, 72.8258],
      [19.0880, 72.8420],
      [19.0728, 72.8826],
      [19.0178, 72.8478]
    ]
  },
  uttarakhand_earthquake: {
    id: "uttarakhand_earthquake",
    name: "Uttarakhand Seismic Tremors",
    type: "Earthquake",
    coords: [30.3165, 78.0322],
    zoom: 12,
    description: "M 6.4 seismic event with epicenter near Chamoli. Shaking felt strongly in Dehradun and Rishikesh. Emergency Search and Rescue teams deployed.",
    gauges: { rain: 0, wind: 10, seismic: 6.4 },
    shelters: [
      {
        id: "s4",
        name: "Dehradun Parade Ground Relief Base",
        coords: [30.3255, 78.0430],
        capacity: 1000,
        occupied: 620,
        medical: true,
        food: true,
        water: true,
        status: "Available",
        phone: "+91 135 271 0001"
      },
      {
        id: "s5",
        name: "Rishikesh Govt PG College Shelter",
        coords: [30.1065, 78.2940],
        capacity: 800,
        occupied: 780,
        medical: true,
        food: true,
        water: true,
        status: "Near Capacity",
        phone: "+91 135 243 0002"
      }
    ],
    hazards: [
      {
        id: "h4",
        name: "Highway Blockage (NH-58)",
        coords: [30.1500, 78.2500],
        description: "Massive rockfall near Devprayag has completely blocked Rishikesh-Badrinath highway.",
        severity: "critical"
      },
      {
        id: "h5",
        name: "Bridge Collapse near Shivpuri",
        coords: [30.1250, 78.3100],
        description: "Suspension bridge over Ganges damaged by rock impacts. Closed to foot traffic.",
        severity: "critical"
      }
    ],
    safeRoutes: [
      [30.1065, 78.2940],
      [30.1500, 78.2500],
      [30.3255, 78.0430]
    ]
  },
  odisha_cyclone: {
    id: "odisha_cyclone",
    name: "Odisha Coast Super Cyclone",
    type: "Cyclone",
    coords: [20.2961, 85.8245],
    zoom: 11,
    description: "Category 5 Cyclone 'Fani II' making landfall near Puri. Wind velocities exceeding 220 km/h. Sea waves up to 5 meters flooding coastal villages.",
    gauges: { rain: 180, wind: 235, seismic: 0.0 },
    shelters: [
      {
        id: "s6",
        name: "Puri Multi-Purpose Cyclone Shelter",
        coords: [19.8150, 85.8310],
        capacity: 2500,
        occupied: 2350,
        medical: true,
        food: true,
        water: true,
        status: "Near Capacity",
        phone: "+91 6752 222 003"
      },
      {
        id: "s7",
        name: "Bhubaneswar Centenary Hall Safe Zone",
        coords: [20.2650, 85.8400],
        capacity: 1500,
        occupied: 450,
        medical: false,
        food: true,
        water: true,
        status: "Available",
        phone: "+91 674 253 0004"
      }
    ],
    hazards: [
      {
        id: "h6",
        name: "Konark Marine Drive Inundation",
        coords: [19.8800, 86.0900],
        description: "Storm surge water has flooded the coastal road. Debris of uprooted trees blocking travel.",
        severity: "critical"
      },
      {
        id: "h7",
        name: "Uprooted Grid Towers",
        coords: [20.2100, 85.8700],
        description: "High tension electricity pylons blown over. Power grid down in Jagatsinghpur border.",
        severity: "critical"
      }
    ],
    safeRoutes: [
      [19.8150, 85.8310],
      [20.2650, 85.8400]
    ]
  },
  delhi_accident: {
    id: "delhi_accident",
    name: "Delhi NCR Fog Pile-up",
    type: "Accident",
    coords: [28.6139, 77.2090],
    zoom: 12,
    description: "Winter dense fog pileup involving 15 vehicles on Yamuna Expressway. Chemical tanker leakage reported. Emergency response crews on scene.",
    gauges: { rain: 10, wind: 15, seismic: 0.0 },
    shelters: [
      {
        id: "s8",
        name: "Safdarjung Hospital Emergency Trauma Center",
        coords: [28.5670, 77.2100],
        capacity: 200,
        occupied: 145,
        medical: true,
        food: true,
        water: true,
        status: "Available",
        phone: "+91 11 2673 0000"
      }
    ],
    hazards: [
      {
        id: "h8",
        name: "Expressway Pileup & Chemical Spill",
        coords: [28.5400, 77.3000],
        description: "Multi-vehicle crash with active acid spill. Evacuation radius 400m established.",
        severity: "critical"
      },
      {
        id: "h9",
        name: "Severe Fog Gridlock - DND Flyway",
        coords: [28.5700, 77.2700],
        description: "Traffic standstill due to poor visibility (< 5 meters). Drive with emergency hazard indicators.",
        severity: "warning"
      }
    ],
    safeRoutes: [
      [28.5670, 77.2100],
      [28.5700, 77.2700],
      [28.6139, 77.2090]
    ]
  }
};

const FIRST_AID_GUIDES = {
  cpr: {
    title: "Cardiopulmonary Resuscitation (CPR)",
    steps: [
      "<strong>Check the Scene & Person</strong>: Ensure safety. Tap the victim's shoulder, shout, 'Aap theek hain?' Check for chest rise and breathing.",
      "<strong>Call for Help</strong>: Shout for nearby support. Immediately dial <strong>112</strong> (Indian National Emergency Helpline) or <strong>102</strong> (Ambulance).",
      "<strong>Position Your Hands</strong>: Place the heel of one hand in the center of the chest, other hand on top, locking your fingers.",
      "<strong>Deliver Compressions</strong>: Push down hard and fast at least 2 inches deep. Use the <strong>CPR Metronome</strong> below to hit 100–120 compressions per minute.",
      "<strong>Give Rescue Breaths</strong>: After 30 compressions, tilt the head back, lift the chin, pinch the nose, and blow 2 breaths (1 second each) if trained. Otherwise, continue hands-only chest compressions."
    ],
    hasMetronome: true
  },
  bleeding: {
    title: "Severe Bleeding Control",
    steps: [
      "<strong>Cover and Dress</strong>: Wear gloves if available. Cover the wound with a clean sterile cloth, bandage, or clean dupatta.",
      "<strong>Apply Direct Pressure</strong>: Press firmly with both hands directly on the wound. Do not release pressure to check.",
      "<strong>Elevate the Limb</strong>: Lift the bleeding arm or leg above the level of the heart to slow down the circulation pressure.",
      "<strong>Secure with Wraps</strong>: Bind the cloth firmly with clean tape or bandage. If blood leaks through, add layers without removing the first one.",
      "<strong>Tourniquet Application</strong>: For catastrophic arterial limb bleeding, tie a tight tourniquet (using a cloth strap and stick) 2-3 inches above the wound. Note down the exact application time for the doctors."
    ]
  },
  choking: {
    title: "Choking (Heimlich Maneuver)",
    steps: [
      "<strong>Assess Severity</strong>: Ask, 'Aap choking kar rahe ho?' If they can speak or cough, encourage them to cough hard.",
      "<strong>Deliver 5 Back Blows</strong>: Support the chest with one hand, lean them forward, and give 5 firm blows between the shoulder blades with the heel of your hand.",
      "<strong>Perform 5 Abdominal Thrusts</strong>: Stand behind the person. Wrap arms around the waist. Make a fist, place it just above the navel, grab it with the other hand, and pull inward and upward sharply.",
      "<strong>Repeat Loop</strong>: Cycle 5 back blows and 5 thrusts until the object is expelled or they lose consciousness.",
      "<strong>Unconscious Protocol</strong>: If they pass out, lower them to the floor, call 112, and start CPR compressions. Check mouth for objects before breathing."
    ]
  },
  fracture: {
    title: "Fracture & Splinting Guide",
    steps: [
      "<strong>Prioritize Wounds</strong>: Stop any active bleeding with sterile dressing before attempting to immobilize the bone.",
      "<strong>Support and Splint</strong>: Keep the injured limb in the position you found it. Do not attempt to pop the bone back. Wrap with makeshift splints (bamboo sticks, thick cardboard, rolled newspapers).",
      "<strong>Tie the Splint</strong>: Tie bandages or cloth bands above and below the fracture. Make sure it is secure but not stopping blood flow to fingers or toes.",
      "<strong>Cool the Swelling</strong>: Place cold compress packs or ice wrapped in cloth over the injury site for 15 minutes.",
      "<strong>Prevent Shock</strong>: Lay the person down flat, elevate feet slightly (unless leg is broken), and keep them warm with blankets."
    ]
  }
};

const SURVIVAL_CHECKLISTS = {
  flood: [
    { text: "Emergency drinking water (4 litres per person per day) in sealed bottles", required: true },
    { text: "Dry rations (parched rice/poha, biscuits, energy bars) for 3-5 days", required: true },
    { text: "Waterproof pouch for Aadhar card, PAN card, passport, and property papers", required: true },
    { text: "Transistor/battery-powered radio for All India Radio news alerts", required: true },
    { text: "Flashlight (torch) with extra pair of cells", required: true },
    { text: "Basic medical kit (Dettol, bandages, ORS packets, chlorine tabs)", required: true },
    { text: "Raincoat or umbrella, sturdy rubber boots", required: false },
    { text: "Hand sanitizer and soap packets", required: false },
    { text: "High decibel whistle (to attract attention of NDRF rescue boats)", required: true }
  ],
  earthquake: [
    { text: "Thick sole shoes or sports shoes to walk over broken concrete", required: true },
    { text: "N95/pollution masks to protect lungs from thick cement dust", required: true },
    { text: "Clean drinking water (3 days supply) and ORS packs", required: true },
    { text: "First-aid kit + essential daily medicines (for diabetes, BP, etc.)", required: true },
    { text: "Heavy utility work gloves to lift brick rubble", required: true },
    { text: "Torch next to the bed or pocket flashlight", required: true },
    { text: "Adjustable wrench or pliers to shut off main domestic LPG gas valve", required: true },
    { text: "Emergency thermal space blanket", required: false },
    { text: "Whistle to signal search & rescue teams if trapped under debris", required: true }
  ],
  cyclone: [
    { text: "Safe drinking water stored for 7 days (wells/taps will be contaminated)", required: true },
    { text: "Dry food (canned items, roasted chickpeas, biscuits) + manual opener", required: true },
    { text: "Prescribed medicines (at least a two-week stock)", required: true },
    { text: "Power banks fully charged (power grids take days to restore)", required: true },
    { text: "Hard cash (ATMs and UPI services will be offline during grid failure)", required: true },
    { text: "Plywood panels or rope nets to secure windows/doors", required: false },
    { text: "Swiss knife / multi-tool utility kit", required: false },
    { text: "Full tank of fuel in motorcycle / car for immediate evacuation", required: true },
    { text: "Mosquito coils or repellent creams (post-cyclone pooling breeds dengue/malaria)", required: false }
  ],
  accident: [
    { text: "Car medical kit (Betadine, cotton rolls, adhesive plaster)", required: true },
    { text: "Reflective high-visibility safety jacket", required: true },
    { text: "Foldable red hazard warning triangle", required: true },
    { text: "Seatbelt cutter and emergency hammer tool", required: true },
    { text: "Warm wool blanket to treat trauma/shock victim", required: true },
    { text: "Fire extinguisher (dry powder type) mounted in vehicle", required: true },
    { text: "Headlamp / hand-held torch", required: true },
    { text: "Emergency contacts sheet with blood group details", required: false }
  ]
};

const AI_RESPONSE_DATABASE = {
  greetings: [
    "Namaste! I am your LifeBridge AI Emergency Assistant. I can help guide you through the active crisis. Ask me about shelters, safe roads, first aid, or supply preparation.",
    "Emergency Assistant online. Please stay calm. How can I help secure your safety right now?"
  ],
  keywords: [
    {
      keys: ["shelter", "evacuate", "where to go", "safe zone", "sleep", "stay", "relief camp"],
      response: `<strong>Shelter Placement Strategy:</strong><br>
      1. Check the interactive map in the center dashboard. Active relief camps and shelters are marked in <strong>Blue</strong>.<br>
      2. In the current scenario, the closest active shelters (like Dadar Municipal School or Puri Shelter) are listed in the side menu. Always check the **Capacity Status** (Avoid shelters marked 'Full').<br>
      3. Call the listed shelter helpline number before traveling if cellular connectivity permits, to confirm bed availability.<br>
      4. Bring your Emergency Kit, Aadhar/ID cards, and vital medications. Government relief teams (NDRF/SDRF) coordinate from these bases.`
    },
    {
      keys: ["road", "safe route", "drive", "highway", "blocked", "hazard", "closed", "expressway"],
      response: `<strong>Safe Routing Protocol:</strong><br>
      1. Review the map for <strong>Red Markers</strong> showing active road hazards and closures (like Milan Subway or highway blockages).<br>
      2. Safe evacuation corridors are rendered as <strong>Neon Green Paths</strong>. These have been cleared by local authorities and NDRF.<br>
      3. Never walk or drive through flooded streets. Just 6 inches of moving water can sweep a person or a small car away.<br>
      4. Watch for fallen electrical poles, hanging wires, or cracked asphalt post-seismic events.`
    },
    {
      keys: ["medical", "hospital", "doctor", "ambulance", "hurt", "injured", "bleed", "first aid", "cpr", "clinic"],
      response: `<strong>Emergency Medical Response:</strong><br>
      1. If the situation is life-threatening, immediately dial **112** (All-in-one helpline) or **102** (Ambulance).<br>
      2. For minor injuries, check the **First Aid & CPR Guide** in the right panel. It features detailed instructions on bleeding, fractures, and CPR.<br>
      3. Local emergency health centers and hospitals are marked on the map with **Green Crosses**.<br>
      4. If treating a casualty, keep them warm, elevate bleeding limbs, and do not move them if spinal injury is suspected unless there is immediate fire/collapse danger.`
    },
    {
      keys: ["water", "food", "eat", "drink", "starving", "dehydrated", "supply", "calculator", "ors"],
      response: `<strong>Resource & Survival Supplies:</strong><br>
      1. Run the **Emergency Kit Calculator** on the left panel to calculate exactly how much water and dry rations your household needs.<br>
      2. As a rule: **4 Litres of water per person per day** is required (half for drinking, half for hygiene). Use ORS packs if dehydrated.<br>
      3. Boil or treat tap water with chlorine tablets. Assume municipal water supply is contaminated after floods or cyclones.<br>
      4. Eat dry rations like poha, chickpeas, or biscuits. Keep refrigerator doors closed to preserve perishable foods.`
    },
    {
      keys: ["electric", "power", "grid", "wire", "shock", "gas", "leak", "fire", "cylinder", "lpg"],
      response: `<strong>Utility Safety Warning:</strong><br>
      1. **LPG Gas Leaks**: If you smell gas or hear a hissing noise, close the regulator immediately. Open all windows. Do not turn electrical switches ON or OFF, as sparks can cause a gas explosion.<br>
      2. **Electrical Hazards**: If power lines are down, maintain a distance of at least 10 meters. Do not touch water loggings that are in contact with fallen poles.<br>
      3. **Shutoffs**: Turn off your home's main MCB switchboard to prevent short circuits during heavy flooding or seismic aftershocks.`
    },
    {
      keys: ["flood", "rain", "water level", "drown", "monsoon", "waterlogging"],
      response: `<strong>Monsoon Flood Safety Protocol:</strong><br>
      1. Move to higher ground or upper floors immediately. Avoid basements.<br>
      2. Do not swim or wade through floodwaters. They contain sewage, chemical spills, and hidden open manholes (a severe hazard in Indian cities).<br>
      3. If trapped, climb to the roof. Wave a bright cloth, dupatta, or torch light to signal NDRF/SDRF rescue boats or helicopters.`
    },
    {
      keys: ["earthquake", "shaking", "ground", "seismic", "aftershock", "tremor"],
      response: `<strong>Earthquake Survival Protocol:</strong><br>
      1. **Drop, Cover, and Hold On**: Drop to your knees. Cover your head under a heavy wooden table. Hold on until the shaking stops.<br>
      2. **If Indoors**: Stay there. Avoid running out in panic as falling balconies/bricks cause most casualties. Do not use lifts/elevators.<br>
      3. **If Outdoors**: Move to an open field or park away from tall buildings, flyovers, and overhead power cables.<br>
      4. Be prepared for **aftershocks**, which can happen frequently post-quake.`
    },
    {
      keys: ["hurricane", "cyclone", "wind", "storm", "coast", "sea"],
      response: `<strong>Cyclone Survival Protocol:</strong><br>
      1. Evacuate early if you live in a low-lying coastal zone. Move to a reinforced concrete multi-purpose Cyclone Shelter.<br>
      2. Keep doors and windows tightly shut. Stay in the central room of the house (hallway, bathroom).<br>
      3. Do not venture out when the winds calm down (the eye of the cyclone); extreme winds will start blowing from the opposite direction suddenly.<br>
      4. Keep power banks charged and keep track of cyclone warning bulletins via transistor radio.`
    }
  ]
};

// Expose variables globally for direct browser access
window.SCENARIOS = SCENARIOS;
window.FIRST_AID_GUIDES = FIRST_AID_GUIDES;
window.SURVIVAL_CHECKLISTS = SURVIVAL_CHECKLISTS;
window.AI_RESPONSE_DATABASE = AI_RESPONSE_DATABASE;
