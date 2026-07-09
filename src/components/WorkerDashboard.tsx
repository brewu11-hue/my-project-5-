/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WorkerProfile, JobPosting, Message, ContractProposal } from "../types";
import { mockNeighborhoods } from "../data/mockData";
import { LocationSelector } from "./LocationSelector";
import {
  Briefcase,
  MapPin,
  Clock,
  Coins,
  ShieldAlert,
  User,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Navigation,
  Check,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Upload,
} from "lucide-react";

interface WorkerDashboardProps {
  currentWorker: WorkerProfile;
  onUpdateWorker: (worker: WorkerProfile) => void;
  jobs: JobPosting[];
  contracts: ContractProposal[];
  onUpdateContract: (contract: ContractProposal) => void;
  onStartChat: (clientId: string, jobId: string) => void;
  translate: (key: string) => string;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  currentWorker,
  onUpdateWorker,
  jobs,
  contracts,
  onUpdateContract,
  onStartChat,
  translate,
}) => {
  // Local form state for editing profile
  const [fullName, setFullName] = useState(currentWorker.fullName);
  const [bio, setBio] = useState(currentWorker.bio);
  const [hourlyRate, setHourlyRate] = useState(currentWorker.hourlyRate);
  const [locationId, setLocationId] = useState(currentWorker.location);
  const [isVisible, setIsVisible] = useState(currentWorker.isVisible);
  const [availability, setAvailability] = useState(currentWorker.availability);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // New photo simulation state
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [photosList, setPhotosList] = useState<string[]>(currentWorker.portfolioPhotos);

  const workerLocation = mockNeighborhoods.find((n) => n.id === locationId);
  const workerTransitLines = workerLocation?.transitLines || [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WorkerProfile = {
      ...currentWorker,
      fullName,
      bio,
      hourlyRate: Number(hourlyRate),
      location: locationId,
      isVisible,
      availability,
      portfolioPhotos: photosList,
    };
    onUpdateWorker(updated);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  const addSimulatedPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotosList([...photosList, newPhotoUrl.trim()]);
      setNewPhotoUrl("");
    } else {
      // Pick a random nice portfolio photo
      const presets = [
        "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400",
      ];
      const randomUrl = presets[Math.floor(Math.random() * presets.length)];
      setPhotosList([...photosList, randomUrl]);
    }
  };

  const removePhoto = (idx: number) => {
    setPhotosList(photosList.filter((_, i) => i !== idx));
  };

  // Find jobs that match location or share transit lines
  const matchedJobs = jobs.filter((job) => {
    if (job.status === "Completed") return false;
    const sameLoc = job.location === locationId;
    const sharesTransit = job.transitRouteRequired.some((route) =>
      workerTransitLines.includes(route)
    );
    return sameLoc || sharesTransit;
  });

  const workerContracts = contracts.filter((c) => c.workerId === currentWorker.id);

  const handleContractResponse = (contractId: string, accept: boolean) => {
    const original = contracts.find((c) => c.id === contractId);
    if (!original) return;

    const updated: ContractProposal = {
      ...original,
      workerAccepted: accept,
      status: accept ? (original.clientAccepted ? "Accepted" : "Pending") : "Declined",
    };
    onUpdateContract(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="worker-dashboard-container">
      {/* LEFT COLUMN: PROFILE CARD AND SETTINGS */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-5 border-b border-[#EAE3D8] pb-5">
            {currentWorker.avatarUrl ? (
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-xs border border-[#EAE3D8]">
                <img
                  src={currentWorker.avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-[#D95F38] text-white rounded-full flex items-center justify-center font-black text-xl uppercase shadow-xs">
                {fullName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-950">{fullName}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isVisible
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}
                >
                  {isVisible ? "POPIA Visible" : "Hidden"}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                {currentWorker.phoneNumber} (POPIA Secured)
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-sans">
                Full Name
              </label>
              <input
                id="worker-edit-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full text-sm bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3.5 py-2.5 text-stone-900 outline-none focus:border-[#D95F38] focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-sans">
                  {translate("hourlyRate")} (R/hr)
                </label>
                <input
                  id="worker-edit-rate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  required
                  min="30"
                  className="w-full text-sm bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3.5 py-2.5 text-stone-900 outline-none focus:border-[#D95F38] focus:bg-white font-mono font-bold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-sans">
                  {translate("availability")}
                </label>
                <select
                  id="worker-edit-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full text-sm bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 outline-none focus:border-[#D95F38] cursor-pointer font-medium transition"
                >
                  <option value="Available">{translate("availability_Available")}</option>
                  <option value="Busy">{translate("availability_Busy")}</option>
                  <option value="Part-time">{translate("availability_PartTime")}</option>
                </select>
              </div>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EAE3D8] space-y-3">
              <h4 className="text-[10px] font-bold text-[#D95F38] uppercase tracking-wider">
                Select Coverage Location
              </h4>
              <LocationSelector
                value={locationId}
                onChange={(id) => setLocationId(id)}
                stacked={true}
              />
            </div>

            <div className="p-4 bg-[#FAF6F0] rounded-xl border border-[#EAE3D8]">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-widest flex items-center gap-1.5 mb-2">
                <Navigation className="w-3.5 h-3.5 text-[#D95F38]" />
                Detected Transit routes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {workerTransitLines.map((line) => (
                  <span
                    key={line}
                    className="text-[10px] font-bold bg-white text-stone-700 px-2.5 py-0.5 rounded-full border border-[#EAE3D8]"
                  >
                    {line}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                Matches you automatically with jobs on these minibus taxi lines to save travel costs.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 font-sans">
                {translate("bio")}
              </label>
              <textarea
                id="worker-edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                required
                className="w-full text-sm bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3.5 py-2.5 text-stone-900 outline-none focus:border-[#D95F38] resize-none focus:bg-white transition"
              />
            </div>

            {/* POPIA Privacy Switch */}
            <div className="p-4 bg-orange-50/40 rounded-xl border border-orange-100 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <input
                  id="worker-popia-consent"
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="mt-1 cursor-pointer w-4 h-4 text-[#D95F38] border-[#EAE3D8] bg-[#FAF6F0] rounded focus:ring-[#D95F38]"
                />
                <label
                  htmlFor="worker-popia-consent"
                  className="text-xs text-[#D95F38] font-bold cursor-pointer"
                >
                  {translate("visibilityToggle")}
                </label>
              </div>
              <p className="text-[10px] text-stone-500 leading-relaxed ml-6">
                Under South Africa's POPI Act, you retain full control. Hiding your profile prevents hirers from seeing it.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                id="worker-save-btn"
                type="submit"
                className="px-4 py-2.5 bg-[#D95F38] text-white rounded-xl text-xs font-bold hover:bg-[#C44E29] transition shadow-xs cursor-pointer"
              >
                {translate("saveProfile")}
              </button>
              {saveFeedback && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {translate("profileUpdateSuccess")}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Portfolio management section */}
        <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6 relative overflow-hidden">
          <h3 className="font-bold text-sm text-stone-950 mb-2 flex items-center gap-1.5 font-sans">
            <Upload className="w-4 h-4 text-[#D95F38]" />
            {translate("portfolio")}
          </h3>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            Showcase finished works (plumbing repairs, tidied gardens, tailored suits) to clients.
          </p>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {photosList.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#EAE3D8] bg-[#FAF6F0] group">
                <img src={url} alt="Portfolio Work" className="w-full h-full object-cover" />
                <button
                  id={`remove-portfolio-photo-${i}`}
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition shadow-md cursor-pointer opacity-85"
                  title="Delete image"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              id="portfolio-photo-url-input"
              type="text"
              placeholder="Paste simulated photo URL..."
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="bg-[#FAF6F0] border border-[#EAE3D8] text-stone-900 placeholder-stone-400 text-xs px-3.5 py-2.5 rounded-xl grow outline-none focus:border-[#D95F38] focus:bg-white"
            />
            <button
              id="add-portfolio-photo-btn"
              onClick={addSimulatedPhoto}
              className="px-3.5 py-2 bg-stone-950 text-white text-xs font-bold rounded-xl hover:bg-stone-850 transition shadow-xs cursor-pointer"
            >
              Add Photo
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DISCOVER GIGS & ACTIVE CONTRACTS */}
      <div className="lg:col-span-7 space-y-6">
        {/* CONTRACT PROPOSALS / SECURED AGREEMENTS */}
        {workerContracts.length > 0 && (
          <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6">
            <h3 className="font-bold text-sm text-stone-950 mb-4 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-[#D95F38]" />
              {translate("activeContracts")}
            </h3>

            <div className="space-y-4">
              {workerContracts.map((contract) => {
                const associatedJob = jobs.find((j) => j.id === contract.jobId);
                if (!associatedJob) return null;

                const isFullyAccepted = contract.workerAccepted && contract.clientAccepted;

                return (
                  <div
                    key={contract.id}
                    className={`p-4 rounded-xl border ${
                      isFullyAccepted
                        ? "bg-emerald-50/30 border-emerald-200"
                        : "bg-white border-[#EAE3D8]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3.5">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold mb-1.5 uppercase tracking-wider ${
                            isFullyAccepted
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              : "bg-orange-50 text-orange-800 border border-orange-100"
                          }`}
                        >
                          {isFullyAccepted ? "Agreement Finalized" : "Pending Signature"}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900">{associatedJob.title}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Hirer: <b className="text-stone-700">{associatedJob.clientName}</b>
                        </p>
                      </div>
                      <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#EAE3D8] text-right">
                        <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wide">Proposed Rate</span>
                        <span className="font-bold text-sm text-[#D95F38] font-mono">
                          R{contract.proposedRate}/hr
                        </span>
                      </div>
                    </div>

                    {/* POPIA SAFE CONTACT UNLOCK AREA */}
                    <div className="mt-3.5 p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EAE3D8] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {isFullyAccepted ? (
                          <Unlock className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Lock className="w-5 h-5 text-stone-400" />
                        )}
                        <div>
                          <p className="font-bold text-stone-900">
                            {isFullyAccepted ? translate("phoneUnlocked") : translate("maskedPhone")}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                            {isFullyAccepted ? associatedJob.clientPhone : "+27 82 *** 9012 (Masked)"}
                          </p>
                        </div>
                      </div>
                      {isFullyAccepted ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold uppercase">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] bg-orange-100 text-orange-800 border border-orange-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>

                    {!isFullyAccepted && (
                      <div className="mt-4 flex flex-wrap gap-2 pt-3.5 border-t border-[#EAE3D8]">
                        {!contract.workerAccepted ? (
                          <>
                            <button
                              id={`worker-accept-contract-${contract.id}`}
                              onClick={() => handleContractResponse(contract.id, true)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition"
                            >
                              Accept Proposed Rate
                            </button>
                            <button
                              id={`worker-decline-contract-${contract.id}`}
                              onClick={() => handleContractResponse(contract.id, false)}
                              className="px-3.5 py-2 bg-[#EAE3D8] hover:bg-[#DCD3C5] text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition"
                            >
                              Reject Offer
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-orange-800 font-bold italic flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Waiting for Hirer to counter-sign rate proposal.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GIGS ON YOUR TRANSIT ROUTES */}
        <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6">
          <div className="flex items-center justify-between gap-4 mb-4 border-b border-[#EAE3D8] pb-4">
            <div>
              <h3 className="font-bold text-sm text-stone-950 flex items-center gap-2 font-sans">
                <Navigation className="w-4 h-4 text-[#D95F38]" />
                {translate("matchingJobs")}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Connecting you with local gigs requiring zero or low transfer costs.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-[#FAF6F0] text-stone-700 px-3 py-1.5 rounded-full border border-[#EAE3D8]">
              {matchedJobs.length} Gigs Listed
            </span>
          </div>

          {matchedJobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#EAE3D8] rounded-xl bg-[#FAF6F0]/20">
              <ShieldAlert className="w-10 h-10 text-stone-400 mx-auto mb-2.5" />
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {translate("noJobsFound")} Try editing your location or look back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedJobs.map((job) => {
                const jobLocation = mockNeighborhoods.find((n) => n.id === job.location);
                const hasTransitOverlap = job.transitRouteRequired.some((route) =>
                  workerTransitLines.includes(route)
                );

                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-xl border border-[#EAE3D8] hover:border-[#D95F38]/40 transition bg-white relative"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="text-[10px] font-bold bg-[#FAF6F0] text-stone-700 px-2.5 py-0.5 rounded-md border border-[#EAE3D8]">
                            {job.category}
                          </span>
                          {hasTransitOverlap && (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Matches Taxi Lines
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-stone-900">{job.title}</h4>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl text-right font-mono self-start sm:self-center">
                        <span className="text-[9px] font-bold text-emerald-800 uppercase block tracking-wider leading-none mb-0.5">Est. Budget</span>
                        <span className="font-black text-emerald-800 text-sm">
                          R{job.budget}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#EAE3D8] text-xs">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-stone-500 font-semibold">
                        <span className="flex items-center gap-1 text-stone-700">
                          <MapPin className="w-3.5 h-3.5 text-[#D95F38]" />
                          {jobLocation?.name || "Unknown"} ({jobLocation?.city})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {job.duration}
                        </span>
                      </div>

                      <button
                        id={`worker-chat-btn-${job.id}`}
                        onClick={() => onStartChat(job.clientId, job.id)}
                        className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer transition hover:bg-stone-850"
                      >
                        Negotiate & Chat
                      </button>
                    </div>

                    {/* Show associated transit lines requested */}
                    {job.transitRouteRequired.length > 0 && (
                      <div className="mt-3 bg-[#FAF6F0] border border-[#EAE3D8] p-2.5 rounded-xl text-[10px] text-stone-600 flex items-center justify-between">
                        <span>Required Route: <b className="text-stone-800">{job.transitRouteRequired[0]}</b></span>
                        <span className="text-[9px] bg-white px-2 py-0.5 rounded text-stone-600 uppercase font-mono border border-[#EAE3D8]">Minibus Link</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
