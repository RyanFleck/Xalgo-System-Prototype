import React, { useState } from 'react';
import { deepCopy, RuleSchema } from 'xalgo-rule-processor';
import { Box, FormDropdown, Text } from '../../components';

function OutputPurpose({ rule, updateRule, active, section }) {
  // 0. Fill out the section name.
  const sectionName = 'Output Purpose';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [modalVerb, setModalVerb] = useState('');
  const [actionVerb, setActionVerb] = useState('');
  const [implementation, setImplementation] = useState('');
  const [normativeVerb, setNormativeVerb] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [philosophicalRationale, setPhilosophicalRationale] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);
    console.log(`${sectionName} section is being edited.`);
    console.log(`${sectionName} section is being edited.`);
    console.log(`${sectionName} section is being edited.`);
    // 2. Ensure each field is set according to the current rule state.
    if (modalVerb !== rule.output_purpose.modal_verb) {
      console.log('Updating modal verb...');
      setModalVerb(rule.output_purpose.modal_verb);
    }
    if (actionVerb !== rule.output_purpose.action_verb) {
      setActionVerb(rule.output_purpose.action_verb);
    }
    if (implementation !== rule.output_purpose.implementation) {
      setImplementation(rule.output_purpose.implementation);
    }
    if (normativeVerb !== rule.output_purpose.normative_verb) {
      setNormativeVerb(rule.output_purpose.normative_verb);
    }
    if (responsibility !== rule.output_purpose.responsibility) {
      setResponsibility(rule.output_purpose.responsibility);
    }
    if (philosophicalRationale !== rule.output_purpose.philosophicalRationale) {
      setPhilosophicalRationale(rule.output_purpose.philosophicalRationale);
    }
  }

  function saveContent() {
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.output_purpose.modal_verb = modalVerb;
    newRule.output_purpose.action_verb = actionVerb;
    newRule.output_purpose.implementation = implementation;
    newRule.output_purpose.normative_verb = normativeVerb;
    newRule.output_purpose.responsibility = responsibility;
    newRule.output_purpose.philosophical_rationale = philosophicalRationale;
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
          value={responsibility}
          onChange={(e) => {
            setResponsibility(e.target.value);
            setModified(true);
          }}
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
          value={normativeVerb}
          onChange={(e) => {
            setNormativeVerb(e.target.value);
            setModified(true);
          }}
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
          value={modalVerb}
          onChange={(e) => {
            setModalVerb(e.target.value);
            setModified(true);
          }}
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
          value={philosophicalRationale}
          onChange={(e) => {
            setPhilosophicalRationale(e.target.value);
            setModified(true);
          }}
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
          value={implementation}
          onChange={(e) => {
            setImplementation(e.target.value);
            setModified(true);
          }}
        />
      </Box>
    </div>
  );
}

export default OutputPurpose;
