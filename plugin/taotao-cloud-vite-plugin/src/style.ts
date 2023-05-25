export const addStyle = (style: string): void => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style;
  document.getElementsByTagName('head')[0].appendChild(styleElement);
}