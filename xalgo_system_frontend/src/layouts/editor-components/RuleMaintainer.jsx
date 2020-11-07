import React, { useRef, useEffect, useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, FormStandard, IdDisplay, Text, Flex, Icon, Button, InfoRow } from '../../components';

function RuleMaintainer({ rule, updateRule, active }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Maintainer';
  //const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified, setModified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (name !== rule.metadata.rule.maintainers[0].name) setName(rule.metadata.rule.maintainers[0].name);
    if (email !== rule.metadata.rule.maintainers[0].email) setEmail(rule.metadata.rule.maintainers[0].email);
  }

  
  function saveContent() {
    console.log(`Saving ${sectionName} to state.`);
    rule.metadata.rule.maintainers[0].name = name;
    rule.metadata.rule.maintainers[0].email = email;
    updateRule(rule);
    setModified(false);
  }

  //controls the modal toggle
  const [isOpen, setIsOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);


  //styling
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

  //closes modal on click outside
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
              <Text variant="formtitle">Rule Maintainer</Text>
              <Button variant="invisible" onClick={() => setIsOpen(false)}>
                <Icon name="ex" fill="text"/>
              </Button>
            </Flex>
            <Box padding={1} />
            <IdDisplay message="Vqp4nv8eGprI" />
            <Box padding={1} />
            <FormStandard 
              name="Name" 
              description={RuleSchema.metadata.rule.maintainers[0].__name}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setModified(true);
              }} 
            />
            <Box padding={1} />
            <FormStandard name="Email" 
              description={RuleSchema.metadata.rule.maintainers[0].__email}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setModified(true);
              }}  
            />
            <Box padding={1} />
            <Button variant="blue" onClick={() => {
                saveContent();
                setIsOpen(false);
            }}>Save</Button>
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
            <InfoRow color="#fff" label="Name" content={name}/>
            <InfoRow color="#F9F8F4" label="Email" content={email}/>
          </Box>
      )}
    </div>
  );
}

export default RuleMaintainer;
