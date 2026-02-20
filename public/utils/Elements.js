export class Elements {
  inputRgb(className) {
    const newElement = document.createElement("input");
    newElement.type = 'color';
    newElement.classList.add(`${className}`);

    document.body.appendChild(newElement);
    return newElement;
  }

  p(className) {
    const newElement = document.createElement("p");
    newElement.classList.add(`${className}`);

    document.body.appendChild(newElement);
    return newElement;
  }
}