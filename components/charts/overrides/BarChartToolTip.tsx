import { useTheme } from "@/components/theme-provider";
import { CONTRIB_COLOR_MAP, LANG_COLOR_MAP } from "@/lib/constants";

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string | number;
  percentage?: boolean;
};

const BarChartTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
  label,
  percentage = false,
}) => {
  const { resolvedTheme } = useTheme();

  if (!active || !payload || payload.length === 0) return null;

  const isDark = resolvedTheme === "dark";

  const getColor = (name: string) => {
    return percentage ? LANG_COLOR_MAP[name] : CONTRIB_COLOR_MAP[name];
  };

  return (
    <div
      className={`backdrop-blur-lg border border-border shadow-md rounded-md px-4 py-2.5 text-sm space-y-1 animate-in fade-in duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out ${
        isDark ? "bg-slate-900 text-white" : "bg-white/80 text-slate-800"
      }`}
    >
      <div className="text-muted-foreground font-medium mb-1">
        Year: {label}
      </div>
      {payload.map((entry, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(entry.name) }}
            />
            <span>{entry.name}</span>
          </div>
          <span>
            {percentage
              ? `${Number(entry.value).toFixed(1)}%`
              : Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BarChartTooltip;
