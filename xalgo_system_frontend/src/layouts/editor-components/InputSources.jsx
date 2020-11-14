import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormStandard, FormDropdown, Text } from '../../components';

function InputSources({ rule, updateRule, active }) {
    // 0. Fill out the section name.
  const sectionName = 'Rule Information';
  //const sectionDesc = 'Begin your rule by providing a title and concise description.';
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
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Input Source</Text>
        <Box padding={1} />
        <FormDropdown
          name="Document Type"
          description="Not in Schema"
          options={[
            { value: 'is.xalgo', label: 'is.xalgo' },
            { value: 'lookup.xalgo', label: 'lookup.xalgo' }
          ]}
        />
        <Box padding={1} />
        <FormStandard name="Unique Identifier" description={RuleSchema.metadata.rule.__description} />
      </Box>
    </div>
  );
}

export default InputSources;
