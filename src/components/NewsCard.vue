<template>
  <div class="news-card">
    <div class="card-header">
      <span class="card-icon">📰</span>
      <h3 class="card-title">今日新闻</h3>
      <button class="refresh-btn" @click="loadNews" :disabled="loading">
        <span :class="['refresh-icon', { spinning: loading }]">🔄</span>
      </button>
    </div>
    <div class="news-list">
      <LoadingSpinner v-if="loading" text="加载中..." />
      <ul v-else class="news-items">
        <li v-for="(item, index) in newsList" :key="item.id" class="news-item">
          <span class="news-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
          <span class="news-title">{{ item.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const API_BASE = 'https://60s.viki.moe'

const newsList = ref([])
const loading = ref(false)

const loadNews = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/60s?encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data && result.data.news) {
      newsList.value = result.data.news.map((title, index) => ({
        id: index + 1,
        title: title
      }))
    }
  } catch (error) {
    console.error('获取新闻失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.news-card {
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
  flex-shrink: 0;
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

.news-list {
  flex: 1;
  overflow-y: auto;
}

.news-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.news-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background: var(--bg-secondary);
}

.news-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.news-rank.top {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.news-title {
  flex: 1;
  color: var(--text-color);
  font-size: 15px;
  line-height: 1.5;
}

.news-list::-webkit-scrollbar {
  width: 6px;
}

.news-list::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.news-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}
</style>
