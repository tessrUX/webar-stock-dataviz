AFRAME.registerComponent('point-candle', {
  schema: {
    pointnum: { default: 0 },
    color: { default: '#0000A0' },
    position: { default: '0 0 0' },
    height: { default: 0.1 }
  },
  multiple: true,

  init: function() {
    let data = this.data;

    // Set attributes of pointCandle entity (a-cylinder)
    // Starting height with small value with animation to full candleHeight

    setMultipleAttributes(this.el, [
      { attribute: 'id', value: `datapoint-candle-${data.pointnum}` },
      { attribute: 'position', value: data.position },
      { attribute: 'radius', value: 0.05 },
      { attribute: 'material', value: 'metalness: 0.5; roughness: 0' },
      { attribute: 'color', value: data.color },
      { attribute: 'height', value: 0.0001 },
      {
        attribute: 'animation__height',
        value: `property: height; delay: 0; from: 0.0001; to: ${data.height}; dur: 500; loop: false; easing: easeOutQuad`
      }
    ]);
  }
});

AFRAME.registerComponent('point-wick', {
  schema: {
    pointnum: { default: 0 },
    color: { default: '#0000A0' },
    position: { default: '0 0 0' },
    height: { default: 0.1 }
  },
  multiple: true,

  init: function() {
    let data = this.data;

    // Set attributes of pointWick entity (a-cylinder)
    // Starting height with small value with animation to full wickHeight
    // Animation delayed to start after candleHeight animation.
    setMultipleAttributes(this.el, [
      { attribute: 'id', value: `datapoint-wick-${data.pointnum}` },
      { attribute: 'position', value: data.position },
      { attribute: 'radius', value: 0.0025 },
      { attribute: 'material', value: 'metalness: 0.5; roughness: 0' },
      { attribute: 'color', value: data.color },
      { attribute: 'height', value: 0.0001 },
      {
        attribute: 'animation__height',
        value: `property: height; delay: 750; from: 0.0001; to: ${data.height}; dur: 500; loop: false; easing: easeOutQuad`
      }
    ]);
  }
});

// Component for the data point box
AFRAME.registerComponent('point-box', {
  schema: {
    pointnum: { default: 0 },
    color: { default: '#0000A0' }
  },
  multiple: true,

  init: function() {
    let data = this.data;

    // Set attributes of pointBox entity (a-box)
    // Starting opacity of 0 with 1-second fade-in animation
    setMultipleAttributes(this.el, [
      { attribute: 'id', value: `datapoint-box-${data.pointnum}` },
      { attribute: 'position', value: '0 0.05 0' },
      { attribute: 'width', value: 1 },
      { attribute: 'height', value: 1 },
      { attribute: 'depth', value: 0.2 },
      {
        attribute: 'material',
        value: 'opacity: 0; metalness: 0.25; roughness: 0'
      },
      { attribute: 'color', value: data.color },
      {
        attribute: 'animation__opacity',
        value:
          'property: material.opacity; delay: 0; from: 0; to: 0.4; dur: 1000; loop: false;'
      }
    ]);
  }
});

// Component for the data point date
AFRAME.registerComponent('point-date', {
  schema: {
    pointnum: { default: 0 },
    text: { default: '' }
  },
  multiple: true,

  init: function() {
    let data = this.data;

    // Set attributes of pointDate entity (a-entity w/ text-geometry)
    // Starting opacity of 0 with 1-second fade-in animation
    setMultipleAttributes(this.el, [
      { attribute: 'id', value: `datapoint-date-${data.pointnum}` },
      { attribute: 'position', value: '-1.1 0.3 0' },
      { attribute: 'scale', value: '0.2 0.2 0.2' },
      { attribute: 'text-geometry', value: `value: ${data.text}` },
      {
        attribute: 'material',
        value: 'opacity: 0; color: #0000A0; metalness: 0.5; roughness: 0'
      },
      {
        attribute: 'animation__opacity',
        value:
          'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false;'
      }
    ]);
  }
});

