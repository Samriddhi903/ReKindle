import React from "react";

export default function RemindersList({ reminders, markDelivered }) {
  if (!reminders || reminders.length === 0) {
    return <div>No reminders found.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-3">Your Reminders</h3>
      <ul className="space-y-2">
        {reminders.map(reminder => (
          <li key={reminder._id} className="flex items-center justify-between border rounded p-3">
            <div>
              <div className="font-semibold">{reminder.reason}</div>
              <div className="text-sm text-gray-600">{new Date(reminder.time).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-3">
              {reminder.delivered ? (
                <span className="text-green-600 font-bold text-xl">&#10003;</span> // tick mark
              ) : (
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded font-semibold"
                  onClick={() => markDelivered(reminder._id)}
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
