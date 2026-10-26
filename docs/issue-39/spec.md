# Spec: Issue #39 — 活动统计统一聚合接口 + 活动清单前端配置化

> 来源：Issue #39 Spec Document（Issue Agent 已发布），本文件为 coding 阶段落地版。

## 目标
- 后端新增统一聚合端点 `GET /activity/stats?activity_code=xxx[&types=summary,trend,conversion]`，返回按类型命名字段结构 `{ summary, trend, conversion }`。
- 前端活动清单配置化（`activity-config.ts`），新增活动仅改前端配置即出现在看板，无需后端发版。
- 旧三端点 `activity/summary|trend|conversion` 标记 deprecated（`@Deprecated` + `Deprecation` 响应头），保留过渡。
- 前端 dashboard 适配新接口，去除 API 层硬编码的 `ACTIVITY_CODE` 常量。

## 范围
- 后端（hdkitservice，关联仓库，分支 feat/issue-39 基于 dev）：
  - `ActivityStatsSnapshotRepository` 增加 activity_code 过滤查询；
  - 新增 `ActivityStatsDTO`（summary/trend/conversion 按类型命名字段）；
  - `DashboardService.getActivityStats(code, types)` 聚合 + types 裁剪；
  - `DashboardController` 新增 `/activity/stats` 端点，旧三端点加 Deprecation 头。
- 前端（本仓库，分支 feat/issue-39 基于 develop）：
  - `src/api/activity.ts` 新增 `getActivityStats(code, types?, dateRange?)`；
  - `src/pages/dashboard/data/activity-config.ts` 活动清单配置（code/name/章节名）；
  - `src/store/dashboard.ts` 切换到聚合接口，活动选择状态 + 配置驱动；
  - `src/api/dashboard.ts` 旧三个 getActivity* 标记 @deprecated，移除硬编码 ACTIVITY_CODE；
  - `src/pages/dashboard/index.vue` 活动选择器 + 配置驱动渲染；
  - `charts.ts` 章节名参数化（无 mock 数据，仅去除硬编码章节标签）。

## 验收
- `GET /activity/stats` 返回 `{ summary, trend, conversion }`；`types` 裁剪生效；
- 前端新增活动仅在 activity-config.ts 加一条配置；
- 旧端点带 `Deprecation: true` 头且行为不变；
- charts.ts / api 层无硬编码活动数据；
- 前后端测试通过。
