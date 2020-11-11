import React from 'react';
import { Flex, Button, Text, Box, Icon } from '..';

export default function Addbutton(props) {
  const { onClick, content } = props;
  return (
    <div>
      <Box padding={1} />
      <Button variant="invisiblewide" onClick={onClick}>
        <Flex alignItems="center" justifyContent="flex-start">
          <Text color="text">{content || 'New Field'}</Text>
          <Box padding={1} />
          <Icon name="add" fill="#A3D8BE"/>
        </Flex>
      </Button>
      <Box padding={1} />
    </div>
  );
}
