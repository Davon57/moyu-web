<template>
  <div class="single-rank-card zhihu-card">
    <div class="card-header">
      <span class="card-icon">💡</span>
      <h3 class="card-title">知乎话题</h3>
      <button class="refresh-btn" @click="loadData" :disabled="loading">
        <span :class="['refresh-icon', { spinning: loading }]">🔄</span>
      </button>
    </div>
    <div class="rank-list">
      <LoadingSpinner v-if="loading" text="加载中..." />
      <ul v-else class="rank-items">
        <li v-for="item in list" :key="item.rank" class="rank-item">
          <span class="rank-number" :class="getRankClass(item.rank)">{{ item.rank }}</span>
          <a :href="item.link" target="_blank" class="rank-title">
            {{ item.title }}
          </a>
          <span class="rank-hot">{{ item.hot }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const API_BASE = 'https://60s.viki.moe'

const list = ref([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/zhihu?encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      list.value = result.data.slice(0, 10).map((item, index) => ({
        rank: index + 1,
        title: item.title,
        hot: item.hot_value_desc || '',
        link: item.link || ''
      }))
    }
  } catch (error) {
    console.error('获取知乎话题失败:', error)
  } finally {
    loading.value = false
  }
}

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-1'
  if (rank === 2) return 'rank-2'
  if (rank === 3) return 'rank-3'
  return ''
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.single-rank-card {
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

.rank-list {
  flex: 1;
  overflow-y: auto;
}

.rank-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-item:hover {
  background: var(--bg-secondary);
}

.rank-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.rank-number.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffb800);
  color: #333;
}

.rank-number.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
  color: #333;
}

.rank-number.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  color: white;
}

.rank-title {
  flex: 1;
  color: var(--text-color);
  font-size: 15px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-title:hover {
  color: var(--primary-color);
  text-decoration: none;
}

.rank-hot {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.rank-list::-webkit-scrollbar {
  width: 6px;
}

.rank-list::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.rank-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}
</style>
