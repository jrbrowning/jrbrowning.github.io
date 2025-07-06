// app/GroupedBarChartWithTable.tsx
"use client";

import BarChartTooltip from "@/components/charts/overrides/BarChartToolTip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTRIB_COLOR_MAP } from "@/lib/constants";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ContributionMetrics {
  year: number;
  commits: number;
  prs: number;
  reviews: number;
  repo_count: number;
}

interface Props {
  data: ContributionMetrics[];
}

const GroupedBarChartWithTable: React.FC<Props> = ({ data }) => {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1 text-center">
          <CardTitle className="text-center">
            GitHub Contributions Per Year (Dual Axis)
          </CardTitle>
        </div>
        <Button variant="outline" onClick={() => setShowRaw(!showRaw)}>
          {showRaw ? "Hide Raw Data" : "Show Raw Data"}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="w-full max-w-8xl mx-auto overflow-x-auto lg:overflow-visible">
          <div className="min-w-screen-md lg:min-w-0 lg:w-full">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="#888888" fontSize={12} />

                <YAxis
                  yAxisId="left"
                  stroke={CONTRIB_COLOR_MAP["commits"]}
                  fontSize={12}
                  label={{
                    value: "Commits",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={CONTRIB_COLOR_MAP["prs"]}
                  fontSize={12}
                  label={{
                    value: "Other Metrics",
                    angle: -90,
                    position: "insideRight",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  content={<BarChartTooltip />}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />

                <Bar
                  yAxisId="left"
                  dataKey="commits"
                  fill={CONTRIB_COLOR_MAP["commits"]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="prs"
                  fill={CONTRIB_COLOR_MAP["prs"]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="reviews"
                  fill={CONTRIB_COLOR_MAP["reviews"]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="repo_count"
                  fill={CONTRIB_COLOR_MAP["repo_count"]}
                />
              </BarChart>
            </ResponsiveContainer>

            {showRaw && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Year</th>
                      <th className="px-4 py-2 text-left">Commits</th>
                      <th className="px-4 py-2 text-left">PRs</th>
                      <th className="px-4 py-2 text-left">Reviews</th>
                      <th className="px-4 py-2 text-left">Repos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr key={row.year} className="border-t">
                        <td className="px-4 py-2">{row.year}</td>
                        <td className="px-4 py-2">{row.commits}</td>
                        <td className="px-4 py-2">{row.prs}</td>
                        <td className="px-4 py-2">{row.reviews}</td>
                        <td className="px-4 py-2">{row.repo_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupedBarChartWithTable;
