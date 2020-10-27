import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, Text, FormDropdown } from '../../components';

function Metadata({ rule, updateRule, active }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Information';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

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
      <Text>Rule Metadata</Text>
      <Box padding={1} />
      <GuideLine>
        <FormStandard
          name="Rule URL"
          description={RuleSchema.metadata.rule.__description}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setModified(true);
          }}
        />
        <Box padding={1} />
        <FormStandard
          name="Rule Version"
          placeholder="1.0"
          description={RuleSchema.metadata.rule.__description}
        />
        <Box padding={1} />
        <FormDropdown
          name="Xalgo Version"
          description="hello world is asking the following things"
          options={[{ value: '1.0', label: '1.0' }]}
        />
        <Box padding={1} />
        <FormDropdown
          name="Rule Criticality"
          description="hello world is asking the following things"
          options={[{ value: 'Experimental', label: 'Experimental' }]}
        />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default Metadata;
