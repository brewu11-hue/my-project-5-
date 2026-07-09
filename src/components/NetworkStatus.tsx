/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Wifi, WifiOff, RefreshCw, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { SyncQueueItem } from "../types";

interface NetworkStatusProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  syncQueue: SyncQueueItem[];
  onTriggerSync: () => void;
  translate: (key: string) => string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isOnline,
  onToggleOnline,
  syncQueue,
  onTriggerSync,
  translate,
}) => {
  return (
    <div
      id="network-status-panel"
      className="bg-[#FDFBF7] border border-[#EAE3D8] rounded-2xl shadow-xs overflow-hidden"
    >
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D8]">
        <div className="flex items-center gap-3">
          <div
            id="status-indicator-dot"
            className={`p-2.5 rounded-full border ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-orange-50 text-orange-700 border-orange-100 animate-pulse"
            }`}
          >
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-950 text-sm">
                {isOnline ? translate("online") : translate("offline")}
              </h3>
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isOnline ? "bg-emerald-500" : "bg-orange-500 animate-ping"
                }`}
              />
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-sans">
              {isOnline
                ? "All changes persist to local SQLite/Room storage and cloud servers."
                : "Safe offline mode active. Read/write active. Data is queued."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-network-btn"
            onClick={onToggleOnline}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
              isOnline
                ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            {isOnline ? "Simulate Offline" : "Connect Online"}
          </button>

          {syncQueue.length > 0 && isOnline && (
            <button
              id="sync-now-btn"
              onClick={onTriggerSync}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#D95F38] text-white hover:bg-[#C44E29] cursor-pointer transition shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Sync ({syncQueue.length})
            </button>
          )}
        </div>
      </div>

      {syncQueue.length > 0 && (
        <div className="bg-orange-500/5 p-3.5 border-t border-[#EAE3D8]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-orange-700">
              <Layers className="w-4 h-4" />
              {translate("syncQueueTitle")} ({syncQueue.length} pending)
            </span>
            <span className="text-[10px] bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-full font-bold">
              Offline Cache Active
            </span>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {syncQueue.map((item) => {
              let label = "";
              switch (item.type) {
                case "SEND_MESSAGE":
                  label = `Draft message to ${item.payload.receiverName || item.payload.receiverId}: "${item.payload.content.slice(0, 30)}..."`;
                  break;
                case "CREATE_JOB":
                  label = `New job listed: "${item.payload.title}" in ${item.payload.locationName}`;
                  break;
                case "UPDATE_PROFILE":
                  label = `Profile update: "${item.payload.fullName}"`;
                  break;
                case "PROPOSE_CONTRACT":
                  label = `Contract proposal: R${item.payload.proposedRate}/hr for Job #${item.payload.jobId}`;
                  break;
                case "ACCEPT_CONTRACT":
                  label = `Contract Accepted: Unlocking POPIA mask for Job #${item.payload.jobId}`;
                  break;
                default:
                  label = `Action: ${item.type}`;
              }

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 bg-white border border-[#EAE3D8] p-2 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-bold font-mono text-[10px] text-orange-600 bg-orange-50 border border-orange-100 px-1 rounded">
                      {item.type}
                    </span>
                    <span className="truncate max-w-[220px] sm:max-w-md">{label}</span>
                  </div>
                  <span className="text-[9px] text-stone-400 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-orange-700 mt-2 italic flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {translate("offlineWarning")}
          </p>
        </div>
      )}
    </div>
  );
};
