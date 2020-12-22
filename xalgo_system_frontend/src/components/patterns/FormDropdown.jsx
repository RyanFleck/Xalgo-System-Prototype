import React from 'react';
import { Stack, Dropdown, Box, Button, Text, Flex, Modal, Infobox, IInfo, ErrorMessage } from '..';

function FormDropdown({ name, description, label, value, errormessage, options = [], onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const renderOptions = () => {
    return options.map(({ value, label, disabled }, index) => (
      <option value={value} key={index}>
        {label}
      </option>
    ));
  };

  return (
    <Stack gap={4}>
      <Modal isOpen={isOpen}>
        <Infobox content={description} onClick={() => setIsOpen(false)} />
        <Box padding={1} />
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
      <Dropdown value={value} onChange={onChange} placeholder={""}>
        {renderOptions()}
        <option value="" disabled hidden>Select</option>
      </Dropdown>

      {errormessage ? (
        <div>
          <Box padding={1} />
          <ErrorMessage message={errormessage} />
        </div>
      ) : (
        <Modal />
      )}
    </Stack>
  );
}

export default FormDropdown;
