# System Architecture

## 当前架构

当前系统是静态 Web 应用，由一个业务页面、一个样式文件和 ES Modules 组成。

```text
index.html
styles.css
js/
├── app.js
├── weight-engine.js
├── quotation-engine.js
├── ui-controller.js
└── storage.js
data/
├── project-schema.json
├── business-rules.json
├── weight-reference.json
├── smart-config.json
├── quotation-schema.json
├── customer-schema.json
├── opportunity-schema.json
├── country-schema.json
├── projects/
├── customers/
├── opportunities/
├── countries/
└── templates/
```

## 模块职责

- `index.html`：承载现有 V2.0 业务页面和控件。
- `styles.css`：承载现有页面样式。
- `app.js`：应用入口和模块编排。
- `weight-engine.js`：重量规则入口、隧道类型模型分派和重量优先级。
- `quotation-engine.js`：钢材成本、加工费、总成本、利润与建议报价。
- `ui-controller.js`：DOM 查询、事件绑定、输入读取、结果更新和重置。
- `storage.js`：localStorage 保存与读取的预留接口，目前未接入业务流程。

## 当前数据流

```text
页面输入
  → ui-controller 读取
  → weight-engine 确定计算重量
  → quotation-engine 生成报价结果
  → ui-controller 更新页面
```

## 架构边界

- UI 层不得包含或修改重量、利润及报价公式。
- 重量引擎不得虚构价格。
- 报价引擎不得把经验重量解释为设计重量。
- 存储层不得改变业务规则，只负责数据读写。
- 应用入口只负责初始化和模块协调。

## 数据治理方向

未来数据库至少应区分：

- 经验重量规则及其版本、来源和生效日期。
- 工程师确认重量、确认人和确认时间。
- 材料、加工、系统、运输、安装及智能配置价格。
- 项目、客户、报价主记录与报价明细快照。
- 人工修正原因和审计日志。

## 安全与质量要求

- 价格和客户数据不得硬编码进公开示例。
- 核心计算应保持纯函数并具备单元测试。
- UI 控件与模块输入必须进行契约检查。
- 重大架构变更必须更新本文件与 CHANGELOG。
- 正式部署前需要权限、数据备份、错误监控和审批机制。


## Sprint 3 数据基础

- `project-schema.json` 和 `quotation-schema.json` 使用 JSON Schema Draft 2020-12 描述核心对象。
- `business-rules.json` 保存带编号、优先级、来源、状态和备注的机器可读规则。
- `weight-reference.json` 明确区分已验证、待确认、比例参考和禁止自动估重。
- `smart-config.json` 中的零价格是未核价占位值，不代表免费或批准价格。
- Sprint 3 不将这些文件接入现有页面，因此 Sprint 2 的数据流和公式保持不变。


## Sprint 4 Weight Engine V2

- `getWeightRecommendation()` 输出参考重量、单点参考范围、置信类型、来源和风险提示。
- 工程师确认重量优先；没有确认重量时才使用经验建议。
- 铁路重量以 12m=124 吨为基准按长度比例建议，公路和地铁再使用 0.76 与 0.5 比例。
- 水工隧洞没有工程师确认重量时禁止自动估算与自动报价。
- UI 仅复用现有参考重量控件和结果消息区域，不改变页面布局。
- 报价引擎及其成本、利润、建议报价公式保持不变。


## Module 03 项目知识库

- 项目、客户和国家以独立 JSON 记录保存，并通过稳定 ID 建立关系。
- 项目记录关联报价索引、智能配置和文件元数据。
- 所有 Schema 字段使用中文 description。
- 示例数据为非真实数据，未核价金额使用 null。
- 知识库暂不接入 UI、Weight Engine 或 Quotation Engine。


## Module 04 CRM 数据基础

- Customer 以 customerId 关联历史项目和商机。
- Opportunity 以 customerId、countryCode 关联客户与国家，并可在转为项目后记录 projectId。
- 销售阶段是受控枚举；预计金额不是正式报价。
- CRM 不接 UI、外部 API，也不参与 Weight Engine 或 Quotation Engine 计算。
