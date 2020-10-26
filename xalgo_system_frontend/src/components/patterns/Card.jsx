import React from 'react';
import { Text, Flex, Icon, Box, Button } from '..';
import { Link } from '@reach/router';

export default function Card({ name, uuid, editLink, downloadRule, deleteRule }) {
  return (
    <Box p={2} bg="bg" border="1px solid" borderColor="oline" borderRadius="base" marginBottom={3}>
      <Flex alignItems="flex-start">
        <Text>{name || 'Rule Name'}</Text>
      </Flex>
      <Flex alignItems="flex-start">
        <Text color="primary">
          <code>
            <small>{uuid || '0000-0000-0000-0000'}</small>
          </code>
        </Text>
      </Flex>
      <Box padding={1} />
      <Flex justifyContent="space-between">
        <Button
          variant="invisible"
          onClick={() => {
            downloadRule(uuid);
          }}
        >
          <Flex alignItems="center">
            <Icon name="download" />
            <Text color="primary">Download</Text>
          </Flex>
        </Button>
        <Button
          variant="invisible"
          onClick={() => {
            deleteRule(uuid);
          }}
        >
          <Text color="error">Delete</Text>
        </Button>
        <Button variant="invisible">
          <Link to={editLink || ''}>
            <Text color="primary">Edit</Text>
          </Link>
        </Button>
      </Flex>
    </Box>
  );
}
