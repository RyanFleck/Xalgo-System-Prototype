// libraries
import React from 'react';
import { toast } from 'react-toastify';

// rm-components
import Box from '../../components/layout/Box';
import Grid from '../../components/layout/Grid';
import Text from '../../components/primitives/Text';
import Button from '../../components/primitives/Button';
import Flex from '../../components/layout/Flex';
import InputField from '../../components/patterns/InputField';
import Input from '../../components/primitives/Input';
import Axios from 'axios';

import { navigate } from '@reach/router';
import { generateNewRule } from 'xalgo-rule-processor/dist/rule';

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
    };

    this.saveAndRedirect = this.saveAndRedirect.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  /**
   * Set the local state from editor state.
   */
  componentDidMount() {
    this.setNameAndDescFromProps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rule !== this.props.rule) {
      this.setNameAndDescFromProps();
    }
  }

  setNameAndDescFromProps() {
    //const { ruleName, ruleDescription } = this.props.rule.metadata;
    const ruleName = 'Rule Name';
    const ruleDescription = 'test';

    if (ruleName && ruleDescription) {
      console.log(
        `RuleName.jsx: Loading rule info from props:\nTitle: ${ruleName}\nDescription: ${ruleDescription}`
      );
    } else {
      console.log('RuleName.jsx: Name and description props delivered empty.');
    }
    this.setState({
      name: ruleName,
      description: ruleDescription,
    });
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
      ).then((res) => {
        if (res.data && res.data.id) {
          const msg = `Created rule with id ${res.data.id}`;
          console.log(res.data);
          const body = generateNewRule();
          body.metadata.rule.title = this.state.name;
          body.metadata.rule.description = this.state.description;
          body.metadata.rule.version = res.data.primary_content;
          body.path = res.data.id;
          toast(msg);
          Axios.patch(
            `/rules/content/${res.data.primary_content}/`,
            {
              body: body,
            },
            {
              headers: {
                'X-CSRFToken': this.props.token,
              },
            }
          ).then((res) => {
            if (res.data && res.data.id) {
              const msg = `Created rule content version with id ${res.data.id}`;
              console.log(res.data);
              toast(msg);
              navigate(`/apps/rm/editor/${res.data.id}`);
            } else {
              toast.error('Failed to create rule content.');
            }
          });
        } else {
          toast.error('Failed to create rule.');
        }
      });
    } else {
      toast.error('Please enter a valid name and description for the rule.');
    }
  }

  render() {
    return (
      <Grid gridTemplateColumns="50% 50%">
        <div style={inputHold}>
          <Flex alignItems="center" justifyContent="center">
            <div style={widthHold}>
              <Text variant="subtitle">Every rule begins with plain language sentences. </Text>
              <Box m={1} />
              <Text>
                Use this field to write or paste the natural language statement of the rule you are
                working on. State in a simple factual way what this rule requires, and what
                assertions it will make.
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
              <Button variant="wide" onClick={this.saveAndRedirect}>
                Start
              </Button>
            </div>
            <div style={inputHold} />
          </Flex>
        </div>
        <Box borderLeft="1px solid #efefef" />
      </Grid>
    );
  }
}
