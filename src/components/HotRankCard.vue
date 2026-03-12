<template>
  <div class="hotrank-card">
    <div class="card-header">
      <span class="card-icon">🔥</span>
      <h3 class="card-title">热门榜单</h3>
      <div class="platform-tabs">
        <button 
          v-for="platform in platforms" 
          :key="platform.key"
          :class="['tab-btn', { active: activePlatform === platform.key }]"
          @click="handlePlatformChange(platform.key)"
        >
          {{ platform.icon }} {{ platform.name }}
        </button>
      </div>
    </div>
    <div class="rank-list">
      <LoadingSpinner v-if="loading" text="加载中..." />
      <ul v-else class="rank-items">
        <li v-for="item in currentList" :key="item.rank" class="rank-item">
          <span class="rank-number" :class="getRankClass(item.rank)">{{ item.rank }}</span>
          <a :href="getPlatformUrl(item, activePlatform)" 
             target="_blank" 
             class="rank-title">
            {{ item.title }}
          </a>
          <span class="rank-hot">{{ formatHot(item.hot) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

// 真实 API 地址
const API_BASE = 'https://60s.viki.moe'

const platforms = [
  { key: 'douyin', name: '抖音', icon: '🎵', api: '/v2/douyin' },
  { key: 'weibo', name: '微博', icon: '🔴', api: '/v2/weibo' },
  { key: 'bili', name: 'B站', icon: '📺', api: '/v2/bili' }
]

const activePlatform = ref('douyin')
const loading = ref(false)
const hotRankData = ref({})

const currentList = computed(() => {
  return hotRankData.value[activePlatform.value] || []
})

const loadHotRank = async (platformKey) => {
  const platform = platforms.find(p => p.key === platformKey)
  if (!platform) return
  
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}${platform.api}?encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      hotRankData.value[platformKey] = result.data.map((item, index) => ({
        rank: index + 1,
        title: item.title,
        hot: item.hot_value || 0,
        link: item.link || ''
      }))
    }
  } catch (error) {
    console.error('获取热搜失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换平台时加载数据
const handlePlatformChange = (platformKey) => {
  activePlatform.value = platformKey
  if (!hotRankData.value[platformKey]) {
    loadHotRank(platformKey)
  }
}

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-1'
  if (rank === 2) return 'rank-2'
  if (rank === 3) return 'rank-3'
  return ''
}

const formatHot = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const getPlatformUrl = (item, platform) => {
  // 优先使用 API 返回的真实链接
  if (item.link) {
    return item.link
  }
  // 备用：自己拼接搜索链接
  const encoded = encodeURIComponent(item.title)
  switch (platform) {
    case 'douyin':
      return `https://www.douyin.com/search/${encoded}`
    case 'weibo':
      return `https://s.weibo.com/weibo?q=${encoded}`
    case 'bili':
      return `https://search.bilibili.com/article?keyword=${encoded}`
    default:
      return '#'
  }
}

onMounted(() => {
  // 默认加载抖音热搜
  loadHotRank('douyin')
})
</script>

<style scoped>
.hotrank-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.card-header .card-icon {
  font-size: 18px;
}

.card-header .card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: inline-block;
  margin-right: 12px;
}

.platform-tabs {
  display: inline-flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tab-btn {
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: all 0.2s;
  border: none;
}

.tab-btn:hover {
  background: var(--border-color);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.rank-list {
  flex: 1;
  overflow-y: auto;
  min-height: 280px;
  max-height: 320px;
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
  transition: background-color 0.2s;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-item:hover {
  background: var(--bg-secondary);
}

.rank-number {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 11px;
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
  font-size: 13px;
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
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* 自定义滚动条 */
.rank-list::-webkit-scrollbar {
  width: 5px;
}

.rank-list::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.rank-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .platform-tabs {
    margin-top: 10px;
  }
  
  .tab-btn {
    font-size: 11px;
    padding: 3px 8px;
  }
}
</style>
