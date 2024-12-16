// import { useState } from "react";
import "./App.css";

function App() {
  // const [transactions, setTransactions] = useState(null);
  // const [totalAmount, setTotalAmount] = useState(0);

  let socket = new WebSocket("wss://ws.blockchain.info/inv");

  socket.onopen = () => {
    console.log("WebSocket connected");
    socket.send(
      JSON.stringify({
        op: "unconfirmed_sub",
      })
    ); // Підписка на нові блоки
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.op === "block") {
      console.log("New block:", data.x.hash, "at height", data.x.height);
    }
  };

  socket.onerror = (error) => console.error("WebSocket error:", error);

  socket.onclose = () => console.log("WebSocket closed");

  return <h1>123</h1>;
}

export default App;
