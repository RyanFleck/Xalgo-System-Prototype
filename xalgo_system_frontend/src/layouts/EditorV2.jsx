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
  maxWidth: 'calc(100% - 80px)',
  // overflowX:
};

const constrainWidth = {
  maxWidth: '800px',
};

const overflowTable = {
  width: '100%',
  overflowX: 'scroll',
};

const ruleLeft = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
  borderBottom: '1px solid #E7E7E7',
}

const ruleLeftOnly = {
  borderLeft: '1px solid #E7E7E7',
  padding: '1em',
}

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
  width: '154px',
}

const heightAdjust = {
  height: '38px',
  width: '0px',
}

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
      collapse: true,
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
    console.log('Starting Editor V2');
    this.getRuleFromStorage();
  }

  //table collapse

  handleCollapse() {
    this.setState({collapse: false});
  }

  handleExpand() {
    this.setState({collapse: true});
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

  updateRule(content, force = false) {
    if (!content) return;

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

    console.log("\nSO this is what's what:");
    console.log(`Old: ${this.state.rule.metadata.rule.url}`);
    console.log(`New: ${body_enforced.metadata.rule.url}`);

    // Check if equal
    if (
      force ||
      JSON.stringify(this.state.rule, null, 1) !== JSON.stringify(body_enforced, null, 1)
    ) {
      console.log('Change in rule content detected, saving to server...');
      // Finally, save.
      this.setState({ active: false, rule: body_enforced }, () => {
        this.setState({ active: true, modalOpen: false }, () => {
          this.persistRuleToStorage();
        });
      });
    } else {
      console.log('No change in rule content detected.');
    }
  }

  resetRule() {
    if (window.confirm(`Are you sure you'd like to RESET Rule ${this.state.uuid}?`)) {
      this.updateRule(deepCopy(emptyRule), true);
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
                <div style={constrainWidth}>
                  {/* Rule Name */}
                  {/* Rule Name */}
                  {/* Rule Name */}

                  <Text variant="formtitle">About the Rule</Text>
                  <Box p={2}></Box>
                  <GuideLine>
                    <NameDescription rule={rule} updateRule={this.updateRule} active={active} />
                    <Metadata rule={rule} updateRule={this.updateRule} active={active} />
                  </GuideLine>

                  {/* Rule Manager */}
                  {/* Rule Manager */}
                  {/* Rule Manager */}
                  {/* Rule Manager */}

                  <Box p={2}></Box>
                  <Text variant="formtitle">Management, Authorship & Maintenance</Text>
                  <Box p={2}></Box>
                  <GuideLine>
                    <RuleManager rule={rule} updateRule={this.updateRule} active={active} />
                    <Addbutton content="Rule Manager" />
                    <RuleAuthor rule={rule} updateRule={this.updateRule} active={active} />
                    <Addbutton content="Rule Author" />
                    <RuleMaintainer rule={rule} updateRule={this.updateRule} active={active} />
                    <Addbutton content="Rule Maintainer" />
                  </GuideLine>

                  {/* Data Sources */}
                  {/* Data Sources */}
                  {/* Data Sources */}

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
                    <DataSource rule={rule} updateRule={this.updateRule} active={active} />
                    <Addbutton content="Jurisdiction" />
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
                </div>
                <Box p={2}></Box>
                <Text variant="formtitle">Input Output Table</Text>
                <Box p={2}></Box>
                  <Box p={4} border="1px solid" borderColor="oline" borderRadius="base">
                    { collapse ? (
                       <Button
                       onClick={this.handleCollapse} 
                        >
                          Collapse Table
                        </Button>
                    ) : (
                      <Button
                       onClick={this.handleExpand} 
                        >
                          Expand Table
                        </Button>
                    )}   
                    <Box p={2}/>
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
                                              <Text variant="formtitle">Input Scenario {rowValue.case}</Text>
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
                                            toast('Unimplemented.');
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
                        <BlankRows rule={rule} ruleLeft={ruleLeftOnly} columnState={collapse} column={column}/>
                        <div style={rowWidth} />
                      </Flex>
                      <Flex alignItems="stretch">
                        <div style={halfWidthOnly} />
                        <BlankRows rule={rule} ruleLeft={ruleLeftOnly} columnState={collapse} column={column}/>
                      </Flex>
                        <Flex alignItems="stretch">
                          <div style={halfWidth}>
                            <Flex>
                              <Text variant="formtitle">Output Assertions</Text>
                            </Flex>
                          </div>
                          <BlankRows rule={rule} ruleLeft={ruleLeft} columnState={collapse} column={column} />
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
                        <BlankRows rule={rule} ruleLeft={ruleLeft} columnState={collapse} column={column}/>
                      </Flex>
                      <Box padding={1} />
                      <Box padding={1} />
                      <Flex justifyContent="flex-end">{/* the modal button will go here */}</Flex>
                    </div>
                  </Box>

                {/* output purpose */}
                {/* output purpose */}
                {/* output purpose */}
                {/* output purpose */}
                {/* output purpose */}
                {/* output purpose */}

                <div style={constrainWidth}>
                  <Box p={2}></Box>
                  <Text variant="formtitle">Output Attributes</Text>
                  <Box p={2}></Box>
                  <GuideLine>
                    <OutputPurpose />
                    <QualitativeWeights rule={rule} updateRule={this.updateRule} active={active} />
                  </GuideLine>
                  <Box p={2}></Box>
                </div>
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
