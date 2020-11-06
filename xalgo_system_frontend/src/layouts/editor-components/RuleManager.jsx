import React, { useRef, useEffect } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormStandard, IdDisplay, Text, Flex, Icon, Button, InfoRow } from '../../components';

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

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setModal(false);
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

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
                  <Icon name="toggle" fill="text"/>
                </Button>
                {modal ? (
                  <div style={float} ref={wrapperRef}>
                    <div style={dark}>
                      <div>
                        <Button variant="invisible" onClick={() => {
                          setIsOpen(true);
                          setModal(false);
                        }}>
                          <Flex justifyContent="space-between" width="120px">
                            <Text color="#fff">Edit</Text>
                            <Icon name="edit" fill="#fff"/>
                          </Flex>
                        </Button>
                        <Box p={1}/>
                        <Button variant="invisible">
                          <Flex justifyContent="space-between" width="120px">
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
            <InfoRow color="#F9F8F4" label="ID" content="Vqp4nv8eGprI"/>
            <InfoRow color="#fff" label="Name" content="Calvin"/>
            <InfoRow color="#F9F8F4" label="Email" content="hello@calvin.ooo"/>
          </Box>
      )}
    </div>
  );
}

export default RuleManager;
