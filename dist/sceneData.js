import { setEntityAttributeById } from './actions.js';
import createDataPoints from './dataPoints.js';
import tslaTestData from '../../assets/testData.js';

const apiToken = '[INSERT YOUR IEXCloud API KEY HERE]';

// This function fetches the data from the IEXCloud API
const fetchStockData = async (symbol, range) => {
  let newUrl = `https://cloud.iexapis.com/stable/stock/${symbol}/chart/${range}?token=${apiToken}`;
  let data = null;

  try {
    let response = await fetch(newUrl);
    data = await response.json();
  } catch (error) {
    console.log(error);
  }

  return data;
};

// This function calls the gets the stock Data and creates the Scene from the data points
const createSceneData = async (symbol, range) => {
  // Set sceneData to sample stock data (useful for scene development testing)
  let sceneData = null;
  if (range === '5d') {
    sceneData = tslaTestData.fiveday;
  } else if (range === '1m') {
    sceneData = tslaTestData.onemonth;
  }

  // Once you have an API inserted in the placeholder, you can uncomment the part below
  // which fetches the data and remove the test data setup in lines 25 - 30

  /*  
  let sceneData = await fetchStockData(symbol, range).then(stockData => {
    return stockData;
  });
  */

  createDataPoints(sceneData);
};

// This function is used to clear the data points currently being displayed on the stage
const clearSceneData = () => {
  let points = document.getElementById('datapoints');
  if (points !== null) {
    points.parentNode.removeChild(points);
  }
};

// This function resets the stage by clearing it and resetting the stage-text entity
const resetScene = () => {
  clearSceneData();

  setEntityAttributeById('stage-text', 'app-text', {
    reset: true,
    mainText: 'Stock Screener'
  });
};

// This function clears the stage, retrieves the data using the searched symbol/range
// and sets the stage text to the searched symbol
const searchData = () => {
  clearSceneData();

  let newSymbol = document.getElementById('symbol-input').value.toUpperCase();
  let newRange = document.getElementById('range-input').value;

  setEntityAttributeById('stage-text', 'app-text', {
    setSymbol: true,
    mainText: newSymbol
  });

  // Wait for stage-text move animation to complete before creating scene data
  setTimeout(() => {
    createSceneData(newSymbol, newRange);
  }, 2000);
};

window.searchData = searchData;
window.resetScene = resetScene;

export { fetchStockData, createSceneData, searchData };
