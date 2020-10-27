import React, { useState } from 'react';
import { RuleSchema } from 'xalgo-rule-processor';
import { Box, GuideLine, FormStandard, Flex, Dropdown, Text, FormDropdown } from '../../components';

function Time({ rule, updateRule, active, section }) {
  // 0. Fill out the section name.
  const sectionName = 'Rule Information';
  // const sectionDesc = 'Begin your rule by providing a title and concise description.';
  const [modified] = useState(false);

  // 1. Set a state for each element that must be filled.
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Don't touch this.
  if (active && !modified) {
    console.log(`${sectionName} section is being edited.`);

    // 2. Ensure each field is set according to the current rule state.
    if (title !== rule.metadata.rule.title) setTitle(rule.metadata.rule.title);
    if (desc !== rule.metadata.rule.description) setDesc(rule.metadata.rule.description);
  }

  // 3. Return a rendering of the component.
  return (
    <div>
      <Box padding={1} />
      <Text>Name & Description</Text>
      <Box padding={1} />
      <GuideLine>
        <FormStandard name="Start Date" description={RuleSchema.metadata.rule.__description} />
        <Box padding={1} />
        <Flex alignItems="center">
          <Text color="textb">Hour</Text>
          <Box padding={1} />
          <Dropdown>
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
          </Dropdown>
          <Box padding={1} />
          <Text color="textb">Minute</Text>
          <Box padding={1} />
          <Dropdown>
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
          </Dropdown>
          <Box padding={1} />
          <Text color="textb">Second</Text>
          <Box padding={1} />
          <Dropdown>
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
          </Dropdown>
        </Flex>
        <Box padding={1} />
        <FormDropdown
                    name="Time Zone"
                    description="hello world is asking the following things"
                    options={[
                      { value: 'UTC−12:00', label: 'UTC−12:00' },
                      { value: 'UTC−11:00', label: 'UTC−11:00' },
                      { value: 'UTC−10:00', label: 'UTC−10:00' },
                      { value: 'UTC−09:30', label: 'UTC−09:30' },
                      { value: 'UTC−09:00', label: 'UTC−09:00' },
                      { value: 'UTC−08:00', label: 'UTC−08:00' },
                      { value: 'UTC−07:00', label: 'UTC−07:00' },
                      { value: 'UTC−06:00', label: 'UTC−06:00' },
                      { value: 'UTC−05:00', label: 'UTC−05:00' },
                      { value: 'UTC−04:00', label: 'UTC−04:00' },
                      { value: 'UTC−03:30', label: 'UTC−03:30' },
                      { value: 'UTC−03:00', label: 'UTC−03:00' },
                      { value: 'UTC−02:00', label: 'UTC−02:00' },
                      { value: 'UTC−01:00', label: 'UTC−01:00' },
                      { value: 'UTC±00:00', label: 'UTC±00:00' },
                      { value: 'UTC+01:00', label: 'UTC+01:00' },
                      { value: 'UTC+02:00', label: 'UTC+02:00' },
                      { value: 'UTC+03:00', label: 'UTC+03:00' },
                      { value: 'UTC+03:30', label: 'UTC+03:30' },
                      { value: 'UTC+04:00', label: 'UTC+04:00' },
                      { value: 'UTC+04:30', label: 'UTC+04:30' },
                      { value: 'UTC+05:00', label: 'UTC+05:00' },
                      { value: 'UTC+05:30', label: 'UTC+05:30' },
                      { value: 'UTC+05:45', label: 'UTC+05:45' },
                      { value: 'UTC+06:00', label: 'UTC+06:00' },
                      { value: 'UTC+06:30', label: 'UTC+06:30' },
                      { value: 'UTC+07:00', label: 'UTC+07:00' },
                      { value: 'UTC+08:00', label: 'UTC+08:00' },
                      { value: 'UTC+08:45', label: 'UTC+08:45' },
                      { value: 'UTC+09:00', label: 'UTC+09:00' },
                      { value: 'UTC+09:30', label: 'UTC+09:30' },
                      { value: 'UTC+10:00', label: 'UTC+10:00' },
                      { value: 'UTC+10:30', label: 'UTC+10:30' },
                      { value: 'UTC+11:00', label: 'UTC+11:00' },
                      { value: 'UTC+12:00', label: 'UTC+12:00' },
                      { value: 'UTC+12:45', label: 'UTC+12:45' },
                      { value: 'UTC+13:00', label: 'UTC+13:00' },
                      { value: 'UTC+14:00', label: 'UTC+14:00' },
                    ]}
                  />
      </GuideLine>
      <Box padding={1} />
    </div>
  );
}

export default Time;
