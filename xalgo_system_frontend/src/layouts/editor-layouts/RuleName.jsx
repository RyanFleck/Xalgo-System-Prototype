// libraries
import React from 'react';
import { toast } from 'react-toastify';

// rm-components
import Box from '../../components/layout/Box';
import Text from '../../components/primitives/Text';
import Button from '../../components/primitives/Button';
import Flex from '../../components/layout/Flex';
import InputField from '../../components/patterns/InputField';
import Input from '../../components/primitives/Input';
import Axios from 'axios';

import cookie from 'react-cookies';
import { navigate } from '@reach/router';
import { Link } from '@reach/router';

// style
const inputHold = {
  height: '90vh',
};

const widthHold = {
  width: '80%',
};

// Primary Component
export default class RuleName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      createEnabled: true,
    };

    this.saveAndRedirect = this.saveAndRedirect.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  /**
   * Set the local state from editor state.
   */
  componentDidMount() {
    console.log('All cookies:');
    console.log(cookie.loadAll());
    console.log(document.cookie);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  /**
   * Persist the local state up to editor state.
   */
  saveAndRedirect() {
    if (this.state.name && this.state.description) {
      console.log(`Name: ${this.state.name}\nDesc: ${this.state.description}`);
      console.log(`Got token: ${this.props.token}`);
      Axios.post(
        '/rules/rule/',
        {
          name: this.state.name,
          description: this.state.description,
        },
        {
          headers: {
            'X-CSRFToken': this.props.token,
          },
        }
      )
        .then((res) => {
          if (res.data && res.data.id) {
            const msg = `Created rule with id ${res.data.id}`;
            toast(msg);
            navigate(`/apps/rm/editor/${res.data.id}`);
          } else {
            toast.error('Failed to create rule.');
          }
        })
        .catch((err) => {
          if (err.response && err.response.hasOwnProperty('status')) {
            const status = err.response.status;
            if (status === 403) {
              console.log(`Failed to authenticate user: ${status}`);
              console.log(err.response);
              console.log(err.response);
            } else {
              console.log(`Error while getting user info: ${status}`);
              console.log(err.response);
            }
          }
        });
    } else {
      toast.error('Please enter a valid name and description for the rule.');
    }
  }

  render() {
    return (
      <div style={inputHold}>
        <Flex alignItems="center" justifyContent="center">
          <div style={widthHold}>
            <Text variant="subtitle">Create a New Rule</Text>
            <Box m={1} />
            <Text>
              Use these fields to write or paste the natural language statement of the rule you are
              working on. State in a simple factual way what this rule requires, and what assertions
              it will make.
            </Text>
            <Box m={1} />
            <Text>
              To edit an existing rule, view your <Link to="/apps/rm/dashboard">dashboard</Link>.
            </Text>
            <Box m={2} />
            <Text variant="formtitle">Rule Name</Text>
            <Box m={1} />
            <Input value={this.state.name} onChange={this.handleNameChange} />
            <Box m={2} />
            <Text variant="formtitle">Rule Description</Text>
            <Box m={1} />
            <InputField value={this.state.description} onChange={this.handleDescriptionChange} />
            <Box m={3} />
            <Button
              variant="wide"
              disabled={!this.state.createEnabled}
              onClick={this.saveAndRedirect}
            >
              Create Your New Rule
            </Button>
          </div>
          <div style={inputHold} />
        </Flex>
      </div>
    );
  }
}
