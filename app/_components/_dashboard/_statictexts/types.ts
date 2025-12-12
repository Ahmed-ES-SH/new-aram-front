// Types
interface TextType {
  en: string;
  ar: string;
}

interface StatItem {
  label: TextType;
  value: string;
}

interface ServicesStat {
  value: string;
  icon_name: string;
  label: TextType;
}

interface StatsItem {
  value: number;
  suffix: string;
  label: TextType;
  key: string;
  icon_name: string;
}

interface CardsFeature {
  icon_name: string;
  text: TextType;
  color: string;
}
