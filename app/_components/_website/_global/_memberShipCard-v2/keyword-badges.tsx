"use client";

import { Keyword } from "../KeywordSelector";

interface KeywordBadgesProps {
  keywords: Keyword[];
  t: (key: string) => string;
}

export function KeywordBadges({ keywords, t }: KeywordBadgesProps) {
  return (
    <div className="px-4 pb-3">
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">
        {t("membershipCard.skillsLabel")}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.slice(0, 4).map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-0.5 text-[10px] font-medium rounded-full 
                       bg-secondary/50 text-secondary-foreground
                       border border-border/50 backdrop-blur-sm"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            {keyword.title}
          </span>
        ))}
        {keywords.length > 4 && (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/20 text-primary">
            +{keywords.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
