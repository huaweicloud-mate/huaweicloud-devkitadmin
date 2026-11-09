# PR 留痕补录：2026-11-09 活动统计修复直接推送 develop 的提交

以下提交因现网紧急修复未走 PR 流程直接推送 develop，在此补录审计轨迹：

| 提交 | 内容 | 前端发布物 |
|---|---|---|
| 2f67249 | Σ 汇总行参与人数改去重口径（取各活动最大值），移除混语义的阶段求和展示 | prod 桶 index-D9R8iStO.js（CDN 已生效） |
| d5be822 | 多选/全部趋势图按活动拆分——每活动独立提交/审批图与 Y 轴 | prod 桶 index-B_6ajRqU.js（CDN 已生效） |

两者均已上线 open.huaweicloud.com 并通过 Playwright 真实路径四状态矩阵验证。
