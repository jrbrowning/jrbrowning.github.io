// app/BarChartWithTable.tsx
import BarChartTooltip from "@/components/charts/overrides/BarChartToolTip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LANG_COLOR_MAP } from "@/lib/constants";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartWithTableProps {
  data: Array<{ year: number; [lang: string]: number | string }>;
}

const BarChartWithTable: React.FC<BarChartWithTableProps> = ({ data }) => {
  const [showRaw, setShowRaw] = useState(false);

  const languageKeys =
    data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "year") : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1 text-center">
          <CardTitle className="text-center">Language Usage Per Year</CardTitle>
        </div>
        <Button variant="outline" onClick={() => setShowRaw(!showRaw)}>
          {showRaw ? "Hide Raw Data" : "Show Raw Data"}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Chart with responsive overflow - same pattern as SankeyChart */}
        <div className="w-full max-w-8xl mx-auto overflow-x-auto lg:overflow-visible">
          <div className="min-w-screen-md lg:min-w-0 lg:w-full">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} stackOffset="expand">
                <XAxis dataKey="year" stroke="#888888" fontSize={12} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  domain={[0, 1]}
                />
                <Tooltip
                  content={<BarChartTooltip percentage={true} />}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {languageKeys.map((lang) => (
                  <Bar
                    key={lang}
                    dataKey={lang}
                    stackId="a"
                    fill={LANG_COLOR_MAP[lang] || "#cccccc"}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {showRaw && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Year</th>
                  {languageKeys.map((lang) => (
                    <th key={lang} className="px-4 py-2 text-left">
                      {lang}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.year as number} className="border-t">
                    <td className="px-4 py-2">{row.year}</td>
                    {languageKeys.map((lang) => (
                      <td key={lang} className="px-4 py-2">
                        {Number(row[lang]).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartWithTable;
