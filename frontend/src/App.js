import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [devices, setDevices] = useState([]);
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [type, setType] = useState("");

  const fetchDevices = async () => {
    const res = await axios.get("http://localhost:5000/devices");
    setDevices(res.data);
  };

  const addDevice = async () => {
    if (!name || !ip || !type) {
      alert("Fill all fields");
      return;
    }

    await axios.post("http://localhost:5000/devices", {
      name,
      ip,
      type
    });

    setName("");
    setIp("");
    setType("");
    fetchDevices();
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Network Device Monitor</h2>

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
        placeholder="Type (Router / Switch / Server)"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />

      <button onClick={addDevice}>Add Device</button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
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
              <td style={{ color: d.status === "Online" ? "green" : "red" }}>
                {d.status}
              </td>
              <td>{new Date(d.lastChecked).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
