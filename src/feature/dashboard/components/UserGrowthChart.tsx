import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserGrowthData } from "../types";

interface UserGrowthChartProps {
  data: UserGrowthData[];
  isDarkMode: boolean;
}

export function UserGrowthChart({ data, isDarkMode }: UserGrowthChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>회원 증가 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={
                    isDarkMode ? "#ffffff" : "var(--color-primary)"
                  }
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={
                    isDarkMode ? "#ffffff" : "var(--color-primary)"
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#444444" : "#e5e7eb"}
            />
            <XAxis
              dataKey="month"
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
              tickFormatter={(value) => `${value}`}
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
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke={isDarkMode ? "#ffffff" : "var(--color-primary)"}
              strokeWidth={2}
              fill="url(#colorUsers)"
              name="회원 수"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
