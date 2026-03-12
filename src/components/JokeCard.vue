<template>
  <div class="joke-card">
    <div class="card-header">
      <span class="card-icon">😂</span>
      <h3 class="card-title">摸鱼笑话</h3>
      <button class="refresh-btn" @click="refreshJoke" :disabled="loading">
        <span :class="['refresh-icon', { spinning: loading }]">🔄</span>
      </button>
    </div>
    <div class="joke-content">
      <LoadingSpinner v-if="loading" text="加载笑话中..." />
      <div v-else class="joke-text">
        <p>{{ currentJoke }}</p>
      </div>
      <div v-if="!loading" class="joke-actions">
        <button class="action-btn" @click="refreshJoke">
          <span>🔄</span>
          <span>换一条</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const API_BASE = 'https://60s.viki.moe'

const currentJoke = ref('')
const loading = ref(false)

const refreshJoke = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/duanzi?encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      currentJoke.value = result.data.duanzi
    }
  } catch (error) {
    console.error('获取笑话失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshJoke()
})
</script>

<style scoped>
.joke-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 10px;
}

.card-icon {
  font-size: 20px;
}

.card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.refresh-btn {
  background: transparent;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.refresh-icon {
  display: inline-block;
  font-size: 16px;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.joke-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.joke-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joke-text p {
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-color);
  text-align: center;
  margin: 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.joke-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 20px;
  background: var(--primary-color);
  color: white;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover {
  opacity: 0.9;
  transform: scale(0.98);
}
</style>
