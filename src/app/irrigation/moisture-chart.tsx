'use client';

import { TrendingUp } from 'lucide-react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { MoistureHistory, Zone } from './data';
import { useMemo } from 'react';

type MoistureChartProps = {
  moistureHistory: MoistureHistory[];
  zones: Zone[];
};

const zoneColors: { [key: number]: string } = {
    1: 'hsl(var(--chart-1))',
    2: 'hsl(var(--chart-2))',
    3: 'hsl(var(--chart-3))',
    4: 'hsl(var(--chart-4))',
    5: 'hsl(var(--chart-5))',
    6: 'hsl(var(--primary))',
}

export function MoistureChart({ moistureHistory, zones }: MoistureChartProps) {
  const chartData = useMemo(() => {
    return moistureHistory.map((historyPoint) => {
        const dataPoint: { time: string, [key: string]: any } = { time: historyPoint.time };
        zones.forEach(zone => {
            dataPoint[`zone_${zone.id}`] = historyPoint.readings[zone.id];
        });
        return dataPoint;
    });
  }, [moistureHistory, zones]);

 const chartConfig = useMemo(() => {
    const config: any = {};
    zones.forEach(zone => {
        config[`zone_${zone.id}`] = {
            label: zone.name,
            color: zoneColors[zone.id] || 'hsl(var(--foreground))',
        };
    });
    return config;
 }, [zones]);

  if (!moistureHistory.length) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Moisture Trend</CardTitle>
                  <CardDescription>Real-time moisture levels across all zones.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <p>Waiting for moisture data...</p>
                </div>
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moisture Trend</CardTitle>
        <CardDescription>Real-time moisture levels across all zones.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(-5)} // Display only HH:MM
                    />
                     <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        domain={[40, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend content={<ChartLegendContent />} />
                    {zones.map(zone => (
                         <Line
                            key={zone.id}
                            dataKey={`zone_${zone.id}`}
                            type="monotone"
                            stroke={zoneColors[zone.id] || 'hsl(var(--foreground))'}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
