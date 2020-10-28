import React from 'react';
import { toast } from 'react-toastify';
import Axios from 'axios';
import axiosRetry from 'axios-retry';

// import { navigate } from '@reach/router';

import {
  deepCopy,
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

import {
  BlankRows,
  NameDescription,
  Metadata,
  RuleAuthor,
  RuleManager,
  InputSources,
  RuleMaintainer,
  DataSource,
  Time,
  StandardRoleName,
  InvolvedProduct,
  OutputPurpose,
  QualitativeWeights,
} from './editor-components';
import { ClockLoader } from 'react-spinners';
import { enforceSchemaWithTables } from 'xalgo-rule-processor/dist/processing';
import { RuleSchema } from 'xalgo-rule-processor/dist/schema';
import { objectEmpty } from 'xalgo-rule-processor/dist/utilities';

axiosRetry(Axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

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
export default class EditorV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: deepCopy(emptyRule),
      sampleInvolvedParties: [1],
      active: false,
      modalOpen: false,
      modalEditingInput: false,
      modalEditingIndex: 0,
      rule_loaded: false,
      uuid: '',
      primary_content_uuid: '',
    };

    this.getRuleFromStorage = this.getRuleFromStorage.bind(this);
    this.updateRule = this.updateRule.bind(this);

    // reset delete persist
    this.resetRule = this.resetRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.persistRuleToStorage = this.persistRuleToStorage.bind(this);

    // Sentence editing
    this.editSentence = this.editSentence.bind(this);
    this.editInputCondition = this.editInputCondition.bind(this);
    this.editOutputAssertion = this.editOutputAssertion.bind(this);
    this.addCase = this.addCase.bind(this);

    this.enforceRuleJSONSchema = this.enforceRuleJSONSchema.bind(this);
  }

  componentDidMount() {
    console.log('Starting Editor V2');
    this.getRuleFromStorage();
  }

  /**
   * ==============================================
   * Class Functions, mostly for editing rule state
   * ==============================================
   */

  enforceRuleJSONSchema(new_rule_body, warn = false) {
    try {
      console.log('Enforcing rule schema...');
      let enforced_body = enforceSchemaWithTables(RuleSchema, new_rule_body);
      return enforced_body;
    } catch (e) {
      if (warn) {
        toast.warning('Warning: Rule did not pass schema checks.');
      }
      console.error(e);
      return new_rule_body;
    }
  }

  getRuleFromStorage() {
    console.log(`Loading rule ${this.props.ruleUUID} using editor version v0.4-2`);
    let rule_data = {};
    let content_data = {};

    function ruleDownloadError(error) {
      console.error(error);
      toast.error(
        'You may not have access to this rule, or it does not exist within the database.'
      );
    }

    // Wait 100ms to ensure rule can be pulled from DB.
    setTimeout(() => {
      console.log('Fetching rule from backend...');

      // First axios request to get UUID for rule body.
      Axios.get(`/rules/rule/${this.props.ruleUUID}/`, {
        headers: {
          'X-CSRFToken': this.props.token,
        },
      })
        .then((res) => {
          console.log('Got rule from UUID:');
          rule_data = res.data;
          console.log(rule_data);
          // Second request to get rule body (stored as primary_content in rule)
          Axios.get(`/rules/content/${rule_data.primary_content}/`, {
            headers: {
              'X-CSRFToken': this.props.token,
            },
          })
            .then((res) => {
              content_data = res.data;
              console.log('Got body from content UUID:');
              console.log(content_data.body);
              const keys = Object.keys(content_data.body);
              console.log('Rule has keys:');
              console.log(keys);

              console.log('Checking rule body...');
              if (objectEmpty(content_data.body)) {
                toast('Body is empty, adding blank rule content.');
              }

              let body_enforced = this.enforceRuleJSONSchema(content_data.body);

              this.setState(
                { rule_loaded: true, uuid: this.props.ruleUUID, primary_content_uuid: res.data.id },
                () => {
                  this.updateRule(body_enforced);
                }
              );
            })
            .catch((e) => {
              ruleDownloadError(e);
            });
        })
        .catch((e) => {
          ruleDownloadError(e);
        });
    }, 100);
  }

  updateRule(content) {
    let newRuleContent = content;
    console.log(
      `Editor.jsx: Updating Rule Content:
      \nContent:\n${prettyJSON(newRuleContent)}`
    );

    if (newRuleContent.input_conditions.length === 0)
      newRuleContent = addNewInputCondition(newRuleContent);

    if (newRuleContent.output_assertions.length === 0)
      newRuleContent = addNewOutputAssertion(newRuleContent);

    // Perform checks on rule to ensure content is good.
    if (newRuleContent.input_conditions[0].cases[0].case === '') {
      console.log('Adding a case to the cases.');
      newRuleContent.input_conditions[0].cases[0].case = alphabet.charAt(0);
    }

    let body_enforced = this.enforceRuleJSONSchema(newRuleContent);

    // Finally, save.
    this.setState({ active: false, rule: body_enforced }, () => {
      console.log('Editor.jsx: Updated content.');
      this.setState({ active: true, modalOpen: false }, () => {
        this.persistRuleToStorage();
      });
    });
  }

  resetRule() {
    if (window.confirm(`Are you sure you'd like to RESET Rule ${this.state.uuid}?`)) {
      this.updateRule(deepCopy(emptyRule));
      toast.warning('Rule reset!');
      this.props.navigate(`/apps/rm/editor/${this.state.uuid}`);
    }
  }

  deleteRule() {
    if (window.confirm(`Are you sure you'd like to DELETE Rule ${this.state.uuid}?`)) {
      toast.error('Unimplemented.');
    }
  }

  persistRuleToStorage(showmsg = false) {
    console.log('Editor.jsx: Persisting rule to storage...');
    let body_enforced = this.enforceRuleJSONSchema(this.state.rule, showmsg);
    console.log(body_enforced);
    Axios.patch(
      `/rules/content/${this.state.primary_content_uuid}/`,
      {
        body: body_enforced,
      },
      {
        headers: {
          'X-CSRFToken': this.props.token,
        },
      }
    )
      .then((res) => {
        console.log('Data pushed.');
        if (showmsg) toast(`Content UUID ${res.data.id} was saved successfully.`);
      })
      .catch((err) => {
        toast.error(`The rule was not saved, please reload.`);
        console.error(err);
      });
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
          saveFunction={this.persistRuleToStorage}
        />
        {this.state.rule_loaded ? (
          <div>
            {/* Modal used by input/output tables. */}
            {modalOpen ? (
              <div style={fixpos}>
                <Box p={4} bg="#fff">
                  <Flex justifyContent="space-between" alignItems="center">
                    <div>
                      <Box padding="0.2em" />
                      <Text variant="formtitle">{rule.metadata.rule.name}</Text>
                    </div>
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
                <Box p={2}></Box>
                <GuideLine>
                  <NameDescription rule={rule} updateRule={this.updateRule} active={active} />
                  <Metadata />
                </GuideLine>

                {/* Rule Manager */}
                {/* Rule Manager */}
                {/* Rule Manager */}
                {/* Rule Manager */}

                <Box p={2}></Box>
                <Text variant="formtitle">Management, Authorship & Maintenance</Text>
                <Box p={2}></Box>
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

                <Box p={2}></Box>
                <Text variant="formtitle">Origins of Data that this Rule Depends Upon</Text>
                <Box p={2}></Box>
                <GuideLine>
                  <InputSources />
                  <Addbutton content="Input Source" />
                </GuideLine>

                {/* Input: contexts */}
                {/* Input: contexts */}
                {/* Input: contexts */}

                <Box p={2}></Box>
                <Text variant="formtitle">
                  Where and when this Rule is Asserted to be in Effect
                </Text>
                <Box p={2}></Box>
                <GuideLine>
                  <DataSource />
                  <Addbutton content="Data Source" />
                  <Time label="Start Time" />
                  <Time label="End Time" />
                </GuideLine>

                {/* Input: filters */}
                {/* Input: filters */}
                {/* Input: filters */}

                <Box p={2}></Box>
                <Text variant="formtitle">
                  External Data Values for which this Rule is Deemed to be Applicable
                </Text>
                <Box p={2}></Box>
                <GuideLine>
                  <StandardRoleName />
                  <Addbutton content="Standard Role Name" />
                  <InvolvedProduct />
                  <Addbutton content="Involved Product or Service" />
                </GuideLine>

                {/* Input Output Table */}
                {/* Input Output Table */}
                {/* Input Output Table */}
                {/* Input Output Table */}
                {/* Input Output Table */}
                {/* Input Output Table */}

                <Box p={2}></Box>
                <Text variant="formtitle">Input Output Table</Text>
                <Box p={2}></Box>
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
                              <Icon name="add" fill="#A3D8BE" />
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

                <Box p={2}></Box>
                <Text variant="formtitle">Output Attributes</Text>
                <Box p={2}></Box>
                <GuideLine>
                  <OutputPurpose />
                </GuideLine>

                {/* Qualitative wieghts */}
                {/* Qualitative wieghts */}
                {/* Qualitative wieghts */}
                {/* Qualitative wieghts */}
                {/* Qualitative wieghts */}
                {/* Qualitative wieghts */}

                <Box p={2}></Box>
                <Text variant="formtitle">Qualitative Weights</Text>
                <GuideLine>
                  <QualitativeWeights />
                </GuideLine>
                <Box p={2}></Box>
              </div>
            </Box>
            {/* End of the editor */}
          </div>
        ) : (
          <div className="loading-rule-data">
            <div style={{ padding: '4rem' }}>
              <ClockLoader size={100} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
