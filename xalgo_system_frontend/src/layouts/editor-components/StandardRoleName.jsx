import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, SubButton, } from '../../components';

function StandardRoleName({ rule, updateRule, active }) {
    // 0. Fill out the section name.
  const sectionName = 'Standard Role Name';
  //const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (code !== rule.input_filters.standard_role_name[0].isic_industry_code) setCode(rule.input_filters.standard_role_name[0].isic_industry_code);
    if (name !== rule.input_filters.standard_role_name[0].isic_industry_name) setName(rule.input_filters.standard_role_name[0].isic_industry_name);
  }

  /*
  function saveContent() {
    const newRule = deepCopy(rule);
    console.log(`Saving ${sectionName} to state.`);
    newRule.input_filters.standard_role_name[0].isic_industry_code = code;
    newRule.input_filters.standard_role_name[0].isic_industry_name = name;
    updateRule(newRule);
    setModified(false);
  }
  */

  // 3. Return a rendering of the component.
  return (
    <div /*onMouseLeave={saveContent}*/>
      <SubButton content="Standard Role Name" />
      <Box padding={1} />
      <GuideLine>
        <FormStandard 
          name="ISIC Industry Code" 
          description={RuleSchema.input_filters.standard_role_name[0].__isic_industry_code}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setModified(true);
          }} 
        />
        <Box padding={1} />
        <FormStandard 
          name="ISIC Industry Name" 
          description={RuleSchema.input_filters.standard_role_name[0].__isic_industry_name}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setModified(true);
          }} 
        />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default StandardRoleName;
