<template>
  <div class="weather-card">
    <div class="card-header">
      <span class="card-icon">🌤️</span>
      <h3 class="card-title">天气查询</h3>
      <button class="refresh-btn" @click="fetchWeather(currentCity)" :disabled="loading">
        <span :class="['refresh-icon', { spinning: loading }]">🔄</span>
      </button>
    </div>
    
    <div class="city-selector">
      <input 
        type="text" 
        v-model="currentCity" 
        @keyup.enter="fetchWeather(currentCity)"
        placeholder="输入城市名，按回车搜索"
        class="city-input"
      />
      <button class="search-btn" @click="fetchWeather(currentCity)" :disabled="loading">
        🔍
      </button>
    </div>
    
    <div class="weather-content">
      <LoadingSpinner v-if="loading" text="查询天气中..." />
      <div v-else-if="weather" class="weather-info">
        <div class="weather-main">
          <span class="weather-icon">{{ getWeatherIcon(weather.weather) }}</span>
          <div class="temp-info">
            <span class="temperature">{{ weather.temp }}°</span>
            <span class="weather-desc">{{ weather.weather }}</span>
          </div>
        </div>
        
        <div class="weather-details">
          <div class="detail-item">
            <span class="detail-icon">💧</span>
            <span class="detail-label">湿度</span>
            <span class="detail-value">{{ weather.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">💨</span>
            <span class="detail-label">风速</span>
            <span class="detail-value">{{ weather.wind }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">🌬️</span>
            <span class="detail-label">AQI</span>
            <span class="detail-value">{{ weather.aqi }} {{ weather.airQuality }}</span>
          </div>
        </div>
        
        <div class="weather-location">
          <span class="location-icon">📍</span>
          <span class="location-text">{{ weather.location }}</span>
        </div>
        
        <div class="weather-suggestion">
          <span class="suggestion-text">{{ weather.suggestion }}</span>
        </div>
      </div>
      <div v-else class="weather-error">
        <p>获取天气失败，请稍后重试</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

// 60s API 地址
const API_BASE = 'https://60s.viki.moe'

const weather = ref(null)
const loading = ref(false)
const currentCity = ref('杭州')

// 天气图标映射
const weatherIconMap = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '🌧️',
  '雷阵雨': '⛈️',
  '小雪': '🌨️',
  '中雪': '🌨️',
  '大雪': '❄️',
  '雾': '🌫️',
  '霾': '😷',
  '台风': '🌀'
}

const getWeatherIcon = (condition) => {
  return weatherIconMap[condition] || '🌤️'
}

const getSuggestion = (condition) => {
  if (condition.includes('雨')) return '🌧️ 下雨天和摸鱼更配哦~'
  if (condition.includes('雪')) return '❄️ 下雪了，注意保暖！'
  if (condition.includes('晴')) return '☀️ 今天天气晴朗，适合出门摸鱼~'
  if (condition.includes('多云')) return '⛅ 多云天气，不晒也不暗！'
  if (condition.includes('阴')) return '☁️ 阴天有点闷，但不影响摸鱼心情'
  if (condition.includes('雾')) return '🌫️ 雾蒙蒙的，出门注意安全'
  if (condition.includes('霾')) return '😷 空气质量不佳，建议室内摸鱼'
  return '🌤️ 今天天气不错~'
}

const fetchWeather = async (city = '杭州') => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/v2/weather?query=${encodeURIComponent(city)}&encoding=json`)
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      const w = result.data.weather
      const aqi = result.data.air_quality
      weather.value = {
        location: result.data.location.name,
        temp: w.temperature,
        weather: w.condition,
        humidity: w.humidity,
        wind: w.wind_power,
        aqi: aqi.aqi,
        airQuality: aqi.quality,
        suggestion: getSuggestion(w.condition)
      }
    }
  } catch (error) {
    console.error('获取天气失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWeather(currentCity.value)
})
</script>

<style scoped>
.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius);
  border: none;
  overflow: hidden;
  color: white;
}

[data-theme="dark"] .weather-card {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  gap: 8px;
}

.card-icon {
  font-size: 18px;
}

.card-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
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
  background: rgba(255, 255, 255, 0.2);
}

.refresh-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.refresh-icon {
  display: inline-block;
  font-size: 15px;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.city-selector {
  display: flex;
  padding: 10px 16px;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.city-input {
  flex: 1;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 13px;
  outline: none;
}

.city-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.weather-content {
  padding: 16px;
}

.weather-info {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.weather-icon {
  font-size: 48px;
}

.temp-info {
  display: flex;
  flex-direction: column;
}

.temperature {
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
}

.weather-desc {
  font-size: 14px;
  opacity: 0.9;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 14px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.detail-icon {
  font-size: 14px;
}

.detail-label {
  font-size: 11px;
  opacity: 0.7;
}

.detail-value {
  font-size: 13px;
  font-weight: 500;
}

.weather-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
}

.location-icon {
  font-size: 12px;
}

.location-text {
  font-size: 13px;
  opacity: 0.9;
}

.weather-suggestion {
  text-align: center;
}

.suggestion-text {
  font-size: 12px;
  opacity: 0.8;
}

.weather-error {
  text-align: center;
  padding: 30px 0;
  opacity: 0.8;
}

.weather-error p {
  margin: 0;
}
</style>
