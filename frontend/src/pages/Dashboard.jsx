import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import client from "../api/client";

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await client.get("/dashboard/kpis");
      setKpis(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load KPIs");
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!kpis) return <p>Loading dashboard…</p>;

  const hourData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    count: kpis.trucksPerHour.find((r) => r.hour === h)?.count || 0,
  }));

  const depotData = kpis.trucksPerDepot.map((d) => ({ depot: `Depot ${d.depot_id}`, count: d.count }));

  return (
    <div>
      <h1>Operations Dashboard</h1>

      <div className="card-row">
        <div className="kpi-card">
          <div className="label">Vehicles Inside</div>
          <div className="value">{kpis.vehiclesInside}</div>
        </div>
        <div className="kpi-card">
          <div className="label">Exited Today</div>
          <div className="value">{kpis.vehiclesExitedToday}</div>
        </div>
        <div className="kpi-card">
          <div className="label">Avg Waiting Time</div>
          <div className="value">{kpis.avgWaitingTime}m</div>
        </div>
        <div className="kpi-card">
          <div className="label">Avg Loading Time</div>
          <div className="value">{kpis.avgLoadingTime}m</div>
        </div>
        <div className="kpi-card">
          <div className="label">Avg Campus Time</div>
          <div className="value">{kpis.avgCampusTime}m</div>
        </div>
      </div>

      <div className="card-row" style={{ gap: 24 }}>
        <div className="panel" style={{ flex: 1, minWidth: 400 }}>
          <h3>Trucks per Hour (Today)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" interval={2} fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0e7c7b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ flex: 1, minWidth: 300 }}>
          <h3>Trucks per Depot (Today)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={depotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="depot" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#1f3864" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>Dock Status Summary</h3>
        <div className="card-row">
          <div className="kpi-card"><div className="label">Available</div><div className="value">{kpis.dockStatusSummary.available}</div></div>
          <div className="kpi-card"><div className="label">Occupied</div><div className="value">{kpis.dockStatusSummary.occupied}</div></div>
          <div className="kpi-card"><div className="label">Maintenance</div><div className="value">{kpis.dockStatusSummary.maintenance}</div></div>
        </div>
      </div>
    </div>
  );
}
