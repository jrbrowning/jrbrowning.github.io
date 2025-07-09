// /lib/data-utils.ts
export function getTopLanguagesByUsage(
  pivot: Record<string, Record<string, number>>,
  limit: number
): Record<string, Record<string, number>> {
  const totals = Object.entries(pivot).map(([lang, yearData]) => ({
    lang,
    total: Object.values(yearData).reduce((sum, v) => sum + v, 0),
  }));

  const topLangs = totals
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map((entry) => entry.lang);

  const filtered: Record<string, Record<string, number>> = {};
  for (const lang of topLangs) {
    filtered[lang] = pivot[lang];
  }

  return filtered;
}

// /lib/data-utils.ts
export function getStackedBarChartData(
  repoLanguageByYear: Record<string, Record<string, number>>,
  topLangs: string[]
): Array<{ year: number; [lang: string]: number | string }> {
  const yearSet = new Set<number>();
  for (const lang of topLangs) {
    Object.keys(repoLanguageByYear[lang] || {}).forEach((y) =>
      yearSet.add(Number(y))
    );
  }

  const years = Array.from(yearSet).sort();

  return years.map((year) => {
    const row: { year: number; [lang: string]: number } = { year };
    for (const lang of topLangs) {
      row[lang] = repoLanguageByYear[lang]?.[String(year)] ?? 0;
    }
    return row;
  });
}