// Component for all data point values and their labels
AFRAME.registerComponent('point-info', {
  schema: {
    valuetype: { default: '' },
    pointnum: { default: 0 },
    islabel: { default: false },
    position: { default: '0 0 0' },
    scale: { default: '0.1 0.1 0.1' },
    text: { default: '' },
    color: { default: '#0000A0' },
    material: {
      default: 'opacity: 0; color: #0000A0; metalness: 0.75; roughness: 0'
    }
  },
  multiple: true,

  init: function() {
    let data = this.data;

    // Set attributes of pointValue/pointLabel entity (a-entity w/ text-geometry)
    // Starting opacity of 0 with 1-second fade-in animation
    setMultipleAttributes(this.el, [
      {
        attribute: 'id',
        value: `datapoint-${data.valuetype}${data.islabel ? 'label' : 'val'}-${
          data.pointnum
        }`
      },
      { attribute: 'position', value: data.position },
      { attribute: 'scale', value: data.scale },
      { attribute: 'text-geometry', value: `value: ${data.text}` },
      {
        attribute: 'material',
        value: `opacity: 0; color: ${data.color}; metalness: 0.5; roughness: 0`
      },
      {
        attribute: 'animation__opacity',
        value:
          'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false;'
      }
    ]);
  }
});

// Stage Text component managing displayed texts and position
AFRAME.registerComponent('app-text', {
  schema: {
    topText: { default: 'Tessr WebAR' },
    mainText: { default: 'Stock Screener' },
    displayedText: { default: [] },
    setSymbol: { default: false },
    reset: { default: false }
  },

  init: function() {
    let data = this.data;
    let appText = this.el;

    // Creation of both text entities
    let appTextTop = document.createElement('a-entity');
    let appTextMain = document.createElement('a-entity');

    // We append the text entities to the parent right away for their positions to correspond to the parent.
    appText.appendChild(appTextTop);
    appText.appendChild(appTextMain);

    // Set attributes for appTextTop/appTextMain entities (a-entity w/ text-geometry)
    setMultipleAttributes(appTextTop, [
      {
        attribute: 'id',
        value: 'app-text-top'
      },
      { attribute: 'position', value: '-0.15 0.3 0' },
      { attribute: 'scale', value: '0.2 0.2 0.2' },
      { attribute: 'text-geometry', value: `value: ${data.topText}` },
      {
        attribute: 'material',
        value: 'color:#0000A0; metalness:0.5; roughness: 0; opacity: 0'
      },
      {
        attribute: 'animation__opacity',
        value:
          'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false'
      }
    ]);

    setMultipleAttributes(appTextMain, [
      {
        attribute: 'id',
        value: 'app-text-main'
      },
      { attribute: 'scale', value: '0.4 0.4 0.4' },
      { attribute: 'text-geometry', value: `value: ${data.mainText}` },
      {
        attribute: 'material',
        value: 'color: #0000A0; metalness:0.5; roughness: 0; opacity: 0'
      },
      {
        attribute: 'animation__opacity',
        value:
          'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false'
      }
    ]);

    // We place our default displayed text values in the array upon initializing,
    // this will be used to compare to any changes sent to toptext/mainText in update()
    data.displayedText = [data.topText, data.mainText];
  },

  update: function() {
    let data = this.data;
    let appText = this.el;
    let appTextTop = document.getElementById('app-text-top');
    let appTextMain = document.getElementById('app-text-main');

    // if setSymbol is true, move the appText to the top right, hide the top text, and swap out the main text for the symbol
    // if reset is true, move the appText back to center, show the top text, and reset the main text
    if (data.setSymbol) {
      appText.setAttribute(
        'animation__move',
        'property: position; delay: 0; from: -1 1.75 -1; to: 0.75 2.5 -1; dur: 2000; loop: false; easing: easeInOutQuad; elasticity: 100'
      );

      appTextTop.setAttribute(
        'animation__opacity',
        'property: material.opacity; delay: 0; from: 1; to: 0; dur: 500; loop: false;'
      );

      appTextMain.setAttribute(
        'animation__opacity',
        'property: material.opacity; delay: 0; from: 1; to: 0; dur: 500; loop: false;'
      );

      setTimeout(() => {
        setMultipleAttributes(appTextMain, [
          { attribute: 'text-geometry', value: `value: ${data.mainText}` },
          {
            attribute: 'animation__opacity',
            value:
              'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false; easing: easeOutQuad'
          }
        ]);
      }, 500);

      data.setSymbol = false;
      return;
    } else if (data.reset) {
      appText.setAttribute(
        'animation__move',
        'property: position; delay: 0; from: 0.75 2.5 -1; to: -1 1.75 -1; dur: 2000; loop: false; easing: easeInOutQuad; elasticity: 100'
      );

      appTextMain.setAttribute(
        'animation__opacity',
        'property: material.opacity; delay: 0; from: 1; to: 0; dur: 1000; loop: false;'
      );

      setTimeout(() => {
        setMultipleAttributes(appTextMain, [
          { attribute: 'text-geometry', value: `value: ${data.mainText}` },
          {
            attribute: 'animation__opacity',
            value:
              'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false; easing: easeOutQuad'
          }
        ]);

        appTextTop.setAttribute(
          'animation__opacity',
          'property: material.opacity; delay: 0; from: 0; to: 1; dur: 500; loop: false; easing: easeOutQuad'
        );
      }, 1000);

      data.reset = false;
      return;
    }

    // if the top text changes, swap out the displayed top text with a fade
    if (data.topText != data.displayedText[0]) {
      data.displayedText[0] = data.topText;

      appTextTop.setAttribute(
        'animation__opacity',
        'property: material.opacity; delay: 0; from: 1; to: 0; dur: 1000; loop: false'
      );
      setTimeout(() => {
        setMultipleAttributes(appTextTop, [
          { attribute: 'text-geometry', value: `value: ${data.topText}` },
          {
            attribute: 'animation__opacity',
            value:
              'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false; easing: easeOutQuad'
          }
        ]);
      }, 1000);
    }

    // if the main text changes, swap out the displayed main text with a fade
    if (data.mainText != data.displayedText[1]) {
      data.displayedText[1] = data.mainText;

      appTextMain.setAttribute(
        'animation__opacity',
        'property: material.opacity; delay: 0; from: 1; to: 0; dur: 1000; loop: false'
      );
      setTimeout(() => {
        setMultipleAttributes(appTextMain, [
          { attribute: 'text-geometry', value: `value: ${data.mainText}` },
          {
            attribute: 'animation__opacity',
            value:
              'property: material.opacity; delay: 0; from: 0; to: 1; dur: 1000; loop: false; easing: easeOutQuad'
          }
        ]);
      }, 1000);
    }
  }
});

// Exit AR Button Component (not natively included in A-Frame)
// Credit: Klaus Weidner (github.com/klausw/a-frame-car-sample)
AFRAME.registerComponent('exit-ar-button', {
  init: function() {
    let exitButton = document.getElementById('exit-ar-button');
    exitButton.addEventListener('click', ev => {
      console.log('exit-ar-button event ' + ev.type);
      this.el.renderer.xr.getSession().end();
    });
  }
});

// Apply 'ar-mode' CSS class Component (derived from hide-in-ar-mode Component)
// Credit: Klaus Weidner (github.com/klausw/a-frame-car-sample)
AFRAME.registerComponent('ar-mode-css', {
  init: function() {
    this.el.addEventListener('enter-vr', ev => {
      if (this.el.is('ar-mode')) {
        document.body.classList.add('ar-mode');
      }
    });
    this.el.addEventListener('exit-vr', ev => {
      document.body.classList.remove('ar-mode');
    });
  }
});

// function to set multiple attributes to an entity (duplicated from actions.js)
const setMultipleAttributes = (entity, attributes) => {
  attributes.forEach(att => entity.setAttribute(att.attribute, att.value));
};
