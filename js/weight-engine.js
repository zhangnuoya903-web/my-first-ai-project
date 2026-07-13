/**
 * 将重量值标准化为可参与计算的非负数。
 */
function normalizeWeight(value) {
  const weight = Number(value);
  return Number.isFinite(weight) && weight > 0 ? weight : 0;
}

/**
 * 铁路隧道重量模型。Sprint 2 保留现有参考重量，不引入新公式。
 */
export function calculateRailwayWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

/**
 * 公路隧道重量模型。Sprint 2 保留现有参考重量，不引入新公式。
 */
export function calculateHighwayWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

/**
 * 地铁隧道重量模型。Sprint 2 保留现有参考重量，不引入新公式。
 */
export function calculateMetroWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

/**
 * 水工隧洞重量模型。Sprint 2 保留现有参考重量，不引入新公式。
 */
export function calculateHydraulicWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

const weightModels = {
  railway: calculateRailwayWeight,
  highway: calculateHighwayWeight,
  metro: calculateMetroWeight,
  hydraulic: calculateHydraulicWeight
};

/**
 * 根据隧道类型调用对应模型，返回页面已有的参考重量。
 */
export function calculateReferenceWeight(tunnelType, referenceWeight) {
  const calculateWeight = weightModels[tunnelType] || calculateRailwayWeight;
  return calculateWeight(referenceWeight);
}

/**
 * 保持 Sprint 1 规则：优先使用工程师确认重量，否则使用参考重量。
 */
export function resolveWeight({
  tunnelType,
  referenceWeight,
  confirmedWeight
}) {
  return (
    normalizeWeight(confirmedWeight) ||
    calculateReferenceWeight(tunnelType, referenceWeight)
  );
}
