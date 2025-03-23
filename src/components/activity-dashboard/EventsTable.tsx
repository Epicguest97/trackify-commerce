
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserActivity } from '@/utils/activityTracking';

interface EventsTableProps {
  activities: UserActivity[];
}

const EventsTable = ({ activities }: EventsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Activity Events</CardTitle>
        <CardDescription>All tracked events in reverse chronological order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-500">Event Type</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">Page</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">Time</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {[...activities].reverse().map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {activity.eventType.replace(/_/g, ' ').toLowerCase()}
                  </td>
                  <td className="py-3 px-4 text-sm">{activity.page || '/'}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {activity.eventData.productName || ''}
                    {activity.eventData.searchTerm ? `"${activity.eventData.searchTerm}"` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsTable;
