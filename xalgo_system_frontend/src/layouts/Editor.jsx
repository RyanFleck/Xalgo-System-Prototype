import React from 'react';
import { toast } from 'react-toastify';
import {
  deepCopy,
  objectEmpty,
  generateNewRule,
  addNewCase,
  addNewInputCondition,
  addNewOutputAssertion,
  prettyJSON,
  // RuleSchema,
} from 'xalgo-rule-processor';
import EditorLeft from './editor-layouts/EditorLeft';
import ColumnLabel from '../components/patterns/ColumnLabel';
import {
  Box,
  Text,
  Flex,
  Button,
  Addbutton,
  InputOutputRow,
  SentenceEditor,
  Icon,
  GuideLine,
} from '../components';

import { BlankRows, NameDescription, Metadata, RuleAuthor, RuleManager, InputSources, RuleMaintainer, DataSource, Time, StandardRoleName, InvolvedProduct, OutputPurpose, QualitativeWeights } from './editor-components';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const fullheight = {
  minHeight: '80vh',
  minWidth: '500px',
  maxWidth: '800px',
  // overflowX:
};

const overflowTable = {
  width: '100%',
  overflowX: 'scroll',
};

const ruleLeft = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
};

const ruleLeftalt = {
  borderLeft: '1px solid #E7E7E7',
  padding: '0.75em',
};

const halfWidth = {
  minWidth: '500px',
};

const bottomLine = {
  borderBottom: '1px solid #E7E7E7',
};

const rowWidth = {
  width: '60px',
};

const fixpos = {
  position: 'sticky',
  top: '88px',
  width: '100%',
};

const modalhold = {
  position: 'sticky',
  height: '90vh',
  background: 'rgba(255, 255, 255, .8)',
  marginBottom: '-90vh',
};

// This empty rule is the schema without any __descriptions.
// Temporarily start with three cases.
const emptyRule = generateNewRule();

