/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { PhoneCall, Play, RefreshCw, Smartphone, HelpCircle, Shield, Key } from "lucide-react";
import { WorkerProfile, JobPosting, Message, Neighborhood } from "../types";
import { mockNeighborhoods } from "../data/mockData";

interface UssdSimulatorProps {
  workers: WorkerProfile[];
  onAddWorker: (worker: WorkerProfile) => void;
  onUpdateWorker: (worker: WorkerProfile) => void;
  jobs: JobPosting[];
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  translate: (key: string) => string;
}

export const UssdSimulator: React.FC<UssdSimulatorProps> = ({
  workers,
  onAddWorker,
  onUpdateWorker,
  jobs,
  messages,
  onAddMessage,
  translate,
}) => {
  // Mobile USSD Session State
  const [phoneState, setPhoneState] = useState<"IDLE" | "DIALING" | "ACTIVE" | "COMPLETED">("IDLE");
  const [dialCode, setDialCode] = useState("");
  const [ussdScreen, setUssdScreen] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  
  // Simulated Phone Identity
  const [simPhoneNumber, setSimPhoneNumber] = useState("+27 73 982 4431"); // Defaults to Nomvula's
  const [customPhone, setCustomPhone] = useState("");
  
  // Registration Wizard variables
  const [regName, setRegName] = useState("");
  const [regSkill, setRegSkill] = useState("");
  const [regLocId, setRegLocId] = useState("");
  const [regRate, setRegRate] = useState("");

  // Menu navigation stack
  const [menuStack, setMenuStack] = useState<{ id: string; screenText: string[]; onAction: (val: string) => void }[]>([]);

  // Reset or initialize
  const resetUssd = () => {
    setPhoneState("IDLE");
    setDialCode("");
    setUssdScreen([]);
    setUserInput("");
    setMenuStack([]);
  };

  const handleKeyPress = (char: string) => {
    if (phoneState === "IDLE") {
      setDialCode((prev) => prev + char);
    } else if (phoneState === "ACTIVE") {
      setUserInput((prev) => prev + char);
    }
  };

  const handleDelete = () => {
    if (phoneState === "IDLE") {
      setDialCode((prev) => prev.slice(0, -1));
    } else if (phoneState === "ACTIVE") {
      setUserInput((prev) => prev.slice(0, -1));
    }
  };

  const handleSend = () => {
    if (phoneState === "IDLE") {
      if (dialCode === "*120*111#") {
        launchUssdService();
      } else {
        setPhoneState("COMPLETED");
        setUssdScreen([
          "Connection problem or",
          "invalid MMI code.",
          "",
          "Dial *120*111# to launch",
          "Vuka Gigs Portal."
        ]);
      }
    } else if (phoneState === "ACTIVE") {
      processUssdInput(userInput);
      setUserInput("");
    }
  };

  const activeWorker = workers.find((w) => w.phoneNumber === simPhoneNumber);

  const launchUssdService = () => {
    setPhoneState("ACTIVE");
    setMenuStack([]);
    
    if (activeWorker) {
      showMainMenu(activeWorker);
    } else {
      showRegistrationMenu();
    }
  };

  // USSD MENU SCREENS
  const showMainMenu = (worker: WorkerProfile) => {
    const locName = mockNeighborhoods.find((n) => n.id === worker.location)?.name || "Unknown";
    const text = [
      `Vuka Gigs: Welcome ${worker.fullName.split(" ")[0]}`,
      `Loc: ${locName} (${worker.isVisible ? "Visible" : "Hidden"})`,
      "1. Find Local Gigs",
      "2. Inbox & Negotiations",
      "3. Toggle Profile Visibility",
      "4. Exit"
    ];
    
    setUssdScreen(text);
    
    const handler = (val: string) => {
      if (val === "1") {
        showLocalGigsMenu(worker);
      } else if (val === "2") {
        showInboxMenu(worker);
      } else if (val === "3") {
        toggleVisibilityUssd(worker);
      } else if (val === "4") {
        exitUssd("Vuka Gigs session ended.\nStay safe on transit! Ngiyabonga.");
      } else {
        // invalid option, redisplay
        showMainMenu(worker);
      }
    };

    setMenuStack([{ id: "MAIN", screenText: text, onAction: handler }]);
  };

  const showRegistrationMenu = () => {
    const text = [
      "Welcome to Vuka Gigs",
      "No profile found on this phone.",
      "1. Register as Worker",
      "2. View Terms & POPIA Compliance",
      "3. Exit"
    ];
    setUssdScreen(text);

    const handler = (val: string) => {
      if (val === "1") {
        startRegistrationWizardName();
      } else if (val === "2") {
        showPopiaTerms();
      } else {
        exitUssd("Vuka Gigs Service. Goodbye.");
      }
    };
    setMenuStack([{ id: "REG_MAIN", screenText: text, onAction: handler }]);
  };

  const showPopiaTerms = () => {
    const text = [
      "Vuka Gigs POPIA Promise:",
      "We hide your cell number & address",
      "until you accept a contract.",
      "1. Register Now",
      "2. Back"
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      if (val === "1") {
        startRegistrationWizardName();
      } else {
        showRegistrationMenu();
      }
    };
    setMenuStack([{ id: "POPIA_INFO", screenText: text, onAction: handler }]);
  };

  // Registration wizard steps
  const startRegistrationWizardName = () => {
    const text = [
      "Vuka Gigs Register (1/4):",
      "Enter your Full Name:",
      "(e.g., Sipho Ndlovu)"
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      if (val.trim().length > 1) {
        setRegName(val.trim());
        startRegistrationWizardSkill(val.trim());
      } else {
        startRegistrationWizardName();
      }
    };
    setMenuStack((prev) => [...prev, { id: "REG_NAME", screenText: text, onAction: handler }]);
  };

  const startRegistrationWizardSkill = (name: string) => {
    const text = [
      `Register (2/4) ${name.split(" ")[0]}:`,
      "Choose your primary skill:",
      "1. Domestic Clean",
      "2. Plumbing",
      "3. Painting",
      "4. Gardening"
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      let selectedSkill = "General Work";
      if (val === "1") selectedSkill = "Domestic Work";
      if (val === "2") selectedSkill = "Plumbing";
      if (val === "3") selectedSkill = "Painting";
      if (val === "4") selectedSkill = "Gardening";
      
      setRegSkill(selectedSkill);
      startRegistrationWizardLocation(name, selectedSkill);
    };
    setMenuStack((prev) => [...prev, { id: "REG_SKILL", screenText: text, onAction: handler }]);
  };

  const startRegistrationWizardLocation = (name: string, skill: string) => {
    startRegistrationWizardProvince(name, skill);
  };

  const startRegistrationWizardProvince = (name: string, skill: string) => {
    const uniqueProvinces = Array.from(new Set(mockNeighborhoods.map((n) => n.province))).sort();
    const text = [
      "Register (3/5) Province:",
      "Choose your province:",
      ...uniqueProvinces.map((p, idx) => `${idx + 1}. ${p}`)
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      const idx = parseInt(val) - 1;
      if (idx >= 0 && idx < uniqueProvinces.length) {
        const selectedProv = uniqueProvinces[idx];
        startRegistrationWizardDistrict(name, skill, selectedProv);
      } else {
        startRegistrationWizardProvince(name, skill);
      }
    };
    setMenuStack((prev) => [...prev, { id: "REG_PROVINCE", screenText: text, onAction: handler }]);
  };

  const startRegistrationWizardDistrict = (name: string, skill: string, province: string) => {
    const uniqueDistricts = Array.from(
      new Set(mockNeighborhoods.filter((n) => n.province === province).map((n) => n.district))
    ).sort();
    
    const displayDistricts = uniqueDistricts.slice(0, 8);
    const text = [
      `Reg District (${province.slice(0, 3)}):`,
      ...displayDistricts.map((d, idx) => `${idx + 1}. ${d.replace(" District", "").replace(" Metro", "").slice(0, 15)}`)
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      const idx = parseInt(val) - 1;
      if (idx >= 0 && idx < displayDistricts.length) {
        const selectedDist = displayDistricts[idx];
        startRegistrationWizardArea(name, skill, province, selectedDist);
      } else {
        startRegistrationWizardDistrict(name, skill, province);
      }
    };
    setMenuStack((prev) => [...prev, { id: "REG_DISTRICT", screenText: text, onAction: handler }]);
  };

  const startRegistrationWizardArea = (name: string, skill: string, province: string, district: string) => {
    const availableAreas = mockNeighborhoods.filter(
      (n) => n.province === province && n.district === district
    ).sort((a, b) => a.name.localeCompare(b.name));

    const text = [
      `Reg Area (${district.replace(" District", "").replace(" Metro", "").slice(0, 8)}):`,
      ...availableAreas.map((a, idx) => `${idx + 1}. ${a.name}`)
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      const idx = parseInt(val) - 1;
      if (idx >= 0 && idx < availableAreas.length) {
        const selectedArea = availableAreas[idx];
        setRegLocId(selectedArea.id);
        startRegistrationWizardRate(name, skill, selectedArea.id);
      } else {
        startRegistrationWizardArea(name, skill, province, district);
      }
    };
    setMenuStack((prev) => [...prev, { id: "REG_AREA", screenText: text, onAction: handler }]);
  };

  const startRegistrationWizardRate = (name: string, skill: string, locId: string) => {
    const text = [
      "Register (4/4) Rate:",
      "Enter desired rate per hour:",
      "In ZAR R (e.g., 75)"
    ];
    setUssdScreen(text);
    const handler = (val: string) => {
      const rate = parseFloat(val) || 75;
      setRegRate(rate.toString());

      // Create profile!
      const newWorker: WorkerProfile = {
        id: `worker_${Date.now()}`,
        fullName: name,
        phoneNumber: simPhoneNumber,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        location: locId,
        skills: [skill, "General Assistance"],
        hourlyRate: rate,
        availability: "Available",
        bio: `Registered via USSD terminal. Servicing ${mockNeighborhoods.find((n) => n.id === locId)?.name} and surrounding transit lines.`,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400",
        ],
        completedJobsCount: 0,
        rating: 5.0,
        isVisible: true,
      };

      onAddWorker(newWorker);
      exitUssd(`Success! Profile created.\nSipho & Nomvula welcome you.\nDial again to look for jobs!`);
    };
    setMenuStack((prev) => [...prev, { id: "REG_RATE", screenText: text, onAction: handler }]);
  };

  const showLocalGigsMenu = (worker: WorkerProfile) => {
    // Smart transit & neighborhood matching
    const workerLoc = mockNeighborhoods.find((n) => n.id === worker.location);
    const workerLines = workerLoc?.transitLines || [];
    
    // Filter matching gigs
    const matchingGigs = jobs.filter((j) => {
      // open status
      if (j.status !== "Open" && j.status !== "In-Negotiation") return false;
      
      // matches either neighborhood or transit lines
      const jobLoc = mockNeighborhoods.find((n) => n.id === j.location);
      const sharesTransit = j.transitRouteRequired.some((route) => workerLines.includes(route));
      const sameLoc = j.location === worker.location;
      
      return sameLoc || sharesTransit;
    });

    if (matchingGigs.length === 0) {
      const text = [
        "Matching Gigs:",
        "No matching gigs found",
        "on your taxi routes today.",
        "1. Back"
      ];
      setUssdScreen(text);
      const handler = () => {
        showMainMenu(worker);
      };
      setMenuStack((prev) => [...prev, { id: "GIG_LIST_EMPTY", screenText: text, onAction: handler }]);
      return;
    }

    const text = [
      "Gigs in your taxi lines:",
      ...matchingGigs.slice(0, 3).map((g, i) => `${i + 1}. R${g.budget}: ${g.title.slice(0, 16)}`),
      "4. Back"
    ];
    setUssdScreen(text);

    const handler = (val: string) => {
      if (val === "4") {
        showMainMenu(worker);
      } else {
        const idx = parseInt(val) - 1;
        if (idx >= 0 && idx < matchingGigs.length) {
          showGigDetails(worker, matchingGigs[idx]);
        } else {
          showLocalGigsMenu(worker);
        }
      }
    };
    setMenuStack((prev) => [...prev, { id: "GIG_LIST", screenText: text, onAction: handler }]);
  };

  const showGigDetails = (worker: WorkerProfile, job: JobPosting) => {
    const locName = mockNeighborhoods.find((n) => n.id === job.location)?.name || "Unknown";
    const text = [
      `Gig: ${job.title.slice(0, 18)}`,
      `Budget: R${job.budget} | Loc: ${locName}`,
      `Route: ${job.transitRouteRequired[0] || "None"}`,
      "1. Express Interest & Chat",
      "2. Back"
    ];
    setUssdScreen(text);

    const handler = (val: string) => {
      if (val === "1") {
        // Apply! Add a mock initial message and set job state
        const helloMsg: Message = {
          id: `msg_${Date.now()}`,
          senderId: worker.id,
          senderRole: "worker",
          receiverId: job.clientId,
          content: `USSD Notice: Worker ${worker.fullName} expressed interest in "${job.title}" at rate R${worker.hourlyRate}/hr. Let's start the chat!`,
          timestamp: new Date().toISOString(),
          jobId: job.id,
        };
        onAddMessage(helloMsg);
        
        exitUssd("Interest submitted!\nChat is open on the secure Web dashboard. Client notified.");
      } else {
        showLocalGigsMenu(worker);
      }
    };
    setMenuStack((prev) => [...prev, { id: "GIG_DETAIL", screenText: text, onAction: handler }]);
  };

  const showInboxMenu = (worker: WorkerProfile) => {
    // Find chats involving this worker
    const relevantMsgs = messages.filter(
      (m) => m.senderId === worker.id || m.receiverId === worker.id
    );

    // Group by client/job
    const uniqueChats: { clientId: string; jobTitle: string; lastMsg: string }[] = [];
    const clientIdsAdded = new Set<string>();

    relevantMsgs.forEach((m) => {
      const otherParty = m.senderId === worker.id ? m.receiverId : m.senderId;
      if (!clientIdsAdded.has(otherParty)) {
        clientIdsAdded.add(otherParty);
        // Find job title
        const associatedJob = jobs.find((j) => j.id === m.jobId);
        const title = associatedJob ? associatedJob.title : "Contract";
        uniqueChats.push({
          clientId: otherParty,
          jobTitle: title,
          lastMsg: m.content,
        });
      }
    });

    if (uniqueChats.length === 0) {
      const text = [
        "Your Inbox:",
        "No active messages.",
        "Express interest in a gig",
        "to open negotiations.",
        "1. Back"
      ];
      setUssdScreen(text);
      const handler = () => {
        showMainMenu(worker);
      };
      setMenuStack((prev) => [...prev, { id: "INBOX_EMPTY", screenText: text, onAction: handler }]);
      return;
    }

    const text = [
      "Your Inbox Chats:",
      ...uniqueChats.slice(0, 3).map((c, i) => `${i + 1}. Chat: ${c.jobTitle.slice(0, 15)}`),
      "4. Back"
    ];
    setUssdScreen(text);

    const handler = (val: string) => {
      if (val === "4") {
        showMainMenu(worker);
      } else {
        const idx = parseInt(val) - 1;
        if (idx >= 0 && idx < uniqueChats.length) {
          showChatDetails(worker, uniqueChats[idx]);
        } else {
          showInboxMenu(worker);
        }
      }
    };
    setMenuStack((prev) => [...prev, { id: "INBOX_LIST", screenText: text, onAction: handler }]);
  };

  const showChatDetails = (worker: WorkerProfile, chat: { clientId: string; jobTitle: string; lastMsg: string }) => {
    const text = [
      `Chat: ${chat.jobTitle.slice(0, 15)}`,
      `Last: "${chat.lastMsg.slice(0, 20)}..."`,
      "1. Send Fast Reply: 'On my way'",
      "2. Send Fast Reply: 'Taxi delayed'",
      "3. Back"
    ];
    setUssdScreen(text);

    const handler = (val: string) => {
      let replyText = "";
      if (val === "1") replyText = "I'm on my way via the minibus taxi route.";
      if (val === "2") replyText = "Minibus taxi delayed, will be there shortly.";

      if (replyText) {
        const replyMsg: Message = {
          id: `msg_${Date.now()}`,
          senderId: worker.id,
          senderRole: "worker",
          receiverId: chat.clientId,
          content: replyText,
          timestamp: new Date().toISOString(),
        };
        onAddMessage(replyMsg);
        exitUssd("Quick reply sent successfully!");
      } else {
        showInboxMenu(worker);
      }
    };
    setMenuStack((prev) => [...prev, { id: "CHAT_DETAIL", screenText: text, onAction: handler }]);
  };

  const toggleVisibilityUssd = (worker: WorkerProfile) => {
    const text = [
      "POPIA Visibility Settings:",
      `Current Status: ${worker.isVisible ? "VISIBLE" : "HIDDEN"}`,
      "Clients see your skills.",
      "1. Switch Status",
      "2. Back"
    ];
    setUssdScreen(text);

    const handler = (val: string) => {
      if (val === "1") {
        const updated = { ...worker, isVisible: !worker.isVisible };
        onUpdateWorker(updated);
        exitUssd(`Success! Your profile visibility is now set to: ${updated.isVisible ? "VISIBLE" : "HIDDEN"}.`);
      } else {
        showMainMenu(worker);
      }
    };
    setMenuStack((prev) => [...prev, { id: "VISIBILITY_TOGGLE", screenText: text, onAction: handler }]);
  };

  const exitUssd = (msg: string) => {
    setPhoneState("COMPLETED");
    setUssdScreen(msg.split("\n"));
  };

  const processUssdInput = (val: string) => {
    if (menuStack.length > 0) {
      const current = menuStack[menuStack.length - 1];
      current.onAction(val);
    }
  };

  return (
    <div
      id="ussd-simulator-card"
      className="bg-white text-stone-900 rounded-2xl p-6 border border-[#EAE3D8] shadow-xs flex flex-col items-center"
    >
      <div className="w-full flex items-center justify-between border-b border-[#EAE3D8] pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-orange-50 p-1.5 rounded-md text-[#D95F38]">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-wider uppercase text-stone-900 font-sans">
              {translate("ussdTitle")}
            </h3>
            <p className="text-[10px] text-stone-500">Feature Phone Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-3 py-1 rounded-full text-[10px] font-mono text-[#D95F38] border border-[#EAE3D8]">
          <Shield className="w-3 h-3 text-[#D95F38]" />
          POPIA Safe
        </div>
      </div>

      <div className="w-full mb-4 bg-[#FAF6F0] p-3.5 rounded-xl border border-[#EAE3D8] text-xs">
        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-sans">
          Select Simulated Phone Line:
        </label>
        <div className="flex gap-2">
          <select
            id="ussd-phone-select"
            value={simPhoneNumber}
            onChange={(e) => {
              setSimPhoneNumber(e.target.value);
              resetUssd();
            }}
            className="bg-white text-stone-900 rounded-lg border border-[#EAE3D8] px-2.5 py-1.5 text-xs grow outline-none focus:border-[#D95F38] font-medium"
          >
            <option value="+27 82 459 1102">Sipho Ndlovu (+27 82 459 1102) [Plumber]</option>
            <option value="+27 73 982 4431">Nomvula Khumalo (+27 73 982 4431) [Domestic]</option>
            <option value="+27 84 321 0098">Pieter Botha (+27 84 321 0098) [Painter]</option>
            <option value="+27 99 999 9999">New Unregistered Worker (+27 99 999 9999)</option>
          </select>
          <button
            id="ussd-refresh-btn"
            onClick={resetUssd}
            title="Reset Terminal"
            className="p-1.5 bg-white text-stone-600 border border-[#EAE3D8] rounded-lg hover:bg-[#FAF6F0] transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
          Switch lines to test how USSD screens dynamically adapt between registered profiles and new registrations!
        </p>
      </div>

      {/* Retro Phone Frame */}
      <div className="w-64 bg-[#F2EDE4] rounded-3xl p-5 border border-[#E5DDD0] shadow-xs flex flex-col items-center">
        {/* Retro Monochrome Screen */}
        <div className="w-full bg-[#EFEBE4] text-stone-950 font-mono p-4 rounded-xl border border-[#DCD3C5] shadow-inner h-48 flex flex-col justify-between mb-4 select-none">
          {phoneState === "IDLE" ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-2">
              <PhoneCall className="w-8 h-8 text-stone-800 mb-2 opacity-75" />
              <div className="text-xs font-black uppercase tracking-wider mb-1">Enter USSD Code:</div>
              <div className="text-sm font-black bg-stone-900/5 px-2 py-0.5 rounded border border-stone-400/20">
                {dialCode || "_"}
              </div>
              <div className="text-[9px] text-stone-600 mt-2.5 leading-tight font-medium">
                Press <b>*120*111#</b> then click <b>SEND</b>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              <div className="text-xs leading-tight font-bold flex-1">
                {ussdScreen.map((line, i) => (
                  <div key={i} className="truncate">
                    {line}
                  </div>
                ))}
              </div>

              {phoneState === "ACTIVE" && (
                <div className="border-t border-stone-400/30 pt-1.5 mt-1 flex items-center justify-between">
                  <span className="text-[10px] bg-stone-900/5 px-1 rounded truncate max-w-[120px]">
                    Input: <b>{userInput || "_"}</b>
                  </span>
                  <span className="text-[9px] font-bold animate-pulse text-[#D95F38]">
                    [WAITING]
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[200px] mb-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((btn) => (
            <button
              key={btn}
              id={`phone-keypad-${btn}`}
              onClick={() => handleKeyPress(btn)}
              className="py-2.5 bg-white hover:bg-[#FAF6F0] active:bg-[#EFEBE4] rounded-xl text-sm font-bold text-stone-800 border border-[#EAE3D8] shadow-xs active:shadow-inner cursor-pointer transition"
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 w-full max-w-[200px] mt-1.5 border-t border-[#DCD3C5] pt-3">
          <button
            id="phone-btn-clear"
            onClick={handleDelete}
            className="py-1.5 bg-[#EAE3D8] hover:bg-[#DCD3C5] text-stone-700 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-[#DCD3C5]/50 cursor-pointer transition"
          >
            Clear
          </button>
          <button
            id="phone-btn-send"
            onClick={handleSend}
            className="py-1.5 bg-[#D95F38] hover:bg-[#C44E29] text-white rounded-lg text-[10px] uppercase font-black tracking-wider shadow-sm cursor-pointer transition"
          >
            Send
          </button>
        </div>
      </div>

      <div className="w-full mt-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#EAE3D8] text-[11px] text-stone-600">
        <h4 className="font-bold text-stone-900 mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#D95F38]" />
          Key Features to Test:
        </h4>
        <ul className="list-disc pl-4 space-y-1.5">
          <li>Select a registered worker like Nomvula or Sipho. Dial <span className="font-mono text-[#D95F38] bg-white px-1.5 py-0.5 rounded border border-[#EAE3D8]">*120*111#</span> and press SEND to search local jobs.</li>
          <li>Select 'New Unregistered Worker'. Dial the code to test the complete multi-step profile registration wizard!</li>
          <li>Toggle profile visibility to "Hidden" via USSD; verify they disappear from the main web search dashboard instantly.</li>
        </ul>
      </div>
    </div>
  );
};
