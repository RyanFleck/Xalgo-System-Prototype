import React, { useEffect, useState } from 'react';
import GridLoader from 'react-spinners/GridLoader';
import Axios from 'axios';
import XalgoRM from './XalgoRM';

Axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
Axios.defaults.xsrfCookieName = 'XCSRF-TOKEN';

if (!process.env.HEROKU) {
  console.log('Deployed locally, use :8000 proxy.');
  // Axios.defaults.baseURL = 'http://localhost:8000';
}

function App() {
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      Axios.get('/rest-auth/user')
        .then((res) => {
          setUser(res.data);
          setUsername(res.data.username);
          Axios.get('/apps/token/')
            .then((res) => {
              setToken(res.data.token);
              setReady(true);
            })
            .catch((err) => {
              if (err.response && err.response.hasOwnProperty('status')) {
                const status = err.response.status;
                if (status === 403) {
                  console.log(`Failed to get token ${status}`);
                } else {
                  console.log(`Error while getting token: ${status}`);
                }
                setReady(true);
              }
            });
        })
        .catch((err) => {
          if (err.response && err.response.hasOwnProperty('status')) {
            const status = err.response.status;
            if (status === 403) {
              console.log(`Failed to authenticate user: ${status}`);
            } else {
              console.log(`Error while getting user info: ${status}`);
            }
            setReady(true);
          }
        });
    }, 50);
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
            <div>
              <h1>
                <b>428</b> Precondition Required: Log In.
              </h1>
              <p>
                <a className="App-link" href="/accounts/login">
                  Please Log In.
                </a>
                {' If using the development React build, go to '}
                <a className="App-link" href="http://localhost:8000/accounts/login">
                  localhost:8000/accounts/login
                </a>
                {' instead.'}
              </p>
            </div>
          ) : (
            <XalgoRM user={user} username={username} token={token} refresh={''} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
