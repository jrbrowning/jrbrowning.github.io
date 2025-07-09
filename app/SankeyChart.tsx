// SankeyChart.tsx

import { LANG_COLOR_MAP } from "@/lib/constants";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface PivotData {
  [language: string]: {
    [year: string]: number;
  };
}

interface SankeyChartProps {
  data: PivotData;
  years: string[];
  theme: "light" | "dark";
}

declare global {
  interface Window {
    Plotly: typeof import("plotly.js");
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, years, theme }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !data || years.length === 0 || !theme) return;

    const labelColor = getCSSVar("--foreground");
    const tickColor = getCSSVar("--muted-foreground");

    const nodeLabels: string[] = [];
    const nodeMap: Record<string, number> = {};
    const nodeColors: string[] = [];
    const xPos: number[] = [];
    let nodeIdx = 0;

    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      for (const lang in data) {
        nodeLabels.push(lang);
        nodeMap[`${lang} ${year}`] = nodeIdx++;
        nodeColors.push(LANG_COLOR_MAP[lang]);
        xPos.push(i / years.length);
      }
    }

    const sources: number[] = [];
    const targets: number[] = [];
    const values: number[] = [];

    for (let i = 0; i < years.length - 1; i++) {
      const y1 = years[i];
      const y2 = years[i + 1];
      for (const lang in data) {
        const val = data[lang][y1] || 0;
        sources.push(nodeMap[`${lang} ${y1}`]);
        targets.push(nodeMap[`${lang} ${y2}`]);
        values.push(Math.max(val, 0.5));
      }
    }

    const dummyYear = (parseInt(years[years.length - 1]) + 1).toString();
    for (const lang in data) {
      nodeLabels.push("");
      nodeMap[`${lang} ${dummyYear}`] = nodeIdx++;
      nodeColors.push(LANG_COLOR_MAP[lang]);
      xPos.push(1.0);
      sources.push(nodeMap[`${lang} ${years[years.length - 1]}`]);
      targets.push(nodeMap[`${lang} ${dummyYear}`]);
      values.push(Math.max(data[lang][years[years.length - 1]] || 0, 0.5));
    }

    const linkColors = sources.map((srcIdx) => {
      const hex = nodeColors[srcIdx];
      const { r, g, b } = hexToRgb(hex);
      return `rgba(${r}, ${g}, ${b}, 0.3)`;
    });

    // unclear how to pass a tailwindcss font family directly to plotly, so hardcoding
    const fontFamily = "Figtree,  ui-sans-serif";

    const yearAnnotations = years.map((year, i) => ({
      x: i / years.length,
      y: -0.1,
      xref: "paper",
      yref: "paper",
      text: `<b>${year}</b>`,
      showarrow: false,
      font: {
        size: 12,
        color: tickColor,
        family: fontFamily,
      },
      xanchor: "left",
    }));

    const yAxisLabel: Partial<Plotly.Annotations> = {
      x: -0.08,
      y: 0.5,
      xref: "paper",
      yref: "paper",
      text: "<b>Usage (%)</b>",
      textangle: "-90",
      showarrow: false,
      font: {
        size: 12,
        color: tickColor,
        family: fontFamily,
      },
      xanchor: "center",
      yanchor: "middle",
    };

    const percentTicks: Partial<Plotly.Annotations>[] = [
      {
        x: -0.02,
        y: 1,
        xref: "paper",
        yref: "paper",
        text: "most",
        showarrow: false,
        font: { size: 10, color: tickColor, family: fontFamily },
        xanchor: "right",
        yanchor: "middle",
      },
      {
        x: -0.05,
        y: 0.5,
        xref: "paper",
        yref: "paper",
        text: "usage amount",
        textangle: "-90",
        showarrow: false,
        font: { size: 10, color: tickColor, family: fontFamily },
        xanchor: "center",
        yanchor: "middle",
      },
      {
        x: -0.02,
        y: 0,
        xref: "paper",
        yref: "paper",
        text: "least",
        showarrow: false,
        font: { size: 10, color: tickColor, family: fontFamily },
        xanchor: "right",
        yanchor: "middle",
      },
    ];

    window.Plotly.react(
      ref.current,
      [
        {
          type: "sankey",
          arrangement: "snap",
          node: {
            pad: 15,
            thickness: 20,
            label: nodeLabels,
            color: nodeColors,
            x: xPos,
            hoverinfo: "none",
          },
          link: {
            source: sources,
            target: targets,
            value: values,
            color: linkColors,
            hoverinfo: "none",
          },
          uid: "sankey-static",
        },
      ],
      {
        title: {
          text: `Top ${Object.keys(data).length} Languages Across Years`,
          font: {
            size: 16,
            color: labelColor,
            family: fontFamily,
          },
        },
        font: {
          family: fontFamily,
          size: 10,
          color: labelColor,
        },
        margin: { l: 60, r: 10, t: 40, b: 40 },
        transition: {
          duration: 500,
          easing: "cubic-in-out",
        },
        annotations: [
          yAxisLabel,
          ...percentTicks,
          ...yearAnnotations,
        ] as Partial<Plotly.Annotations>[],
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
      },
      {
        responsive: true,
      }
    );
  }, [data, years, theme]);

  return (
    <div className="relative w-full overflow-x-auto">
      <motion.div
        ref={ref}
        className="min-h-[500px] min-w-[1000px] bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default SankeyChart;
