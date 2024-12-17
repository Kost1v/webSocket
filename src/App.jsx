import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isConect, setIsConect] = useState(false);
  const socket = useRef(null);

  const connectSocket = () => {
    socket.current = new WebSocket("wss://ws.blockchain.info/inv");

    socket.current.onopen = () => {
      console.log("WebSocket connected");
      socket.current.send(JSON.stringify({ op: "unconfirmed_sub" }));
      setIsConect(true);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.op === "utx") {
        const newTransaction = data.x;

        const transactionAmount =
          newTransaction.out.reduce((sum, output) => sum + output.value, 0) /1e8;

        setTransactions((prev) => [newTransaction, ...prev.slice(0, 4)]);

        setTotalAmount((prev) => prev + transactionAmount);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      setIsConect(false);
    };
  };

  const disconnectSocket = () => {
    socket.current.close();
    setIsConect(false);
    console.log("WebSocket disconnected");
    
  };

  const resetTransactions = () => {
    setTransactions([]);
    setTotalAmount(0)
  }

  useEffect(() => {
    return () => {
      socket.current.close();
    };
  }, []);


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Transactions</h1>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button type="button" onClick={connectSocket} disabled={isConect}>
          Subscribe
        </button>
        <button type="button" onClick={disconnectSocket} disabled={!isConect}>
          Unsubscribe
        </button>
        <button type="button" onClick={resetTransactions}>
          Reset Transactions
        </button>
      </div>
      <p>
        <strong>Total Amount:</strong> {totalAmount.toFixed(8)} BTC
      </p>

      <ul
        style={{
          maxHeight: "400px",
          overflowY: "scroll",
          padding: "0",
          listStyle: "none",
        }}
      >
        {transactions !== null &&
          transactions.map((tx) => (
            <li
              key={tx.hash}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Hash:</strong> {tx.hash}
              </p>
              {/* <p>
                <strong>Amount:</strong> {totalAmount.toFixed(8)}
                BTC
              </p> */}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
