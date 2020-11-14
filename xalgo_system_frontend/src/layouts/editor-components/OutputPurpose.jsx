import React, { useState } from 'react';
import { deepCopy, RuleSchema } from 'xalgo-rule-processor';
import { Box, FormDropdown, Text } from '../../components';

function OutputPurpose({ rule, updateRule, active, section, }) {
  // 0. Fill out the section name.
  const sectionName = 'Output Purpose';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  /*
  const [conformance, setConformance] = useState('');
  const [primaryVerb, setPrimaryVerb] = useState('');
  */
  const [actionVerb, setActionVerb] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (actionVerb !== rule.output_purpose.action_verb) setActionVerb(rule.output_purpose.action_verb);
  }

  function saveContent() {
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.output_purpose.action_verb = actionVerb;
    updateRule(newRule);
    setModified(false);
  }

  // 3. Return a rendering of the component.
  return (
    <div onMouseLeave={saveContent}>
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Purpose</Text>
        <Box padding={1} />
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
          description={RuleSchema.output_purpose.__action_verb}
          options={[
            { value: 'be', label: 'be' },
            { value: 'do', label: 'do' },
            { value: 'have', label: 'have' },
          ]}
          value={actionVerb}
          onChange={(e) => {
            setActionVerb(e.target.value);
            setModified(true);
          }} 
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
      </Box>
    </div>
  );
}

export default OutputPurpose;
