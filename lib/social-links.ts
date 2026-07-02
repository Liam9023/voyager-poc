/**
 * Social-proof deep links — pure URL construction, no API call, no data read back
 * (POC_followup_prompt.md item 5). Just a one-tap way for the traveller to check social
 * buzz on a venue themselves, on the actual platform.
 */
export function instagramSearchUrl(venueName: string, location = "Noosa"): string {
  const q = `${venueName} ${location}`.trim();
  return `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(q)}`;
}
