"use client"

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ThemeNavigation({ category, currentTheme = 'all' }) {
  const { t } = useTranslation();

  const themes = [
    { value: 'all', label: t('all_themes', 'All Themes') },
    { value: 'classic', label: t('classic', 'Classic') },
    { value: 'ethnic', label: t('ethnic', 'Ethnic') },
    { value: 'one-of-a-kind', label: t('one_of_a_kind', 'One of a Kind') }
  ];

  const baseUrl = `/shop/${category}`;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {themes.map((theme) => (
        <Link
          key={theme.value}
          href={theme.value === 'all' ? baseUrl : `${baseUrl}?theme=${theme.value}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentTheme === theme.value
              ? 'bg-[#232326] text-[#f8f8f8] border border-[#bcbcbc55]'
              : 'bg-[#18181b] text-[#bcbcbc] border border-[#bcbcbc33] hover:bg-[#232326] hover:text-[#f8f8f8] hover:border-[#bcbcbc55]'
          }`}
        >
          {theme.label}
        </Link>
      ))}
    </div>
  );
}
