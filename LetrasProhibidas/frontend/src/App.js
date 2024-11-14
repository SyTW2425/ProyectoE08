import logo from "./logo.svg";
import { useEffect } from "react"
import "./App.css";
import { io } from "socket.io-client"

function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("connect", () => {
      console.log("Conectado al servidor")
    })
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1 className="text-4xl text-center text-blue-500">Hello World</h1>
    </div>
  );
}

export default App;
