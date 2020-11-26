import React from 'react';
import { deepCopy } from 'xalgo-rule-processor';
import { isArray } from 'xalgo-rule-processor/dist/types';
import { toast } from 'react-toastify';

import { Text, Box, Flex, Button, Icon, Badge } from '..';

const ruleLeft = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
  alignSelf: 'stretch',
  borderBottom: '1px solid #E7E7E7',
};

const halfWidth = {
  minWidth: '500px',
  maxWidth: '500px',
  paddingTop: '1em',
  paddingBottom: '1em',
  borderBottom: '1px solid #E7E7E7',
};

const center = {
  alignSelf: 'center',
  width: '126px',
};

const standard = {
  width: '0px',
  height: '45px',
};

//row collapsed

function rotateValue(tfb, inputCondition = true) {
  let retval = '';
  if (tfb.toLowerCase() === 't') {
    retval = 'F';
  } else if (tfb.toLowerCase() === 'f') {
    retval = inputCondition ? 'B' : 'T';
  } else {
    retval = 'T';
  }
  return retval;
}

function InputOutputRow({
  rowData,
  rule,
  updateRule,
  editRow,
  index,
  inputCondition,
  columnState,
}) {
  const { participle, attribute, subject, operation, value } = rowData.context;
  const collapse = columnState;
  const sentence = [
    'The',
    participle || 'participle',
    attribute || 'attribute',
    'of the',
    subject || 'subject',
    'is',
    operation || '==',
    value || 'value',
  ].join(' ');

  return (
    <div>
      <Flex alignItems="stretch">
        <div style={halfWidth}>
          <Flex alignItems="flex-start">
            <Text color="textb">{sentence}</Text>
            <Box padding={2} />
            <Button
              variant="invisible"
              onClick={() => {
                editRow(index);
              }}
            >
              <Icon name="edit" fill="textb" size={14} />
            </Button>
            <Box padding={2} />
          </Flex>
        </div>

        {rowData.cases.map((rowValue, i) => {
          let variant = inputCondition ? 'both' : 'lightblue';
          let text = inputCondition ? 'Both' : 'False';
          if (rowValue.value.toLowerCase() === 't') {
            variant = 'blue';
            text = 'True';
          } else if (rowValue.value.toLowerCase() === 'f') {
            variant = 'lightblue';
            text = 'False';
          } else if (rowValue.value.toLowerCase() === 'b') {
            variant = 'both';
            text = 'Both';
          }

          return (
            <div style={ruleLeft} key={i}>
              <Flex>
                <Button
                  variant="invisible"
                  onClick={() => {
                    // Updates the case.
                    const ruleCopy = deepCopy(rule);
                    if (inputCondition) {
                      ruleCopy.input_conditions[index].cases[i].value = rotateValue(
                        ruleCopy.input_conditions[index].cases[i].value,
                        inputCondition
                      );
                    } else {
                      // Output assertion
                      ruleCopy.output_assertions[index].cases[i].value = rotateValue(
                        ruleCopy.output_assertions[index].cases[i].value,
                        inputCondition
                      );
                    }
                    updateRule(ruleCopy);
                  }}
                >
                  {inputCondition ? (
                    <Badge variant={variant}>{rowValue.value || 'B'}</Badge>
                  ) : (
                    <Badge variant={variant}>{rowValue.value || 'F'}</Badge>
                  )}
                </Button>
                <div style={collapse ? center : standard}>
                  <Flex alignItems="center">
                    {collapse ? (
                      <Flex>
                        <Box p={2} />
                        <Text>{text}</Text>
                        {/*
                        <Dropdown>
                          <option>True</option>
                          <option>False</option>
                          <option>Both</option>
                        </Dropdown>
                        */}
                      </Flex>
                    ) : (
                      <div></div>
                    )}
                  </Flex>
                </div>
              </Flex>
            </div>
          );
        })}
        <div style={ruleLeft}>
          <Button
            variant="invisible"
            onClick={() => {
              const ruleCopy = deepCopy(rule);
              if (
                inputCondition &&
                isArray(ruleCopy.input_conditions) &&
                ruleCopy.input_conditions.length > 1
              ) {
                console.log('Removing input condition...');
                ruleCopy.input_conditions.splice(index, 1);
                updateRule(ruleCopy);
              } else if (
                isArray(ruleCopy.output_assertions) &&
                ruleCopy.output_assertions.length > 1
              ) {
                console.log('Removing output assertion...');
                ruleCopy.output_assertions.splice(index, 1);
                updateRule(ruleCopy);
              } else {
                toast.error('A rule must have at least one input condition and output assertion.');
              }
            }}
          >
            <Icon name="ex" fill="#ED9C91" />
          </Button>
        </div>
      </Flex>
    </div>
  );
}

export default InputOutputRow;
