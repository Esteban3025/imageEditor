export class Elements {
  constructor() {
    this.createElements = [];
  }

  InputTypeColor(className) {
    const newElement = document.createElement("input");
    newElement.type = 'color';
    newElement.classList.add(`${className}`);

    document.body.appendChild(newElement);
    this.createElements.push(newElement);
    return newElement;
  }

  p(className) {
    const newElement = document.createElement("p");
    newElement.classList.add(`${className}`);

    document.body.appendChild(newElement);
    this.createElements.push(newElement);
    return newElement;
  }

  inputTypeRange(className) {
    const newElement = document.createElement("input");
    newElement.type = 'range';
    newElement.setAttribute("value", "0");
    newElement.classList.add(`${className}`);

    document.body.appendChild(newElement);
    this.createElements.push(newElement);
    return newElement;
  }

  InputTypeFile(inputClassName, labelClassName, id, text) {
    const newElement = document.createElement("input");
    newElement.type = 'file';
    newElement.setAttribute('id', `${id}`);
    newElement.name = `${id}`;
    newElement.accept = 'image/*';
    newElement.classList.add(`${inputClassName}`);
    document.body.appendChild(newElement);
    this.createElements.push(newElement);
  
    const labelElement = document.createElement("label");
    labelElement.setAttribute('for', `${id}`);
    labelElement.textContent = `${text}`;
    labelElement.classList.add(`${labelClassName}`);
    
    document.body.appendChild(labelElement);
    
    this.createElements.push(labelElement);
    return newElement;
  }

  inputTypeNumber(className, id) {
    const newElement = document.createElement("input");
    newElement.type = 'number';
    newElement.setAttribute("id", `${id}`);
    newElement.setAttribute("min", "0");
    newElement.setAttribute("value", "500");
    newElement.classList.add(`${className}`);

    document.body.appendChild(newElement);
    this.createElements.push(newElement);
    return newElement;
  }

  hideElements(){
    this.createElements.map(e => e.hidden = true);
  }

  showElements(){
    this.createElements.map(e => e.hidden = false);
  }
}