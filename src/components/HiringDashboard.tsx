/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WorkerProfile, JobPosting, ContractProposal, Neighborhood } from "../types";
import { mockNeighborhoods } from "../data/mockData";
import { LocationSelector } from "./LocationSelector";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  Briefcase,
  Star,
  ShieldCheck,
  Smartphone,
  Check,
  Send,
  Navigation,
  CheckCircle,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";

interface HiringDashboardProps {
  workers: WorkerProfile[];
  jobs: JobPosting[];
  onAddJob: (job: JobPosting) => void;
  contracts: ContractProposal[];
  onUpdateContract: (contract: ContractProposal) => void;
  onStartChatWithWorker: (workerId: string, jobId: string) => void;
  translate: (key: string) => string;
  currentClient: { id: string; fullName: string; phoneNumber: string; location: string };
}

export const HiringDashboard: React.FC<HiringDashboardProps> = ({
  workers,
  jobs,
  onAddJob,
  contracts,
  onUpdateContract,
  onStartChatWithWorker,
  translate,
  currentClient,
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransit, setSelectedTransit] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Post new job form states
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("Domestic Work");
  const [jobBudget, setJobBudget] = useState("");
  const [jobDuration, setJobDuration] = useState("1 Day");
  const [jobLocation, setJobLocation] = useState("sandton");
  const [jobDescription, setJobDescription] = useState("");
  const [formFeedback, setFormFeedback] = useState(false);

  // Expanded portfolio image modal
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  // All unique categories for skills search
  const allCategories = ["Domestic Work", "Plumbing", "Painting", "Gardening", "Sewing", "General Work"];

  // All transit routes for filtering
  const allTransitLines = Array.from(
    new Set(mockNeighborhoods.flatMap((n) => n.transitLines))
  );

  // Filtered Workers list
  const filteredWorkers = workers.filter((worker) => {
    // Under POPIA guidelines, only show visible workers
    if (!worker.isVisible) return false;

    // Search term matching skills/bio/name
    const matchesSearch =
      searchTerm === "" ||
      worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      worker.bio.toLowerCase().includes(searchTerm.toLowerCase());

    // Location matching (Province -> District -> Area)
    let matchesLoc = true;
    if (selectedLocation !== "") {
      matchesLoc = worker.location === selectedLocation;
    } else {
      const workerLoc = mockNeighborhoods.find((n) => n.id === worker.location);
      if (workerLoc) {
        if (selectedDistrict !== "" && workerLoc.district !== selectedDistrict) {
          matchesLoc = false;
        }
        if (selectedProvince !== "" && workerLoc.province !== selectedProvince) {
          matchesLoc = false;
        }
      } else {
        matchesLoc = false;
      }
    }

    // Transit line matching
    const workerLoc = mockNeighborhoods.find((n) => n.id === worker.location);
    const matchesTransit =
      selectedTransit === "" ||
      (workerLoc && workerLoc.transitLines.includes(selectedTransit));

    return matchesSearch && matchesLoc && matchesTransit;
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = mockNeighborhoods.find((n) => n.id === jobLocation);
    const transit = loc ? loc.transitLines : [];

    const newJob: JobPosting = {
      id: `job_${Date.now()}`,
      clientId: currentClient.id,
      clientName: currentClient.fullName,
      title: jobTitle,
      category: jobCategory,
      description: jobDescription,
      location: jobLocation,
      budget: Number(jobBudget),
      duration: jobDuration,
      transitRouteRequired: transit,
      status: "Open",
      clientPhone: currentClient.phoneNumber,
    };

    onAddJob(newJob);
    setFormFeedback(true);
    
    // Clear form
    setJobTitle("");
    setJobBudget("");
    setJobDescription("");
    
    setTimeout(() => {
      setFormFeedback(false);
      setShowAddJob(false);
    }, 1500);
  };

  const clientContracts = contracts.filter((c) => c.clientId === currentClient.id);

  const handleContractResponse = (contractId: string, accept: boolean) => {
    const original = contracts.find((c) => c.id === contractId);
    if (!original) return;

    const updated: ContractProposal = {
      ...original,
      clientAccepted: accept,
      status: accept ? (original.workerAccepted ? "Accepted" : "Pending") : "Declined",
    };
    onUpdateContract(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="hiring-dashboard-container">
      {/* LEFT COLUMN: FILTERS & JOB POSTING FORM */}
      <div className="lg:col-span-4 space-y-6">
        {/* PUBLISH NEW JOB CARD */}
        <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-bold text-sm text-stone-950 flex items-center gap-1.5 font-sans">
              <FileText className="w-4.5 h-4.5 text-[#D95F38]" />
              {translate("addJob")}
            </h3>
            <button
              id="toggle-add-job-btn"
              onClick={() => setShowAddJob(!showAddJob)}
              className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-white border border-[#EAE3D8] text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              {showAddJob ? "Collapse" : "Expand"}
              <Plus className={`w-4 h-4 transition-transform ${showAddJob ? "rotate-45" : ""}`} />
            </button>
          </div>

          {showAddJob && (
            <form onSubmit={handlePostJob} className="space-y-4 pt-4 border-t border-[#EAE3D8]">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                  {translate("jobTitle")}
                </label>
                <input
                  id="job-title-input"
                  type="text"
                  required
                  placeholder="e.g. Broken faucet leak, lawn clean-up"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                    {translate("jobCategory")}
                  </label>
                  <select
                    id="job-category-select"
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 cursor-pointer outline-none focus:border-[#D95F38]"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                    {translate("jobBudget")}
                  </label>
                  <input
                    id="job-budget-input"
                    type="number"
                    required
                    placeholder="Budget in R"
                    value={jobBudget}
                    onChange={(e) => setJobBudget(e.target.value)}
                    className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Location Selector (Province / District / Area) */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE3D8] space-y-3">
                <h4 className="text-[10px] font-bold text-[#D95F38] uppercase tracking-wider">
                  Job Location (Province / District / Area)
                </h4>
                <LocationSelector
                  value={jobLocation}
                  onChange={(id) => setJobLocation(id)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                  {translate("jobDuration")}
                </label>
                <select
                  id="job-duration-select"
                  value={jobDuration}
                  onChange={(e) => setJobDuration(e.target.value)}
                  className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 cursor-pointer outline-none focus:border-[#D95F38]"
                >
                  <option value="1 Day">1 Day</option>
                  <option value="2-3 Days">2-3 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                  {translate("jobDescription")}
                </label>
                <textarea
                  id="job-description-textarea"
                  required
                  placeholder="Explain exactly what needs fixing, any tools required, or taxi points."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] resize-none focus:bg-white transition"
                />
              </div>

              <div className="bg-[#FAF6F0] border border-[#EAE3D8] p-3 rounded-xl text-[10px] text-stone-500 leading-relaxed">
                * Based on the selected location, we automatically tag and recommend minibus taxi lines to reduce workers' travel fees.
              </div>

              <button
                id="submit-job-btn"
                type="submit"
                className="w-full py-2.5 bg-[#D95F38] hover:bg-[#C44E29] text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
              >
                {translate("postJobBtn")}
              </button>

              {formFeedback && (
                <div className="text-center text-xs text-[#D95F38] font-bold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" />
                  {translate("createPostSuccess")}
                </div>
              )}
            </form>
          )}
        </div>

        {/* ACTIVE AGREEMENTS FOR HIRER */}
        {clientContracts.length > 0 && (
          <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6">
            <h3 className="font-bold text-sm text-stone-950 mb-4 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-[#D95F38]" />
              {translate("activeContracts")}
            </h3>

            <div className="space-y-4">
              {clientContracts.map((contract) => {
                const associatedJob = jobs.find((j) => j.id === contract.jobId);
                const worker = workers.find((w) => w.id === contract.workerId);
                if (!associatedJob || !worker) return null;

                const isFullyAccepted = contract.workerAccepted && contract.clientAccepted;

                return (
                  <div
                    key={contract.id}
                    className={`p-4 rounded-xl border text-xs ${
                      isFullyAccepted
                        ? "bg-emerald-50/30 border-emerald-200"
                        : "bg-white border-[#EAE3D8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold mb-1.5 uppercase ${
                            isFullyAccepted
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              : "bg-orange-50 text-orange-800 border border-orange-100"
                          }`}
                        >
                          {isFullyAccepted ? "Agreement Signed" : "Awaiting Signatures"}
                        </span>
                        <h4 className="font-bold text-stone-900 leading-tight text-sm">
                          {associatedJob.title}
                        </h4>
                        <p className="text-stone-500 mt-1">
                          Worker: <b className="text-stone-700 font-bold">{worker.fullName}</b>
                        </p>
                      </div>
                      <div className="bg-[#FAF6F0] px-3 py-1.5 border border-[#EAE3D8] rounded-xl text-right font-mono self-start">
                        <span className="font-bold text-[#D95F38] text-xs">R{contract.proposedRate}/hr</span>
                      </div>
                    </div>

                    {/* POPIA SECURITY MASK FOR CLIENT VIEW */}
                    <div className="p-3 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-1.5">
                        {isFullyAccepted ? (
                          <Unlock className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-stone-400" />
                        )}
                        <span className="font-mono text-stone-700">
                          {isFullyAccepted ? worker.phoneNumber : "Phone Masked (POPIA)"}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-stone-600 uppercase font-mono bg-white px-2 py-0.5 rounded border border-[#EAE3D8]">
                        {isFullyAccepted ? "Unlocked" : "Locked"}
                      </span>
                    </div>

                    {!isFullyAccepted && (
                      <div className="flex gap-2 pt-3 border-t border-[#EAE3D8]">
                        {!contract.clientAccepted ? (
                          <>
                            <button
                              id={`client-accept-contract-${contract.id}`}
                              onClick={() => handleContractResponse(contract.id, true)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              Confirm Rate Proposal
                            </button>
                            <button
                              id={`client-decline-contract-${contract.id}`}
                              onClick={() => handleContractResponse(contract.id, false)}
                              className="px-3.5 py-1.5 bg-[#EAE3D8] hover:bg-[#DCD3C5] text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="italic text-orange-800 font-bold text-xs flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                            Waiting for Worker to sign and finalize contract.
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

        {/* WORKER SEARCH FILTERS */}
        <div className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-sm text-stone-950 flex items-center gap-1.5 font-sans">
            <Filter className="w-4.5 h-4.5 text-stone-600" />
            Filter Candidates
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                Search Skills or Name:
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  id="worker-search-input"
                  type="text"
                  placeholder={translate("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                Filter by Taxi Transit Route:
              </label>
              <select
                id="transit-route-filter"
                value={selectedTransit}
                onChange={(e) => setSelectedTransit(e.target.value)}
                className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3 py-2.5 text-stone-900 cursor-pointer outline-none focus:border-[#D95F38]"
              >
                <option value="">{translate("allTransit")}</option>
                {allTransitLines.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EAE3D8] space-y-3">
              <h4 className="text-[10px] font-bold text-[#D95F38] uppercase tracking-wider">
                Filter by Location
              </h4>
              <LocationSelector
                value={selectedLocation}
                onChange={(id) => setSelectedLocation(id)}
                onProvinceChange={(prov) => setSelectedProvince(prov)}
                onDistrictChange={(dist) => setSelectedDistrict(dist)}
                isFilter={true}
                filterAllLabel="All Areas"
                stacked={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LIST MATCHING WORKERS */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-stone-900 font-sans">
            Available Candidates ({filteredWorkers.length})
          </h2>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> POPIA Secure Mode
          </span>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="text-center py-16 border border-[#EAE3D8] bg-[#FAF6F0]/30 rounded-2xl">
            <p className="text-xs text-stone-500">{translate("noWorkersFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorkers.map((worker) => {
              const loc = mockNeighborhoods.find((n) => n.id === worker.location);
              return (
                <div
                  key={worker.id}
                  className="bg-white border border-[#EAE3D8] rounded-2xl p-5 flex flex-col justify-between hover:border-[#D95F38]/40 transition relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-3">
                        {worker.avatarUrl ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-[#EAE3D8]">
                            <img
                              src={worker.avatarUrl}
                              alt={worker.fullName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#D95F38] text-white rounded-full flex items-center justify-center font-black text-sm uppercase shadow-xs">
                            {worker.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-stone-950 leading-none">
                            {worker.fullName}
                          </h4>
                          <span className="text-[10px] font-bold text-stone-400 font-mono block mt-1">
                            Phone Hidden (POPIA)
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono bg-[#FAF6F0] px-3 py-1.5 rounded-xl border border-[#EAE3D8]">
                        <span className="text-[9px] text-stone-400 block font-bold uppercase leading-tight mb-0.5">Rate</span>
                        <span className="font-bold text-xs text-[#D95F38]">
                          R{worker.hourlyRate}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {worker.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[9px] font-bold bg-[#FAF6F0] text-stone-700 px-2.5 py-0.5 rounded-md border border-[#EAE3D8]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {worker.bio}
                    </p>

                    <div className="flex items-center gap-x-4 gap-y-1 bg-[#FAF6F0] p-3 rounded-xl border border-[#EAE3D8] text-xs font-semibold text-stone-700 mb-4">
                      <span className="flex items-center gap-1 truncate text-stone-800">
                        <MapPin className="w-3.5 h-3.5 text-[#D95F38]" />
                        {loc?.name || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-stone-500 font-mono text-[10px] bg-white px-2 py-0.5 rounded-lg ml-auto border border-[#EAE3D8]">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {worker.rating.toFixed(1)} ({worker.completedJobsCount} jobs)
                      </span>
                    </div>

                    {/* Portfolio Preview */}
                    {worker.portfolioPhotos.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-2 font-sans">
                          Portfolio Works:
                        </span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {worker.portfolioPhotos.map((photo, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() => setExpandedPhoto(photo)}
                              className="w-12 h-12 rounded-lg overflow-hidden border border-[#EAE3D8] bg-[#FAF6F0] cursor-zoom-in hover:brightness-105 transition flex-shrink-0"
                              title="Click to view full work"
                            >
                              <img src={photo} alt="Work Photo" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3.5 border-t border-[#EAE3D8] flex items-center justify-between gap-2.5">
                    <span className="text-[9px] text-[#D95F38] font-bold bg-[#FAF6F0] border border-[#EAE3D8] px-2.5 py-1 rounded-full uppercase font-mono">
                      {loc?.transitLines[0] || "Standard transit"}
                    </span>

                    <button
                      id={`client-negotiate-btn-${worker.id}`}
                      onClick={() => onStartChatWithWorker(worker.id, "job_1")}
                      className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer transition hover:bg-stone-850"
                    >
                      Negotiate & Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Portfolio expanded photo modal overlay */}
      {expandedPhoto && (
        <div
          id="photo-modal-overlay"
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setExpandedPhoto(null)}
        >
          <div className="relative max-w-xl bg-white p-2 rounded-2xl border border-[#EAE3D8] shadow-2xl">
            <img src={expandedPhoto} alt="Full Size Portfolio" className="rounded-xl max-h-[80vh] object-contain" />
            <div className="text-center text-xs text-stone-500 py-2.5 font-bold uppercase tracking-wider font-sans">
              Tap anywhere to return
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
