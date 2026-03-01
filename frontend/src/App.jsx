import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [workers, setWorkers] = useState([]);
  const [stations, setStations] = useState([]);
  const [factory, setFactory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const workerRes = await API.get("/metrics/workers");
    const stationRes = await API.get("/metrics/workstations");
    const factoryRes = await API.get("/metrics/factory");

    setWorkers(workerRes.data);
    setStations(stationRes.data);
    setFactory(factoryRes.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={async () => {
          try {
            await API.post("/events/generate-dummy");
            fetchData();
          } catch (err) {
            alert("Error regenerating data");
          }
        }}
      >
        Regenerate Dummy Data
      </button>
      <h1>Factory Productivity Dashboard</h1>

      {factory && (
        <div>
          <h2>Factory Summary</h2>
          <p>Total Productive Time: {factory.totalProductiveTime}s</p>
          <p>Total Production: {factory.totalProduction}</p>
          <p>Average Utilization: {factory.avgUtilization}%</p>
          <p>Average Production Rate: {factory.avgProductionRate} units/hr</p>
        </div>
      )}

      <h2>Workers</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Active Time</th>
            <th>Idle Time</th>
            <th>Utilization %</th>
            <th>Total Units</th>
            <th>Units / Hr</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w) => (
            <tr key={w.worker_id}>
              <td>{w.name}</td>
              <td>{w.activeTime}s</td>
              <td>{w.idleTime}s</td>
              <td>{w.utilization}</td>
              <td>{w.totalUnits}</td>
              <td>{w.unitsPerHour}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Workstations</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Occupancy Time</th>
            <th>Utilization %</th>
            <th>Total Units</th>
            <th>Throughput</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s.station_id}>
              <td>{s.name}</td>
              <td>{s.occupancyTime}s</td>
              <td>{s.utilization}</td>
              <td>{s.totalUnits}</td>
              <td>{s.throughputRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
