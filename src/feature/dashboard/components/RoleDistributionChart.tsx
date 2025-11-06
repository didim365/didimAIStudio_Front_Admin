import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { RoleDistribution } from "../types";

interface RoleDistributionChartProps {
  data: RoleDistribution[];
  isDarkMode: boolean;
}

export function RoleDistributionChart({
  data,
  isDarkMode,
}: RoleDistributionChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>역할별 사용자 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={100}
              fill={isDarkMode ? "#ffffff" : "var(--color-primary)"}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    isDarkMode
                      ? index === 0
                        ? "#ffffff"
                        : index === 1
                        ? "#cccccc"
                        : "#999999"
                      : index === 0
                      ? "var(--color-primary)"
                      : index === 1
                      ? "var(--color-secondary)"
                      : "var(--color-accent)"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode
                  ? "#1a1a1a"
                  : "hsl(var(--background))",
                border: `1px solid ${
                  isDarkMode ? "#444444" : "hsl(var(--border))"
                }`,
                borderRadius: "8px",
                color: isDarkMode ? "#ffffff" : "inherit",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
