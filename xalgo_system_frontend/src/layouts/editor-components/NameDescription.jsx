import React, { useState } from 'react';
import { Box, FormStandard, Text } from '../../components';
import { deepCopy, RuleSchema } from 'xalgo-rule-processor';

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

  function saveContent() {
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.metadata.rule.title = title;
    newRule.metadata.rule.description = desc;
    updateRule(newRule);
    setModified(false);
  }

  // 3. Return a rendering of the component.
  return (
    <div onMouseLeave={saveContent}>
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Name & Description</Text>
        <Box padding={1} />
          <FormStandard
            name="Rule Name"
            description={RuleSchema.metadata.rule.__title}
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
            longInput
          />
          {/*
          <Box padding={1} />
          <Text>
            <b>Rule UUID:</b> {rule.path}
          </Text>
          <Text>
            <b>Public Link:</b>
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`https://xalgo-system.herokuapp.com/rule/${rule.path}`}
            >{`https://xalgo-system.herokuapp.com/rule/${rule.path}`}</a>
          </Text>
          */}
      </Box>
    </div>
  );
}

export default NameDescription;
