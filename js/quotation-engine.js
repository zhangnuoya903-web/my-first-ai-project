/**
 * 计算钢材采购成本。
 */
export function calculateSteelCost(weight, steelPrice) {
  return weight * steelPrice;
}

/**
 * 计算加工制造费用。
 */
export function calculateProcessingCost(weight, processingPrice) {
  return weight * processingPrice;
}

/**
 * 汇总全部现有成本项。
 */
export function calculateTotalCost({
  steelCost,
  processingCost,
  hydraulicCost,
  electricalCost,
  transportCost,
  installationCost,
  otherCost,
  smartCost
}) {
  return (
    steelCost +
    processingCost +
    hydraulicCost +
    electricalCost +
    transportCost +
    installationCost +
    otherCost +
    smartCost
  );
}

/**
 * 根据成本合计和目标利润率计算预计利润。
 */
export function calculateProfit(totalCost, profitRate) {
  return totalCost * (profitRate / 100);
}

/**
 * 计算建议报价。
 */
export function calculateSuggestedQuotation(totalCost, profit) {
  return totalCost + profit;
}

/**
 * 按 Sprint 1 的原有公式生成完整报价结果。
 */
export function calculateQuotation(input) {
  const steelCost = calculateSteelCost(input.weight, input.steelPrice);
  const processingCost = calculateProcessingCost(
    input.weight,
    input.processingPrice
  );
  const smartCost = 0;
  const totalCost = calculateTotalCost({
    steelCost,
    processingCost,
    hydraulicCost: input.hydraulicCost,
    electricalCost: input.electricalCost,
    transportCost: input.transportCost,
    installationCost: input.installationCost,
    otherCost: input.otherCost,
    smartCost
  });
  const profit = calculateProfit(totalCost, input.profitRate);
  const quotation = calculateSuggestedQuotation(totalCost, profit);

  return {
    weight: input.weight,
    steelCost,
    processingCost,
    smartCost,
    totalCost,
    profit,
    quotation
  };
}
