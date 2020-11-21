// libraries
import React from 'react';
import Box from '../components/layout/Box';
import Grid from '../components/layout/Grid';
import Card from '../components/patterns/Card';
import Flex from '../components/layout/Flex';

import Intro from './components/Intro';

// rm-components
import Text from '../components/primitives/Text';
import ScrollUp from './components/ScrollUp';
//import { Link } from '@reach/router';
import Axios from 'axios';
import BarLoader from 'react-spinners/BarLoader';
import FileSaver from 'file-saver';
import slugify from 'slugify';

const hold = {
  zIndex: '5',
};

export function downloadRule(uuid, csrfToken) {
  let rule_name = 'rule';
  console.log(`Downloading ${uuid}`);
  Axios.get(`/rules/json/${uuid}/`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
  }).then((res) => {
    if (res && res.status && res.status === 200) {
      const data = res.data;
      console.log(data);
      rule_name = data.metadata.rule.title;
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, `${slugify(rule_name.toLowerCase())}.xa.json`);
    }
  });
}

export function deleteRule(uuid, csrfToken) {
  console.log(`Deleting ${uuid} token ${this.props.token}`);
  if (window.confirm(`Delete rule ${uuid}?`)) {
    Axios.delete(`/rules/rule/${uuid}/`, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    }).then((res) => {
      if (res && res.status && res.status === 204) {
        console.log('Rule Deleted.');
        this.getRules();
      }
    });
  }
}

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
  }

  componentDidMount() {
    this.getRules();
  }

  getRules() {
    Axios.get('/rules/rule')
      .then((res) => {
        const rules = res.data.sort((a, b) => {
          let date_a = Date.parse(a.modified);
          let date_b = Date.parse(b.modified);
          const older = date_b - date_a;
          console.log(`Comparing ${date_a} to ${date_b}, is older: ${older}`);
          return older;
        });
        console.log('Sorted rules:');
        console.log(rules);

        this.setState({ rules: rules, ready: true });
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
    const { user } = this.props;
    return (
      <ScrollUp>
        <div style={hold}>
          <Grid gridTemplateRows="auto" height="100vh">
            <Box>
              <Grid gridTemplateColumns="500px auto" height="100%">
                <Intro name={user.email} />
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
                            deleteRule={deleteRule}
                            downloadRule={downloadRule}
                            csrfToken={this.props.token}
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
