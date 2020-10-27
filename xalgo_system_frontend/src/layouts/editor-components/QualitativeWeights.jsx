import React, { useState } from 'react';
//import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormSlider, FormDropdown, Text } from '../../components';

function QualitativeWeights({ rule, updateRule, active, section }) {
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
      <Text>Section Name</Text>
      <Box padding={1} />
      <GuideLine>
        <FormDropdown
          name="Select the rule group that most applies."
          description="hello world is asking the following things"
          options={[
            {
              value: 'Informal Custom or Preference',
              label: 'Informal Custom or Preference',
            },
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
            { value: 'Operational Patern', label: 'Operational Patern' },
          ]}
        />
        <Box padding={2} />
        <FormSlider
          name="Character of this Obligation"
          description="lorem ipsum"
          labela="Basic Coherence"
          labelb="Strongly Beneficial"
          labelc="Absolutely Essential"
        />
        <Box padding={2} />
        <FormSlider
          name="Enforcement Measures in Place"
          description="lorem ipsum"
          labela="Minor Penalties"
          labelb="Significant Penalties"
          labelc="Major Penalties"
        />
        <Box padding={2} />
        <FormSlider
          name="Consequences of Non-Conformance "
          description="lorem ipsum"
          labela="Preference Only"
          labelb="Significant Effects"
          labelc="Enormous Impacts"
        />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default QualitativeWeights;
