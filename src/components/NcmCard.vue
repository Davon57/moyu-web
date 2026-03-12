<template>
  <div class="single-rank-card ncm-card">
    <div class="card-header">
      <span class="card-icon">🎵</span>
      <h3 class="card-title">{{ currentListName }}</h3>
      <button v-if="currentListId" class="back-btn" @click="goBack">
        ← 返回
      </button>
      <button class="refresh-btn" @click="loadData" :disabled="loading">
        <span :class="['refresh-icon', { spinning: loading }]">🔄</span>
      </button>
    </div>
    <div class="rank-list">
      <LoadingSpinner v-if="loading" text="加载中..." />
      <ul v-else-if="currentListId" class="rank-items">
        <li v-for="item in detailList" :key="item.id" class="rank-item">
          <span class="rank-number">{{ item.rank }}</span>
          <div class="song-info">
            <a :href="item.link" target="_blank" class="song-title">
              {{ item.title }}
            </a>
            <a :href="item.artistLink" target="_blank" class="artist-name">
              {{ item.artist }}
            </a>
          </div>
        </li>
      </ul>
      <ul v-else class="rank-items">
        <li v-for="item in list" :key="item.id" class="rank-item" @click="showDetail(item)">
          <span class="list-icon">🎶</span>
          <div class="list-info">
            <span class="list-name">{{ item.name }}</span>
            <span class="list-freq">{{ item.update_frequency }}</span>
          </div>
          <span class="arrow">→</span>
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
const detailList = ref([])
const currentListId = ref(null)
const currentListName = ref('网易云榜单')
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/ncm-rank/list?encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      list.value = result.data.slice(0, 10).map((item) => ({
        id: item.id,
        name: item.name,
        update_frequency: item.update_frequency || '',
        link: item.link || ''
      }))
    }
  } catch (error) {
    console.error('获取网易云榜单失败:', error)
  } finally {
    loading.value = false
  }
}

const showDetail = async (item) => {
  currentListId.value = item.id
  currentListName.value = item.name
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/ncm-rank/${item.id}?encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      detailList.value = result.data.slice(0, 10).map((song) => ({
        id: song.id,
        rank: song.rank,
        title: song.title,
        artist: song.artist?.map(a => a.name).join(', ') || '',
        artistLink: song.artist?.[0]?.link || '',
        link: song.link || ''
      }))
    }
  } catch (error) {
    console.error('获取榜单详情失败:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  currentListId.value = null
  currentListName.value = '网易云榜单'
  detailList.value = []
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
  gap: 8px;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.back-btn {
  font-size: 12px;
  color: var(--primary-color);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
}

.back-btn:hover {
  text-decoration: underline;
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
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 10px;
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

.list-icon {
  font-size: 20px;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-name {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-freq {
  font-size: 12px;
  color: var(--text-secondary);
}

.arrow {
  color: var(--text-secondary);
  font-size: 14px;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  display: block;
  font-size: 14px;
  color: var(--text-color);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-title:hover {
  color: var(--primary-color);
}

.artist-name {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name:hover {
  color: var(--primary-color);
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
