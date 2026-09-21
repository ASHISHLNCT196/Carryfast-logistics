import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function DockBoard() {
  const [depots, setDepots] = useState([]);

  async function load() {
    const { data } = await client.get("/depots");
    setDepots(data);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Dock Board</h1>
      {depots.map((depot) => (
        <div className="panel" key={depot.id}>
          <h3>{depot.name} <span style={{ color: "#999", fontWeight: 400 }}>({depot.location})</span></h3>
          <div className="dock-grid">
            {(depot.Docks || []).map((dock) => (
              <div className="dock-tile" key={dock.id}>
                <div className="num">{dock.dock_number}</div>
                <span className={`badge ${dock.status}`}>{dock.status}</span>
              </div>
            ))}
            {(!depot.Docks || depot.Docks.length === 0) && <p style={{ color: "#999" }}>No docks configured.</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
