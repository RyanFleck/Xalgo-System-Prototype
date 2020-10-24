import React, { useEffect, useState } from "react";
import "./App.css";
import GridLoader from "react-spinners/GridLoader";
import Axios from "axios";
import XalgoRM from "./XalgoRM";

let rules = null;
let user = null;

function App() {
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [rules, setRules] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Axios.get("/rest-auth/user")
      .then((res) => {
        setUser(res.data);
        setUsername(res.data.username);
        console.log(`User ${res.data.username} is authenticated.`);
        setReady(true);
      })
      .catch((err) => {
        const status = err.response.status;
        if (status === 403) {
          console.log(`Failed to authenticate user: ${status}`);
        } else {
          console.log(`Error while getting user info: ${status}`);
        }
        setReady(true);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!ready ? (
          <div className="loading">
            <GridLoader size={20} margin={15} />
          </div>
        ) : (
          <div className="signed-in">
            {username === null ? (
              <a className="App-link" href="/accounts/login">
                Please Log In
              </a>
            ) : (
              <XalgoRM user={user} username={username} rules={rules} />
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
