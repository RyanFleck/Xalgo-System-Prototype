// libraries
import React from 'react';
import Box from '../../components/layout/Box';
import Grid from '../../components/layout/Grid';
//import { Link } from '@reach/router';


// rm-components
import Text from '../../components/primitives/Text';
import Button from '../../components/primitives/Button';

// Primary Component
function Intro({name}) {

    return (
          <Box backgroundColor="#F6F5F2" p={4}>
            <Grid gridTemplateRows="auto auto auto" height="85vh">
                <Box>
                    <Text variant="formtitle">Welcome, {name}</Text>
                    <Box p={2} />
                    <Text color="textb">
                        Use the XRM interface to construct rules using the Oughtomation method. Click on the Editor tab to create a rule, or browse rules you have already written using the dashboard tab.
                    </Text>
                </Box>
                <Box />
                <Box alignSelf="end">
                    <Text color="publish">
                        This prototype is under construction. Please post any bugs or
                        issues on the repository for this system.
                    </Text>
                    <Box p={2} />
                    <Text color="error">

                        <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/RyanFleck/Xalgo-System-Prototype/issues"
                        >
                        <Button variant="error">
                            Provide feedback, or report a bug
                        </Button>
                        </a>
                    </Text>
                </Box>
            </Grid>
          </Box>
    );
}

export default Intro;
