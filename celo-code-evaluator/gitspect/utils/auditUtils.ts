import { AuditResult, AuditResponse } from "../types/audit";

export const parseOverallScore = (text: string): number | undefined => {
  const scoreMatch = text.match(/Overall Score.*?(\d+\.\d+)/i);
  return scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
};

export const extractNumber = (
  text: string,
  regex: RegExp
): number | undefined => {
  const match = text.match(regex);
  return match ? parseInt(match[1], 10) : undefined;
};

export const extractLanguages = (text: string): Record<string, number> => {
  const languages: Record<string, number> = {};
  const langSection = text.match(
    /Language Distribution[\s\S]*?Codebase Breakdown/i
  );

  if (langSection) {
    const langLines = langSection[0]
      .split("\n")
      .filter((line) => line.includes("%"))
      .map((line) => line.trim());

    langLines.forEach((line) => {
      const parts = line.split(":");
      if (parts.length === 2) {
        const lang = parts[0].trim();
        const percent = parseFloat(parts[1].trim().replace("%", ""));
        if (!isNaN(percent)) {
          languages[lang] = percent;
        }
      }
    });
  }

  return languages;
};

export const parseMetrics = (text: string) => {
  return {
    stars: extractNumber(text, /Stars:\s*(\d+)/i),
    forks: extractNumber(text, /Forks:\s*(\d+)/i),
    contributors: extractNumber(text, /Contributors:\s*(\d+)/i),
    commits: extractNumber(text, /Commits:\s*(\d+)/i),
    languages: extractLanguages(text),
  };
};

export const parseCriteriaScores = (text: string) => {
  const criteria: { name: string; score: string; justification: string }[] = [];
  const criteriaSection = text.match(
    /Project Scores([\s\S]*?)Repository Metrics/i
  );

  if (criteriaSection) {
    const lines = criteriaSection[1].split("\n").filter((line) => line.trim());

    lines.forEach((line) => {
      if (line.includes("|") && !line.includes("Criteria")) {
        const parts = line
          .split("|")
          .map((part) => part.trim())
          .filter((part) => part);
        if (parts.length >= 3) {
          criteria.push({
            name: parts[0],
            score: parts[1],
            justification: parts[2],
          });
        }
      }
    });
  }

  return criteria;
};

export const parseAuditResponse = (data: AuditResponse): AuditResult => {
  const analysisText = data.analyses[Object.keys(data.analyses)[0]];
  return {
    repoName: Object.keys(data.analyses)[0],
    analysis: analysisText,
    score: parseOverallScore(analysisText),
    metrics: parseMetrics(analysisText),
    criteria: parseCriteriaScores(analysisText),
  };
};
