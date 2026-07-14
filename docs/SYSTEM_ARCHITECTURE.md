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
