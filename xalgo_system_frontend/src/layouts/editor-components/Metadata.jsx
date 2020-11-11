import React, { useState } from 'react';
import { Box, GuideLine, FormStandard, Text, FormDropdown } from '../../components';
import { deepCopy, RuleSchema } from 'xalgo-rule-processor';

function Metadata({ rule, updateRule, active }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Metadata';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [url, setUrl] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (url !== rule.metadata.rule.url) setUrl(rule.metadata.rule.url);
  }

  function saveContent() {
    // Remember not to modify the rule prop.
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.metadata.rule.url = url;
    updateRule(newRule);
    setModified(false);
  }

  // 3. Return a rendering of the component.
  return (
    <div onMouseLeave={saveContent}>
      <Box padding={1} />
      <Text>Rule Metadata</Text>
      <Box padding={1} />
      <GuideLine>
        <FormStandard
          name="Full Rule Text URL"
          description={RuleSchema.metadata.rule.__url}
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
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
