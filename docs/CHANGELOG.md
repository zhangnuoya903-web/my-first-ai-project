# Changelog

本项目的重大产品、业务规则和架构变更记录在此文件中。

## Sprint 0 — Project Governance — 2026-07-14

### Added

- 建立 PROJECT_CHARTER、PRODUCT_VISION 和 PRODUCT_ROADMAP。
- 建立 BUSINESS_RULES 和 SYSTEM_ARCHITECTURE。
- 建立 SPRINT_PLAN 和 CHANGELOG。
- 建立根目录 AGENTS.md，约束未来 AI 开发。
- 更新 README，增加项目定位、版本、流程、文档目录和免责声明。

### Changed

- 仅修改项目文档；没有修改 HTML、CSS 或 JavaScript 业务代码。

## V2.1 — Development Baseline — Unreleased

- 将治理文档、模块化架构和后续受控数据演进作为 V2.1 开发基线。
- V2.1 尚未作为正式业务版本发布。

## Sprint 2 — JavaScript Modularization — 2026-07-13

### Changed

- 将根目录 script.js 拆分为 app、weight-engine、quotation-engine、ui-controller 和 storage。
- 页面入口切换为 ES Modules。
- 保持 Sprint 1 计算公式、DOM 控件及重置行为。

## Sprint 1 — V2.0 Recovery — 2026-07-13

### Fixed

- 修复 HTML 与 JavaScript 控件 ID 不一致。
- 修复 calculateButton 和 resetButton。
- 修复 DOM 查询、输入引用和事件绑定。
- 恢复成本、利润和建议报价计算。

## V2.0 — Quotation Prototype

### Added

- 建立隧道二衬台车智能报价 V2.0 页面。
- 包含项目、隧道、台车、系统配置、智能配置、成本和结果区域。

### Limitations

- 当前结果属于内部辅助分析。
- 经验重量不能替代设计重量。
- 正式报价仍需工程和商务审核。
