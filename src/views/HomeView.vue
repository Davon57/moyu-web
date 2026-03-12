<template>
  <div class="home">
    <section class="rank-section">
      <div class="rank-grid">
        <div class="rank-item"><NewsCard /></div>
        <div class="rank-item"><RednoteCard /></div>
        <div class="rank-item"><SingleRankCard platform="douyin" /></div>
        <div class="rank-item"><SingleRankCard platform="weibo" /></div>
        <div class="rank-item"><ZhihuCard /></div>
        <div class="rank-item"><DongchediCard /></div>
        <div class="rank-item"><MaoyanRtCard /></div>
        <div class="rank-item"><MaoyanTvCard /></div>
        <div class="rank-item"><MaoyanWebCard /></div>
        <div class="rank-item"><DoubanTvCard /></div>
        <div class="rank-item"><DoubanShowCard /></div>
        <div class="rank-item"><DoubanCard /></div>
        <div class="rank-item"><DoubanGlobalTvCard /></div>
        <div class="rank-item"><DoubanGlobalShowCard /></div>
        <div class="rank-item"><NcmCard /></div>
        <div class="rank-item"><MaoyanCard /></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import SingleRankCard from '../components/SingleRankCard.vue'
import NewsCard from '../components/NewsCard.vue'
import RednoteCard from '../components/RednoteCard.vue'
import ZhihuCard from '../components/ZhihuCard.vue'
import DongchediCard from '../components/DongchediCard.vue'
import NcmCard from '../components/NcmCard.vue'
import MaoyanCard from '../components/MaoyanCard.vue'
import MaoyanRtCard from '../components/MaoyanRtCard.vue'
import MaoyanTvCard from '../components/MaoyanTvCard.vue'
import MaoyanWebCard from '../components/MaoyanWebCard.vue'
import DoubanCard from '../components/DoubanCard.vue'
import DoubanTvCard from '../components/DoubanTvCard.vue'
import DoubanGlobalTvCard from '../components/DoubanGlobalTvCard.vue'
import DoubanShowCard from '../components/DoubanShowCard.vue'
import DoubanGlobalShowCard from '../components/DoubanGlobalShowCard.vue'
</script>

<style scoped>
.home {
  min-height: 100%;
  background: var(--bg-secondary);
}

/* 榜单区域 */
.rank-section {
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
}

.rank-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.rank-item {
  min-width: 0;
}

.rank-item :deep(.single-rank-card),
.rank-item :deep(.news-card) {
  height: 100%;
  min-height: 320px;
}

.rank-item :deep(.single-rank-card .rank-list),
.rank-item :deep(.news-card .news-list) {
  flex: 1;
  overflow-y: auto;
  max-height: 360px;
}

/* 响应式 */
@media (max-width: 1600px) {
  .rank-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (max-width: 1024px) {
  .rank-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .rank-section { padding: 12px; }
  .rank-grid { grid-template-columns: 1fr; gap: 12px; }
  .rank-item :deep(.single-rank-card),
  .rank-item :deep(.news-card) { min-height: 280px; }
}
</style>
