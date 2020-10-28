import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, SubButton, } from '../../components';

function StandardRoleName({ rule, updateRule, active }) {
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
      <SubButton content="Standard Role Name" />
      <Box padding={1} />
      <GuideLine>
        <FormStandard name="ISIC Industry Code" description={RuleSchema.metadata.rule.__description} />
        <Box padding={1} />
        <FormStandard name="ISIC Industry Name" description={RuleSchema.metadata.rule.__description} />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default StandardRoleName;
