<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>ChiYan Bot 管理后台</h2>
      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" />
        </el-form-item>
        <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { authApi } from '../api/services';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.error('请输入用户名和密码');
    return;
  }
  loading.value = true;
  try {
    const { data } = await authApi.login(username.value, password.value);
    authStore.setAuth(data.token, data.username);
    ElMessage.success('登录成功');
    router.push('/');
  } catch {
    ElMessage.error('登录失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}
.login-card {
  width: 400px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
