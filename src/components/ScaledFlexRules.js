import React from 'react';
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

const ScaledFlexRules = () => {
  return (
    <Card>
      <CardHeader
        title="Scaled FLEX Rules"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2">
          <strong>Scaled FLEX Points:</strong>
          <ul>
            <li>50%+ ownership: No multiplier</li>
            <li>25-50%: 1.2x multiplier</li>
            <li>12.5-25%: 1.3x multiplier</li>
            <li>5-12.5%: 1.5x multiplier</li>
            <li>0-5%: 1.75x multiplier</li>
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ScaledFlexRules;