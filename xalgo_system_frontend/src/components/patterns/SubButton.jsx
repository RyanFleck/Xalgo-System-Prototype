import React from 'react';
import { Flex, Button, Text, Box, Icon } from '..';

export default function Subbutton(props) {
  const { onClick, content } = props;
  return (
    <div>
      <Box padding={1} />
      <Button variant="invisiblewide" onClick={onClick}>
        <Flex alignItems="end" justifyContent="flex-start">
          <Text color="text">{content || 'New Field'}</Text>
          <Box padding={1} />
          <Icon name="ex" fill="#ED9C91"/>
        </Flex>
      </Button>
      <Box padding={1} />
    </div>
  );
}
