import React from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, SubButton, IdDisplay } from '../../components';

function RuleManager() {
  return (
    <div>
      <SubButton content="Rule Manager" />
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

export default RuleManager;
