const STORAGE_KEY = 'tunnel-trolley-quotation';

/**
 * 保存报价数据的预留接口；Sprint 2 暂不接入页面流程。
 */
export function saveQuotation(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * 读取报价数据的预留接口；没有数据时返回 null。
 */
export function loadQuotation() {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  return storedValue ? JSON.parse(storedValue) : null;
}
