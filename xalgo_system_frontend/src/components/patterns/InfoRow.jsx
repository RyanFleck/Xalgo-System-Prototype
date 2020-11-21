import React from 'react';
import {  Box, Grid, Text } from '..';

function InfoRow({ color, label, content}) {

    return (
    <Box p={2} backgroundColor={color} borderRadius="base">
              <Grid gridTemplateColumns="160px auto" gridGap="1em">
                <div>
                  <Text color="textb" textAlign="right">
                    {label}
                  </Text>
                </div>
                <div>
                  <Text>
                    {content}
                  </Text>
                </div>
              </Grid>
            </Box>
    );
}

export default InfoRow;
