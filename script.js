function getElement(id) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`未找到页面控件：${id}`);
  }

  return element;
}

function getNumber(element) {
  const value = Number(element.value);
  return Number.isFinite(value) ? value : 0;
}

function formatCurrency(value) {
  return `${value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} 元`;
}

function resetResult(elements) {
  elements.equipmentName.textContent = '等待生成';
  elements.resultWeight.textContent = '0 吨';
  elements.resultSteelCost.textContent = '0 元';
  elements.resultProcessingCost.textContent = '0 元';
  elements.resultSmartCost.textContent = '0 元';
  elements.resultTotalCost.textContent = '0 元';
  elements.resultProfit.textContent = '0 元';
  elements.resultQuotation.textContent = '0 元';
  elements.resultMessage.textContent =
    '当前为静态界面原型，下一步接入重量参考和报价计算逻辑。';
}

function initializeQuotationPage() {
  const elements = {
    pageContainer: document.querySelector('.page-container'),
    projectName: getElement('projectName'),
    tunnelType: getElement('tunnelType'),
    trolleyLength: getElement('trolleyLength'),
    customLength: getElement('customLength'),
    referenceWeight: getElement('referenceWeight'),
    confirmedWeight: getElement('confirmedWeight'),
    steelPrice: getElement('steelPrice'),
    processingPrice: getElement('processingPrice'),
    hydraulicCost: getElement('hydraulicCost'),
    electricalCost: getElement('electricalCost'),
    transportCost: getElement('transportCost'),
    installationCost: getElement('installationCost'),
    otherCost: getElement('otherCost'),
    profitRate: getElement('profitRate'),
    calculateButton: getElement('calculateButton'),
    resetButton: getElement('resetButton'),
    equipmentName: getElement('equipmentName'),
    resultWeight: getElement('resultWeight'),
    resultSteelCost: getElement('resultSteelCost'),
    resultProcessingCost: getElement('resultProcessingCost'),
    resultSmartCost: getElement('resultSmartCost'),
    resultTotalCost: getElement('resultTotalCost'),
    resultProfit: getElement('resultProfit'),
    resultQuotation: getElement('resultQuotation'),
    resultMessage: getElement('resultMessage')
  };

  elements.calculateButton.addEventListener('click', () => {
    const confirmedWeight = getNumber(elements.confirmedWeight);
    const referenceWeight = getNumber(elements.referenceWeight);
    const weight = confirmedWeight || referenceWeight;
    const steelCost = weight * getNumber(elements.steelPrice);
    const processingCost = weight * getNumber(elements.processingPrice);
    const smartCost = 0;

    const totalCost =
      steelCost +
      processingCost +
      getNumber(elements.hydraulicCost) +
      getNumber(elements.electricalCost) +
      getNumber(elements.transportCost) +
      getNumber(elements.installationCost) +
      getNumber(elements.otherCost) +
      smartCost;

    const profit = totalCost * (getNumber(elements.profitRate) / 100);
    const quotation = totalCost + profit;

    const selectedTunnelType =
      elements.tunnelType.options[elements.tunnelType.selectedIndex].text;
    const selectedLength =
      elements.trolleyLength.value === 'custom'
        ? getNumber(elements.customLength)
        : getNumber(elements.trolleyLength);
    const projectName = elements.projectName.value.trim();

    elements.equipmentName.textContent =
      projectName || `${selectedTunnelType}二衬台车（${selectedLength}米）`;
    elements.resultWeight.textContent = `${weight.toLocaleString('zh-CN')} 吨`;
    elements.resultSteelCost.textContent = formatCurrency(steelCost);
    elements.resultProcessingCost.textContent = formatCurrency(processingCost);
    elements.resultSmartCost.textContent = formatCurrency(smartCost);
    elements.resultTotalCost.textContent = formatCurrency(totalCost);
    elements.resultProfit.textContent = formatCurrency(profit);
    elements.resultQuotation.textContent = formatCurrency(quotation);
    elements.resultMessage.textContent = '报价分析已生成。';
  });

  elements.resetButton.addEventListener('click', () => {
    elements.pageContainer
      .querySelectorAll('input, select')
      .forEach((control) => {
        if (control.type === 'checkbox' || control.type === 'radio') {
          control.checked = control.defaultChecked;
        } else if (control.tagName === 'SELECT') {
          const defaultOptionIndex = Array.from(control.options).findIndex(
            (option) => option.defaultSelected
          );
          control.selectedIndex =
            defaultOptionIndex >= 0 ? defaultOptionIndex : 0;
        } else {
          control.value = control.defaultValue;
        }
      });

    resetResult(elements);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQuotationPage);
} else {
  initializeQuotationPage();
}
