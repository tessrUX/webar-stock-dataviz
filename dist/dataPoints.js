import { setMultipleAttributes, appendChildren } from './actions.js';

// Position and color attributes for stock data point values and labels
const stockDataAtts = {
  dayHigh: {
    position: { x: -0.45, y: 0.65, z: 0 },
    color: '#FFC300'
  },
  dayLow: {
    position: { x: -0.45, y: -0.65, z: 0 },
    color: '#0000A0'
  },
  rangeHigh: {
    position: { x: -0.1, y: 0.65, z: 0 },
    color: '#FFC300'
  },
  rangeLow: {
    position: { x: -0.1, y: -0.65, z: 0 },
    color: '#0000A0'
  },
  open: {
    position: { x: -0.85, y: 0, z: 0 },
    color: '#1E8449'
  },
  close: {
    position: { x: 0.6, y: 0, z: 0 },
    color: '#C0392B'
  },
  default: {
    position: { x: 0, y: 0, z: 0 },
    color: '#0000A0'
  }
};

// This function will create data point value text entities and their labels
const createPointVal = (pointNum, dayColor, valueType, pointVal) => {
  // Initialize entities for the data point value and label, as well as a parent Entity to encapsulate them
  let pointEn = document.createElement('a-entity');
  let pointValue = document.createElement('a-entity');
  let pointLabel = document.createElement('a-entity');

  pointEn.setAttribute('id', `grid-${valueType}-${pointNum}`);
  pointValue.setAttribute('id', `grid-${valueType}val-${pointNum}`);
  pointLabel.setAttribute('id', `grid-${valueType}label-${pointNum}`);

  appendChildren(pointEn, [pointValue, pointLabel]);

  // Set the position, color and label text based on the value type
  let pointPos, pointLabelText, pointColor;

  switch (valueType) {
    case 'rangeHigh':
      pointPos = stockDataAtts.rangeHigh.position;
      pointLabelText = 'RANGE HIGH';
      pointColor = stockDataAtts.rangeHigh.color;
      break;
    case 'rangeLow':
      pointPos = stockDataAtts.rangeLow.position;
      pointLabelText = 'RANGE LOW';
      pointColor = stockDataAtts.rangeLow.color;
      break;
    case 'dayHigh':
      pointPos = stockDataAtts.dayHigh.position;
      pointLabelText = 'DAY HIGH';
      pointColor = stockDataAtts.dayHigh.color;
      break;
    case 'dayLow':
      pointPos = stockDataAtts.dayLow.position;
      pointLabelText = 'DAY LOW';
      pointColor = stockDataAtts.dayLow.color;
      break;
    case 'open':
      pointPos = stockDataAtts.open.position;
      pointLabelText = 'OPEN';
      pointColor = dayColor;
      break;
    case 'close':
      pointPos = stockDataAtts.close.position;
      pointLabelText = 'CLOSE';
      pointColor = dayColor;
      break;
    default:
      pointPos = stockDataAtts.default.position;
      pointColor = stockDataAtts.default.color;
  }

  // Place the parent entity in the correct position based on the value type
  pointEn.setAttribute('position', pointPos);

  // Set the proper attributes for the pointValue and pointLabel entities via the point-info A-Frame component
  pointValue.setAttribute(
    'point-info',
    `pointnum: ${pointNum}; valuetype: ${valueType}; scale: 0.1 0.1 0.1; text: $${pointVal.toFixed(
      2
    )}; color: ${pointColor}`
  );

  pointLabel.setAttribute(
    'point-info',
    `pointnum: ${pointNum}; valuetype: ${valueType}; islabel: true; position: 0 0.1 0; scale: 0.05 0.05 0.05; text: ${pointLabelText}; color: ${pointColor}`
  );

  // Scale down the text size for Day High and Day Low data points
  if (valueType === 'dayHigh' || valueType === 'dayLow') {
    setMultipleAttributes(pointEn, [
      { attribute: 'scale', value: '0.75 0.75 0.75' },
      {
        attribute: 'position',
        value: `${pointPos.x + 0.05} ${pointPos.y + 0.015} ${pointPos.z}`
      }
    ]);
  }

  return pointEn;
};

// This function generates a grid for each data point with an encapsulating box and all displayed values
const createPointGrid = (pointNum, pointData, dayColor, rangeData) => {
  // Initialize an entity to serve as a container for all other entities in the point grid
  let pointGrid = document.createElement('a-entity');
  pointGrid.setAttribute('id', `datapoint-grid-${pointNum}`);

  // create entities for point data values and their labels via the createPointVal function
  let pointRangeHigh = createPointVal(
    pointNum,
    '',
    'rangeHigh',
    rangeData.high
  );
  let pointRangeLow = createPointVal(pointNum, '', 'rangeLow', rangeData.low);
  let pointDayHigh = createPointVal(pointNum, '', 'dayHigh', pointData.high);
  let pointDayLow = createPointVal(pointNum, '', 'dayLow', pointData.low);
  let pointOpen = createPointVal(pointNum, dayColor, 'open', pointData.open);
  let pointClose = createPointVal(pointNum, dayColor, 'close', pointData.close);

  // Initialize entities for the data point date and encapsulating box
  let pointDate = document.createElement('a-entity');
  let pointBox = document.createElement('a-box');

  appendChildren(pointGrid, [
    pointRangeHigh,
    pointRangeLow,
    pointDayHigh,
    pointDayLow,
    pointOpen,
    pointClose,
    pointDate,
    pointBox
  ]);

  // Set attributes for pointDate and pointBox via the point-date and point-box A-Frame components
  pointDate.setAttribute(
    'point-date',
    `pointnum: ${pointNum}; text: ${pointData.label}`
  );
  pointBox.setAttribute(
    'point-box',
    `pointnum: ${pointNum}; color: ${dayColor}`
  );

  return pointGrid;
};

