import { Elements } from './Elements.js';
const elements = new Elements();

export class UI {

  textRgb(inputClassName, textpClassName, text) {
    const rgbInput = elements.InputTypeColor(`${inputClassName}`);

    const p = elements.p(`${textpClassName}`);
    p.textContent = `${text}`;
    return rgbInput;
  }

  textRange(inputClassName, textpClassName, text) {
    const range = elements.inputTypeRange(`${inputClassName}`);

    const p = elements.p(`${textpClassName}`);
    p.textContent = `${text}`;
    return range;
  }

  scaleInputs(inputClassName, inputClassName2, textpClassName, text) {
    const inputText = elements.inputTypeNumber(`${inputClassName}`, 'inputText');
    const inputText2 = elements.inputTypeNumber(`${inputClassName2}`, 'inputText2');

    const p = elements.p(`${textpClassName}`);
    p.textContent = `${text}`;
    return [inputText, inputText2];
  }
}