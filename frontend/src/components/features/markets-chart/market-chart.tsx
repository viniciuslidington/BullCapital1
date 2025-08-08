import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateMarketChartConfig } from "@/lib/utils";

interface MarketChartProps {
  title: string;
  description: string;
  chartData: Array<{
    date: string;
    [ticker: string]: string | number;
  }>;
}

export function MarketChart({
  title,
  description,
  chartData,
}: MarketChartProps) {
  const [timeRange, setTimeRange] = useState("30d");

  const chartConfig = generateMarketChartConfig(chartData);

  // A lógica de filtragem foi corrigida aqui
  const filteredData = useMemo(() => {
    // Pega a última data dos seus dados como referência
    const lastDataPoint = chartData[chartData.length - 1];
    if (!lastDataPoint) return [];

    const referenceDate = new Date(lastDataPoint.date);

    let daysToSubtract = 90; // Valor padrão
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "total") {
      daysToSubtract = chartData.length;
    } else if (timeRange === "1y") {
      daysToSubtract = 365;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [timeRange, chartData]); // Adicionado useMemo para performance

  return (
    <Card className="bg-card/60 w-full pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {/* Mantendo os valores originais para 90, 30 e 7 dias */}
            <SelectItem value="total" className="rounded-lg">
              Total
            </SelectItem>
            <SelectItem value="1y" className="rounded-lg">
              Últimos 365 dias
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Últimos 90 dias
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart data={filteredData} margin={{ top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
              offset={24}
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("pt-BR");
              }}
            />
            {Object.entries(chartConfig).map(([ticker, config]) => (
              <Line
                key={ticker}
                dataKey={ticker}
                type="natural"
                fill={`url(#fill${ticker})`}
                stroke={config.color}
                dot={false}
                strokeWidth={2}
              />
            ))}

            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
