import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function EntryExit() {
  const [activeEntries, setActiveEntries] = useState([]);
  const [plate, setPlate] = useState("");
  const [message, setMessage] = useState(null);
  const [depots, setDepots] = useState([]);

  async function loadActive() {
    const { data } = await client.get("/entry/active");
    setActiveEntries(data);
  }

  async function loadDepots() {
    const { data } = await client.get("/depots");
    setDepots(data);
  }

  useEffect(() => { loadActive(); loadDepots(); }, []);

  async function handleEntry(e) {
    e.preventDefault();
    setMessage(null);
    try {
      const { data } = await client.post("/entry", { plate_number: plate || undefined, manual_override: true });
      setMessage({ type: "success", text: `Entry #${data.entry.id} created for ${data.vehicle.plate_number} (ANPR confidence ${data.anpr.confidence})` });
      setPlate("");
      loadActive();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Entry failed" });
    }
  }

  async function handleExit(plateNumber) {
    setMessage(null);
    try {
      const { data } = await client.post("/exit", { plate_number: plateNumber });
      setMessage({ type: "success", text: `Exit recorded. Campus time: ${data.campus_duration_min} minutes.` });
      loadActive();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Exit failed" });
    }
  }

  async function handleAssignDepot(entryId) {
    const depotId = depots[0]?.id;
    if (!depotId) return;
    try {
      await client.post(`/entry/${entryId}/assign-depot`, { depot_id: depotId, order_id: `ORD-${Date.now()}` });
      setMessage({ type: "success", text: `Depot assigned to entry #${entryId}` });
      loadActive();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Assignment failed" });
    }
  }

  return (
    <div>
      <h1>Entry / Exit — Gate Simulation</h1>
      <p style={{ color: "#666", fontSize: 13 }}>
        This simulates the ANPR camera trigger described in Part 2.5 of the plan. Leave the plate field blank to
        simulate an unregistered vehicle read with a random plate.
      </p>

      <form className="panel inline-form" onSubmit={handleEntry}>
        <div className="form-row">
          <label>Plate Number (optional)</label>
          <input placeholder="e.g. MH12AB1234" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} />
        </div>
        <button className="btn" type="submit">Simulate Entry (ANPR)</button>
      </form>

      {message && (
        <p className={message.type === "error" ? "error-text" : ""} style={message.type === "success" ? { color: "#1a7a3c" } : {}}>
          {message.text}
        </p>
      )}

      <div className="panel">
        <h3>Active Entries on Campus</h3>
        <table>
          <thead>
            <tr><th>Entry ID</th><th>Plate</th><th>Entry Time</th><th>Confidence</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {activeEntries.map((e) => (
              <tr key={e.id}>
                <td>#{e.id}</td>
                <td>{e.plate_number}</td>
                <td>{new Date(e.entry_time).toLocaleString()}</td>
                <td>{e.confidence_score}</td>
                <td>
                  <button className="btn secondary" style={{ marginRight: 6 }} onClick={() => handleAssignDepot(e.id)}>Assign Depot</button>
                  <button className="btn" onClick={() => handleExit(e.plate_number)}>Exit</button>
                </td>
              </tr>
            ))}
            {activeEntries.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "#999" }}>No active entries — simulate one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
