import { getWeightRecommendation } from './weight-engine.js';
import { calculateQuotation } from './quotation-engine.js';
import { createUiController } from './ui-controller.js';

/**
 * 初始化报价页面并连接 UI、重量建议和报价模块。
 */
function initializeApplication() {
  const uiController = createUiController();

  uiController.bindEvents((input) => {
    const recommendation = getWeightRecommendation({
      tunnelType: input.tunnelType,
      length: input.trolleyLength,
      confirmedWeight: input.confirmedWeight
    });

    uiController.renderWeightRecommendation(recommendation);

    if (recommendation.referenceWeight === null) {
      uiController.renderBlockedRecommendation(recommendation);
      return;
    }

    const result = calculateQuotation({
      ...input,
      weight: recommendation.referenceWeight
    });

    uiController.renderResult(input, result, recommendation.warning);
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
