// libraries
import React from 'react';
import { Link } from '@reach/router';

// rm-components
import Text from '../../components/primitives/Text';
import Flex from '../../components/layout/Flex';
import Icon from '../../components/icons/Icon';
import Grid from '../../components/layout/Grid';
import Box from '../../components/layout/Box';
import Button from '../../components/primitives/Button';

// styles
const styleHold = {
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: '5',
  background: '#1E2033',
};

const styleNavlink = {
  fontSize: '1.05em',
  paddingRight: '2em',
  textDecoration: 'none',
  color: '#fff',
};

const svghold = {
  width: '22px',
  height: '22px',
  marginRight: '0px',
  paddingTop: '3px',
};

// Primary Component
export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: false,
      isToggleAccount: false,
    };
    this.handleModal = this.handleModal.bind(this);
    this.handleAccount = this.handleAccount.bind(this);
  }

  handleModal() {
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }));
  }

  handleAccount() {
    this.setState((state) => ({
      isToggleAccount: !state.isToggleAccount,
    }));
  }

  render() {
    const { authenticated } = this.props;
    return (
      <div style={styleHold}>
        <Grid
          gridTemplateColumns="400px auto 400px"
          alignItems="center"
          paddingLeft={3}
          paddingRight={4}
          paddingTop={3}
          paddingBottom={3}
        >
          <Box>
            <Flex alignItems="center">
              <Link to="/apps/rm" style={styleNavlink}>
                <Text variant="formtitle" marginLeft="8px" color="#fff">
                  XRM
                </Text>
              </Link>
            </Flex>
          </Box>
          <Box>
          </Box>
          <Box justifySelf="end">
            <Flex>
              {authenticated ? (
                <Link to="/apps/rm/editor" style={styleNavlink}>
                  <Flex alignItems="center">
                    <div style={svghold}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                        <title>i-edit-black-small</title>
                        <path
                          fill="#fff"
                          d="M14.52,7.87,10.35,3.71,11.86,2.2a2,2,0,0,1,1.41-.58h0a2,2,0,0,1,1.42.58L16,3.53a2,2,0,0,1,0,2.83ZM11.77,3.71l2.75,2.74.8-.79a1,1,0,0,0,0-1.42L14,2.91a1,1,0,0,0-.71-.29h0a1,1,0,0,0-.7.29Z"
                          transform="translate(-0.1 -1.62)"
                        />
                        <path
                          fill="#fff"
                          d="M4.23,18.18H.1V14L9.73,4.38l4.15,4.15Zm-3.13-1H3.81l8.66-8.65L9.73,5.79,1.1,14.39Z"
                          transform="translate(-0.1 -1.62)"
                        />
                      </svg>
                    </div>
                    <Text>Editor</Text>
                  </Flex>
                </Link>
              ) : null}
              {authenticated ? (
                <Link to="/apps/rm/dashboard" style={styleNavlink}>
                  <Flex alignItems="center">
                    <div style={svghold}>
                      <Icon name="dash" fill="#fff" />
                    </div>
                    <Text>Dashboard</Text>
                  </Flex>
                </Link>
              ) : null}

              <Flex alignItems="center">
                <Button variant="invisible">
                  <Text color="#fff">Log Out</Text>
                </Button>
              </Flex>
            </Flex>
          </Box>
        </Grid>
      </div>
    );
  }
}
