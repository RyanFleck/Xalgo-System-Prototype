import React, { useState } from 'react';
//import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormSlider, FormDropdown, Text } from '../../components';
import {
  deepCopy,
  //RuleSchema
} from 'xalgo-rule-processor';

function QualitativeWeights({ rule, updateRule, active, section }) {
  // 0. Fill out the section name.
  const sectionName = 'Qualitative Weights';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  // const [title, setTitle] = useState('');

  const [ruleGroup, setRuleGroup] = useState('');
  const [character, setCharacter] = useState(0);
  const [enforcement, setEnforcement] = useState(0);
  const [consequences, setConsequences] = useState(0);

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    // if (title !== rule.metadata.rule.title) setTitle(rule.metadata.rule.title);
    if (ruleGroup !== rule.output_weight.rule_group) {
      setRuleGroup(rule.output_weight.rule_group);
    }
    if (character !== rule.output_weight.character_of_obligation) {
      setCharacter(rule.output_weight.character_of_obligation);
    }
    if (enforcement !== rule.output_weight.enforcement_measures) {
      setEnforcement(rule.output_weight.enforcement_measures);
    }
    if (consequences !== rule.output_weight.consequences) {
      setConsequences(rule.output_weight.consequences);
    }
  }

  function saveContent() {
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    // rule.metadata.rule.title = title;
    console.log(
      `Saving weights => group: ${ruleGroup} character: ${character} enforcement: ${enforcement} consequences: ${consequences}`
    );
    newRule.output_weight.rule_group = ruleGroup;
    newRule.output_weight.character_of_obligation = character;
    newRule.output_weight.enforcement_measures = enforcement;
    newRule.output_weight.consequences = consequences;
    updateRule(newRule);
    setModified(false);
  }

  // 3. Return a rendering of the component.
  return (
    <div onMouseLeave={saveContent}>
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Qualitative Weights</Text>
        <Box padding={1} />
        <FormDropdown
          name="Select the rule group that most applies."
          description="hello world is asking the following things"
          options={[
            {
              value: 'Informal Custom or Preference',
              label: 'Informal Custom or Preference',
            },
            { value: 'Operational Pattern', label: 'Operational Pattern' },
            {
              value: 'Formal Custom Without Legal Standing',
              label: 'Formal Custom Without Legal Standing',
            },
            {
              value: 'Guideline, Instruction, or Policy',
              label: 'Guideline, Instruction, or Policy',
            },
            { value: 'Code of Conduct', label: 'Code of Conduct' },
            { value: 'Regulation or Directive', label: 'Regulation or Directive' },
            { value: 'Common Law or Case Law', label: 'Common Law or Case Law' },
            { value: 'Statute or Legislation', label: 'Statute or Legislation' },
            { value: 'International Law', label: 'International Law' },
          ]}
          value={ruleGroup}
          onChange={(e) => {
            setModified(true);
            console.log(`Setting rule group to ${e.target.value}`);
            console.log(e);
            setRuleGroup(e.target.value);
          }}
        />
        <Box padding={2} />
        <FormSlider
          name="Character of this Obligation"
          description="lorem ipsum"
          labela="Basic Coherence"
          labelb="Strongly Beneficial"
          labelc="Absolutely Essential"
          value={character}
          onChange={(e) => {
            setModified(true);
            setCharacter(parseInt(e));
          }}
        />
        <Box padding={2} />
        <FormSlider
          name="Enforcement Measures in Place"
          description="lorem ipsum"
          labela="Minor Penalties"
          labelb="Significant Penalties"
          labelc="Major Penalties"
          value={enforcement}
          onChange={(e) => {
            setModified(true);
            setEnforcement(parseInt(e));
          }}
        />
        <Box padding={2} />
        <FormSlider
          name="Consequences of Non-Conformance "
          description="lorem ipsum"
          labela="Preference Only"
          labelb="Significant Effects"
          labelc="Enormous Impacts"
          value={consequences}
          onChange={(e) => {
            setModified(true);
            setConsequences(parseInt(e));
          }}
        />
      </Box>
    </div>
  );
}

export default QualitativeWeights;
