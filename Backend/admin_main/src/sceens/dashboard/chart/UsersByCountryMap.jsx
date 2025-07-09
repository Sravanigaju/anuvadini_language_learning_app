import React from 'react';
import { Card } from 'react-bootstrap';
import { ResponsiveChoropleth } from '@nivo/geo';
import { geoData } from "../data/Geo";

const UsersByCountryMap = ({ isDashboard = false }) => {
const data = [
  { id: "AFG", value: 500 }, // Afghanistan example
  { id: "IND", value: 600 },
  { id: "USA", value: 300 },
  { id: "GBR", value: 200 },
  { id: "DEU", value: 150 },
  { id: "FRA", value: 100 },
  { id: "JPN", value: 80 },
  { id: "BRA", value: 60 },
];
return (
    <Card>
      <Card.Header>
        <h5>Users by Country / Region</h5>
      </Card.Header>
      <Card.Body style={{ height: "400px" }}>
        <ResponsiveChoropleth
          data={data}
          features={geoData.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors="blues"
          domain={[0, 600]} // adjust as needed
          unknownColor="#666666"
          label="properties.name"
          valueFormat=".0f"
          projectionScale={isDashboard ? 40 : 100}
          projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
          projectionRotation={[0, 0, 0]}
          borderWidth={1}
          borderColor="#ffffff"
          legends={[
            {
              anchor: "bottom-left",
              direction: "column",
              justify: true,
              translateX: 20,
              translateY: -60,
              itemsSpacing: 0,
              itemWidth: 94,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemTextColor: "#444",
              itemOpacity: 0.85,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Card.Body>
    </Card>
  );
};

export default UsersByCountryMap;
