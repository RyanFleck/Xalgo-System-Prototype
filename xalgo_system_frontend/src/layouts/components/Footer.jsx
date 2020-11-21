// libraries
import React from 'react';

// rm-components
import Text from '../../components/primitives/Text';
import Flex from '../../components/layout/Flex';
import Icon from '../../components/icons/Icon';
import Grid from '../../components/layout/Grid';
import Box from '../../components/layout/Box';
import Button from '../../components/primitives/Button';

const cc = {
  backgroundColor: "#494D59",
  padding: '12px 2em 12px 2em',
}

const smalltext = {
  fontSize: '0.55rem',
  color: '#fff',
}

const footer = {
  position: 'relative',
  zIndex: '5',
}

// Primary Component
export default class Footer extends React.Component {
  render() {
    return (
      <div style={footer}>
        <Box px={4} py={2} backgroundColor="#439D72">
          <Grid gridTemplateColumns="auto 180px" gridGap="2.5%">
            <Flex alignItems="center">
              <Icon name="info" fill="#D0F3E2"/>
              <Text color="#D0F3E2">This prototype is under construction.</Text>
            </Flex>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/RyanFleck/Xalgo-System-Prototype/issues"
                >
                  <Button variant="error">
                          Provide Feedback
                  </Button>
                </a>

          </Grid>
        </Box>
        <Box p={4} backgroundColor="#1E2033">
          <Grid gridTemplateColumns="auto 180px 180px" gridGap="2.5%">
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://xalgorithms.org/"
              >
                <Text color="oline">
                  Xalgorithms Foundation
                </Text>
              </a>
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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/RyanFleck/Xalgo-System-Prototype"
              >
                <Text color="oline">
                  Source Code
                </Text>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://development.xalgorithms.org/"
              >
                <Text color="oline">
                  Developer Docs
                </Text>
              </a>
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
