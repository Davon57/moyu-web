<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <span class="logo-icon">🐟</span>
        <span class="logo-text">摸鱼坊</span>
        <span class="hitokoto-in-logo" @click="refreshHitokoto" :title="hitokotoFull">{{ hitokotoText }}</span>
      </div>
      
      <div class="header-tools">
        <div class="tool-wrapper weather-tool">
          <div class="tool-item" @click="toggleWeatherPanel" :class="{ active: showWeatherPanel }">
            <span class="tool-icon">{{ weatherIcon }}</span>
            <span class="tool-value">{{ temp }}°</span>
            <span class="tool-label">{{ weatherDesc }}</span>
            <span class="tool-extra">{{ windInfo }}</span>
          </div>
          <div v-if="showWeatherPanel" class="tool-panel weather-panel" @click.stop>
            <div class="panel-header">
              <span class="panel-title">{{ locationName }} {{ weatherData?.weather || '天气' }}</span>
              <button class="close-btn" @click="showWeatherPanel = false">✕</button>
            </div>
            <div class="panel-content">
              <div class="city-search">
                <input type="text" v-model="city" @keyup.enter="searchWeather" placeholder="输入城市名..." class="city-input" />
                <button class="search-btn" @click="searchWeather">🔍</button>
              </div>
              <LoadingSpinner v-if="loading" text="加载中..." />
              <div class="weather-detail" v-else-if="weatherData">
                <div class="detail-main">
                  <div class="temp-big">{{ weatherData.temperature }}°</div>
                  <div class="weather-info">
                    <span class="condition">{{ weatherData.weather }}</span>
                    <span class="update-time">更新时间: {{ weatherData.updated }}</span>
                  </div>
                </div>
                <div class="detail-section">
                  <h4 class="section-title">基本信息</h4>
                  <div class="detail-grid">
                    <div class="detail-item"><span class="label">💧 湿度</span><span class="value">{{ weatherData.humidity }}%</span></div>
                    <div class="detail-item"><span class="label">🌡️ 气压</span><span class="value">{{ weatherData.pressure }} hPa</span></div>
                    <div class="detail-item"><span class="label">💨 风力</span><span class="value">{{ weatherData.windDirection }} {{ weatherData.windPower }}</span></div>
                    <div class="detail-item"><span class="label">🌧️ 降水</span><span class="value">{{ weatherData.precipitation }} mm</span></div>
                  </div>
                </div>
                <div class="detail-section">
                  <h4 class="section-title">空气质量</h4>
                  <div class="detail-grid">
                    <div class="detail-item"><span class="label">🌬️ AQI</span><span class="value">{{ weatherData.aqi }} {{ weatherData.airQuality }}</span></div>
                    <div class="detail-item"><span class="label">PM2.5</span><span class="value">{{ weatherData.pm25 }} μg/m³</span></div>
                    <div class="detail-item"><span class="label">PM10</span><span class="value">{{ weatherData.pm10 }} μg/m³</span></div>
                    <div class="detail-item"><span class="label">🏆 排名</span><span class="value">第 {{ weatherData.airRank }}/{{ weatherData.totalCities }}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tool-wrapper countdown-tool">
          <div class="tool-item" @click="toggleCountdownPanel" :class="{ active: showCountdownPanel }">
            <span class="tool-icon">⏰</span>
            <span class="tool-value countdown-text">{{ timeLeft.hours }}:{{ timeLeft.minutes }}:{{ timeLeft.seconds }}</span>
            <span class="tool-label">{{ statusTextShort }}</span>
          </div>
          <div v-if="showCountdownPanel" class="tool-panel countdown-panel" @click.stop>
            <div class="panel-header">
              <span class="panel-title">下班倒计时</span>
              <button class="close-btn" @click="showCountdownPanel = false">✕</button>
            </div>
            <div class="panel-content">
              <div class="countdown-display">
                <div class="time-block"><span class="time-val">{{ timeLeft.hours }}</span><span class="time-lbl">时</span></div>
                <span class="sep">:</span>
                <div class="time-block"><span class="time-val">{{ timeLeft.minutes }}</span><span class="time-lbl">分</span></div>
                <span class="sep">:</span>
                <div class="time-block"><span class="time-val">{{ timeLeft.seconds }}</span><span class="time-lbl">秒</span></div>
              </div>
              <div class="countdown-status">{{ statusText }}</div>
              <div class="setting-row">
                <label class="setting-label">设置下班时间</label>
                <input type="time" v-model="targetTime" @change="saveSettings" class="time-input" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button class="theme-toggle" @click="themeStore.toggleTheme">
        <span class="theme-icon">{{ themeStore.isDark ? '☀️' : '🌙' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../stores/useThemeStore'
import LoadingSpinner from './LoadingSpinner.vue'

const themeStore = useThemeStore()
const API_BASE = 'https://60s.viki.moe'

// 天气
const city = ref('杭州')
const weatherData = ref(null)
const loading = ref(false)
const showWeatherPanel = ref(false)
const weatherIconMap = { '晴': '☀️', '多云': '⛅', '阴': '☁️', '小雨': '🌧️', '中雨': '🌧️', '大雨': '🌧️', '雷阵雨': '⛈️', '小雪': '🌨️', '雾': '🌫️', '霾': '😷' }
const weatherIcon = computed(() => weatherData.value ? (weatherIconMap[weatherData.value.weather] || '🌤️') : '🌤️')
const temp = computed(() => weatherData.value?.temperature || '--')
const weatherDesc = computed(() => weatherData.value?.weather || '加载中')
const locationName = computed(() => weatherData.value?.location || '')
const windInfo = computed(() => weatherData.value?.windPower || '')

const fetchWeather = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/v2/weather?query=${encodeURIComponent(city.value)}&encoding=json`)
    const result = await res.json()
    if (result.code === 200 && result.data) {
      const w = result.data.weather, aqi = result.data.air_quality, sr = result.data.sunrise
      weatherData.value = { location: result.data.location.name, temperature: w.temperature, weather: w.condition, humidity: w.humidity, pressure: w.pressure, precipitation: w.precipitation, windDirection: w.wind_direction, windPower: w.wind_power, updated: w.updated, aqi: aqi.aqi, airQuality: aqi.quality, pm25: aqi.pm25, pm10: aqi.pm10, airRank: aqi.rank, totalCities: aqi.total_cities, sunrise: sr?.sunrise_desc, sunset: sr?.sunset_desc }
    }
  } catch (e) { console.error(e) } finally { loading.value = false }
}
const searchWeather = () => { if (city.value.trim()) fetchWeather() }
const toggleWeatherPanel = () => { 
  showWeatherPanel.value = !showWeatherPanel.value
  if (showWeatherPanel.value) showCountdownPanel.value = false
}

// 倒计时
const targetTime = ref('17:30')
const currentTime = ref(new Date())
const showCountdownPanel = ref(false)
let timer = null

const statusText = computed(() => {
  const now = new Date(), day = now.getDay()
  if (day === 0 || day === 6) return '🎉 周末到了!'
  if (timeLeft.value.isDone) return '🎉 已下班!'
  const h = parseInt(timeLeft.value.hours), m = parseInt(timeLeft.value.minutes)
  if (h > 4) return '💼 距离下班...'
  if (h > 1) return '😊 快了!'
  if (h > 0) return '🚀 马上到!'
  if (m > 30) return '⏰ 半小时!'
  return '🎉 准备下班!'
})

const statusTextShort = computed(() => {
  const now = new Date(), day = now.getDay()
  if (day === 0 || day === 6) return '周末'
  if (timeLeft.value.isDone) return '已下班'
  const h = parseInt(timeLeft.value.hours), m = parseInt(timeLeft.value.minutes)
  if (h > 4) return '工作中'
  if (h > 1) return '快了'
  if (h > 0) return '马上到'
  if (m > 30) return '半小时'
  return '下班!'
})

const timeLeft = computed(() => {
  const now = currentTime.value
  const [targetHour, targetMinute] = targetTime.value.split(':').map(Number)
  
  // 判断是否已经过了下班时间
  const isAfterWork = now.getHours() > targetHour || 
    (now.getHours() === targetHour && now.getMinutes() >= targetMinute)
  
  // 如果已经过了下班时间，显示已下班
  if (isAfterWork) {
    return { hours: '00', minutes: '00', seconds: '00', isDone: true }
  }
  
  // 未到下班时间，计算倒计时
  const target = new Date(now)
  target.setHours(targetHour, targetMinute, 0, 0)
  const diff = target - now
  const total = Math.floor(diff / 1000)
  const hs = Math.floor(total / 3600)
  const ms = Math.floor((total % 3600) / 60)
  const ss = total % 60
  return { hours: String(hs).padStart(2,'0'), minutes: String(ms).padStart(2,'0'), seconds: String(ss).padStart(2,'0'), isDone: false }
})

const loadSettings = () => { targetTime.value = localStorage.getItem('moyu-countdown-target') || '17:30' }
const saveSettings = () => { localStorage.setItem('moyu-countdown-target', targetTime.value) }
const toggleCountdownPanel = () => { 
  showCountdownPanel.value = !showCountdownPanel.value
  if (showCountdownPanel.value) showWeatherPanel.value = false
}

// 一言
const hitokotoText = ref('加载中...')
const hitokotoFull = ref('')
const refreshHitokoto = async () => {
  hitokotoText.value = '加载中...'
  try {
    const res = await fetch(`${API_BASE}/v2/hitokoto?encoding=json`)
    const result = await res.json()
    if (result.data?.hitokoto) {
      hitokotoFull.value = result.data.hitokoto
      hitokotoText.value = result.data.hitokoto
    }
  } catch (e) { hitokotoText.value = '加载失败' }
}

// 点击外部关闭
const handleClickOutside = (e) => {
  const headerContent = e.target.closest('.header-content')
  if (!headerContent) {
    showWeatherPanel.value = false
    showCountdownPanel.value = false
    return
  }
  // 点击天气工具打开天气面板，关闭倒计时面板
  if (showWeatherPanel.value && !e.target.closest('.weather-tool')) {
    showWeatherPanel.value = false
  }
  // 点击倒计时工具打开倒计时面板，关闭天气面板
  if (showCountdownPanel.value && !e.target.closest('.countdown-tool')) {
    showCountdownPanel.value = false
  }
  // 打开一个时关闭另一个
  if (showWeatherPanel.value && showCountdownPanel.value) {
    if (e.target.closest('.weather-tool')) {
      showCountdownPanel.value = false
    } else if (e.target.closest('.countdown-tool')) {
      showWeatherPanel.value = false
    }
  }
}

onMounted(() => {
  themeStore.initTheme()
  fetchWeather()
  loadSettings()
  refreshHitokoto()
  timer = setInterval(() => currentTime.value = new Date(), 1000)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header { background: var(--card-bg); border-bottom: 1px solid var(--border-color); padding: 10px 0; position: sticky; top: 0; z-index: 100; }
.header-content { max-width: 1600px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; position: relative; }
.logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
.logo-icon { font-size: 28px; animation: fishBounce 2s ease-in-out infinite; }
@keyframes fishBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.logo-text { font-size: 18px; font-weight: bold; color: var(--text-color); }
.hitokoto-in-logo { font-size: 14px; color: var(--text-secondary); max-width: 500px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; font-style: italic; }
.hitokoto-in-logo:hover { color: var(--primary-color); }

.header-tools { display: flex; align-items: center; gap: 12px; flex: 1; justify-content: center; }
.tool-wrapper { position: relative; }
.tool-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.2s; min-width: 180px; }
.tool-item:hover { background: var(--border-color); }
.tool-item.active { border-color: var(--primary-color); }
.tool-icon { font-size: 18px; flex-shrink: 0; }
.tool-value { font-size: 18px; font-weight: 600; color: var(--text-color); font-family: monospace; }
.tool-label { font-size: 13px; color: var(--text-secondary); }
.tool-extra { font-size: 12px; color: var(--text-secondary); }
.countdown-text { font-weight: 600; }

.tool-panel { position: absolute; top: 100%; left: 0; margin-top: 8px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 200; }
.panel-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-color); }
.panel-title { font-size: 14px; font-weight: 600; color: var(--text-color); }
.close-btn { background: transparent; border: none; font-size: 14px; color: var(--text-secondary); cursor: pointer; }
.panel-content { padding: 16px; }

.weather-panel { width: 360px; max-height: 500px; overflow-y: auto; }
.countdown-panel { width: 280px; }
.city-input { flex: 1; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px; background: var(--bg-secondary); color: var(--text-color); }
.search-btn { padding: 8px 12px; border: none; border-radius: 8px; background: var(--primary-color); cursor: pointer; }
.detail-main { display: flex; align-items: center; gap: 16px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; margin-bottom: 16px; }
.temp-big { font-size: 48px; font-weight: bold; }
.weather-info { display: flex; flex-direction: column; gap: 4px; }
.condition { font-size: 18px; font-weight: 500; }
.update-time { font-size: 12px; opacity: 0.8; }
.detail-section { margin-bottom: 16px; }
.section-title { font-size: 12px; font-weight: 600; color: var(--text-secondary); margin: 0 0 10px 0; }
.detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.detail-item { display: flex; flex-direction: column; gap: 2px; padding: 8px; background: var(--bg-secondary); border-radius: 8px; }
.detail-item .label { font-size: 11px; color: var(--text-secondary); }
.detail-item .value { font-size: 13px; font-weight: 500; color: var(--text-color); }

.countdown-panel { width: 280px; }
.countdown-display { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; }
.time-block { display: flex; flex-direction: column; align-items: center; }
.time-val { font-size: 32px; font-weight: bold; color: var(--primary-color); font-family: monospace; background: var(--bg-secondary); padding: 6px 10px; border-radius: 8px; min-width: 50px; text-align: center; }
.time-lbl { font-size: 11px; color: var(--text-secondary); margin-top: 4px; }
.sep { font-size: 28px; font-weight: bold; color: var(--text-secondary); }
.countdown-status { text-align: center; font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; }
.setting-row { display: flex; flex-direction: column; gap: 8px; }
.setting-label { font-size: 13px; color: var(--text-secondary); }
.time-input { padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 16px; background: var(--bg-secondary); color: var(--text-color); font-family: monospace; text-align: center; }

.theme-toggle { background: transparent; padding: 8px; border-radius: 50%; transition: background 0.2s; flex-shrink: 0; }
.theme-toggle:hover { background: var(--bg-secondary); }
.theme-icon { font-size: 20px; }

@media (max-width: 768px) {
  .header-content { padding: 0 12px; gap: 8px; }
  .logo-text { font-size: 16px; }
  .hitokoto-in-logo { display: none; }
  .weather-tool { display: none; }
}
</style>
