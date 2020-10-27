import React from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, SubButton, IdDisplay } from '../../components';

function RuleMaintainer() {
  return (
    <div>
      <SubButton content="Rule Maintainer" />
      <Box padding={1} />
      <GuideLine>
        <IdDisplay message="Vqp4nv8eGprI" />
        <Box padding={1} />
        <FormStandard name="Name" description={RuleSchema.metadata.rule.__description} />
        <Box padding={1} />
        <FormStandard name="Email" description={RuleSchema.metadata.rule.__description} />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default RuleMaintainer;
