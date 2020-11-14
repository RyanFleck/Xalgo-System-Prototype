import React, { useState } from 'react';
import { Box, FormStandard, Text, FormDropdown } from '../../components';
import { deepCopy, RuleSchema } from 'xalgo-rule-processor';

function Metadata({ rule, updateRule, active }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Metadata';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [url, setUrl] = useState('');
  const [version, setVersion] =  useState('');
  const [criticality, setCriticality] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (url !== rule.metadata.rule.url) setUrl(rule.metadata.rule.url);
    if (version !== rule.metadata.rule.version) setVersion(rule.metadata.rule.version);
    if (criticality !== rule.metadata.rule.criticality) setCriticality(rule.metadata.rule.criticality);

  }

  function saveContent() {
    // Remember not to modify the rule prop.
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.metadata.rule.url = url;
    newRule.metadata.rule.version = version;
    newRule.metadata.rule.criticality = criticality;
    updateRule(newRule);
    setModified(false);
  }

  // 3. Return a rendering of the component.
  return (
    <div onMouseLeave={saveContent}>
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Rule Metadata</Text>
        <Box padding={1} />
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
            description={RuleSchema.metadata.rule.__version}
            value={version}
            onChange={(e) => {
              setVersion(e.target.value);
              setModified(true);
            }}
          />
          <Box padding={1} />
          <FormDropdown
            name="Xalgo Version"
            description="Not in Schema"
            options={[{ value: '1.0', label: '1.0' }]}
          />
          <Box padding={1} />
          <FormDropdown
            name="Rule Criticality"
            description={RuleSchema.metadata.rule.__criticality}
            options={[
              { value: 'Experimental', label: 'Experimental' }
            ]}
            value={criticality}
            onChange={(e) => {
              setCriticality(e.target.value);
              setModified(true);
            }}
          />
      </Box>
    </div>
  );
}

export default Metadata;
