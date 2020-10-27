import React from 'react';
import { Input, Stack, Box, Button, Text, Flex, Modal, Infobox, IInfo, ErrorMessage } from '..';

function FormStandard({
  name,
  description,
  value,
  onChange,
  onBlur,
  placeholder,
  errormessage,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Stack gap={4}>
      <Modal isOpen={isOpen}>
        <Infobox content={description} onClick={() => setIsOpen(false)} />
      </Modal>
      <Flex alignItems="center">
        <Text color="textb">{name}</Text>
        <Button variant="invisible" onClick={() => setIsOpen(true)}>
          <Flex alignItems="flex-bottom" m="4px">
            <IInfo />
          </Flex>
        </Button>
      </Flex>
      <Box padding={1} />
      {errormessage
        ?
          <Input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          variant='error'
          />
        :
          <Input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          />
      }
      {errormessage ? <ErrorMessage message={errormessage}/> : <Modal/>}
    </Stack>
  );
}

export default FormStandard;
