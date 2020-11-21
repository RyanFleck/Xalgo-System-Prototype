// libraries
import React from 'react';
import Grid from '../components/layout/Grid';
//import { Link } from '@reach/router';

// components
import ScrollUp from './components/ScrollUp';

// rm-components
import Flex from '../components/layout/Flex';
import Intro from './components/Intro';

// Primary Component
export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { user } = this.props;
    return (
      <ScrollUp>
        <Grid height="100vh" gridTemplateColumns="500px auto" m="0" p="0">
          <Intro name={ user.email }/>
          <Flex alignItems="center" justifyContent="center">
          </Flex>
        </Grid>
      </ScrollUp>
    );
  }
}
