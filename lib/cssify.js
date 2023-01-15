const cssify = (styles) => {
  let css = "";
  let currentSelector = "";
  const propertiesMap = new Map();
  const variables = new Map();
  const mixins = new Map();

  //recursively iterate through the object and look for mixin and variable references
  const process = (obj) => {
    for (let [property, value] of Object.entries(obj)) {
      if (typeof value === "object") {
        process(value);
      } else {
        //check if the value is a variable reference
        if (value.startsWith("$")) {
          //replace variable reference with its value
          obj[property] = variables.get(value.substring(1));
        }
        //check if the property is a mixin reference
        if (property.startsWith("@")) {
          //get the properties of the mixin
          const mixinProperties = mixins.get(property.substring(1));
          //add the mixin properties to the current object
          Object.assign(obj, mixinProperties);
        }
      }
    }
  }

  const createCSS = (declaration) => {
    for (let [property, value] of Object.entries(declaration)) {
      if (property.startsWith(':')) {
        currentSelector += property;
        createCSS(value);
        currentSelector = currentSelector.substring(0, currentSelector.lastIndexOf(property));
      } else if (property.startsWith("@")) {
        //get the properties of the mixin
        const mixinProperties = mixins.get(property.substring(1));
        //process the mixin properties
        process(mixinProperties);
        //add the mixin properties to the CSS
        createCSS(mixinProperties);
      } else if (typeof value === "object") {
        currentSelector += ` ${property}`;
        createCSS(value);
        currentSelector = currentSelector.substring(0, currentSelector.lastIndexOf(" "));
      } else {
        if (!propertiesMap.has(currentSelector)) {
          propertiesMap.set(currentSelector, {})
        }
        propertiesMap.get(currentSelector)[property] = value;
      }
    }
    for (let [selector, properties] of propertiesMap.entries()) {
      css += `${selector} { \n`;
      for (let [property, value] of Object.entries(properties)) {
        css += `  ${property}: ${value};\n`;
      }
      css += `}\n`;
    }
  }

  //start creating the CSS
  createCSS(styles);

  return css;
}


module.exports = cssify