import React from 'react';
import { Flex, Button, Text, Box, Icon } from '..';

export default function Subbutton(props) {
  const { onClick, content } = props;
  return (
    <Button variant="invisiblewide" onClick={onClick}>
      <Flex alignItems="end" justifyContent="flex-start">
        <Icon name="ex" fill="#ED9C91"/>
        <Box padding={1} />
        <Text color="textb">{content || 'New Field'}</Text>
      </Flex>
    </Button>
  );
}