// This function creates all stage entities for the retrieved stock data
const createDataPoints = dataPoints => {
  // Specify xyz position for first data point container entity
  let xPos = 0;
  let yPos = 1.5;
  let zPos = -0.5;

  // Specify the pointBox height in mm, the data range's minimum daily low and maximum daily high values,
  // and the difference of the range high/low in cents, which will be be used as reference values for candle/wick heights
  let boxHeight = 1000;
  let rangeHigh = Math.max(...dataPoints.map(point => point.high));
  let rangeLow = Math.min(...dataPoints.map(point => point.low));
  let dataRangeCents = Number(((rangeHigh - rangeLow) * 100).toFixed(4));

  // Select the scene stage and initialize a container entity for the data points
  let sceneStage = document.querySelector('#stage');
  let pointEntities = document.createElement('a-entity');

  pointEntities.setAttribute('id', `datapoints`);
  sceneStage.appendChild(pointEntities);

  // This nested function will calculate the heights for candle and wick entities,
  // and create all necessary entities for each data point in the set
  const createPoint = i => {
    // Set pointData equal to all values for current data point in the loop
    let pointData = dataPoints[i];
    let pointColor,
      pointNum = i + 1;

    let dayValChange = pointData.close - pointData.open;

    // determine if it was an up (green), down (red) or no change (blue) day for pointColor
    if (dayValChange < 0) {
      pointColor = '#C0392B';
    } else if (dayValChange > 0) {
      pointColor = '#1E8449';
    } else {
      dayValChange = 0.05;
      pointColor = '#0000A0';
    }

    // Calculate the ranges to be used for the candle and wick heights
    let dayOpenCloseRange = Number(Math.abs(dayValChange).toFixed(4));
    let dayHighLowRange = Number((pointData.high - pointData.low).toFixed(4));

    // Calculate height of candle (open/close) and wick (high/low) heights relative to box height
    let candleHeight = Number(
      (((dayOpenCloseRange / dataRangeCents) * boxHeight) / 10).toFixed(4)
    );
    let wickHeight = Number(
      (((dayHighLowRange / dataRangeCents) * boxHeight) / 10).toFixed(4)
    );

    // Calculate the position of the candle and wick relative to rangeLow (bottom of box)
    // Candle position dependent on if day is up (open < close) or down (open > close)
    let candlePointFromLow = Number(
      (
        (Math.sign(dayValChange) === 1 ? pointData.open : pointData.close) -
        rangeLow
      ).toFixed(4)
    );
    let wickPointFromLow = Number((pointData.low - rangeLow).toFixed(4));

    let candlePosFromBottom = Number(
      (((candlePointFromLow / dataRangeCents) * boxHeight) / 10).toFixed(4)
    );
    let wickPosFromBottom = Number(
      (((wickPointFromLow / dataRangeCents) * boxHeight) / 10).toFixed(4)
    );

    // Final candle and wick positions with y value containing calculated positions
    // Position is based on cylinder origin which is its center so half of candle/wick height is also added
    let candlePosition = `0 ${-0.45 +
      candleHeight / 2 +
      candlePosFromBottom} 0`;
    let wickPosition = `0 ${-0.45 + wickHeight / 2 + wickPosFromBottom} 0`;

    // Initialize entities for data point container and candle/wick
    let pointGroup = document.createElement('a-entity');
    let pointCandle = document.createElement('a-cylinder');
    let pointWick = document.createElement('a-cylinder');

    // Create the point grid with all values and box for data point
    let pointGrid = createPointGrid(pointNum, pointData, pointColor, {
      high: rangeHigh,
      low: rangeLow
    });

    pointGroup.setAttribute('id', `datapoint-${pointNum}`);
    pointGroup.setAttribute('position', { x: xPos, y: yPos, z: zPos });

    appendChildren(pointGroup, [pointGrid, pointCandle, pointWick]);

    // Set attributes for pointCandle and pointWick via the point-candle and point-wick A-Frame components
    pointCandle.setAttribute(
      'point-candle',
      `pointnum: ${pointNum}; position: ${candlePosition}; height: ${candleHeight}; color: ${pointColor}`
    );
    pointWick.setAttribute(
      'point-wick',
      `pointnum: ${pointNum}; position: ${wickPosition}; height: ${wickHeight}; color: ${pointColor}`
    );

    // Add pointGroup to parent entity containing all points and decrease z position for next data point
    pointEntities.appendChild(pointGroup);
    zPos = zPos - 3;
  };

  // loop through and call createPoint for all data points
  for (var i = 0; i < dataPoints.length; i++) {
    createPoint(i);
  }
};

export default createDataPoints;
