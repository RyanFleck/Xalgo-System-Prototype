import React, { useState } from 'react';
// import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormDropdown, Text } from '../../components';

function OutputPurpose({ rule, updateRule, active, section, }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Information';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (title !== rule.metadata.rule.title) setTitle(rule.metadata.rule.title);
    if (desc !== rule.metadata.rule.description) setDesc(rule.metadata.rule.description);
  }

  // 3. Return a rendering of the component.
  return (
    <div>
      <Box padding={1} />
      <Text>Purpose</Text>
      <Box padding={1} />
      <GuideLine>
        <FormDropdown
          name="Who has responsibility for conformance?"
          description="Who has responsibility for conformance?"
          options={[
            { value: 'rule-maker', label: 'rule-maker' },
            { value: 'rule-taker', label: 'rule-taker' },
            { value: 'third-party', label: 'third-party' },
          ]}
        />
        <Box padding={1} />
        <FormDropdown
          name="What is the primary verb?"
          description="What is the primary normative (deontic; modal) verb?"
          options={[
            { value: 'must', label: 'must' },
            { value: 'may', label: 'may' },
            { value: 'should', label: 'should' },
          ]}
        />
        <Box padding={1} />
        <FormDropdown
          name="What is the nature of the primary verb"
          description="Is the primary modal verb stated in the affirmative; negative or as a question?"
          options={[
            { value: 'affirmative', label: 'affirmative' },
            { value: 'negative', label: 'negative' },
            { value: 'interrogative', label: 'interrogative' },
          ]}
        />
        <Box padding={1} />
        <FormDropdown
          name="What is the primary action verb?"
          description="What is the primary action verb?"
          options={[
            { value: 'be', label: 'be' },
            { value: 'do', label: 'do' },
            { value: 'have', label: 'have' },
          ]}
        />
        <Box padding={1} />
        <FormDropdown
          name="What is the type of philosophical rationale?"
          description="What is the principal type of philosophical rationale for this rule?"
          options={[
            { value: 'logical', label: 'logical' },
            { value: 'practical', label: 'practical' },
            { value: 'ethical', label: 'ethical' },
          ]}
        />
        <Box padding={1} />
        <FormDropdown
          name="What is the nature of this rule?"
          description="Is this a directly implemented rule, a desription of a rule to be conformed with, or an empirical
            fact about a rule?"
          options={[
            { value: 'imperative', label: 'imperative' },
            { value: 'declarative', label: 'declarative' },
            { value: 'empirical', label: 'empirical' },
          ]}
        />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default OutputPurpose;