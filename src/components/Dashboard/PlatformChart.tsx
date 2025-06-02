
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PlatformChartProps {
  data: Record<string, number>;
}

const PLATFORM_COLORS = {
  TikTok: '#FF0050',
  Instagram: '#E4405F',
  YouTube: '#FF0000',
  LinkedIn: '#0077B5'
};

export function PlatformChart({ data }: PlatformChartProps) {
  const chartData = Object.entries(data).map(([platform, count]) => ({
    name: platform,
    value: count,
    color: PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] || '#8884d8'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} contenidos ({((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
