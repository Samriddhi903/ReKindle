import { useState, useEffect } from "react";

export default function Reminders() {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [dueReminder, setDueReminder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get JWT token from localStorage
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Combine date and time into ISO string
  const getDateTimeISO = () => {
    if (!date || !time) return "";
    return new Date(`${date}T${time}`).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setStatus("You must be logged in to set reminders.");
      return;
    }
    setStatus("Saving...");
    const reminderTime = getDateTimeISO();
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ reason, time: reminderTime })
    });
    if (res.ok) {
      setStatus("Reminder set!");
      setReason("");
      setDate("");
      setTime("");
    } else if (res.status === 401) {
      setStatus("Unauthorized. Please log in again.");
    } else {
      setStatus("Failed to set reminder.");
    }
  };

  // Poll for due reminders every 30 seconds
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchDueReminders = async () => {
      const res = await fetch("/api/reminders/due", {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setDueReminder(data[0]);
          setShowModal(true);
        }
      } else if (res.status === 401) {
        setStatus("Session expired. Please log in again.");
      }
    };
    fetchDueReminders();
    const interval = setInterval(fetchDueReminders, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, token]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Set a Reminder</h2>
      {!isLoggedIn ? (
        <div className="text-red-600 font-semibold mb-4">You must be logged in to set and receive reminders.</div>
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Reason for reminder"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
          className="border rounded p-2"
          disabled={!isLoggedIn}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="border rounded p-2"
          disabled={!isLoggedIn}
        />
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          required
          className="border rounded p-2"
          disabled={!isLoggedIn}
        />
        <button className="bg-pastel-mint text-blue-900 font-bold py-2 rounded shadow hover:bg-pastel-blue transition" type="submit" disabled={!isLoggedIn}>
          Set Reminder
        </button>
      </form>
      {status && <div className="mt-3 text-blue-900">{status}</div>}

      {/* Modal for due reminder */}
      {showModal && dueReminder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-2">⏰ Reminder!</h3>
            <p className="mb-4">{dueReminder.reason}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
              onClick={async () => {
                if (dueReminder && dueReminder._id) {
                  try {
                    await fetch(`/api/reminders/${dueReminder._id}/delivered`, {
                      method: 'PATCH',
                      headers: {
                        'Authorization': 'Bearer ' + token
                      }
                    });
                  } catch (err) {
                    // Optionally handle error
                  }
                }
                setShowModal(false);
                setDueReminder(null);
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 