/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, WorkerProfile, JobPosting, Message, ContractProposal, SyncQueueItem } from "./types";
import { translations } from "./data/translations";
import { getLocalStorageData, saveLocalStorageData, mockNeighborhoods } from "./data/mockData";
import { LanguageSelector } from "./components/LanguageSelector";
import { NetworkStatus } from "./components/NetworkStatus";
import { UssdSimulator } from "./components/UssdSimulator";
import { WorkerDashboard } from "./components/WorkerDashboard";
import { HiringDashboard } from "./components/HiringDashboard";
import { ChatInterface } from "./components/ChatInterface";
import { SignUpProfile } from "./components/SignUpProfile";
import { StartScreen } from "./components/StartScreen";
import {
  Briefcase,
  Users,
  ShieldAlert,
  MessageSquare,
  HelpCircle,
  Clock,
  Heart,
  Globe,
  PlusCircle,
  Database,
  ArrowRightLeft,
  ChevronRight,
  Shield,
  Menu,
  LogOut,
} from "lucide-react";

export default function App() {
  // Global App States
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [currentRole, setCurrentRole] = useState<"worker" | "client">(() => {
    try {
      const stored = localStorage.getItem("sizawork_role");
      if (stored === "worker" || stored === "client") return stored;
    } catch {}
    return "worker";
  });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("sizawork_authenticated");
      return stored === "true";
    } catch {}
    return false;
  });
  
  // Persistent Databases
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    try {
      return getLocalStorageData().workers || [];
    } catch {
      return [];
    }
  });
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    try {
      return getLocalStorageData().jobs || [];
    } catch {
      return [];
    }
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return getLocalStorageData().messages || [];
    } catch {
      return [];
    }
  });
  const [contracts, setContracts] = useState<ContractProposal[]>(() => {
    try {
      return getLocalStorageData().contracts || [];
    } catch {
      return [];
    }
  });
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const storedQueue = localStorage.getItem("sizawork_syncqueue");
        if (storedQueue) {
          return JSON.parse(storedQueue);
        }
      }
    } catch {}
    return [];
  });

  // Navigation / Workspace selection
  const [activeChatClientId, setActiveChatClientId] = useState<string>("client_1");
  const [activeChatJobId, setActiveChatJobId] = useState<string>("job_1");
  const [showUssdSidebar, setShowUssdSidebar] = useState<boolean>(true);

  // Active Profile Identification
  const [activeWorkerId, setActiveWorkerId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem("sizawork_active_worker_id");
      if (stored) return stored;
    } catch {}
    return "worker_1";
  });

  const [currentClient, setCurrentClient] = useState<{ id: string; fullName: string; phoneNumber: string; location: string }>(() => {
    try {
      const stored = localStorage.getItem("sizawork_current_client");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      id: "client_current",
      fullName: "Lindiwe Khumalo (You)",
      phoneNumber: "+27 82 555 9012",
      location: "jhb_cbd",
    };
  });

  const [showSignUpPanel, setShowSignUpPanel] = useState<boolean>(false);

  // Sync state changes to local storage
  const persistChanges = (
    wList: WorkerProfile[],
    jList: JobPosting[],
    mList: Message[],
    cList: ContractProposal[]
  ) => {
    setWorkers(wList);
    setJobs(jList);
    setMessages(mList);
    setContracts(cList);
    saveLocalStorageData({ workers: wList, jobs: jList, messages: mList, contracts: cList });
  };

  // Safe translation lookup helper
  const translate = (key: string): string => {
    const langDict = translations[currentLanguage];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    const enDict = translations["en"];
    return enDict[key] || key;
  };

  // Sync Queue management
  const addToSyncQueue = (type: SyncQueueItem["type"], payload: any) => {
    const newItem: SyncQueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    const updatedQueue = [...syncQueue, newItem];
    setSyncQueue(updatedQueue);
    localStorage.setItem("sizawork_syncqueue", JSON.stringify(updatedQueue));
  };

  const handleToggleOnline = () => {
    const nextOnlineState = !isOnline;
    setIsOnline(nextOnlineState);
    
    // Auto-trigger synchronization of pending queue items when returning online
    if (nextOnlineState && syncQueue.length > 0) {
      setTimeout(() => {
        handleTriggerSync(syncQueue);
      }, 500);
    }
  };

  const handleTriggerSync = (queueToSync: SyncQueueItem[] = syncQueue) => {
    if (queueToSync.length === 0) return;

    let updatedWorkers = [...workers];
    let updatedJobs = [...jobs];
    let updatedMessages = [...messages];
    let updatedContracts = [...contracts];

    // Process each queued offline write in sequence
    queueToSync.forEach((item) => {
      switch (item.type) {
        case "SEND_MESSAGE":
          // Find any corresponding message that was in pendingSync, and resolve it
          updatedMessages = updatedMessages.map((m) => {
            if (m.id === item.payload.id) {
              return { ...m, isPendingSync: false };
            }
            return m;
          });
          break;

        case "CREATE_JOB":
          // Already in local jobs, just ensure status is open
          break;

        case "UPDATE_PROFILE":
          // Update profile in database
          updatedWorkers = updatedWorkers.map((w) => {
            if (w.id === item.payload.id) {
              return { ...item.payload };
            }
            return w;
          });
          break;

        case "PROPOSE_CONTRACT":
          // Create or update contract proposal
          const existsIdx = updatedContracts.findIndex((c) => c.id === item.payload.id);
          if (existsIdx > -1) {
            updatedContracts[existsIdx] = item.payload;
          } else {
            updatedContracts.push(item.payload);
          }
          break;

        case "ACCEPT_CONTRACT":
          updatedContracts = updatedContracts.map((c) => {
            if (c.id === item.payload.id) {
              return { ...item.payload };
            }
            return c;
          });
          break;
      }
    });

    persistChanges(updatedWorkers, updatedJobs, updatedMessages, updatedContracts);
    setSyncQueue([]);
    localStorage.removeItem("sizawork_syncqueue");
  };

  // MUTATION WRAPPERS WITH OFFLINE SAFE HANDLING
  const handleUpdateWorker = (updatedWorker: WorkerProfile) => {
    const nextWorkers = workers.map((w) => (w.id === updatedWorker.id ? updatedWorker : w));
    if (!isOnline) {
      addToSyncQueue("UPDATE_PROFILE", updatedWorker);
      // Still update local state immediately so UI remains responsive
      persistChanges(nextWorkers, jobs, messages, contracts);
    } else {
      persistChanges(nextWorkers, jobs, messages, contracts);
    }
  };

  const handleAddWorker = (newWorker: WorkerProfile) => {
    const nextWorkers = [...workers, newWorker];
    if (!isOnline) {
      addToSyncQueue("UPDATE_PROFILE", newWorker);
      persistChanges(nextWorkers, jobs, messages, contracts);
    } else {
      persistChanges(nextWorkers, jobs, messages, contracts);
    }
  };

  const handleSignUpWorker = (newWorker: WorkerProfile) => {
    handleAddWorker(newWorker);
    setActiveWorkerId(newWorker.id);
    localStorage.setItem("sizawork_active_worker_id", newWorker.id);
    setCurrentRole("worker");
    localStorage.setItem("sizawork_role", "worker");
    setIsAuthenticated(true);
    localStorage.setItem("sizawork_authenticated", "true");
    setShowSignUpPanel(false);
  };

  const handleSignUpClient = (clientData: { id: string; fullName: string; phoneNumber: string; location: string }) => {
    setCurrentClient(clientData);
    localStorage.setItem("sizawork_current_client", JSON.stringify(clientData));
    setCurrentRole("client");
    localStorage.setItem("sizawork_role", "client");
    setIsAuthenticated(true);
    localStorage.setItem("sizawork_authenticated", "true");
    setShowSignUpPanel(false);
  };

  const handleLoginSuccess = (user: { role: "worker" | "client"; id: string; name: string }) => {
    setCurrentRole(user.role);
    localStorage.setItem("sizawork_role", user.role);
    if (user.role === "worker") {
      setActiveWorkerId(user.id);
      localStorage.setItem("sizawork_active_worker_id", user.id);
    } else {
      const matchedClient = workers.find(w => w.id === user.id);
      const clientDetails = {
        id: user.id,
        fullName: user.name,
        phoneNumber: matchedClient?.phoneNumber || "+27 82 555 9012",
        location: matchedClient?.location || "jhb_cbd",
      };
      setCurrentClient(clientDetails);
      localStorage.setItem("sizawork_current_client", JSON.stringify(clientDetails));
    }
    setIsAuthenticated(true);
    localStorage.setItem("sizawork_authenticated", "true");
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("sizawork_authenticated");
    localStorage.removeItem("sizawork_active_worker_id");
    localStorage.removeItem("sizawork_role");
  };

  const handleAddJob = (newJob: JobPosting) => {
    const nextJobs = [newJob, ...jobs];
    if (!isOnline) {
      addToSyncQueue("CREATE_JOB", newJob);
      persistChanges(workers, nextJobs, messages, contracts);
    } else {
      persistChanges(workers, nextJobs, messages, contracts);
    }
  };

  const handleAddMessage = (newMsg: Message) => {
    const nextMessages = [...messages, newMsg];
    if (!isOnline) {
      const msgWithPending = { ...newMsg, isPendingSync: true };
      const nextMessagesOffline = [...messages, msgWithPending];
      addToSyncQueue("SEND_MESSAGE", msgWithPending);
      persistChanges(workers, jobs, nextMessagesOffline, contracts);
    } else {
      persistChanges(workers, jobs, nextMessages, contracts);
    }
  };

  const handleUpdateContract = (updatedContract: ContractProposal) => {
    const exists = contracts.some((c) => c.id === updatedContract.id);
    const nextContracts = exists
      ? contracts.map((c) => (c.id === updatedContract.id ? updatedContract : c))
      : [...contracts, updatedContract];

    if (!isOnline) {
      addToSyncQueue("ACCEPT_CONTRACT", updatedContract);
      persistChanges(workers, jobs, messages, nextContracts);
    } else {
      persistChanges(workers, jobs, messages, nextContracts);
    }
  };

  // UI ACTIONS
  const handleStartChat = (clientId: string, jobId: string) => {
    setActiveChatClientId(clientId);
    setActiveChatJobId(jobId);
    
    // Ensure there is at least an initial contract proposal to start rate negotiations
    const hasContract = contracts.some((c) => c.jobId === jobId && c.clientId === clientId);
    if (!hasContract) {
      const targetWorker = workers.find((w) => w.id === (currentRole === "worker" ? activeWorkerId : "worker_2")) || workers[0];
      const targetJob = jobs.find((j) => j.id === jobId);
      const newContract: ContractProposal = {
        id: `contract_${Date.now()}`,
        jobId,
        workerId: currentRole === "worker" ? targetWorker.id : otherWorkerIdFromSelection(clientId),
        clientId,
        proposedRate: targetWorker ? targetWorker.hourlyRate : 80,
        workerAccepted: currentRole === "worker",
        clientAccepted: currentRole === "client",
        status: "Pending",
      };
      handleUpdateContract(newContract);
    }
  };

  const otherWorkerIdFromSelection = (clientId: string): string => {
    // defaults to worker under interaction
    const lastMsg = messages.find(m => m.receiverId === clientId || m.senderId === clientId);
    return lastMsg ? (lastMsg.senderRole === "worker" ? lastMsg.senderId : lastMsg.receiverId) : activeWorkerId;
  };

  const handleSendMessageFromChat = (content: string) => {
    const senderId = currentRole === "worker" ? activeWorkerId : currentClient.id;
    const receiverId = activeChatClientId; // the active partner ID

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      senderRole: currentRole,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      jobId: activeChatJobId,
    };

    handleAddMessage(newMsg);
  };

  const handleProposeContractFromChat = (rate: number) => {
    const workerId = currentRole === "worker" ? activeWorkerId : activeChatClientId;
    const clientId = currentRole === "worker" ? activeChatClientId : currentClient.id;

    const exists = contracts.find((c) => c.jobId === activeChatJobId && c.workerId === workerId);
    const updatedContract: ContractProposal = exists
      ? {
          ...exists,
          proposedRate: rate,
          workerAccepted: currentRole === "worker",
          clientAccepted: currentRole === "client",
          status: "Pending",
        }
      : {
          id: `contract_${Date.now()}`,
          jobId: activeChatJobId,
          workerId,
          clientId,
          proposedRate: rate,
          workerAccepted: currentRole === "worker",
          clientAccepted: currentRole === "client",
          status: "Pending",
        };

    handleUpdateContract(updatedContract);

    // Append automated system proposal notice in chat
    const noticeMsg: Message = {
      id: `msg_${Date.now()}_system`,
      senderId: currentRole === "worker" ? workerId : clientId,
      senderRole: currentRole,
      receiverId: currentRole === "worker" ? clientId : workerId,
      content: `System: Rate proposal sent. R${rate}/hour. Awaiting counter-signature.`,
      timestamp: new Date().toISOString(),
      jobId: activeChatJobId,
    };
    handleAddMessage(noticeMsg);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-900 flex flex-col font-sans" id="app-root-wrapper">
      {/* GLOBAL SYSTEM BAR / TOP HEADER */}
      <header className="bg-white border-b border-[#EAE3D8] text-stone-900 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#D95F38] p-2.5 rounded-xl text-white shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-stone-950 text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                  {translate("appName")}
                </h1>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  {translate("appSubtitle")}
                </p>
              </div>
            </div>

            {/* Mobile Sidebar toggle */}
            <button
              id="mobile-ussd-toggle-btn"
              onClick={() => setShowUssdSidebar(!showUssdSidebar)}
              className="md:hidden p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              USSD (*120#)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Translation switch buttons */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />

            {/* Simulated server clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono bg-[#FAF6F0] text-stone-600 px-3 py-1.5 rounded-lg border border-[#EAE3D8]">
              <Clock className="w-3.5 h-3.5 text-[#D95F38]" />
              <span>JHB Taxi Local: 07:42 AM</span>
            </div>

            {isAuthenticated && (
              <button
                id="header-logout-btn"
                onClick={handleLogOut}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs border border-stone-800"
              >
                <LogOut className="w-3.5 h-3.5 text-[#D95F38]" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CONNECTION CONTROL & TRANSACTION LOG BANNER */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto w-full px-4 mt-5">
          <NetworkStatus
            isOnline={isOnline}
            onToggleOnline={handleToggleOnline}
            syncQueue={syncQueue}
            onTriggerSync={() => handleTriggerSync(syncQueue)}
            translate={translate}
          />
        </div>
      )}

      {/* MAIN WORKSPACE SECTION */}
      {!isAuthenticated ? (
        <div className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 flex flex-col items-center justify-center">
          <StartScreen
            workers={workers}
            onLoginSuccess={handleLoginSuccess}
            onSignUpWorker={handleSignUpWorker}
            onSignUpClient={handleSignUpClient}
            translate={translate}
          />
        </div>
      ) : (
        <main className="max-w-7xl mx-auto w-full px-4 py-5 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* VIEW AREA - WORKER / CLIENT DASHBOARDS */}
        <div className={`col-span-1 md:col-span-12 ${showUssdSidebar ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>
          {/* USER INTERFACE PROFILE ROLE TOGGLE */}
          <div className="bg-white border border-[#EAE3D8] p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                id="role-toggle-worker-btn"
                onClick={() => {
                  setCurrentRole("worker");
                  setActiveChatClientId("client_1");
                  setActiveChatJobId("job_1");
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentRole === "worker"
                    ? "bg-[#D95F38] text-white shadow-xs"
                    : "text-stone-600 hover:bg-[#FAF6F0]"
                }`}
              >
                <Users className="w-4 h-4" />
                {translate("toggleWorker")}
              </button>

              <button
                id="role-toggle-client-btn"
                onClick={() => {
                  setCurrentRole("client");
                  setActiveChatClientId("worker_1");
                  setActiveChatJobId("job_1");
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentRole === "client"
                    ? "bg-[#D95F38] text-white shadow-xs"
                    : "text-stone-600 hover:bg-[#FAF6F0]"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                {translate("toggleClient")}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="desktop-signup-toggle-btn"
                onClick={() => setShowSignUpPanel(!showSignUpPanel)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                  showSignUpPanel
                    ? "bg-[#D95F38] text-white border-[#D95F38] shadow-sm animate-pulse"
                    : "bg-white hover:bg-[#FAF6F0] text-stone-700 border-[#EAE3D8] shadow-xs"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {showSignUpPanel ? "Close Sign Up" : "Join Vuka Gigs (Sign Up)"}
              </button>

              <button
                id="desktop-ussd-toggle-btn"
                onClick={() => setShowUssdSidebar(!showUssdSidebar)}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FAF6F0] text-stone-700 text-xs font-bold rounded-xl cursor-pointer transition-all border border-[#EAE3D8] shadow-xs"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#D95F38]" />
                {showUssdSidebar ? "Hide USSD" : "Show USSD (*120#)"}
              </button>
            </div>
          </div>

          {/* DYNAMIC REGISTRATION/SIGN UP WIDGET */}
          {showSignUpPanel && (
            <div className="animate-fade-in">
              <SignUpProfile
                onSignUpWorker={handleSignUpWorker}
                onSignUpClient={handleSignUpClient}
                translate={translate}
              />
            </div>
          )}

          {/* MAIN FORM/DASHBOARD VIEWS */}
          {currentRole === "worker" ? (
            <WorkerDashboard
              currentWorker={workers.find((w) => w.id === activeWorkerId) || workers[0]}
              onUpdateWorker={handleUpdateWorker}
              jobs={jobs}
              contracts={contracts}
              onUpdateContract={handleUpdateContract}
              onStartChat={handleStartChat}
              translate={translate}
            />
          ) : (
            <HiringDashboard
              workers={workers}
              jobs={jobs}
              onAddJob={handleAddJob}
              contracts={contracts}
              onUpdateContract={handleUpdateContract}
              onStartChatWithWorker={handleStartChat}
              translate={translate}
              currentClient={currentClient}
            />
          )}

          {/* INTEGRATED MESSAGING ROOM */}
          <div className="pt-6 border-t border-[#EAE3D8]">
            <div className="flex items-center gap-2 mb-4 text-stone-900">
              <MessageSquare className="w-5 h-5 text-[#D95F38]" />
              <h3 className="font-extrabold text-sm tracking-wide uppercase font-sans">{translate("activeChat")}</h3>
            </div>
            <ChatInterface
              currentUserId={currentRole === "worker" ? activeWorkerId : currentClient.id}
              currentUserRole={currentRole}
              otherPartyId={activeChatClientId}
              associatedJobId={activeChatJobId}
              messages={messages}
              contracts={contracts}
              onSendMessage={handleSendMessageFromChat}
              onProposeContract={handleProposeContractFromChat}
              workers={workers}
              jobs={jobs}
              isOnline={isOnline}
              translate={translate}
            />
          </div>
        </div>

        {/* USSD TERMINAL MOBILE SIDEBAR */}
        {showUssdSidebar && (
          <div className="col-span-1 md:col-span-12 lg:col-span-4 sticky top-24 self-start space-y-4">
            <UssdSimulator
              workers={workers}
              onAddWorker={handleAddWorker}
              onUpdateWorker={handleUpdateWorker}
              jobs={jobs}
              messages={messages}
              onAddMessage={handleAddMessage}
              translate={translate}
            />
          </div>
        )}
        </main>
      )}

      {/* POPIA COMPLIANCE SECURITY FOOTER */}
      <footer className="bg-white text-stone-600 text-xs py-10 mt-16 border-t border-[#EAE3D8]">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-[#EAE3D8] pb-8">
            <div className="space-y-2">
              <h4 className="font-extrabold text-stone-950 flex items-center gap-1.5 text-xs tracking-wide uppercase">
                <Shield className="w-4 h-4 text-[#D95F38]" />
                POPIA Legal Framework
              </h4>
              <p className="text-[11px] leading-relaxed text-stone-500">
                Vuka Gigs is fully compliant with the South African Protection of Personal Information Act (POPIA). Phone numbers and addresses are strictly masked under secure hashing algorithm layers. Only when rate negotiations are mutually locked do contact links unlock, preventing spam and tracking.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-stone-950 flex items-center gap-1.5 text-xs tracking-wide uppercase">
                <Database className="w-4 h-4 text-[#D95F38]" />
                Offline-First Data Guarantee
              </h4>
              <p className="text-[11px] leading-relaxed text-stone-500">
                To bridge the digital divide, our client-side database persists on local storage (SQLite/Room equivalent). All chats drafted or profile updates made while traveling in minibus taxis with zero data connection are preserved. They synchronize automatically once back in coverage.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-stone-950 flex items-center gap-1.5 text-xs tracking-wide uppercase">
                <Globe className="w-4 h-4 text-[#D95F38]" />
                Socio-Economic Inclusion
              </h4>
              <p className="text-[11px] leading-relaxed text-stone-500">
                Providing standard web platform tooling along with retro USSD phone portals allows informal workers with low-tech devices to remain competitive, search local jobs along transit routes, and receive real-time gig notifications without data fees.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone-400 font-mono">
            <span>Vuka Gigs © 2026 • Johannesburg - Cape Town, South Africa</span>
            <span className="flex items-center gap-1.5 bg-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#EAE3D8] text-stone-700">
              POPIA Status: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <b className="text-stone-900 uppercase">Active Compliance Mode</b>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
