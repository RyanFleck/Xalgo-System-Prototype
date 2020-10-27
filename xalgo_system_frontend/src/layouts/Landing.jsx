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
import Button from '../components/primitives/Button';
import Icon from '../components/icons/Icon';


const top = {
  paddingTop: '6px',
};

const margin = {
  paddingTop: '2px',
}

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
          <Box backgroundColor="#F6F5F2">
            <Box p={4}>
              <Text variant="formtitle">Welcome, {user.email}</Text>
              <Box p={2} />
              <Text color="textb">
                Use the XRM interface to construct rules using the Oughtomation method. Click on the Editor tab to create a rule, or browse rules you have already written using the dashboard tab.
              </Text>
              <Box p={2} />
              <Text color="textb">
                This prototype is under construction. Please post any bugs or
                issues in the repository for this system.
              </Text>
              <Box p={2} />
              <Flex alignItems="center">
                <Text color="error">This protoype is optimised only for desktop usage</Text>
                <Icon name="info" fill="#ED9C91"></Icon>
              </Flex>
              <Box p={2} />
              <Text color="error">
                
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/RyanFleck/Xalgo-System-Prototype/issues"
                >
                  <Button variant="wide">
                    <Grid gridTemplateColumns="auto 18px" width="100%">
                      <div>
                        <div style={margin}>
                        </div>
                        <Text color="primary">
                          Report an issue, or provide feedback 
                        </Text>
                      </div>
                      <div style={top}>
                        <Icon name="expand" fill="#204EF0"/>
                      </div>
                    </Grid>
                  </Button>
                </a>
              </Text>
            </Box>
          </Box>
          <Flex alignItems="center" justifyContent="center">
          </Flex>
        </Grid>
      </ScrollUp>
    );
  }
}
