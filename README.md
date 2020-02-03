## Tessr WebAR Stock Screener

**A 3D Stock Data Visualization in Augmented Reality on the Web!**

This project was made to experiment with A-Frame's new AR mode in Chrome via the WebXR Device API.

Try out the demo here:

You will need to enable the following experimental chrome flags (currently supported on ARCore-compatible Android devices in Chrome 79 or later):

- WebXR Device API
- WebXR AR Module
- WebXR AR DOM Overlay

### Project Setup

For proper development environment setup, please check out the [companion article]() on Medium.

I will be releasing a second article soon giving a detailed runthrough of how the project was made.

### Main Project Files

- **index.html** - 3D Scene with A-Frame and Stock Data Search Menu
- **style.css** - CSS styles for all 2D DOM components and AR mode configurations
- **sceneData.js** - Functions for data retrieval and creation of scene from data
- **dataPoints.js** - Functions for creation of entities used to visualize retrieved data points
- **aframeComponents.js** - Components for initialization and updates of entities used in the scene

### How to Get Stock Data

To retrieve live stock data, you will need an IEXCloud API Key. You can create an account with their free tier [here](https://iexcloud.io/cloud-login#/register) that includes up to 50,000 messages (data points) per month.

I have included test stock data that you can use prior to gaining an API Key.

In this project, I have limited the request ranges to 5 days and 1 month to not use up the free tier limit too quickly. If you would like to retrieve larger ranges, check out the [IEXCloud API documentation](https://iexcloud.io/docs/api/#historical-prices) for historical price data parameters.

### Additional Questions

If you have any questions regarding the project or need help setting it up, feel free to reach out to me on twitter ([@tessrUX](https://twitter.com/tessrUX)). Cheers!
