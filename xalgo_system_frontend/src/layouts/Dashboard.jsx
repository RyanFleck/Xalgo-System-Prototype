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
import FileSaver from 'file-saver';
import slugify from 'slugify';

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

    this.getRules = this.getRules.bind(this);
    this.downloadRule = this.downloadRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
  }

  componentDidMount() {
    this.getRules();
  }

  downloadRule(uuid) {
    let rule_name = 'rule';
    console.log(`Downloading ${uuid}`);
    Axios.get(`/rules/rule/${uuid}/`, {
      headers: {
        'X-CSRFToken': this.props.token,
      },
    }).then((res) => {
      if (res && res.status && res.status === 200) {
        console.log('Rule Get.');
        console.log(`Content object has uuid ${res.data.primary_content}`);
        console.log(res);
        rule_name = res.data.name;
        Axios.get(`/rules/content/${res.data.primary_content}/`, {
          headers: {
            'X-CSRFToken': this.props.token,
          },
        }).then((res) => {
          if (res && res.status && res.status === 200) {
            console.log('Content Get.');
            console.log(`Content object has body:`);
            console.log(res.data.body);
            const data = res.data.body;
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: 'text/plain;charset=utf-8',
            });
            FileSaver.saveAs(blob, `${slugify(rule_name.toLowerCase())}.xa.json`);
          }
        });
      }
    });
  }

  deleteRule(uuid) {
    console.log(`Deleting ${uuid} token ${this.props.token}`);
    if (window.confirm(`Delete rule ${uuid}?`)) {
      Axios.delete(`/rules/rule/${uuid}/`, {
        headers: {
          'X-CSRFToken': this.props.token,
        },
      }).then((res) => {
        if (res && res.status && res.status === 204) {
          console.log('Rule Deleted.');
          this.getRules();
        }
      });
    }
  }

  getRules() {
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
                      <Text color="primary">
                        <Link to="/apps/rm/editor">Create Rule</Link>
                      </Text>
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
                            editLink={`/apps/rm/editor/${e.id}`}
                            deleteRule={this.deleteRule}
                            downloadRule={this.downloadRule}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <Flex alignitems="center">
                        <BarLoader width={320} />
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
