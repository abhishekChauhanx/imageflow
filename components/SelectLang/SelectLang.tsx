import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React from 'react'
import "./SelectLang.css"
const SelectLang = () => {
    const currentLocale = useLocale();
    const switchLanguage = (newLocale: string) => {
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
        router.refresh();
    };
      const router = useRouter();
    const languages = [
        { code: "en", label: "🇺🇸 EN" },
        { code: "hi", label: "🇮🇳 HI" },
        { code: "zh", label: "🇨🇳 ZH" },
        { code: "id", label: "🇮🇩 ID" },
        { code: "ko", label: "🇰🇷 KO" },
    ];
    return (
        <li>
            <select
                value={currentLocale}
                onChange={(e) => switchLanguage(e.target.value)}
                className="lang-switcher"
                aria-label="Select language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </li>
    )
}

export default SelectLang
