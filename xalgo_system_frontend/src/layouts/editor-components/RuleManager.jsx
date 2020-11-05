import React from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormStandard, IdDisplay, Text, Flex, Icon, Button } from '../../components';

function RuleManager() {

  const [isOpen, setIsOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  const float = {
    position: 'absolute',
    marginTop: '-24px',
  };

  const dark = {
    background: '#1E2033',
    borderRadius: '8px',
    border: '1px solid #E7E7E7',
    boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
    padding: '1em',
  };

  return (
    <div>
      {isOpen ? (
          <Box padding={3} border="1px solid" borderColor="oline" borderRadius="base">
            <Flex justifyContent="space-between">
              <Text variant="formtitle">Rule Manager</Text>
              <Button variant="invisible" onClick={() => setIsOpen(false)}>
                <Icon name="ex" fill="text"/>
              </Button>
            </Flex>
            <Box padding={1} />
            <IdDisplay message="Vqp4nv8eGprI" />
            <Box padding={1} />
            <FormStandard name="Name" description={RuleSchema.metadata.rule.__description} />
            <Box padding={1} />
            <FormStandard name="Email" description={RuleSchema.metadata.rule.__description} />
            <Box padding={1} />
            <Button variant="blue" onClick={() => setIsOpen(false)}>Save</Button>
          </Box>
      ) : (
          <Box padding={3} border="1px solid" borderColor="oline" borderRadius="base">
            <Flex justifyContent="space-between">
              <Text variant="formtitle">Rule Manager</Text>
              <div>
                <Button variant="invisible" onClick={() => setModal(true)}>
                  <Icon name="info" fill="text"/>
                </Button>
                {modal ? (
                  <div style={float}>
                    <div style={dark}>
                      <div>
                        <Button variant="invisible" onClick={() => setIsOpen(true)}>
                          <Flex justifyContent="space-between">
                            <Text color="#fff">Edit</Text>
                            <Icon name="edit" fill="#fff"/>
                          </Flex>
                        </Button>
                        <Box p={1}/>
                        <Button variant="invisible">
                          <Flex justifyContent="space-between">
                            <Text color="error">Delete</Text>
                            <Box p={1}/>
                            <Icon name="trash" fill="#ED9C91"/>
                          </Flex>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </Flex>
            <Box padding={1} />
            <Text>test</Text>
            <Box padding={1} />
            <Text>test</Text>
          </Box>
      )}
    </div>
  );
}

export default RuleManager;
