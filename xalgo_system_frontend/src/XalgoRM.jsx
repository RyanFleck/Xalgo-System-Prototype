import React from 'react';
import Application from './layouts/Application';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function XalgoRM({ user, username, token, refresh }) {
  return (
    <div className="XalgoRM">
      <Application user={user} username={username} token={token} refresh={refresh} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        transition={Slide}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </div>
  );
}

export default XalgoRM;
