
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserActivity } from '@/utils/activityTracking';

interface EventTypePieChartProps {
  activities: UserActivity[];
}

const EventTypePieChart = ({ activities }: EventTypePieChartProps) => {
  // Count events by type
  const eventCounts = activities.reduce((acc: Record<string, number>, activity) => {
    acc[activity.eventType] = (acc[activity.eventType] || 0) + 1;
    return acc;
  }, {});
  
  // Prepare data for event type chart
  const eventTypeChartData = Object.entries(eventCounts).map(([type, count]) => ({
    name: type.replace(/_/g, ' ').toLowerCase(),
    value: count
  }));
  
  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Types Distribution</CardTitle>
        <CardDescription>Breakdown of different types of tracked events</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={eventTypeChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {eventTypeChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EventTypePieChart;
