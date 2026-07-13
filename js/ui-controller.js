/**
 * 查询必需的页面控件；控件缺失时立即给出明确错误。
 */
function getElement(id) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`未找到页面控件：${id}`);
  }

  return element;
}

/**
 * 将输入控件的值转换为可计算数字。
 */
function getNumber(element) {
  const value = Number(element.value);
  return Number.isFinite(value) ? value : 0;
}

/**
 * 将金额格式化为 Sprint 1 使用的人民币展示格式。
 */
function formatCurrency(value) {
  return `${value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} 元`;
}

/**
 * 集中查询报价页面使用的 DOM 控件。
 */
function collectElements() {
  const pageContainer = document.querySelector('.page-container');

  if (!pageContainer) {
    throw new Error('未找到页面容器：.page-container');
  }

  return {
    pageContainer,
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
}

/**
 * 创建页面控制器，统一负责读取表单、绑定事件和更新结果。
 */
export function createUiController() {
  const elements = collectElements();

  /**
   * 读取现有页面字段，不在 UI 层执行报价公式。
   */
  function readInput() {
    const selectedTunnelType =
      elements.tunnelType.options[elements.tunnelType.selectedIndex].text;
    const selectedLength =
      elements.trolleyLength.value === 'custom'
        ? getNumber(elements.customLength)
        : getNumber(elements.trolleyLength);

    return {
      projectName: elements.projectName.value.trim(),
      tunnelType: elements.tunnelType.value,
      tunnelTypeLabel: selectedTunnelType,
      trolleyLength: selectedLength,
      referenceWeight: getNumber(elements.referenceWeight),
      confirmedWeight: getNumber(elements.confirmedWeight),
      steelPrice: getNumber(elements.steelPrice),
      processingPrice: getNumber(elements.processingPrice),
      hydraulicCost: getNumber(elements.hydraulicCost),
      electricalCost: getNumber(elements.electricalCost),
      transportCost: getNumber(elements.transportCost),
      installationCost: getNumber(elements.installationCost),
      otherCost: getNumber(elements.otherCost),
      profitRate: getNumber(elements.profitRate)
    };
  }

  /**
   * 将报价引擎的结果写回现有结果控件。
   */
  function renderResult(input, result) {
    elements.equipmentName.textContent =
      input.projectName ||
      `${input.tunnelTypeLabel}二衬台车（${input.trolleyLength}米）`;
    elements.resultWeight.textContent =
      `${result.weight.toLocaleString('zh-CN')} 吨`;
    elements.resultSteelCost.textContent = formatCurrency(result.steelCost);
    elements.resultProcessingCost.textContent = formatCurrency(
      result.processingCost
    );
    elements.resultSmartCost.textContent = formatCurrency(result.smartCost);
    elements.resultTotalCost.textContent = formatCurrency(result.totalCost);
    elements.resultProfit.textContent = formatCurrency(result.profit);
    elements.resultQuotation.textContent = formatCurrency(result.quotation);
    elements.resultMessage.textContent = '报价分析已生成。';
  }

  /**
   * 恢复结果区域的初始内容。
   */
  function resetResult() {
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

  /**
   * 将所有现有输入控件恢复为 HTML 默认值。
   */
  function resetPage() {
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

    resetResult();
  }

  /**
   * 绑定现有计算和重置按钮事件。
   */
  function bindEvents(onCalculate) {
    elements.calculateButton.addEventListener('click', () => {
      onCalculate(readInput());
    });

    elements.resetButton.addEventListener('click', resetPage);
  }

  return {
    bindEvents,
    renderResult
  };
}
