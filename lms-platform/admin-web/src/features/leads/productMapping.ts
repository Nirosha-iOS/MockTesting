export interface LeadProductMapItem {
  productId: number;
  productName: string;
  countApplicable: boolean;
  totalCount?: number;
  mappedCount?: number;
}

const PREFIX = "PMAP1:";

function cleanName(name: string): string {
  return name.trim().replace(/[|;,~]/g, " ");
}

function parseIntSafe(raw: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.floor(n);
}

export function encodeLeadProductMap(items: LeadProductMapItem[]): string {
  const normalized = items
    .map((i) => {
      if (!i.productId || !i.productName.trim()) return null;
      const total = i.countApplicable ? parseIntSafe(String(i.totalCount ?? "")) : undefined;
      const mapped = i.countApplicable ? parseIntSafe(String(i.mappedCount ?? "")) : undefined;
      return {
        productId: i.productId,
        productName: cleanName(i.productName),
        countApplicable: i.countApplicable,
        totalCount: total,
        mappedCount: mapped,
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  if (normalized.length === 0) return "";

  const body = normalized
    .map((i) => {
      const countFlag = i.countApplicable ? "1" : "0";
      const total = i.totalCount === undefined ? "" : String(i.totalCount);
      const mapped = i.mappedCount === undefined ? "" : String(i.mappedCount);
      return `${i.productId}~${i.productName}~${countFlag}~${total}~${mapped}`;
    })
    .join(";");

  return `${PREFIX}${body}`;
}

export function decodeLeadProductMap(raw: string | null | undefined): LeadProductMapItem[] {
  if (!raw || !raw.startsWith(PREFIX)) return [];
  const body = raw.slice(PREFIX.length).trim();
  if (body === "") return [];
  return body
    .split(";")
    .map((row) => {
      const [idRaw, nameRaw, flagRaw, totalRaw, mappedRaw] = row.split("~");
      const productId = Number(idRaw);
      const productName = (nameRaw ?? "").trim();
      if (!Number.isFinite(productId) || productId <= 0 || productName === "") return null;
      const countApplicable = flagRaw === "1";
      return {
        productId,
        productName,
        countApplicable,
        totalCount: countApplicable ? parseIntSafe(totalRaw ?? "") : undefined,
        mappedCount: countApplicable ? parseIntSafe(mappedRaw ?? "") : undefined,
      } satisfies LeadProductMapItem;
    })
    .filter((v): v is LeadProductMapItem => v !== null);
}

export function getPendingCount(item: LeadProductMapItem): number | undefined {
  if (!item.countApplicable) return undefined;
  const total = item.totalCount ?? 0;
  const mapped = item.mappedCount ?? 0;
  return Math.max(0, total - mapped);
}

export function toDisplayText(raw: string | null | undefined): string {
  const items = decodeLeadProductMap(raw);
  if (items.length === 0) return raw?.trim() || "—";
  return items
    .map((item) => {
      if (!item.countApplicable) return `${item.productName} (count N/A)`;
      const mapped = item.mappedCount ?? 0;
      const pending = getPendingCount(item) ?? 0;
      return `${item.productName} (mapped ${mapped}, pending ${pending})`;
    })
    .join(", ");
}
