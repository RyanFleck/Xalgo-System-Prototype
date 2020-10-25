import React from 'react';
import { Flex, Button, Text, Box, Icon } from '..';

export default function Addbutton(props) {
  const { onClick, content } = props;
  return (
    <Button variant="invisiblewide" onClick={onClick}>
      <Flex alignItems="center" justifyContent="flex-start">
        <Icon name="add" fill="#A3D8BE"/>
        <Box padding={1} />
        <Text color="textb">{content || 'New Field'}</Text>
      </Flex>
    </Button>
  );
}
