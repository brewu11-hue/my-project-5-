/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MapPin, Map, Navigation } from "lucide-react";
import { mockNeighborhoods } from "../data/mockData";
import { Neighborhood } from "../types";

interface LocationSelectorProps {
  value: string;
  onChange: (id: string) => void;
  onProvinceChange?: (province: string) => void;
  onDistrictChange?: (district: string) => void;
  isFilter?: boolean;
  filterAllLabel?: string;
  className?: string;
  labelSize?: "xs" | "sm" | "base";
  stacked?: boolean;
}

// Extract unique provinces
const provinces = Array.from(new Set(mockNeighborhoods.map((n) => n.province))).sort();

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  onProvinceChange,
  onDistrictChange,
  isFilter = false,
  filterAllLabel = "All Areas",
  className = "",
  labelSize = "xs",
  stacked = false,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Sync state with incoming value
  useEffect(() => {
    if (value) {
      const loc = mockNeighborhoods.find((n) => n.id === value);
      if (loc) {
        setSelectedProvince(loc.province);
        setSelectedDistrict(loc.district);
        if (onProvinceChange) onProvinceChange(loc.province);
        if (onDistrictChange) onDistrictChange(loc.district);
      }
    } else if (isFilter) {
      // If value is cleared but we are in filter mode, we preserve the province/district state if they were set.
      // Let's not overwrite selectedProvince/selectedDistrict if they are already chosen.
    } else {
      // For non-filters, default to first available
      const defaultLoc = mockNeighborhoods[0];
      setSelectedProvince(defaultLoc.province);
      setSelectedDistrict(defaultLoc.district);
      if (onProvinceChange) onProvinceChange(defaultLoc.province);
      if (onDistrictChange) onDistrictChange(defaultLoc.district);
      onChange(defaultLoc.id);
    }
  }, [value, isFilter]);

  // Districts for selected province
  const availableDistricts = selectedProvince
    ? Array.from(
        new Set(
          mockNeighborhoods
            .filter((n) => n.province === selectedProvince)
            .map((n) => n.district)
        )
      ).sort()
    : [];

  // Areas for selected district
  const availableAreas = selectedDistrict
    ? mockNeighborhoods.filter(
        (n) => n.province === selectedProvince && n.district === selectedDistrict
      ).sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    if (onProvinceChange) onProvinceChange(prov);

    if (isFilter) {
      setSelectedDistrict("");
      if (onDistrictChange) onDistrictChange("");
      onChange(""); // All areas
      return;
    }

    if (!prov) {
      setSelectedDistrict("");
      if (onDistrictChange) onDistrictChange("");
      onChange("");
      return;
    }

    // For registration: Set first district of this province
    const firstDist = mockNeighborhoods.find((n) => n.province === prov)?.district || "";
    setSelectedDistrict(firstDist);
    if (onDistrictChange) onDistrictChange(firstDist);

    if (firstDist) {
      const firstArea = mockNeighborhoods.find(
        (n) => n.province === prov && n.district === firstDist
      );
      if (firstArea) {
        onChange(firstArea.id);
      } else {
        onChange("");
      }
    } else {
      onChange("");
    }
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    if (onDistrictChange) onDistrictChange(dist);

    if (isFilter) {
      onChange(""); // All areas in this district
      return;
    }

    if (!dist) {
      onChange("");
      return;
    }

    const firstArea = mockNeighborhoods.find(
      (n) => n.province === selectedProvince && n.district === dist
    );
    if (firstArea) {
      onChange(firstArea.id);
    } else {
      onChange("");
    }
  };

  const labelClass = `block font-bold text-stone-500 uppercase tracking-widest mb-1.5 ${
    labelSize === "xs" ? "text-[10px]" : labelSize === "sm" ? "text-xs" : "text-sm"
  }`;

  return (
    <div className={`grid ${stacked ? "grid-cols-1 gap-3" : "grid-cols-1 md:grid-cols-3 gap-3"} ${className}`}>
      {/* PROVINCE SELECT */}
      <div>
        <label className={labelClass}>Province</label>
        <div className="relative">
          <Map className="absolute left-3 top-3 w-3.5 h-3.5 text-[#D95F38]" />
          <select
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl text-stone-900 cursor-pointer outline-none focus:border-[#D95F38] focus:bg-white transition"
          >
            {isFilter && <option value="">All Provinces</option>}
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DISTRICT SELECT */}
      <div>
        <label className={labelClass}>District / Metro</label>
        <div className="relative">
          <Navigation className="absolute left-3 top-3 w-3.5 h-3.5 text-[#D95F38]" />
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!selectedProvince}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl text-stone-900 cursor-pointer outline-none focus:border-[#D95F38] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFilter && <option value="">All Districts</option>}
            {!isFilter && !selectedDistrict && (
              <option value="">Select District</option>
            )}
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AREA / TOWN SELECT */}
      <div>
        <label className={labelClass}>Local Area / Town</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-[#D95F38]" />
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={!selectedDistrict}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#EAE3D8] rounded-xl text-stone-900 cursor-pointer outline-none focus:border-[#D95F38] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFilter && <option value="">{filterAllLabel}</option>}
            {!isFilter && !value && <option value="">Select Area</option>}
            {availableAreas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.city})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
