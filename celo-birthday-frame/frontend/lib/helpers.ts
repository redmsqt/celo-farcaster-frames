import { page_url } from "@/config";
import { parseUnits } from "viem";
export const isSSRMode = typeof window === "undefined";

export function cleanDescription(text: string): string {
  return text
    .replace(/<br\s*\/?>\s*>?\s*/gi, " ") // Replace <br>, <br/>, <br >, <br>> etc. with a space
    .replace(/\s+/g, " ") // Collapse multiple spaces into one
    .trim(); // Remove leading/trailing spaces
}

export function projectUrl(slug: string | undefined): string {
  return `https://giveth.io/project/${slug}`;
}

export function encodeBase64Url(addr: string): string {
  return Buffer.from(addr.slice(2), "hex")
    .toString("base64") // base64 encode
    .replace(/\+/g, "-") // replace + with -
    .replace(/\//g, "_") // replace / with _
    .replace(/=+$/, ""); // remove trailing =
}

export function decodeBase64Url(encoded: string): string {
  const pad = encoded.length % 4 ? "=".repeat(4 - (encoded.length % 4)) : "";
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return "0x" + Buffer.from(base64, "base64").toString("hex");
}

export function generateInviteUrl(address: string): string {
  return `${page_url}/birthday/${address}`;
}

export function formatAmount(amount: number, decimals: number): bigint {
  return parseUnits(amount.toString(), decimals);
}
