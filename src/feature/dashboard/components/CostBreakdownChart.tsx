import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CostData } from "../types";

interface CostBreakdownChartProps {
  data: CostData[];
  isDarkMode: boolean;
}

export function CostBreakdownChart({
  data,
  isDarkMode,
}: CostBreakdownChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>서비스별 월간 비용</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <defs>
              <linearGradient id="colorCost1" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor={isDarkMode ? "#ffffff" : "var(--color-primary)"}
                  stopOpacity={0.7}
                />
                <stop
                  offset="100%"
                  stopColor={isDarkMode ? "#ffffff" : "var(--color-primary)"}
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient id="colorCost2" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor={isDarkMode ? "#cccccc" : "var(--color-secondary)"}
                  stopOpacity={0.7}
                />
                <stop
                  offset="100%"
                  stopColor={isDarkMode ? "#cccccc" : "var(--color-secondary)"}
                  stopOpacity={1}
                />
              </linearGradient>
              <linearGradient id="colorCost3" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor={isDarkMode ? "#999999" : "var(--color-accent)"}
                  stopOpacity={0.7}
                />
                <stop
                  offset="100%"
                  stopColor={isDarkMode ? "#999999" : "var(--color-accent)"}
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#444444" : "#e5e7eb"}
            />
            <XAxis
              type="number"
              stroke={isDarkMode ? "#ffffff" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`}
            />
            <YAxis
              dataKey="service"
              type="category"
              stroke={isDarkMode ? "#ffffff" : "#64748b"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
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
              formatter={(value) => `₩${value.toLocaleString()}`}
            />
            <Bar dataKey="cost" name="비용" radius={[0, 4, 4, 0]}>
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "url(#colorCost1)"
                      : index === 1
                        ? "url(#colorCost2)"
                        : index === 2
                          ? "url(#colorCost3)"
                          : isDarkMode
                            ? "#666666"
                            : "hsl(var(--muted))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
