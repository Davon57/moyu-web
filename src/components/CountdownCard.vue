<template>
  <div class="countdown-card">
    <div class="card-header">
      <span class="card-icon">⏰</span>
      <h3 class="card-title">下班倒计时</h3>
      <button class="settings-btn" @click="showSettings = !showSettings">
        ⚙️
      </button>
    </div>
    
    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-panel">
      <div class="setting-item">
        <label>下班时间</label>
        <input 
          type="time" 
          v-model="targetTime" 
          @change="saveSettings"
          class="time-input"
        />
      </div>
    </div>
    
    <!-- 倒计时显示 -->
    <div class="countdown-content">
      <div class="countdown-display">
        <div class="time-unit">
          <span class="time-value">{{ timeLeft.hours }}</span>
          <span class="time-label">时</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-unit">
          <span class="time-value">{{ timeLeft.minutes }}</span>
          <span class="time-label">分</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-unit">
          <span class="time-value">{{ timeLeft.seconds }}</span>
          <span class="time-label">秒</span>
        </div>
      </div>
      
      <div class="countdown-status" :class="{ 'is-workday': isWorkday, 'is-weekend': !isWorkday }">
        <span class="status-icon">{{ isWorkday ? '💼' : '🎉' }}</span>
        <span class="status-text">{{ statusText }}</span>
      </div>
      
      <div class="work-hours-info">
        <span>目标: {{ targetTime || '18:00' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const targetTime = ref('18:00')
const showSettings = ref(false)
const currentTime = ref(new Date())
let timer = null

const isWorkday = computed(() => {
  const day = currentTime.value.getDay()
  return day >= 1 && day <= 5
})

const timeLeft = computed(() => {
  const now = currentTime.value
  const [hours, minutes] = (targetTime.value || '18:00').split(':').map(Number)
  
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)
  
  // 如果目标时间已过，视为第二天
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }
  
  const diff = target - now
  const totalSeconds = Math.floor(diff / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
})

const statusText = computed(() => {
  if (!isWorkday.value) {
    return '周末到了！好好放松~'
  }
  
  const h = parseInt(timeLeft.value.hours)
  const m = parseInt(timeLeft.value.minutes)
  
  if (h > 4) {
    return '距离下班还有好一会儿...'
  } else if (h > 1) {
    return '快了快了！坚持住！'
  } else if (h > 0) {
    return '马上就到了！冲！'
  } else if (m > 30) {
    return '半小时倒计时！'
  } else if (m > 10) {
    return '胜利在望！'
  } else {
    return '准备下班！'
  }
})

const saveSettings = () => {
  localStorage.setItem('moyu-countdown-target', targetTime.value)
}

const loadSettings = () => {
  const saved = localStorage.getItem('moyu-countdown-target')
  if (saved) {
    targetTime.value = saved
  }
}

const updateTime = () => {
  currentTime.value = new Date()
}

onMounted(() => {
  loadSettings()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.countdown-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 8px;
}

.card-icon {
  font-size: 18px;
}

.card-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.settings-btn {
  background: transparent;
  padding: 6px;
  border-radius: 6px;
  font-size: 15px;
  transition: background-color 0.2s;
}

.settings-btn:hover {
  background: var(--bg-secondary);
}

.settings-panel {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-item label {
  font-size: 13px;
  color: var(--text-secondary);
}

.time-input {
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  background: var(--card-bg);
  color: var(--text-color);
}

.countdown-content {
  padding: 20px 16px;
  text-align: center;
}

.countdown-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Courier New', monospace;
  background: var(--bg-secondary);
  padding: 6px 10px;
  border-radius: 8px;
  min-width: 54px;
}

.time-label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.time-separator {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-secondary);
}

.countdown-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 13px;
  margin-bottom: 14px;
}

.countdown-status.is-workday {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.countdown-status.is-weekend {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.status-icon {
  font-size: 14px;
}

.work-hours-info {
  font-size: 11px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .time-value {
    font-size: 26px;
    padding: 5px 8px;
    min-width: 46px;
  }
  
  .time-separator {
    font-size: 22px;
  }
}
</style>
