import { useState, useEffect } from "react";
import RemindersList from "./RemindersList";

export default function Reminders() {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [reminders, setReminders] = useState([]);
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

  const fetchAllReminders = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch("/api/reminders", {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      } else if (res.status === 401) {
        setStatus("Session expired. Please log in again.");
      } else {
        setStatus("Failed to fetch reminders.");
      }
    } catch (err) {
      setStatus("Error fetching reminders.");
    }
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
      fetchAllReminders();
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

  // Fetch all reminders on mount and when login status changes
  useEffect(() => {
    fetchAllReminders();
  }, [isLoggedIn, token]);

  const markDelivered = async (id) => {
    try {
      const res = await fetch(`/api/reminders/${id}/delivered`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (res.ok) {
        // Update reminders list after marking delivered
        fetchAllReminders();
        // If the delivered reminder is the dueReminder, close modal
        if (dueReminder && dueReminder._id === id) {
          setShowModal(false);
          setDueReminder(null);
        }
      } else if (res.status === 401) {
        setStatus("Session expired. Please log in again.");
      } else {
        setStatus("Failed to mark reminder as delivered.");
      }
    } catch (err) {
      setStatus("Error marking reminder as delivered.");
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mb-6">
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
                  await markDelivered(dueReminder._id);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
        {/* List of all reminders */}
        {isLoggedIn && (
          <RemindersList reminders={reminders} markDelivered={markDelivered} />
        )}
      </div>
    </>
  );
}
