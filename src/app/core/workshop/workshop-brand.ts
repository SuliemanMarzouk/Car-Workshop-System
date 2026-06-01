/** Brand tokens aligned with tailwind `brand` palette and `--gradient-brand`. */
export const WORKSHOP_BRAND = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryDeep: '#1e40af',
  primaryDarker: '#1e3a8a',
  accent: '#0ea5e9',
  soft: '#eff6ff',
  softMid: '#dbeafe',
  onPrimary: '#ffffff',
  onDark: '#f8fafc',
  mutedOnDark: '#bfdbfe',
  gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #0ea5e9 100%)',
  gradientVertical: 'linear-gradient(180deg, #1d4ed8 0%, #2563eb 55%, #0ea5e9 100%)',
  footerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
} as const;

const DEFAULT_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="white" fill-opacity="0.18"/>
  <path d="M14 38h36l-3-9H17l-3 9z" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M20 29h24" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="22" cy="38" r="3.5" fill="white"/>
  <circle cx="42" cy="38" r="3.5" fill="white"/>
  <path d="M26 22h12l4 7H22l4-7z" stroke="white" stroke-width="2.2" stroke-linejoin="round"/>
</svg>`;

export function getDefaultWorkshopLogoDataUrl(): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DEFAULT_LOGO_SVG)}`;
}

export function resolveWorkshopLogo(logoDataUrl?: string): string {
  const trimmed = logoDataUrl?.trim();
  if (trimmed && (trimmed.startsWith('data:image/') || trimmed.startsWith('http'))) {
    return trimmed;
  }
  return getDefaultWorkshopLogoDataUrl();
}
