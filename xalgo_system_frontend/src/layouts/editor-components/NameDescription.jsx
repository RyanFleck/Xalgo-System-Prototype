import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, Text } from '../../components';

function NameDescription({ rule, updateRule, active }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Information';
  //const sectionDesc = 'Begin your rule by providing a title and concise description.';
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
      <Text>Name & Description</Text>
      <Box padding={1} />
      <GuideLine>
        <FormStandard
          name="Rule Name"
          description={RuleSchema.metadata.rule.__description}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setModified(true);
          }}
        />
        <Box padding={1} />
        <FormStandard
          name="Rule Description"
          description={RuleSchema.metadata.rule.__description}
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
            setModified(true);
          }}
        />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default NameDescription;
