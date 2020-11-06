import React from 'react';
import { Flex, Button, Text, Box, Icon } from '..';

export default function Addbutton(props) {
  const { onClick, content } = props;
  return (
    <div>
      <Box padding={1} />
      <Button variant="invisiblewide" onClick={onClick}>
        <Flex alignItems="center" justifyContent="flex-start">
          <Icon name="add" fill="#A3D8BE"/>
          <Box padding={1} />
          <Text variant="formtitle" color="text">{content || 'New Field'}</Text>
        </Flex>
      </Button>
      <Box padding={1} />
    </div>
  );
}
