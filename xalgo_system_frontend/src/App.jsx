import React, { useEffect, useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import Axios from "axios";
import XalgoRM from "./XalgoRM";

function App() {
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
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
    }, 1500);
  }, []);

  return (
    <div className="application-wrapper">
      {!ready ? (
        <div className="loading-wrapper">
          <div className="grid-loader">
            <GridLoader size={20} margin={15} className="grid-loader-spinner" />
          </div>
        </div>
      ) : (
        <div className="signed-in">
          {username === null ? (
            <a className="App-link" href="/accounts/login">
              Please Log In
            </a>
          ) : (
            <XalgoRM user={user} username={username} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
