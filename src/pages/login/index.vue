<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">📊 插件运营看板</div>
      <div class="login-sub">Plugin Operations Dashboard</div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-item">
          <label>账号</label>
          <input
            v-model="formData.username"
            type="text"
            placeholder="请输入账号"
            class="form-input"
            autocomplete="username"
          />
        </div>
        <div class="form-item">
          <label>密码</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
            autocomplete="current-password"
          />
        </div>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>
      <div class="login-footer">
        <span class="hint-text">后续支持华为账号登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const formData = ref({ username: '', password: '' })

async function handleLogin() {
  if (!formData.value.username || !formData.value.password) {
    errorMsg.value = '请输入账号和密码'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res: any = await login(formData.value)
    if (res.token) {
      localStorage.setItem('token', res.token)
      router.push('/dashboard')
    } else {
      errorMsg.value = '登录失败：未返回 Token'
    }
  } catch (e: any) {
    errorMsg.value = '登录失败：' + (e.message || '服务异常')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.login-card {
  width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
}

.login-sub {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #5b8def;
    box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.1);
  }
}

.error-msg {
  font-size: 12px;
  color: #ff4d4f;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 11px;
  background: #5b8def;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;

  &:hover {
    background: #3b6fd6;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.login-footer {
  text-align: center;
  margin-top: 20px;

  .hint-text {
    font-size: 11px;
    color: #d1d5db;
  }
}
</style>
