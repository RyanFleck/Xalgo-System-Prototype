import React from 'react';
import { Input, Stack, Box, Button, Text, Flex, Modal, Infobox } from '..';
import { IInfo } from '../icons';

function FormSlider({ name, description, labela, labelb, labelc, value, onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Stack gap={4}>
      <Modal isOpen={isOpen}>
        <Infobox content={description} onClick={() => setIsOpen(false)} />
      </Modal>
      <Box padding={1} />
      <Flex alignItems="center">
        <Text>{name}</Text>
        <Button variant="invisible" onClick={() => setIsOpen(true)}>
          <Flex alignItems="flex-bottom" m="4px">
            <IInfo />
          </Flex>
        </Button>
      </Flex>
      <Box padding={1} />
      <Flex justifyContent="space-between">
        <Text color="textb">{labela}</Text>
        <Text color="textb">{labelb}</Text>
        <Text color="textb">{labelc}</Text>
      </Flex>
      <Box padding={1} />
      <Input
        variant="secondary"
        type="range"
        min={(0).toString()}
        max={(99).toString()}
        value={value ? value.toString() : '0'}
        onChange={(x) => {
          console.log(`Value is now ${x.target.value}`);
          onChange(x.target.value);
        }}
        step={1}
      />
    </Stack>
  );
}

export default FormSlider;
