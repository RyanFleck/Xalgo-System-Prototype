import React from 'react';
import { Text, Flex, Icon, Box } from '..';

function ErrorMessage({ message }) {
  return (
    <div>
      <Box padding={1} />
      <Flex alignItems="center">
        <Icon name="exclaim" fill="#ED9C91" />
        <Text variant="error">{message}</Text>
      </Flex>
    </div>
  );
}

export default ErrorMessage;
