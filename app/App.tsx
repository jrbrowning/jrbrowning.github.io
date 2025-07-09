import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getStackedBarChartData,
  getTopLanguagesByUsage,
} from "@/lib/data-utils";
import { GitHubData } from "@/types";
import { useEffect, useState } from "react";
import BarChartWithTable from "./BarChartWithTable";
import GroupedBarChartWithTable from "./GroupedBarChartWithTable";
import SankeyChart from "./SankeyChart";

export default function App() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [langLimit, setLangLimit] = useState<number>(5);
  const { theme } = useTheme();

  useEffect(() => {
    fetch("/github-static-transformed.json")
      .then((res) => res.json())
      .then((d: GitHubData) => {
        setData(d);
        const langYears = Object.values(d.language_usage_pivot)[0];
        setYears(Object.keys(langYears));
      });
  }, []);

  if (!data || years.length === 0) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const filteredData = getTopLanguagesByUsage(
    data.language_usage_pivot,
    langLimit
  );
  const topLangs = Object.keys(filteredData);

  const barChartData = getStackedBarChartData(
    data.repo_language_by_year,
    topLangs
  );

  const triggerClass =
    "text-xs sm:text-sm px-3 py-1.5 rounded-md border border-transparent data-[state=active]:border-border data-[state=active]:bg-muted data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold transition-colors";

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen">
        {/* Header */}
        <header className="mb-2">
          <div className="w-full max-w-13xl mx-auto px-4 sm:px-6">
            <div className="bg-background text-foreground flex items-center justify-between w-full py-2 sm:py-3">
              <h1 className="ml-2 text-lg sm:text-2xl font-bold tracking-tight">
                GitHub Developer Insights |{" "}
                <span className="text-blue-600 dark:text-blue-400 font-mono">
                  &lt;JRBrowning /&gt;
                </span>
              </h1>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="w-full max-w-10xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="sankey" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 gap-3 sm:gap-4">
              <TabsList
                className="flex w-full sm:w-auto gap-2 p-0"
                aria-label="Data views"
              >
                <TabsTrigger
                  value="sankey"
                  className={triggerClass}
                  title="Language Sankey view"
                >
                  Language Flow
                </TabsTrigger>

                <TabsTrigger
                  value="bar"
                  className={triggerClass}
                  title="Bar chart by year"
                >
                  Yearly Usage
                </TabsTrigger>

                <TabsTrigger
                  value="contrib"
                  className={triggerClass}
                  title="Grouped GitHub contributions"
                >
                  GitHub Contribution
                </TabsTrigger>
              </TabsList>

              <div className="bg-background text-foreground flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-xs text-muted-foreground pl-1">
                  Top Languages
                </label>
                <Select
                  value={langLimit.toString()}
                  onValueChange={(val) => setLangLimit(parseInt(val))}
                >
                  <SelectTrigger
                    className="w-full sm:w-[100px]"
                    aria-label="Top language count"
                    title="Select number of top languages to display"
                  >
                    <SelectValue placeholder="languages" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-lg border border-border shadow-md rounded-md px-4 py-2.5 text-sm space-y-1 animate-in fade-in duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out">
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Top {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="sankey">
              <div className="bg-background text-foreground rounded-2xl border border-border shadow-sm p-4">
                <SankeyChart
                  data={filteredData}
                  years={years}
                  theme={theme as "light" | "dark"}
                />
              </div>
            </TabsContent>

            <TabsContent value="bar">
              <BarChartWithTable data={barChartData} />
            </TabsContent>

            <TabsContent value="contrib">
              <GroupedBarChartWithTable data={data.contributions_by_year} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
}
