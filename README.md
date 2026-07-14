# LYGD AI Tunnel Platform

LYGD AI Tunnel Platform 是面向隧道二衬台车非标项目的方案、经验重量、成本和商务报价辅助平台。

## 项目定位

平台用于统一项目参数、经验数据和报价过程，帮助工程师与商务人员形成可追溯的报价分析。平台是辅助工具，不替代工程设计、结构验算、正式报价审批或合同评审。

## 版本号

- 当前业务页面：V2.0
- 当前治理与开发基线：V2.1（开发中）
- 已完成工程阶段：Sprint 1、Sprint 2
- 当前治理阶段：Sprint 0 — Project Governance

版本记录见 [docs/CHANGELOG.md](docs/CHANGELOG.md)。

## 开发流程

1. 每个 Sprint 开始前确认目标、范围、业务规则和验收条件。
2. 开发前阅读根目录 [AGENTS.md](AGENTS.md) 及 [docs/BUSINESS_RULES.md](docs/BUSINESS_RULES.md)。
3. 不得在缺少业务依据时新增价格、重量系数或设计结论。
4. 实现完成后执行与风险相匹配的测试。
5. 每个 Sprint 必须报告修改文件、测试结果和已知问题。
6. 重大修改必须同步更新 [docs/CHANGELOG.md](docs/CHANGELOG.md)。
7. 经人工审核后才能进入下一 Sprint。

## 文档目录

- [项目章程](docs/PROJECT_CHARTER.md)
- [产品愿景](docs/PRODUCT_VISION.md)
- [产品路线图](docs/PRODUCT_ROADMAP.md)
- [业务规则](docs/BUSINESS_RULES.md)
- [系统架构](docs/SYSTEM_ARCHITECTURE.md)
- [Sprint 计划](docs/SPRINT_PLAN.md)
- [变更日志](docs/CHANGELOG.md)
- [AI 开发约束](AGENTS.md)

## 数据目录

- `data/project-schema.json`：项目、客户、国家、币种、隧道、台车、报价参数、智能配置和版本信息。
- `data/business-rules.json`：机器可读的已批准业务规则及规则编号。
- `data/weight-reference.json`：经验重量参考、比例模型和人工确认限制。
- `data/smart-config.json`：智能配置目录及未核价占位价格。
- `data/quotation-schema.json`：成本、利润、报价、币种、日期和版本对象。

数据文件目前只作为治理与模型基础，尚未接入 Sprint 2 的页面计算流程。

## 项目知识库

`data/projects/`、`data/customers/`、`data/countries/` 和 `data/templates/` 组成 LYGD Project Knowledge Base V1 的文件型基础。项目、客户和国家记录分别由对应 JSON Schema 约束，关系及数据边界见 [docs/DATA_MODEL.md](docs/DATA_MODEL.md)。

知识库目前不接入页面，也不参与 Weight Engine 或 Quotation Engine 计算。

## 当前运行方式

通过 HTTP 静态服务器访问项目根目录并打开 `index.html`。页面使用 ES Modules，不建议直接通过 `file://` 协议运行。

## 免责声明

本平台中的重量数据属于历史经验参考，不能视为设计重量、施工图结论或结构安全依据。系统生成的成本与建议报价仅用于内部分析，不构成正式设计、正式报价、合同承诺或法律意见。所有非标设备参数、重量、价格和商务条件必须由有权限的工程师及业务负责人复核确认。
