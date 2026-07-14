# LYGD Project Knowledge Base V1 — Data Model

## 目标

Module 03 建立企业项目知识库的文件型数据基础。当前数据不接入页面，不改变 Weight Engine 或 Quotation Engine。

## 目录

```text
data/
├── project-schema.json
├── customer-schema.json
├── country-schema.json
├── opportunity-schema.json
├── projects/
│   └── example-project.json
├── customers/
│   └── example-customer.json
├── countries/
│   └── example-country.json
├── opportunities/
│   └── example-opportunity.json
└── templates/
    └── project-template.json
```

## 对象关系

```text
Country (countryCode)
  ├── 1:N Customer (countryCode)
  │       ├── 1:N Project (customer.id)
  │       └── 1:N Opportunity (customerId)
  ├── 1:N Project (country)
  └── 1:N Opportunity (countryCode)

Project
  ├── 1:N Quotation index (quotations)
  ├── 1:N File record (files)
  └── 1:N Smart configuration (smartConfigurations)
```

- 国家通过 `countryCode` 与客户、项目关联。
- 客户通过 `customerId` 与项目的 `customer.id` 关联。
- 客户的 `historicalProjectIds` 保存历史项目反向索引。
- 项目保存客户名称快照，便于历史记录阅读，但客户主数据仍以 customerId 为准。
- 报价数组只保存项目内索引；完整报价对象遵循 `quotation-schema.json`。
- 文件数组只保存元数据和受控路径，不直接把文件内容嵌入项目 JSON。

## 项目对象

项目对象覆盖：

- 项目编号、名称和报价场景。
- 隧道类型及隧道参数。
- 国家、客户和币种引用。
- 台车长度、结构等级、经验参考重量和工程师确认重量。
- 智能配置及其批准价格。
- 报价输入、历史报价索引和文件记录。
- 项目生命周期状态和版本信息。

## 客户对象

客户对象覆盖客户类型、联系方式、国家、历史项目关联和版本信息。公开示例不得包含真实个人联系方式。

## 国家对象

国家对象覆盖国家代码、中英文名称、区域、语言、币种和运输备注。运输信息没有获批内容时使用空数组，不得虚构。

## 数据边界

- 所有示例均为非真实数据。
- 未经核价的金额使用 `null`，不得用虚构数值填充。
- 经验重量必须标明来源和免责声明。
- 工程师确认重量优先。
- 知识库当前不接入 UI，也不参与现有计算。
- 实际数据入库前必须执行 Schema 校验和人工审核。


## CRM 商机对象

商机通过 customerId 关联客户、通过 countryCode 关联国家；商机转为正式项目后可填写 projectId。销售阶段使用 lead、contacted、technical_discussion、quotation_sent、negotiation、won、lost 七个受控值。预计金额不是正式报价，没有可靠依据时必须为 null。
