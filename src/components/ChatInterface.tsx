/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Message, ContractProposal, WorkerProfile, JobPosting } from "../types";
import {
  Send,
  Lock,
  Unlock,
  Coins,
  Shield,
  Clock,
  Check,
  CheckCheck,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserRole: "worker" | "client";
  otherPartyId: string;
  associatedJobId: string;
  messages: Message[];
  contracts: ContractProposal[];
  onSendMessage: (content: string) => void;
  onProposeContract: (proposedRate: number) => void;
  workers: WorkerProfile[];
  jobs: JobPosting[];
  isOnline: boolean;
  translate: (key: string) => string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUserId,
  currentUserRole,
  otherPartyId,
  associatedJobId,
  messages,
  contracts,
  onSendMessage,
  onProposeContract,
  workers,
  jobs,
  isOnline,
  translate,
}) => {
  const [typedText, setTypedText] = useState("");
  const [proposedRate, setProposedRate] = useState<number>(85);
  const [showNegotiatePanel, setShowNegotiatePanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find info about other party
  const associatedJob = jobs.find((j) => j.id === associatedJobId);
  const otherWorker = workers.find((w) => w.id === otherPartyId);

  // If role is client, other party is worker. If role is worker, other party is client (represented by associated job client info)
  const otherPartyName =
    currentUserRole === "client"
      ? otherWorker?.fullName || "Candidate Worker"
      : associatedJob?.clientName || "Hiring Manager";

  const otherPartyPhone =
    currentUserRole === "client"
      ? otherWorker?.phoneNumber || "+27 82 555 4401"
      : associatedJob?.clientPhone || "+27 82 555 9012";

  // Filter messages for this conversation thread
  const conversationMessages = messages.filter((msg) => {
    const involvesBoth =
      (msg.senderId === currentUserId && msg.receiverId === otherPartyId) ||
      (msg.senderId === otherPartyId && msg.receiverId === currentUserId);
    return involvesBoth;
  });

  // Find associated contract proposal
  const activeContract = contracts.find(
    (c) => c.jobId === associatedJobId && c.workerId === (currentUserRole === "client" ? otherPartyId : currentUserId)
  );

  const isContractFinalized = activeContract?.workerAccepted && activeContract?.clientAccepted;

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;
    onSendMessage(typedText.trim());
    setTypedText("");
  };

  const handleProposeRate = () => {
    onProposeContract(proposedRate);
    setShowNegotiatePanel(false);
  };

  return (
    <div
      id="chat-interface-workspace"
      className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]"
    >
      {/* CHAT HEADER */}
      <div className="bg-[#FAF6F0] p-4 flex items-center justify-between gap-4 border-b border-[#EAE3D8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D95F38] text-white rounded-full flex items-center justify-center font-black text-sm uppercase shadow-xs">
            {otherPartyName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900">{otherPartyName}</h3>
            <p className="text-[10px] text-stone-500 font-mono">
              {associatedJob ? `Gig: ${associatedJob.title.slice(0, 30)}...` : "Contract Negotiation"}
            </p>
          </div>
        </div>

        {/* POPIA LOCKED OR UNLOCKED PHONE INDICATOR */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#EAE3D8]">
          {isContractFinalized ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <div className="text-[10px] text-right">
                <span className="block text-emerald-800 font-bold uppercase leading-none">Contact Unlocked</span>
                <span className="font-mono text-stone-900 font-bold">{otherPartyPhone}</span>
              </div>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              <div className="text-[10px] text-right">
                <span className="block text-orange-800 font-bold uppercase leading-none">POPIA Secured</span>
                <span className="font-mono text-stone-500">+27 82 *** ****</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* POPIA SECURITY COMPLIANCE WARNING BANNER */}
      <div className="bg-emerald-50 text-emerald-800 px-4 py-2.5 text-[10.5px] border-b border-[#EAE3D8] flex items-center gap-2">
        <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse" />
        <span className="font-medium">
          {translate("popiaNotice")} {!isContractFinalized && "Once both accept the rate, details reveal."}
        </span>
      </div>

      {/* MESSAGES CONTAINER WITH RADIAL DOT GRID BACKGROUND */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF6F0] bg-[radial-gradient(#EAE3D8_1px,transparent_1px)] [background-size:16px_16px]" ref={scrollRef}>
        {conversationMessages.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-xs font-medium">
            No previous messages. Type below to start rate negotiation.
          </div>
        ) : (
          conversationMessages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? "bg-[#D95F38] text-white font-medium rounded-br-none"
                      : "bg-white text-stone-900 border border-[#EAE3D8] rounded-bl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>

                <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-stone-400 font-mono">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && (
                    <span>
                      {msg.isPendingSync ? (
                        <span className="text-orange-600 font-bold flex items-center gap-0.5">
                          Offline Draft <Check className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RATE PROPOSAL BAR */}
      {activeContract && (
        <div className="bg-orange-50/50 p-3.5 border-t border-[#EAE3D8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-700 font-bold">
            <Coins className="w-4.5 h-4.5 text-[#D95F38] animate-pulse" />
            <span>
              Contract Status: <b className="text-[#D95F38] font-extrabold uppercase">{activeContract.status}</b> (R{activeContract.proposedRate}/hr)
            </span>
          </div>
          <div className="flex gap-2">
            {!activeContract.workerAccepted && currentUserRole === "worker" && (
              <span className="text-[10px] text-stone-500 italic">Sign proposal in contracts list</span>
            )}
            {!activeContract.clientAccepted && currentUserRole === "client" && (
              <span className="text-[10px] text-stone-500 italic">Sign proposal in active list</span>
            )}
            {isContractFinalized && (
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                <Check className="w-3 h-3" /> Agreement Sealed!
              </span>
            )}
          </div>
        </div>
      )}

      {/* CHAT INPUT FORM */}
      <div className="p-3.5 bg-white border-t border-[#EAE3D8]">
        <form onSubmit={handleSend} className="flex gap-2">
          <button
            id="negotiate-toggle-btn"
            type="button"
            onClick={() => setShowNegotiatePanel(!showNegotiatePanel)}
            className="px-3.5 py-2.5 bg-orange-50 hover:bg-orange-100/70 text-[#D95F38] border border-orange-100 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Coins className="w-3.5 h-3.5" />
            {translate("negotiateRate")}
          </button>

          <input
            id="chat-text-input"
            type="text"
            placeholder={isOnline ? translate("typeMessage") : "Offline: Type message to draft..."}
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            className="grow text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] focus:bg-white transition"
          />

          <button
            id="chat-send-btn"
            type="submit"
            className="px-4 py-2.5 bg-[#D95F38] hover:bg-[#C44E29] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* NEGOTIATE POPUP DRAWER */}
        {showNegotiatePanel && (
          <div className="mt-3 p-4 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                {translate("proposeRateLabel")}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400">R</span>
                <input
                  id="propose-rate-number-input"
                  type="number"
                  min="40"
                  max="500"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(Number(e.target.value))}
                  className="w-20 text-xs bg-white border border-[#EAE3D8] rounded px-2.5 py-1.5 outline-none font-bold font-mono text-stone-900 focus:border-[#D95F38]"
                />
                <span className="text-xs text-stone-500 font-medium">/ hour</span>
              </div>
            </div>

            <div className="flex gap-1.5 self-end sm:self-center">
              <button
                id="submit-rate-proposal-btn"
                type="button"
                onClick={handleProposeRate}
                className="px-3.5 py-2 bg-[#D95F38] hover:bg-[#C44E29] text-white rounded-lg text-xs font-bold cursor-pointer transition"
              >
                {translate("sendOffer")}
              </button>
              <button
                id="cancel-rate-proposal-btn"
                type="button"
                onClick={() => setShowNegotiatePanel(false)}
                className="px-3.5 py-2 bg-[#EAE3D8] hover:bg-[#DCD3C5] text-stone-700 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
