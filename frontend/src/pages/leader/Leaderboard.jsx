import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("/api/leaderboard").then((response) => {
      setLeaders(response.data);
    }).catch((error) => {
      console.error("Error fetching leaderboard:", error);
    });
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🏆 Leaderboard</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#1A1A2E", color: "white" }}>
            <th style={tableHeaderStyle}>Rank</th>
            <th style={tableHeaderStyle}>Player</th>
            <th style={tableHeaderStyle}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={index} style={{ background: index % 2 === 0 ? "#F3F3F3" : "#FFFFFF" }}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>{leader.name}</td>
              <td style={tableCellStyle}>{leader.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = { padding: "10px", border: "1px solid white" };
const tableCellStyle = { padding: "10px", border: "1px solid black", textAlign: "center" };

export default Leaderboard; // ✅ Ensure this default export exists
