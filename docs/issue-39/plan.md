# Plan: Issue #39

## 测试 seam
- 后端：`DashboardService.getActivityStats(code, types)`（公开服务方法）+ `GET /activity/stats` MockMvc 层；旧端点 Deprecation 头。
- 前端：`activity-config.ts` 导出的配置/校验函数；`api/activity.ts` 参数拼装；store 聚合结果分发到 activitySummary/Trend/Conversion。

## 后端（hdkitservice）
1. Repository：`findFirstByActivityCodeOrderBySnapshotDateDesc(code)`、`findByActivityCodeAndSnapshotDateGreaterThanEqualOrderBySnapshotDateAsc(code, start)`。
2. `ActivityStatsDTO`：字段 `summary` / `trend` / `conversion`（可为 null，types 裁剪时省略）。
3. Service：`getActivityStats(String activityCode, Set<String> types)`；code 缺省回退最新快照的 code；types null/空 = 全量。
4. Controller：`GET /activity/stats`（activity_code 可选、types 逗号分隔）；旧三端点返回 `ResponseEntity` + `Deprecation: true`、`Sunset` 不设日期仅 `Link` 省略（仅 Deprecation 头），方法加 `@Deprecated`。
5. 测试：DashboardServiceTest 新增 getActivityStats 用例（全量/裁剪/按 code/回退）；DashboardControllerTest 新增 stats 端点 + deprecation 头断言。

## 前端（本仓库）
1. `activity-config.ts`：`ActivityConfig` 列表 + `getActivityConfig(code)` + `assertUniqueActivityCodes()`（开发期校验）。
2. `api/activity.ts`：`getActivityStats(code, types?, dateRange?)`。
3. store：`selectedActivityCode`（默认配置第一条）+ `loadActivityStats()` 一次请求填充三个旧 ref（模板零改动兼容）；`loadBusinessMetrics` 用其替换三个旧调用。
4. `api/dashboard.ts`：旧三函数 JSDoc `@deprecated`，删除 `ACTIVITY_CODE` 常量。
5. `index.vue`：s6 顶部加活动选择 select（options 来自配置），watch 切换重载活动数据；章节标签用配置 chapterLabels。
6. `charts.ts`：`buildActivityTrendOption` / funnel / conv 章节名参数化（默认值保持原标签）。
7. 测试：`src/pages/dashboard/data/__tests__/activity-config.spec.ts`（唯一性校验、查找）、store 活动聚合分发用例。

## 提交拆分（TDD）
- 后端：test 红 → feat 实现 →（一次 push）。
- 前端：test 红（activity-config + store 分发）→ feat 实现 → 适配 UI → push。

## 风险
- 快照表当前只有一个活动数据；code 不存在时返回零值结构（与旧行为一致）。
- 前端旧函数保留 deprecated 不删，避免外部引用破坏。
