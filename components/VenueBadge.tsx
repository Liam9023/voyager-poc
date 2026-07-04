import { priceLevelLabelClient } from "@/lib/places-format";

/**
 * Star rating + review count + price level + "See on Google Maps" link — surfaced wherever a
 * venue card carries real Places data (POC_followup_prompt.md item 11). Renders nothing for
 * hand-authored curated picks, which never carry real rating data — never fabricate one.
 */
export default function VenueBadge({
  rating,
  userRatingCount,
  priceLevel,
  googleMapsUri,
  className = "",
}: {
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  googleMapsUri?: string;
  className?: string;
}) {
  const price = priceLevelLabelClient(priceLevel);
  if (!rating && !price && !googleMapsUri) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {rating ? (
        <span className="rounded-full bg-secondary-light px-2 py-0.5 text-[9px] font-bold text-secondary">
          ★ {rating}
          {userRatingCount ? ` (${userRatingCount})` : ""}
        </span>
      ) : null}
      {price ? (
        <span className="rounded-full bg-tag px-2 py-0.5 text-[9px] font-semibold text-text-mid">{price}</span>
      ) : null}
      {googleMapsUri ? (
        <a
          href={googleMapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-semibold text-accent hover:underline"
        >
          See on Google Maps ↗
        </a>
      ) : null}
    </div>
  );
}
