<template>
  <div class="poison-card">
    <div class="card-header">
      <span class="card-icon">💬</span>
      <h3 class="card-title">一言</h3>
      <button class="refresh-btn" @click="refresh" :disabled="loading">
        <span :class="['refresh-icon', { spinning: loading }]">🔄</span>
      </button>
    </div>
    <div class="soup-content">
      <LoadingSpinner v-if="loading" text="加载中..." />
      <div v-else class="soup-text">
        <p>{{ content }}</p>
      </div>
      <div v-if="!loading" class="soup-actions">
        <button class="action-btn" @click="refresh">
          <span>🔄</span>
          <span>换一句</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const API_BASE = 'https://60s.viki.moe'

const content = ref('')
const loading = ref(false)

const refresh = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/hitokoto?encoding=json`)
    const result = await response.json()
    
    if (result.data && result.data.hitokoto) {
      content.value = result.data.hitokoto
    }
  } catch (error) {
    console.error('获取一言失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.poison-card {
  background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
  border-radius: var(--radius);
  border: 1px solid #404040;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 10px;
}

.card-icon {
  font-size: 20px;
}

.card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.refresh-btn {
  background: transparent;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s;
  border: none;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
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

.soup-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.soup-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.soup-text p {
  font-size: 18px;
  line-height: 1.8;
  color: #fff;
  text-align: center;
  margin: 0;
  font-weight: 500;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.soup-actions {
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
  background: rgba(255, 255,  255, 0.15);
  color: #fff;
  font-size: 14px;
  transition: all 0.2s;
  border: none;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
