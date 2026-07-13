import { resolveWeight } from './weight-engine.js';
import { calculateQuotation } from './quotation-engine.js';
import { createUiController } from './ui-controller.js';

/**
 * 初始化报价页面并连接 UI、重量和报价模块。
 */
function initializeApplication() {
  const uiController = createUiController();

  uiController.bindEvents((input) => {
    const weight = resolveWeight({
      tunnelType: input.tunnelType,
      referenceWeight: input.referenceWeight,
      confirmedWeight: input.confirmedWeight
    });
    const result = calculateQuotation({
      ...input,
      weight
    });

    uiController.renderResult(input, result);
  });
}

/**
 * 在 DOM 可用后启动应用入口。
 */
function startApplication() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
  } else {
    initializeApplication();
  }
}

startApplication();
