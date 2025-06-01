import { AuditResult, AuditResponse } from "../types/audit";
import { parseAuditResponse } from "../utils/auditUtils";

export const auditRepositoryOld = async (
  githubUrl: string
): Promise<AuditResult> => {
  const response = await fetch(
    "https://celo-hackathon-agent.vercel.app/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        github_urls: githubUrl,
        prompt: "prompts/celo.txt",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: AuditResponse = await response.json();
  return parseAuditResponse(data);
};

export const auditRepository = async (
  githubUrl: string
): Promise<AuditResult> => {
  const frameEndpoint = "api/frame-audit";

  const response = await fetch(frameEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ github_urls: githubUrl }),
  });

  if (!response.ok) {
    console.error("Audit failed:", response.statusText);
    throw new Error(`Audit failed: ${response.status}`);
  }
  console.log("Audit response:", response);

  const data: AuditResponse = await response.json();
  return parseAuditResponse(data);
};
