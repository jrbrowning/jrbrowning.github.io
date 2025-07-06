export interface GitHubData {
  language_usage_pivot: Record<string, Record<string, number>>;
  contributions_by_year: Array<{
    year: number;
    commits: number;
    prs: number;
    reviews: number;
    repo_count: number;
  }>;
  repo_language_by_year: Record<string, Record<string, number>>;
}
