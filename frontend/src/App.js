import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [type, setType] = useState("");

  const BASE_URL =
    "http://network-monitor-backend-env.eba-wrj6md2i.ap-south-1.elasticbeanstalk.com";

  const fetchDevices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/devices`);
            const filtered = res.data.filter(
        (d) => d.name && d.ip && d.type
      );
      // show only last 10 devices
      const last10 = filtered.slice(-10).reverse();
      setDevices(last10);

    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  };

  const addDevice = async () => {
    if (!name || !ip || !type) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/devices`, { name, ip, type });
      setName("");
      setIp("");
      setType("");
      fetchDevices();
    } catch (err) {
      console.error("Failed to add device:", err);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>🌐 Network Device Monitor</h1>

      {/* Add Device Card */}
      <div className="card">
        <h3>Add Device</h3>
        <div className="form">
          <input
            placeholder="Device Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="IP Address"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <input
            placeholder="Type (Router / Server / Laptop)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <button onClick={addDevice}>Add</button>
        </div>
      </div>

      {/* Device List */}
      <div className="card">
        <h3>Devices</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th>Type</th>
              <th>Status</th>
              <th>Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.ip}</td>
                <td>{d.type}</td>
                <td
                  className={
                    d.status === "Online" ? "status online" : "status offline"
                  }
                >
                  {d.status}
                </td>
                <td>
                  {new Date(d.lastChecked).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
