import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UsageData } from "../types";

interface TokenUsageChartProps {
  data: UsageData[];
  isDarkMode: boolean;
}

export function TokenUsageChart({ data, isDarkMode }: TokenUsageChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>주간 토큰 사용량</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="colorChatTokens" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isDarkMode ? "#ffffff" : "var(--color-primary)"}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={isDarkMode ? "#ffffff" : "var(--color-primary)"}
                  stopOpacity={0.7}
                />
              </linearGradient>
              <linearGradient
                id="colorEmbeddingTokens"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={isDarkMode ? "#cccccc" : "var(--color-secondary)"}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={isDarkMode ? "#cccccc" : "var(--color-secondary)"}
                  stopOpacity={0.7}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#444444" : "#e5e7eb"}
            />
            <XAxis
              dataKey="date"
              stroke={isDarkMode ? "#ffffff" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDarkMode ? "#ffffff" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode
                  ? "#1a1a1a"
                  : "hsl(var(--background))",
                border: `1px solid ${isDarkMode ? "#444444" : "hsl(var(--border))"}`,
                borderRadius: "8px",
                color: isDarkMode ? "#ffffff" : "inherit",
              }}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Legend
              wrapperStyle={{ color: isDarkMode ? "#ffffff" : "inherit" }}
            />
            <Bar
              dataKey="chatTokens"
              fill="url(#colorChatTokens)"
              name="챗봇 토큰"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="embeddingTokens"
              fill="url(#colorEmbeddingTokens)"
              name="임베딩 토큰"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
