import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormStandard, Text } from '../../components';

function StandardRoleName({ rule, updateRule, active }) {
    // 0. Fill out the section name.
  const sectionName = 'Involved Product or Service';
  //const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, /*setModified*/] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (code !== rule.input_filters.involved_product_service[0].unspsc_code) setCode(rule.input_filters.involved_product_service[0].unspsc_code);
    if (name !== rule.input_filters.involved_product_service[0].unspsc_name) setName(rule.input_filters.involved_product_service[0].unspsc_name);
  }

  /*
  function saveContent() {
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.input_filters.involved_product_service[0].unspsc_code = code;
    newRule.input_filters.involved_product_service[0].unspsc_name = name;
    updateRule(newRule);
    setModified(false);
  }
  */

  // 3. Return a rendering of the component.
  return (
    <div /*onMouseLeave={saveContent}*/>
      <Box border="1px solid" borderColor="oline" borderRadius="base" p={3} bg="#fff">
        <Text variant="formtitle">Involved Product or Service</Text>
        <Box padding={1} />
        <FormStandard
          name="UNSPSC Product or Service Code"
          description={RuleSchema.input_filters.involved_product_service[0].__nspsc_code}
        />
        <Box padding={1} />
        <FormStandard
          name="UNSPSC Product or Service Name"
          description={RuleSchema.input_filters.involved_product_service[0].__unspsc_name}
        />
      </Box>
    </div>
  );
}

export default StandardRoleName;
