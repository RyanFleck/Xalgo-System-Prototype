// libraries
import React from 'react';
import Grid from '../components/layout/Grid';
import RuleName from './editor-layouts/RuleName';
import Intro from './components/Intro';

// components
import ScrollUp from './components/ScrollUp';

// Primary Component
export default class NewRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, token } = this.props;
    return (
      <ScrollUp>
        <Grid height="100vh" gridTemplateColumns="500px auto">
          <Intro name={ user.email }/>
          <RuleName user={user} token={token} />
        </Grid>
      </ScrollUp>
    );
  }
}
