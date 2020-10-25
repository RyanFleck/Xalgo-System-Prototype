// libraries
import React from 'react';
import Box from '../components/layout/Box';
import Grid from '../components/layout/Grid';
import { Link } from '@reach/router';

// components
import ScrollUp from './components/ScrollUp';

// rm-components
import Text from '../components/primitives/Text';
import Flex from '../components/layout/Flex';
import Search from '../components/patterns/Search';

// Primary Component
export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, username } = this.props;
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
          <Flex alignItems="center" justifyContent="center">
            <Box width="460px">
              <Text variant="heading">Solving the Problem of Rules.</Text>
              <Box p={1} />
              <Box border="1px solid" borderColor="oline" borderRadius="round" p={2}>
                <Search />
              </Box>
              <Box p={1} />
              <Link
                to="/apps/rm/editor"
                style={{
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                <Text>Assemble a Rule</Text>
              </Link>
            </Box>
          </Flex>
        </Grid>
      </ScrollUp>
    );
  }
}
