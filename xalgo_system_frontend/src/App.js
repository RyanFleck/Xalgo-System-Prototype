import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Axios from "axios";

let rules = null;
let user = null;

function App() {
  const [username, setUsername] = useState("Anonymous");
  const [user, setUser] = useState(null);
  const [rules, setRules] = useState(null);

  useEffect(() => {
    Axios.get("/rest-auth/user")
      .then((res) => {
        setUser(res.data);
        setUsername(res.data.username);
        console.log(`User ${res.data.username} is authenticated.`);
      })
      .catch((err) => {
        const status = err.response.status;
        if (status === 403) {
          console.log(`Failed to authenticate user: ${status}`);
          setUsername("Unauthenticated");
        } else {
          console.log(`Error while getting user info: ${status}`);
        }
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello, {username}.</p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
