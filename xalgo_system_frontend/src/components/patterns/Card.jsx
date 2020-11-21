import React from 'react';
import { Text, Flex, Icon, Box, Button } from '..';
import { Link } from '@reach/router';

export default function Card({ name, uuid, editLink, downloadRule, deleteRule, csrfToken }) {
  return (
    <Box p={2} bg="bg" border="1px solid" borderColor="oline" borderRadius="base" marginBottom={3}>
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Flex>
          <Text>{name || 'Rule Name'}</Text>
          <Box p={2} />
          <Text color="textb">
            <code>
              <small>{uuid || '0000-0000-0000-0000'}</small>
            </code>
          </Text>
        </Flex>
        <Button
          variant="invisible"
          onClick={() => {
            deleteRule(uuid, csrfToken);
          }}
        >
          <Flex alignItems="center">
            <Icon name="trash" fill="#ED9C91" size={14} />
            <Text color="error">Delete</Text>
          </Flex>
        </Button>
      </Flex>
      <Box padding={1} />
      <Flex>
        <Button
          variant="invisible"
          onClick={() => {
            downloadRule(uuid, csrfToken);
          }}
        >
          <Flex alignItems="center">
            <Icon name="download" size={14} />
            <Text color="primary">Download</Text>
          </Flex>
        </Button>
        <Box p={2} />
        <Button variant="invisible">
          <Link to={editLink || ''}>
            <Flex alignItems="center">
              <Icon name="edit" size={14} />
              <Text color="primary">Edit</Text>
            </Flex>
          </Link>
        </Button>
      </Flex>
    </Box>
  );
}
