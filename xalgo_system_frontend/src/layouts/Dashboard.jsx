// libraries
import React from 'react';
import Box from '../components/layout/Box';
import Grid from '../components/layout/Grid';
import Card from '../components/patterns/Card';
import Flex from '../components/layout/Flex';

// rm-components
import Text from '../components/primitives/Text';
import ScrollUp from './components/ScrollUp';
import { Link } from '@reach/router';
import Axios from 'axios';
import BarLoader from 'react-spinners/BarLoader';

const hold = {
  zIndex: '5',
};

// Primary Component
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDescription: 'Rule Maker Dashboard',
      rules: [],
      ready: false,
    };
  }

  componentDidMount() {
    Axios.get('/rules/rule')
      .then((res) => {
        this.setState({ rules: res.data, ready: true });
      })
      .catch((err) => {
        const status = err.response.status;
        if (status === 403) {
          console.log(`Failed to authenticate user: ${status}`);
        } else {
          console.log(`Error while getting user info: ${status}`);
        }
      });
  }

  render() {
    return (
      <ScrollUp>
        <div style={hold}>
          <Grid gridTemplateRows="auto" height="90vh">
            <Box>
              <Grid gridTemplateColumns="400px auto 400px" height="100%">
                <Box borderRight="1px solid #efefef">
                  <Box p={4}>
                    <Text variant="formtitle">Editor</Text>
                    <Box p={2} />
                    <Box>
                      <Link to="">
                        <Text color="primary">Create Rule</Text>
                      </Link>
                    </Box>
                    <Box marginTop={2}>
                      <Text color="textb">Create Table</Text>
                    </Box>
                  </Box>
                </Box>
                <Box p={4} borderRight="1px solid #efefef">
                  <Box p={1} />
                  <Text>Graphics showing rule ussage will go here in the future</Text>
                </Box>
                <Box p={4} height="auto">
                  <Text variant="formtitle">My Rules</Text>
                  <Box p={2} />
                  {this.state.ready ? (
                    <div>
                      {this.state.rules.map((e, i) => {
                        return (
                          <Card
                            key={i}
                            uuid={e.id}
                            name={e.name}
                            downloadLink=""
                            editLink={`/apps/rm/editor/${e.id}`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <Flex alignitems="center">
                        <BarLoader width={200} />
                      </Flex>
                    </div>
                  )}
                </Box>
              </Grid>
            </Box>
          </Grid>
        </div>
      </ScrollUp>
    );
  }
}
