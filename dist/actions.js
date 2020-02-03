const setEntityAttributeById = (id, attribute, value) => {
  let entity = document.getElementById(id);
  entity.setAttribute(attribute, value);
};

const setMultipleAttributes = (entity, attributes) => {
  attributes.forEach(att => entity.setAttribute(att.attribute, att.value));
};

const appendChildren = (entity, children) => {
  children.forEach(child => entity.appendChild(child));
};

export { setEntityAttributeById, setMultipleAttributes, appendChildren };
