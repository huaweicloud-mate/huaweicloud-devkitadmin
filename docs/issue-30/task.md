# Issue #30 任务拆解

| # | 任务 | 仓库 | 状态 |
|---|------|------|------|
| 1 | 配置项：实时聚合开关 + 间隔（分钟） | hdkitservice | ✅ |
| 2 | RealtimeMetricsCache（内存缓存 + 观测状态） | hdkitservice | ✅ |
| 3 | RealtimeAggregationTask（5 分钟定时 + ensureFresh 兜底） | hdkitservice | ✅ |
| 4 | DashboardService getter 口径参数化（statDate 重载 + 兼容无参） | hdkitservice | ✅ |
| 5 | DashboardController dateRange 参数 + RealtimePayload 包装 + /realtime/status | hdkitservice | ✅ |
| 6 | 后端测试：RealtimeAggregationTaskTest + ControllerTest 实时用例 | hdkitservice | ✅（执行待 CI） |
| 7 | 前端 API 层 dateRange 参数 | 主仓库 | ✅ |
| 8 | store 口径状态/解包/降级提示 | 主仓库 | ✅ |
| 9 | 看板顶栏切换控件 + 措辞联动 | 主仓库 | ✅ |
| 10 | 前端构建验证（vue-tsc + vite build） | 主仓库 | ✅ |
| 11 | 双仓库提交、建 PR、A2A QA | 两仓库 | ✅ |
