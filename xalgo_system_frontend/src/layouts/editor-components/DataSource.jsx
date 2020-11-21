import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormStandard, Text } from '../../components';

function DataSource({ rule, updateRule, active }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Maintainer';
  //const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [country, setCountry] = useState('');
  const [subCountry, setSubCountry] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (country !== rule.input_context.jurisdiction[0].country) setCountry(rule.input_context.jurisdiction[0].country);
    if (subCountry !== rule.input_context.jurisdiction[0].subcountry) setSubCountry(rule.input_context.jurisdiction[0].subcountry);
  }


  function saveContent() {
    console.log(`Saving ${sectionName} to state.`);
    rule.input_context.jurisdiction[0].country = country;
    rule.input_context.jurisdiction[0].subcountry = subCountry;
    updateRule(rule);
    setModified(false);
  }

  return (
    <div onMouseLeave={saveContent}>
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Jurisdiction</Text>
        <Box p={1} />
        <FormStandard
          name="Country Jurisdiction"
          description={RuleSchema.input_context.jurisdiction[0].__country}
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setModified(true);
          }}
        />
        <Box padding={1} />
        <FormStandard name="Sub-country Jurisdiction"
          description={RuleSchema.input_context.jurisdiction[0].__subcountry}
          value={subCountry}
          onChange={(e) => {
            setSubCountry(e.target.value);
            setModified(true);
          }}
        />

      </Box>
    </div>
  );
}

export default DataSource;
