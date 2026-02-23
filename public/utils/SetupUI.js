import { Elements } from './Elements.js';
const elements = new Elements();

export class UI {

  textRgb(inputClassName, textpClassName, text) {
    const rgbInput = elements.inputRgb(`${inputClassName}`);

    const p = elements.p(`${textpClassName}`);
    p.textContent = `${text}`;
    return rgbInput;
  }

  textRange(inputClassName, textpClassName, text) {
    const rgbInput = elements.inputRange(`${inputClassName}`);

    const p = elements.p(`${textpClassName}`);
    p.textContent = `${text}`;
    return rgbInput;
  }
}