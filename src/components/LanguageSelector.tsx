/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Language } from "../types";
import { Globe, Check } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages: { code: Language; name: string; local: string }[] = [
  { code: "en", name: "English", local: "English" },
  { code: "zu", name: "isiZulu", local: "Zulu" },
  { code: "xh", name: "isiXhosa", local: "Xhosa" },
  { code: "st", name: "Sesotho", local: "Sotho" },
  { code: "af", name: "Afrikaans", local: "Afrikaans" },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="relative inline-block text-left" id="language-selector-wrapper">
      <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF6F0] border border-[#EAE3D8] p-1 rounded-xl">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              onClick={() => onLanguageChange(lang.code)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                isActive
                  ? "bg-[#D95F38] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-950 hover:bg-white"
              }`}
            >
              <span className="block">{lang.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
