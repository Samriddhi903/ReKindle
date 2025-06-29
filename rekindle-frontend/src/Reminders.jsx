import { useState } from "react";

const PATHWAY_API_KEY = import.meta.env.VITE_PATHWAY_API_KEY;
const PATHWAY_WORKFLOW_ID = import.meta.env.VITE_PATHWAY_WORKFLOW_ID;

export default function Reminders() {
  const [reminder, setReminder] = useState("");
  const [time, setTime] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const res = await fetch(`https://api.pathway.com/v1/${PATHWAY_WORKFLOW_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PATHWAY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: "USER_ID", // Replace with real user ID if available
        caregiverEmail,
        reminder,
        time
      })
    });
    if (res.ok) setStatus("Reminder set!");
    else setStatus("Failed to set reminder.");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Set a Reminder</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="What to remind?"
          value={reminder}
          onChange={e => setReminder(e.target.value)}
          required
          className="border rounded p-2"
        />
        <input
          type="datetime-local"
          value={time}
          onChange={e => setTime(e.target.value)}
          required
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="Caregiver's Email"
          value={caregiverEmail}
          onChange={e => setCaregiverEmail(e.target.value)}
          required
          className="border rounded p-2"
        />
        <button className="bg-pastel-mint text-blue-900 font-bold py-2 rounded shadow hover:bg-pastel-blue transition" type="submit">
          Set Reminder
        </button>
      </form>
      {status && <div className="mt-3 text-blue-900">{status}</div>}
    </div>
  );
} 