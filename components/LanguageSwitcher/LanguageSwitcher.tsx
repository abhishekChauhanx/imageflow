// components/LanguageSwitcher.tsx
"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const languages = [
  { code: "en", label: "🇺🇸 English" },
  { code: "hi", label: "🇮🇳 Hindi" },
  { code: "zh", label: "🇨🇳 Chinese" },
  { code: "id", label: "🇮🇩 Indonesian" },
  { code: "ko", label: "🇰🇷 Korean" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Save to cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    // Refresh page so server re-reads cookie and loads new messages
    router.refresh();
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => switchLanguage(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}