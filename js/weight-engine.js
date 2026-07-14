const RAILWAY_BASE_LENGTH = 12;
const RAILWAY_BASE_WEIGHT = 124;
const HIGHWAY_RATIO = 0.76;
const METRO_RATIO = 0.5;
const STANDARD_LENGTHS = [9, 10.5, 12];
const REFERENCE_WARNING = '历史经验参考，不替代正式设计';

/**
 * 将重量值标准化为可参与计算的非负数。
 */
function normalizeWeight(value) {
  const weight = Number(value);
  return Number.isFinite(weight) && weight > 0 ? weight : 0;
}

/**
 * 将建议重量保留到两位小数，避免浮点误差进入报价。
 */
function roundWeight(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * 在没有获批误差带时，以单点参考值表达可用范围，不虚构上下限。
 */
function createRange(referenceWeight) {
  if (referenceWeight === null) {
    return null;
  }

  return {
    min: referenceWeight,
    max: referenceWeight,
    unit: 'ton',
    basis: 'single-reference'
  };
}

/**
 * 根据铁路 12m=124 吨基准按长度比例生成经验参考重量。
 */
function calculateRailwayRecommendation(length) {
  return roundWeight(
    RAILWAY_BASE_WEIGHT * (length / RAILWAY_BASE_LENGTH)
  );
}

/**
 * 判断长度是否属于当前已登记的标准长度。
 */
function isStandardLength(length) {
  return STANDARD_LENGTHS.includes(length);
}

/**
 * 创建无法自动建议重量的结果。
 */
function createUnavailableRecommendation(source, warning) {
  return {
    referenceWeight: null,
    range: null,
    confidence: 'unavailable',
    source,
    warning
  };
}

/**
 * 生成 Weight Engine V2 重量建议。
 * 工程师确认重量优先；没有确认重量时才使用经验参考。
 */
export function getWeightRecommendation({
  tunnelType,
  length,
  confirmedWeight
}) {
  const normalizedConfirmedWeight = normalizeWeight(confirmedWeight);

  if (normalizedConfirmedWeight) {
    return {
      referenceWeight: normalizedConfirmedWeight,
      range: createRange(normalizedConfirmedWeight),
      confidence: 'engineer-confirmed',
      source: '工程师确认重量',
      warning: '已采用工程师确认重量。报价不能替代正式设计。'
    };
  }

  if (tunnelType === 'hydraulic') {
    return createUnavailableRecommendation(
      'LYGD业务规则 BR-0004',
      '水工隧洞必须人工确认，禁止自动估算和自动报价。'
    );
  }

  const normalizedLength = normalizeWeight(length);

  if (!normalizedLength) {
    return createUnavailableRecommendation(
      'Weight Engine V2',
      '缺少有效台车长度，必须由工程师确认重量。'
    );
  }

  const railwayWeight = calculateRailwayRecommendation(normalizedLength);
  let referenceWeight;
  let source;
  let confidence;

  if (tunnelType === 'railway') {
    referenceWeight = railwayWeight;
    source =
      normalizedLength === RAILWAY_BASE_LENGTH
        ? 'LYGD历史项目：铁路12m=124吨'
        : '铁路12m=124吨按长度比例推算';
    confidence =
      normalizedLength === RAILWAY_BASE_LENGTH
        ? 'historical-reference'
        : 'derived-reference';
  } else if (tunnelType === 'highway') {
    referenceWeight = roundWeight(railwayWeight * HIGHWAY_RATIO);
    source = 'LYGD历史经验：铁路同长度参考重量×0.76';
    confidence = 'derived-reference';
  } else if (tunnelType === 'metro') {
    referenceWeight = roundWeight(railwayWeight * METRO_RATIO);
    source = 'LYGD历史经验：铁路同长度参考重量×0.5';
    confidence = 'derived-reference';
  } else {
    return createUnavailableRecommendation(
      'Weight Engine V2',
      '未知隧道类型，必须由工程师确认重量。'
    );
  }

  const reviewWarning = isStandardLength(normalizedLength)
    ? ''
    : ' 非标准长度，必须由工程师复核。';

  return {
    referenceWeight,
    range: createRange(referenceWeight),
    confidence,
    source,
    warning: `${REFERENCE_WARNING}。${reviewWarning}`.trim()
  };
}

/**
 * 兼容 Sprint 2：返回传入的铁路参考重量。
 */
export function calculateRailwayWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

/**
 * 兼容 Sprint 2：返回传入的公路参考重量。
 */
export function calculateHighwayWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

/**
 * 兼容 Sprint 2：返回传入的地铁参考重量。
 */
export function calculateMetroWeight(referenceWeight) {
  return normalizeWeight(referenceWeight);
}

/**
 * 兼容 Sprint 2：返回传入的水工参考重量。
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
 * 兼容 Sprint 2：根据隧道类型返回页面传入的参考重量。
 */
export function calculateReferenceWeight(tunnelType, referenceWeight) {
  const calculateWeight = weightModels[tunnelType] || calculateRailwayWeight;
  return calculateWeight(referenceWeight);
}

/**
 * 兼容 Sprint 1/2：优先使用工程师确认重量，否则使用传入参考重量。
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
