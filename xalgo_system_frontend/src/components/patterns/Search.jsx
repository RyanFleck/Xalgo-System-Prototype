import React from 'react';
import { Input, Flex, Icon, Box, Button } from '..';

function Search() {
  return (
    <Box m={0} width={1} bg="bg">
      <Flex justifyContent="space-between" alignItems="center">
        <Button variant="invisible">
          <Flex alignItems="center" marginTop="4px">
            <Icon name="search" fill="#000" />
          </Flex>
        </Button>
        <Input variant="search" type="text" m={2} />
      </Flex>
    </Box>
  );
}

export default Search;
