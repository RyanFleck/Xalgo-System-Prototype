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
  Grid,
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
  Entity,
} from './editor-components';
import { ClockLoader } from 'react-spinners';
import { enforceSchemaWithTables } from 'xalgo-rule-processor/dist/processing';
import { RuleSchema } from 'xalgo-rule-processor/dist/schema';
import { objectEmpty } from 'xalgo-rule-processor/dist/utilities';

import { downloadRule } from './Dashboard';

axiosRetry(Axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const fullheight = {
  minHeight: '80vh',
  minWidth: '500px',
  maxWidth: 'calc(100% - 90px)',
  // overflowX:
};

const constrainWidth = {
  maxWidth: '100%',
};

const overflowTable = {
  width: '100%',
  overflowX: 'scroll',
};

const ruleLeft = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
  borderBottom: '1px solid #E7E7E7',
};

const ruleLeftOnly = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
};

const ruleLeftalt = {
  borderLeft: '1px solid #E7E7E7',
  padding: '0.75em',
  borderBottom: '1px solid #E7E7E7',
};

const halfWidth = {
  minWidth: '500px',
  borderBottom: '1px solid #E7E7E7',
};

const halfWidthOnly = {
  minWidth: '500px',
};

const rowWidth = {
  width: 'auto',
  borderBottom: '1px solid #E7E7E7',
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

const column = {
  width: '160px',
};

const heightAdjust = {
  height: '38px',
  width: '0px',
};

const topguide = {
  position: 'fixed',
  padding: '2em',
  background: '#F9FBFE',
  width: '100%',
  zIndex: '1',
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
      collapse: false,
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

    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }

  componentDidMount() {
    console.log('EditorV2::componentDidMount()');
    this.getRuleFromStorage();
  }

  //table collapse

  handleCollapse() {
    console.log('EditorV2::handleCollapse()');
    this.setState({ collapse: false });
  }

  handleExpand() {
    console.log('EditorV2::handleExpand()');
    this.setState({ collapse: true });
  }

  /**
   * ==============================================
   * Class Functions, mostly for editing rule state
   * ==============================================
   */

  enforceRuleJSONSchema(new_rule_body, warn = false) {
    console.log('EditorV2::enforceRuleJSONSchema()');
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
    console.log('EditorV2::getRuleFromStorage()');
    console.log(`Loading rule ${this.props.ruleUUID} using editor version v0.4-2`);
    let rule_data = {};
    let content_data = {};

    function ruleDownloadError(error) {
      console.log('EditorV2::ruleDownloadError()');
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

  updateRule(content, force = false) {
    console.log('EditorV2::updateRule()');
    if (!content) {
      console.log('No content was provided to update the rule with.');
      return false;
    }

    let newRuleContent = content;
    console.log('Editor.jsx: Updating Rule Content:');
    console.log(newRuleContent);

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

    // Check if equal
    if (
      force ||
      JSON.stringify(this.state.rule, null, 1) !== JSON.stringify(body_enforced, null, 1)
    ) {
      console.log('EditorV2::updateRule() -> Change in rule content detected, saving to server...');
      // Finally, save.
      this.setState({ active: false, rule: body_enforced }, () => {
        this.setState({ active: true, modalOpen: false }, () => {
          this.persistRuleToStorage();
        });
      });
    } else {
      console.log('EditorV2::updateRule() -> No change in rule content detected.');
    }

    return true;
  }

  resetRule() {
    console.log('EditorV2::resetRule()');
    if (window.confirm(`Are you sure you'd like to RESET Rule ${this.state.uuid}?`)) {
      this.updateRule(deepCopy(emptyRule), true);
      toast.warning('Rule reset!');
      this.props.navigate(`/apps/rm/editor/${this.state.uuid}`);
    }
  }

  deleteRule() {
    console.log('EditorV2::deleteRule()');
    if (window.confirm(`Are you sure you'd like to DELETE Rule ${this.state.uuid}?`)) {
      toast.error('Unimplemented.');
    }
  }

  persistRuleToStorage(showmsg = false) {
    console.log('EditorV2::persistRuleToStorage()');
    let body_enforced = this.enforceRuleJSONSchema(this.state.rule, showmsg);
    console.log('Enforced body:');
    console.log(body_enforced);
    console.log('Running an AXIOS PATCH operation to update rule content...');
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
        console.log('Data pushed to backend successfully.');
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
    console.log('EditorV2::editInputCondition()');
    this.editSentence(key, true);
  }

  editOutputAssertion(key) {
    console.log('EditorV2::editOutputAssertion()');
    this.editSentence(key, false);
  }

  editSentence(key, inputConditions = false) {
    console.log('EditorV2::editSentence()');
    this.setState({
      modalOpen: true,
      modalEditingInput: inputConditions,
      modalEditingIndex: key,
    });
  }

  addCase() {
    console.log('EditorV2::addCase()');
    this.updateRule(addNewCase(this.state.rule), true);
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
    console.log('EditorV2::render()');
    const {
      rule,
      //SampleInvolvedParties,
      active,
      modalOpen,
      modalEditingIndex,
      modalEditingInput,
      collapse,
    } = this.state;

    //const collapse = true;

    return (
      <div>
        <EditorLeft
          title={rule.metadata.rule.title}
          description={rule.metadata.rule.description}
          deleteFunction={this.deleteRule}
          resetFunction={this.resetRule}
          saveFunction={this.persistRuleToStorage}
          rule={rule}
          downloadRule={downloadRule}
          csrfToken={this.props.token}
        />
        <div style={topguide}>
          <Flex>
            {this.state.rule_loaded ? (
              <Flex>
                <Text variant="formtitle">{rule.metadata.rule.title}</Text>
                <Box p={2} />
                <Text>
                  <Button
                    variant="invisible"
                    onClick={() => {
                      downloadRule(rule.uuid, this.props.token);
                    }}
                  >
                    <code>{rule.uuid}</code>
                  </Button>
                </Text>
                <Box p={1} />
              </Flex>
            ) : (
              <Flex>
                <Text>Loading...</Text>
              </Flex>
            )}
          </Flex>
        </div>
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
              {/* ================================================================ */}
              {/* ================================================================ */}
              {/* ================================================================ */}

              <div style={fullheight}>
                <div style={constrainWidth}>
                  {/* ================================================================ */}
                  {/* Rule Name */}
                  {/* Rule Name */}
                  {/* Rule Name */}
                  {/* Rule Name */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">About the Rule</Text>
                  <Box p={2}></Box>

                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <Box gridArea="1 / 1 / 2 / 3">
                      <NameDescription rule={rule} updateRule={this.updateRule} active={active} />
                    </Box>
                    <Box gridArea="2 / 1 / 3 / 2">
                      <Metadata rule={rule} updateRule={this.updateRule} active={active} />
                    </Box>
                    <Box gridArea="2 / 2 / 3 / 3">
                      <Entity rule={rule} updateRule={this.updateRule} active={active} />
                      <Addbutton content="Rule Maintainer" />
                    </Box>
                  </Grid>

                  {/* ================================================================ */}
                  {/* Rule Manager */}
                  {/* Rule Manager */}
                  {/* Rule Manager */}
                  {/* Rule Manager */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">Management, Authorship & Maintenance</Text>
                  <Box p={2}></Box>

                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <div>
                      <RuleManager rule={rule} updateRule={this.updateRule} active={active} />
                      <Addbutton content="Rule Manager" />
                    </div>
                    <div>
                      <RuleAuthor rule={rule} updateRule={this.updateRule} active={active} />
                      <Addbutton content="Rule Author" />
                    </div>
                    <div>
                      <RuleMaintainer rule={rule} updateRule={this.updateRule} active={active} />
                      <Addbutton content="Rule Maintainer" />
                    </div>
                  </Grid>

                  {/* ================================================================ */}
                  {/* Data Sources */}
                  {/* Data Sources */}
                  {/* Data Sources */}
                  {/* Data Sources */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">Origins of Data that this Rule Depends Upon</Text>
                  <Box p={2}></Box>
                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <div>
                      <InputSources />
                      <Addbutton content="Input Source" />
                    </div>
                  </Grid>

                  {/* ================================================================ */}
                  {/* Input: contexts */}
                  {/* Input: contexts */}
                  {/* Input: contexts */}
                  {/* Input: contexts */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">
                    Where and when this Rule is Asserted to be in Effect
                  </Text>
                  <Box p={2}></Box>
                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <div>
                      <DataSource rule={rule} updateRule={this.updateRule} active={active} />
                      <Addbutton content="Jurisdiction" />
                    </div>
                    <Time label="Start Time" />
                    <Time label="End Time" />
                  </Grid>

                  {/* ================================================================ */}
                  {/* Input: filters */}
                  {/* Input: filters */}
                  {/* Input: filters */}
                  {/* Input: filters */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">
                    External Data Values for which this Rule is Deemed to be Applicable
                  </Text>
                  <Box p={2}></Box>
                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <div>
                      <StandardRoleName />
                      <Addbutton content="Standard Role Name" />
                    </div>
                    <div>
                      <InvolvedProduct />
                      <Addbutton content="Involved Product or Service" />
                    </div>
                  </Grid>

                  {/* ================================================================ */}
                  {/* Input Output Table */}
                  {/* Input Output Table */}
                  {/* Input Output Table */}
                  {/* Input Output Table */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">Input Output Table</Text>
                  <Box p={2}></Box>
                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <Box
                      p={4}
                      border="1px solid"
                      borderColor="oline"
                      borderRadius="base"
                      bg="#fff"
                      gridArea="1 / 1 / 2 / 4"
                    >
                      {collapse ? (
                        <Button onClick={this.handleCollapse}>Collapse Table</Button>
                      ) : (
                        <Button onClick={this.handleExpand}>Expand Table</Button>
                      )}
                      <Box p={2} />
                      <div style={overflowTable}>
                        <Flex alignItems="stretch">
                          <div style={halfWidth}>
                            <Flex>
                              <Text variant="formtitle">Input Conditions</Text>
                            </Flex>
                          </div>
                          <Box>
                            <Flex>
                              {/* Input Conditions/Output Assertions Case Headings */}
                              {rule.input_conditions[0].cases.map((rowValue, i) => {
                                return (
                                  <div style={ruleLeft} key={i}>
                                    <div>
                                      {collapse ? (
                                        <div style={column}>
                                          <Flex justifyContent="space-between" alignItems="center">
                                            <div style={heightAdjust} />
                                            <Text variant="formtitle">
                                              Input Scenario {rowValue.case} &nbsp;
                                            </Text>
                                            <Button
                                              variant="invisible"
                                              onClick={() => {
                                                toast('Unimplemented.');
                                              }}
                                            >
                                              <Icon name="toggle" fill="#494D59" />
                                            </Button>
                                          </Flex>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="invisible"
                                          onClick={() => {
                                            const col = rowValue.case.toUpperCase();
                                            const msg = `Deleting column ${col}.`;
                                            console.log(msg);
                                            toast(msg);
                                            const newRule = deepCopy(rule);

                                            /* Filter ICs and OAs by letter.*/
                                            newRule.input_conditions = newRule.input_conditions.map(
                                              (ic) => {
                                                ic.cases = ic.cases.filter(
                                                  (x) => x.case.toUpperCase() !== col
                                                );
                                                console.log('IC Reduced:');
                                                console.log(ic);
                                                return ic;
                                              }
                                            );
                                            newRule.output_assertions = newRule.output_assertions.map(
                                              (ic) => {
                                                ic.cases = ic.cases.filter(
                                                  (x) => x.case.toUpperCase() !== col
                                                );
                                                console.log('OA Reduced:');
                                                console.log(ic);
                                                return ic;
                                              }
                                            );

                                            this.updateRule(newRule);
                                          }}
                                        >
                                          <ColumnLabel rowLabel={rowValue.case || '?'} />
                                        </Button>
                                      )}
                                    </div>
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
                              columnState={collapse}
                            />
                          </Box>
                        ))}

                        <Flex alignItems="stretch">
                          <div style={halfWidthOnly}>
                            <Addbutton
                              content="Add Input Condition"
                              onClick={() => {
                                /* This function must add a new Input Condition */
                                this.updateRule(addNewInputCondition(rule));
                              }}
                            />
                          </div>
                          <BlankRows
                            rule={rule}
                            ruleLeft={ruleLeftOnly}
                            columnState={collapse}
                            column={column}
                          />
                          <div style={rowWidth} />
                        </Flex>
                        <Flex alignItems="stretch">
                          <div style={halfWidthOnly} />
                          <BlankRows
                            rule={rule}
                            ruleLeft={ruleLeftOnly}
                            columnState={collapse}
                            column={column}
                          />
                        </Flex>
                        <Flex alignItems="stretch">
                          <div style={halfWidth}>
                            <Flex>
                              <Text variant="formtitle">Output Assertions</Text>
                            </Flex>
                          </div>
                          <BlankRows
                            rule={rule}
                            ruleLeft={ruleLeft}
                            columnState={collapse}
                            column={column}
                          />
                        </Flex>
                        {rule.output_assertions.map((val, key) => (
                          <Box key={key}>
                            <InputOutputRow
                              rowData={val}
                              rule={rule}
                              updateRule={this.updateRule}
                              editRow={this.editOutputAssertion}
                              index={key}
                              inputCondition={false}
                              columnState={collapse}
                            />
                          </Box>
                        ))}
                        <Flex alignItems="stretch">
                          <div style={halfWidth}>
                            <Addbutton
                              content="Add Output Assertion"
                              onClick={() => {
                                /* Must add a new output assertion. */
                                this.updateRule(addNewOutputAssertion(rule));
                              }}
                            />
                          </div>
                          <BlankRows
                            rule={rule}
                            ruleLeft={ruleLeft}
                            columnState={collapse}
                            column={column}
                          />
                        </Flex>
                        <Box padding={1} />
                        <Box padding={1} />
                        <Flex justifyContent="flex-end">{/* the modal button will go here */}</Flex>
                      </div>
                    </Box>
                  </Grid>

                  {/* ================================================================ */}
                  {/* output purpose */}
                  {/* output purpose */}
                  {/* output purpose */}
                  {/* output purpose */}

                  <Box p={4}></Box>
                  <Text variant="subtitle">Output Attributes</Text>
                  <Box p={2}></Box>
                  <Grid gridTemplateColumns="33% 33% 33%" gridGap="2em">
                    <Box>
                      <OutputPurpose rule={rule} updateRule={this.updateRule} active={active} />
                    </Box>
                    <Box gridArea="1 / 2 / 2 / 4">
                      <QualitativeWeights
                        rule={rule}
                        updateRule={this.updateRule}
                        active={active}
                      />
                    </Box>
                  </Grid>
                  <Box p={2}></Box>
                </div>
              </div>

              {/* ================================================================ */}
              {/* ================================================================ */}
              {/* ================================================================ */}
            </Box>
            {/* End of the editor */}
          </div>
        ) : (
          <div className="loading-rule-data">
            <div style={{ padding: '4rem', paddingTop: '8rem' }}>
              <ClockLoader size={100} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
