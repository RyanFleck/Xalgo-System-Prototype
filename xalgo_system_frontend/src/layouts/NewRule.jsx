// libraries
import React from 'react';
import Box from '../components/layout/Box';
import Grid from '../components/layout/Grid';
import RuleName from './editor-layouts/RuleName';
// components
import ScrollUp from './components/ScrollUp';

// rm-components
import Text from '../components/primitives/Text';

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
        <Grid height="80vh" gridTemplateColumns="400px auto">
          <Box borderRight="1px solid #efefef">
            <Box p={4}>
              <Text variant="formtitle">Introducing XRADS</Text>
              <Box p={3} />
              <Text color="primary">Welcome, {user.email}</Text>
              <Box p={1} />
              <Text color="primary">
                This prototype rule editor is currently under construction. Please post any bugs or
                issues on the repository for this system:
              </Text>
              <Box p={1} />
              <Text color="primary">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/RyanFleck/Xalgo-System-Prototype/issues"
                >
                  Xalgo-System-Prototype/issues
                </a>
              </Text>
              <Box p={2} />
              <Text color="primary">
                You may begin assembling rules under the Editor tab, or browse rules you have
                already written at the dashboard tab.
              </Text>
            </Box>
          </Box>
          <RuleName user={user} token={token} />
        </Grid>
      </ScrollUp>
    );
  }
}
