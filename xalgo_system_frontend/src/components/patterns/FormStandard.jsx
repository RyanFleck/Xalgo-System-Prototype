import React from 'react';
import {
  Input,
  Stack,
  Box,
  Button,
  Text,
  Flex,
  Modal,
  Infobox,
  IInfo,
  ErrorMessage,
  InputField,
} from '..';

function FormStandard({
  name,
  description,
  value,
  onChange,
  onBlur,
  placeholder,
  errormessage,
  longInput = false,
  type = 'text',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Stack gap={4}>
      <Modal isOpen={isOpen}>
        <div>
          <Infobox content={description} onClick={() => setIsOpen(false)} />
          <Box p={1} />
        </div>
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
      {!longInput ? (
        <div>
          {errormessage ? (
            <Input
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              variant="error"
              type={type}
            />
          ) : (
            <Input
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              type={type}
              disabled={disabled}
            />
          )}
          {errormessage ? <ErrorMessage message={errormessage} /> : null}
        </div>
      ) : (
        <div>
          {errormessage ? (
            <InputField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              variant="error"
              type={type}
              disabled={disabled}
            />
          ) : (
            <InputField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              type={type}
            />
          )}
          {errormessage ? <ErrorMessage message={errormessage} /> : null}
        </div>
      )}
    </Stack>
  );
}

export default FormStandard;
