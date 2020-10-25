import React from 'react';
import { Text, Flex, Icon, Box } from '..';

function IdDisplay({ message }) {
  return (
    <div>
      <Flex alignItems="center">
        <Text color='textb'>ID</Text>
        <Box padding={1} />
        <Text color='textb'>{message}</Text>
        <Icon name="copy" fill="#696969" />
      </Flex>
    </div>
  );
}

export default IdDisplay;
