// libraries
import React from 'react';

// rm-components
import Text from '../../components/primitives/Text';
import Flex from '../../components/layout/Flex';
import Icon from '../../components/icons/Icon';
import Grid from '../../components/layout/Grid';
import Box from '../../components/layout/Box';
import Button from '../../components/primitives/Button';


const top = {
  paddingTop: '6px',
};

const margin = {
  paddingTop: '2px',
}

const cc = {
  backgroundColor: "#494D59",
  padding: '12px 2em 12px 2em',
}

const smalltext = {
  fontSize: '0.55rem',
  color: '#fff',
}

// Primary Component
export default class Footer extends React.Component {
  render() {
    return (
      <div>
        <Box px={4} py={4} backgroundColor="#DBEAFF"> 
          <Grid gridTemplateColumns="auto 180px" gridGap="2.5%">
            <Flex alignItems="center">
              <Icon name="info" fill="#204EF0"/>
              <Text color="primary">This prototype is under construction.</Text>
            </Flex>
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
                          Provide Feedback
                        </Text>
                      </div>
                      <div style={top}>
                        <Icon name="expand" fill="#204EF0"/>
                      </div>
                    </Grid>
                  </Button>
                </a>

          </Grid>
        </Box>
        <Box p={4} backgroundColor="#1E2033"> 
          <Grid gridTemplateColumns="auto 180px 180px" gridGap="2.5%">
            <div>
              <Text color="oline">
                Xalgorithms Foundation
              </Text>
            </div>
            <div>
              <Text color="oline">
                Privacy Policy
              </Text>
              <Text color="oline">
                Terms of Service
              </Text>
            </div>
            <div>
              <Text color="oline">
                Source Code
              </Text>
              <Text color="oline">
                Developer Docs
              </Text>
            </div>
          </Grid>
          <Box p={4}></Box>
        </Box>
        <div style={cc}>
          <Grid gridTemplateColumns="auto 180px" gridGap="2.5%">
            <p style={smalltext}>
            CC BY-SA 4.0 2020 Xalgorithms Foundation
            </p>
            <p style={smalltext}>
            50 Hines Road, Suite 240, 
            <br />
            Ottawa, Ontario, Canada K2K 2M5
            </p>
          </Grid>
        </div>
      </div>
    );
  }
}
