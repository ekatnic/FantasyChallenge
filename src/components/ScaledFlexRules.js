import React from "react";
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
            <li style={{ color: "red" }}>50%+ ownership: .75x multiplier</li>
            <li>25-50%: 1x multiplier</li>
            <li>12.5-25%: 1.25x multiplier</li>
            <li>5-12.5%: 1.5x multiplier</li>
            <li>0-5%: 2x multiplier</li>
            <li>Only Entry: 3x multiplier</li>
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ScaledFlexRules;
