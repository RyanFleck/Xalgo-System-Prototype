import React from 'react';
import Application from './layouts/Application';
import { ToastContainer, Slide } from 'react-toastify';

function XalgoRM({ user, username, rules }) {
  return (
    <div className="XalgoRM">
      <Application user={user} username={username} rules={rules} />
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