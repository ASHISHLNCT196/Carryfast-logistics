import React, { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Vehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ plate_number: "", vehicle_type: "", transporter: "", owner_name: "" });
  const [error, setError] = useState("");

  async function load() {
    const { data } = await client.get("/vehicles", { params: { search } });
    setVehicles(data.data);
  }

  useEffect(() => { load(); }, [search]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await client.post("/vehicles", form);
      setForm({ plate_number: "", vehicle_type: "", transporter: "", owner_name: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create vehicle");
    }
  }

  async function handleDeactivate(id) {
    await client.delete(`/vehicles/${id}`);
    load();
  }

  return (
    <div>
      <h1>Vehicle Registry</h1>

      {user.role === "admin" && (
        <form className="panel inline-form" onSubmit={handleCreate}>
          <div className="form-row">
            <label>Plate Number</label>
            <input required value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value.toUpperCase() })} />
          </div>
          <div className="form-row">
            <label>Type</label>
            <input value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Transporter</label>
            <input value={form.transporter} onChange={(e) => setForm({ ...form, transporter: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Owner</label>
            <input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
          </div>
          <button className="btn" type="submit">Add Vehicle</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      )}

      <div className="toolbar">
        <input placeholder="Search plate number…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Plate</th><th>Type</th><th>Transporter</th><th>Owner</th><th>Status</th>
              {user.role === "admin" && <th></th>}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.plate_number}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.transporter}</td>
                <td>{v.owner_name}</td>
                <td><span className={`badge ${v.status === "active" ? "available" : "maintenance"}`}>{v.status}</span></td>
                {user.role === "admin" && (
                  <td>{v.status === "active" && <button className="btn danger" onClick={() => handleDeactivate(v.id)}>Deactivate</button>}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
