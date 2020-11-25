import React from 'react';
import { Flex } from '../../components';

const small = {
  width: '34px',
  height: '24px',
};

const stretch = {
  alignSelf: 'stretch',
};

const column = {
  width: '160px',
  height: '24px',
};

export default function BlankRows({ rule, ruleLeft, columnState }) {
  const collapse = columnState;

  return (
    <div style={stretch}>
      <Flex>
        {rule.input_conditions[0].cases.map((rowValue, i) => (
          <div style={ruleLeft} key={i}>
            {collapse ? <div style={column} /> : <div style={small} />}
          </div>
        ))}
        <div style={ruleLeft} />
      </Flex>
    </div>
  );
}