/**
 * ================
 * The Editor Class
 * ================
 *
 * The Editor component is the parent of all editing views, and is the
 * master source of information regarding the state of the rule.
 */
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: deepCopy(emptyRule),
      sampleInvolvedParties: [1],
      active: false,
      modalOpen: false,
      modalEditingInput: false,
      modalEditingIndex: 0,
    };

    this.getRuleFromStorage = this.getRuleFromStorage.bind(this);
    this.updateRule = this.updateRule.bind(this);

    // reset delete persist
    this.resetRule = this.resetRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.persistRuleToLocalStorage = this.persistRuleToLocalStorage.bind(this);

    // Sentence editing
    this.editSentence = this.editSentence.bind(this);
    this.editInputCondition = this.editInputCondition.bind(this);
    this.editOutputAssertion = this.editOutputAssertion.bind(this);
    this.addCase = this.addCase.bind(this);
  }

  componentDidMount() {
    this.getRuleFromStorage();
  }

  /**
   * ==============================================
   * Class Functions, mostly for editing rule state
   * ==============================================
   */

  getRuleFromStorage() {
    console.log('Editor.jsx: Getting rule from storage...');

    const storedRule = localStorage.getItem('rulev2');
    const storedRuleContent = JSON.parse(storedRule);
    const storedRuleEmpty = objectEmpty(storedRuleContent);

    console.log(`Editor.jsx: Local stored rule is \n\n${storedRule}`);

    if (!this.state.rule.metadata.rule.title) {
      console.log('Editor.jsx: There is currently no rule stored in STATE.');
      if (!storedRuleEmpty && storedRuleContent.metadata.rule.title) {
        console.log('Editor.jsx: There is rule content in local storage, loading into State...');
        this.updateRule(storedRuleContent);
      }
    }
  }

  updateRule(content) {
    let newRuleContent = content;
    console.log(
      `Editor.jsx: Updating Rule Content:
      \nContent:\n${prettyJSON(newRuleContent)}`
    );

    if (newRuleContent.input_conditions.length === 0) {
      newRuleContent = addNewInputCondition(newRuleContent);
    }

    if (newRuleContent.output_assertions.length === 0) {
      newRuleContent = addNewOutputAssertion(newRuleContent);
    }
    // Perform checks on rule to ensure content is good.
    if (newRuleContent.input_conditions[0].cases[0].case === '') {
      console.log('Adding a case to the cases.');
      newRuleContent.input_conditions[0].cases[0].case = alphabet.charAt(0);
    }

    // Finally, save.
    this.setState({ active: false, rule: newRuleContent }, () => {
      console.log('Editor.jsx: Updated content from local storage.');
      this.setState({ active: true, modalOpen: false }, () => {
        this.persistRuleToLocalStorage();
      });
    });
  }

  resetRule() {
    toast.warning('Rule reset');
    this.updateRule(deepCopy(emptyRule));
    this.props.navigate('/editor');
  }

  deleteRule() {
    toast.warning('Rule Delete');
    this.updateRule(deepCopy(emptyRule));
    this.props.navigate('/dashboard');
    console.error("This is a toy editor, you're not deleting anything.");
  }

  persistRuleToLocalStorage() {
    console.log('Editor.jsx: Persisting rule to local storage...');
    localStorage.setItem('rulev2', prettyJSON(this.state.rule));
  }

  /**
   * ===========================
   * Functions for Editing Cases
   * ===========================
   */

  editInputCondition(key) {
    this.editSentence(key, true);
  }

  editOutputAssertion(key) {
    this.editSentence(key, false);
  }

  editSentence(key, inputConditions = false) {
    this.setState({
      modalOpen: true,
      modalEditingInput: inputConditions,
      modalEditingIndex: key,
    });
  }

  addCase() {
    this.updateRule(addNewCase(this.state.rule));
  }

  /**
   * ==================================
   * Rendering Method, end of functions
   * ==================================
   *
   * I've tried to move as many parts of this as possible into functional
   * components, which are included after this class. Those which could not
   * should be moved in the future.
   */

  render() {
    const {
      rule,
      //SampleInvolvedParties,
      active,
      modalOpen,
      modalEditingIndex,
      modalEditingInput,
    } = this.state;

    return (
      <div>
        <EditorLeft
          title={rule.metadata.rule.title}
          description={rule.metadata.rule.description}
          deleteFunction={this.deleteRule}
          resetFunction={this.resetRule}
        >
          {/* Modal used by input/output tables. */}
          {modalOpen ? (
            <div style={fixpos}>
              <Box p={4} bg="#fff">
                <Flex justifyContent="space-between" alignItems="center">
                  <div>
                    <Box padding="0.2em" />
                    <Text variant="formtitle">{rule.metadata.rule.name}</Text>
                  </div>
                  <Flex>
                    <Text color="publish">Publish</Text>
                    <Box p={1} />
                    <Text color="primary">Save and Exit</Text>
                  </Flex>
                </Flex>
              </Box>
              <div style={modalhold}>
                <Flex alignItems="center" justifyContent="center">
                  <Box height="70vh" />
                  <Box
                    p={2}
                    m={0}
                    width="620px"
                    bg="bg"
                    border="1px solid"
                    borderColor="oline"
                    borderRadius="base"
                  >
                    <SentenceEditor
                      rule={rule}
                      index={modalEditingIndex}
                      active={active}
                      modalEditingInput={modalEditingInput}
                      updateRule={this.updateRule}
                    />
                  </Box>
                </Flex>
              </div>
            </div>
          ) : null}

          <Box p={4}>
            <div style={fullheight}>

              {/* Rule Name */}
              {/* Rule Name */}
              {/* Rule Name */}

              <Text variant="formtitle">About the Rule</Text>
              <GuideLine>
                <NameDescription rule={rule} updateRule={this.updateRule} active={active} />
                <Metadata />
              </GuideLine>

              {/* Rule Manager */}
              {/* Rule Manager */}
              {/* Rule Manager */}
              {/* Rule Manager */}

              <Text variant="formtitle">Management, Authorship & Maintenance</Text>
              <GuideLine>
                <RuleManager />
                <Addbutton content="Rule Manager" />
                <RuleAuthor />
                <Addbutton content="Rule Author" />
                <RuleMaintainer />
                <Addbutton content="Rule Maintainer" />
              </GuideLine>

              {/* Daata Sources */}
              {/* Daata Sources */}
              {/* Daata Sources */}

              <Text variant="formtitle">Data Sources</Text>
              <GuideLine>
                <InputSources />
                <Addbutton content="Input Source" />
              </GuideLine>

              {/* Input: contexts */}
              {/* Input: contexts */}
              {/* Input: contexts */}

              <Text variant="formtitle">Input: Contexts</Text>
              <GuideLine>
                <DataSource />
                <Addbutton content="Data Source" />
                <Time />
                <Time />
              </GuideLine>

              {/* Input: filters */}
              {/* Input: filters */}
              {/* Input: filters */}

              <Text variant="formtitle">Input: Filters</Text>
              <GuideLine>
                <StandardRoleName />
                <Addbutton content="Standard Role Name" />
                <InvolvedProduct />
                <Addbutton content="Involved Product or Service" />
              </GuideLine>  

              {/* Input filters */}
              {/* Input filters */}
              {/* Input filters */}
              {/* Input filters */}
              {/* Input filters */}
              {/* Input filters */}


              {/* Input Output Table */}
              {/* Input Output Table */}
              {/* Input Output Table */}
              {/* Input Output Table */}
              {/* Input Output Table */}
              {/* Input Output Table */}

              <Text variant="formtitle">Input Output Filters</Text>
              <GuideLine>
                <Box>
                  <div style={overflowTable}>
                    <div style={bottomLine}>
                      <Flex alignItems="center">
                        <div style={halfWidth}>
                          <Flex>
                            <Text>Input Conditions</Text>
                          </Flex>
                        </div>
                        <Box>
                          <Flex>
                            {/* Input Conditions/Output Assertions Case Headings */}
                            {rule.input_conditions[0].cases.map((rowValue, i) => {
                              return (
                                <div style={ruleLeft} key={i}>
                                  <Button
                                    variant="invisible"
                                    onClick={() => {
                                      toast('Unimplemented.');
                                    }}
                                  >
                                    <ColumnLabel rowLabel={rowValue.case || '?'} />
                                  </Button>
                                </div>
                              );
                            })}
                            <div style={ruleLeftalt} />
                          </Flex>
                        </Box>
                        <div style={rowWidth}>
                          <Button variant="invisible" onClick={this.addCase}>
                            <Icon name="add" fill="#A3D8BE"/>
                          </Button>
                        </div>
                      </Flex>
                    </div>

                    {/* Input Conditions Data */}
                    {rule.input_conditions.map((val, key) => (
                      <Box key={key}>
                        <InputOutputRow
                          rowData={val}
                          rule={rule}
                          updateRule={this.updateRule}
                          editRow={this.editInputCondition}
                          index={key}
                          inputCondition
                        />
                      </Box>
                    ))}

                    <Flex alignItems="center">
                      <div style={halfWidth}>
                        <Addbutton
                          onClick={() => {
                            /* This function must add a new Input Condition */
                            this.updateRule(addNewInputCondition(rule));
                          }}
                        />
                      </div>
                      <BlankRows rule={rule} ruleLeft={ruleLeft} />
                      <div style={rowWidth} />
                    </Flex>
                    <Flex alignItems="center">
                      <div style={halfWidth} />
                      <BlankRows rule={rule} ruleLeft={ruleLeft} />
                    </Flex>
                    <div style={bottomLine}>
                      <Flex alignItems="center">
                        <div style={halfWidth}>
                          <Flex>
                            <Text>Output Assertions</Text>
                          </Flex>
                        </div>
                        <BlankRows rule={rule} ruleLeft={ruleLeft} />
                      </Flex>
                    </div>
                    {rule.output_assertions.map((val, key) => (
                      <Box key={key}>
                        <InputOutputRow
                          rowData={val}
                          rule={rule}
                          updateRule={this.updateRule}
                          editRow={this.editOutputAssertion}
                          index={key}
                          inputCondition={false}
                        />
                      </Box>
                    ))}
                    <Flex alignItems="center">
                      <div style={halfWidth}>
                        <Addbutton
                          onClick={() => {
                            /* Must add a new output assertion. */
                            this.updateRule(addNewOutputAssertion(rule));
                          }}
                        />
                      </div>
                      <BlankRows rule={rule} ruleLeft={ruleLeft} />
                    </Flex>
                    <Box padding={1} />
                    <Box padding={1} />
                    <Flex justifyContent="flex-end">{/* the modal button will go here */}</Flex>
                  </div>
                </Box>
              </GuideLine>

              {/* output purpose */}
              {/* output purpose */}
              {/* output purpose */}
              {/* output purpose */}
              {/* output purpose */}
              {/* output purpose */}

              <Text variant="formtitle">Output</Text>
              <GuideLine>
                <OutputPurpose />
              </GuideLine>

              {/* Qualitative wieghts */}
              {/* Qualitative wieghts */}
              {/* Qualitative wieghts */}
              {/* Qualitative wieghts */}
              {/* Qualitative wieghts */}
              {/* Qualitative wieghts */}

              <Text variant="formtitle">Qualitative Weights</Text>
              <GuideLine>
                <QualitativeWeights />
              </GuideLine>

            </div>
          </Box>
          {/* End of the editor */}
        </EditorLeft>
      </div>
    );
  }
}
