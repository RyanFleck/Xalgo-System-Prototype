import React from 'react';
import { deepCopy } from 'xalgo-rule-processor';
import { isArray } from 'xalgo-rule-processor/dist/types';
import { toast } from 'react-toastify';

import { Text, Box, Flex, Button, Icon, Badge } from '..';

const ruleLeft = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
};

const halfWidth = {
  minWidth: '500px',
};

const bottomLine = {
  borderBottom: '1px solid #E7E7E7',
  minWidth: '100%',
  display: 'block',
};

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

function InputOutputRow({ rowData, rule, updateRule, editRow, index, inputCondition }) {
  const { participle, attribute, subject, operation, value } = rowData;
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
    <div style={bottomLine}>
      <Flex alignItems="center">
        <div style={halfWidth}>
          <Flex>
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
                  toast.error(
                    'A rule must have at least one input condition and output assertion.'
                  );
                }
              }}
            >
              <Icon name="ex" fill="#ED9C91" />
            </Button>
            <Box padding={2} />
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
          </Flex>
        </div>
        <Box>
          <Flex>
            {rowData.cases.map((rowValue, i) => {
              let variant = 'blue';
              if (rowValue.value.toLowerCase() === 't') {
                variant = 'blue';
              } else if (rowValue.value.toLowerCase() === 'f') {
                variant = 'lightblue';
              } else if (rowValue.value.toLowerCase() === 'b') {
                variant = 'both';
              }


              return (
                <div style={ruleLeft} key={i}>
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
                </div>
              );
            })}
            <div style={ruleLeft}></div>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}

export default InputOutputRow;
