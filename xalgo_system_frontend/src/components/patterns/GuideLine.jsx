import React from 'react';

const guide = {
  borderLeft: '1px solid #E7E7E7',
  paddingLeft: '2em',
  marginLeft: '8px',
};

function GuideLine({ children }) {
  return <div style={guide}>{children}</div>;
}

export default GuideLine;
