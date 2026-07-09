/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WorkerProfile, Neighborhood, Language } from "../types";
import { mockNeighborhoods } from "../data/mockData";
import { User, Briefcase, Check, ShieldCheck, UserPlus, Phone, MapPin, Coins, Info } from "lucide-react";
import { LocationSelector } from "./LocationSelector";

interface SignUpProfileProps {
  onSignUpWorker: (newWorker: WorkerProfile) => void;
  onSignUpClient: (clientData: { id: string; fullName: string; phoneNumber: string; location: string }) => void;
  translate: (key: string) => string;
}

export const SignUpProfile: React.FC<SignUpProfileProps> = ({
  onSignUpWorker,
  onSignUpClient,
  translate,
}) => {
  const [signupType, setSignupType] = useState<"worker" | "client">("worker");
  
  // General Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locationId, setLocationId] = useState("soweto");
  
  // Worker-Specific States
  const [hourlyRate, setHourlyRate] = useState("75");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["General Work"]);
  const [agreePopia, setAgreePopia] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  // Available Skills list
  const availableSkills = [
    "Plumbing",
    "Domestic Work",
    "Painting",
    "Gardening",
    "Sewing",
    "Electrical",
    "Carpentry",
    "General Work"
  ];

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      alert("Please provide your name and phone number.");
      return;
    }

    if (signupType === "worker") {
      if (!agreePopia) {
        alert("You must agree to POPIA regulations to list your profile safely.");
        return;
      }

      // Generate a new worker profile
      const newWorker: WorkerProfile = {
        id: `worker_${Date.now()}`,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: `${fullName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        location: locationId,
        skills: selectedSkills.length > 0 ? selectedSkills : ["General Work"],
        hourlyRate: Number(hourlyRate) || 75,
        availability: "Available",
        bio: bio.trim() || `Experienced worker in ${selectedSkills.join(", ")}. Proudly serving my local community and transit lines.`,
        portfolioPhotos: [],
        completedJobsCount: 0,
        rating: 5.0,
        isVisible: true,
      };

      onSignUpWorker(newWorker);
      setSignupSuccess(`Worker profile created for ${fullName}! Switched to your active Worker view.`);
    } else {
      // Generate client profile details
      const clientData = {
        id: `client_${Date.now()}`,
        fullName: fullName.trim() + " (You)",
        phoneNumber: phoneNumber.trim(),
        location: locationId,
      };

      onSignUpClient(clientData);
      setSignupSuccess(`Hirer profile created for ${fullName}! Switched to your active Hiring Client view.`);
    }

    // Reset fields
    setFullName("");
    setPhoneNumber("");
    setBio("");
    setAgreePopia(false);
    setSelectedSkills(["General Work"]);

    // Clear alert after some time
    setTimeout(() => {
      setSignupSuccess(null);
    }, 4000);
  };

  return (
    <div id="signup-profile-component" className="bg-white border border-[#EAE3D8] rounded-2xl shadow-xs p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-[#D95F38]" />
        <h2 className="text-base font-bold text-stone-900">Create a New Profile</h2>
      </div>
      
      <p className="text-xs text-stone-500 mb-5">
        Join South Africa's offline-first informal work ecosystem. Register in seconds to start seeking employment or listing local gigs.
      </p>

      {/* Profile Type Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6F0] rounded-xl border border-[#EAE3D8] mb-5">
        <button
          type="button"
          onClick={() => setSignupType("worker")}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            signupType === "worker"
              ? "bg-[#D95F38] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-950"
          }`}
        >
          <User className="w-4 h-4" />
          Seeking Employment
        </button>
        <button
          type="button"
          onClick={() => setSignupType("client")}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            signupType === "client"
              ? "bg-[#D95F38] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-950"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Looking for Services
        </button>
      </div>

      {signupSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-bold mb-5 flex items-start gap-2 animate-pulse">
          <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <span>{signupSuccess}</span>
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Full Name / Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={signupType === "worker" ? "e.g. Thabo Khumalo" : "e.g. Lerato's Catering"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="tel"
                required
                placeholder="e.g. +27 82 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Location Selection Block */}
        <div className="bg-white p-4 rounded-xl border border-[#EAE3D8] space-y-4">
          <h4 className="text-xs font-bold text-[#D95F38] uppercase tracking-wider">
            Select Your South African Coverage Location
          </h4>
          <LocationSelector
            value={locationId}
            onChange={(id) => setLocationId(id)}
          />
        </div>

        {signupType === "worker" && (
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1.5">
              Hourly Rate (ZAR / Hour)
            </label>
            <div className="relative">
              <Coins className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="number"
                min="30"
                max="1000"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl text-stone-900 outline-none focus:border-[#D95F38] focus:bg-white transition font-mono font-bold"
              />
            </div>
          </div>
        )}

        {signupType === "worker" && (
          <>
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-2">
                Skills & Services Offered (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableSkills.map((skill) => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 text-left text-xs rounded-xl border transition flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-orange-50 border-[#D95F38] text-stone-900 font-bold"
                          : "bg-white border-[#EAE3D8] text-stone-600 hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span>{skill}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#D95F38]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1.5">
                Bio / Tell Hirers About Yourself
              </label>
              <textarea
                rows={3}
                placeholder="Describe your experience, typical job types, and tools you have. (e.g. 5 years of commercial plastering and residential bricklaying...)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 outline-none focus:border-[#D95F38] resize-none focus:bg-white transition"
              />
            </div>

            <div className="bg-[#FAF6F0] border border-[#EAE3D8] p-3 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#D95F38] flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-stone-600 leading-relaxed">
                <b>Taxi Transit Matching:</b> Vuka Gigs automatically maps your neighborhood to JHB/CPT taxi lines to calculate commute options for hirers. Your phone details remain encrypted until contracts are signed.
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreePopia}
                onChange={(e) => setAgreePopia(e.target.checked)}
                className="mt-1 accent-[#D95F38] h-4 w-4 border-[#EAE3D8] rounded"
              />
              <span className="text-[11px] text-stone-600 leading-tight font-medium">
                I agree to list my profile securely under South Africa's POPIA regulations. I consent to share my phone number ONLY with Hirers once rate proposals are signed.
              </span>
            </label>
          </>
        )}

        {signupType === "client" && (
          <div className="bg-[#FAF6F0] border border-[#EAE3D8] p-3.5 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-[#D95F38] mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-stone-600 leading-relaxed">
              <b>POPIA Secure Hiring:</b> As an employer, your profile helps workers view job offers confidently. The platform keeps both worker and client phone details fully protected during negotiations.
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-[#D95F38] hover:bg-[#C44E29] text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          {signupType === "worker" ? "Register as Worker Profile" : "Register as Hiring Client"}
        </button>
      </form>
    </div>
  );
};
