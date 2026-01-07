<template>
  <div class="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow p-[clamp(10px,2.2vw,16px)] relative select-none min-h-[500px] flex flex-col">
    
    

    <div class="flex items-center justify-between mb-[clamp(8px,1.8vw,12px)] relative z-10">
      <button class="rounded-lg hover:bg-gray-100 text-gray-600 px-[clamp(8px,2vw,12px)] py-[clamp(4px,1vw,8px)] text-[clamp(11px,2.8vw,14px)] transition-colors" @click="prevMonth">上月</button>
      
      <div class="flex items-center gap-2">
        <button 
          class="flex items-center gap-1 bg-white/80 backdrop-blur border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-3 py-1 rounded-lg transition-all text-[clamp(12px,3vw,16px)] font-semibold"
          @click="openPicker('year')"
        >
          <span>{{ currentSolarMonth.getYear() }}年</span>
          <i class="ri-arrow-down-s-line text-gray-400 text-xs"></i>
        </button>

        <button 
          class="flex items-center gap-1 bg-white/80 backdrop-blur border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 px-3 py-1 rounded-lg transition-all text-[clamp(12px,3vw,16px)] font-semibold"
          @click="openPicker('month')"
        >
          <span>{{ currentSolarMonth.getMonth() }}月</span>
          <i class="ri-arrow-down-s-line text-gray-400 text-xs"></i>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button class="rounded-lg hover:bg-gray-100 text-gray-600 px-[clamp(8px,2vw,12px)] py-[clamp(4px,1vw,8px)] text-[clamp(11px,2.8vw,14px)] transition-colors" @click="nextMonth">下月</button>
        <button 
          class="rounded-lg bg-slate-900 hover:bg-slate-700 text-white px-[clamp(8px,2vw,12px)] py-[clamp(4px,1vw,8px)] text-[clamp(11px,2.8vw,14px)] transition-colors shadow-md flex items-center gap-1" 
          @click="goToday"
        >
          <span class="hidden sm:inline">返回今天</span>
          <span class="sm:hidden">今</span>
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showPicker" class="absolute inset-0 z-20 bg-black/5 backdrop-blur-[1px] rounded-2xl" @click="showPicker = false"></div>
    </transition>

    <transition name="slide-down">
      <div v-if="showPicker" class="absolute top-[60px] left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 p-4 flex flex-col max-h-[50%] overflow-hidden">
        
        <div class="flex justify-center mb-4 border-b border-gray-100 pb-2">
          <div class="flex gap-2 bg-gray-100/50 p-1 rounded-lg">
            <button 
              class="px-4 py-1 rounded-md text-sm font-medium transition-all"
              :class="pickerMode === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              @click="pickerMode = 'year'"
            >
              年份
            </button>
            <button 
              class="px-4 py-1 rounded-md text-sm font-medium transition-all"
              :class="pickerMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              @click="pickerMode = 'month'"
            >
              月份
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-if="pickerMode === 'year'" class="grid grid-cols-4 gap-2">
            <button class="col-span-4 text-xs text-gray-400 py-2 hover:text-blue-500" @click="changePickerYearRange(-12)">
              <i class="ri-arrow-up-s-line"></i> 以前
            </button>
            <button 
              v-for="y in pickerYears" 
              :key="y"
              class="py-2 rounded-lg text-sm transition-all border"
              :class="y === pickerSelection.year ? 'bg-slate-900 text-white border-slate-900' : 'border-gray-50 bg-gray-50 text-gray-700 hover:border-blue-400'"
              @click="selectPickerYear(y)"
            >
              {{ y }}
            </button>
            <button class="col-span-4 text-xs text-gray-400 py-2 hover:text-blue-500" @click="changePickerYearRange(12)">
               以后 <i class="ri-arrow-down-s-line"></i>
            </button>
          </div>

          <div v-if="pickerMode === 'month'" class="grid grid-cols-3 gap-3">
            <button 
              v-for="m in 12" 
              :key="m"
              class="py-3 rounded-lg text-sm font-medium transition-all border"
              :class="m === pickerSelection.month ? 'bg-slate-900 text-white border-slate-900' : 'border-gray-50 bg-gray-50 text-gray-700 hover:border-blue-400'"
              @click="selectPickerMonth(m)"
            >
              {{ m }}月
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div class="relative">
      <div class="font-bold text-gray-100 select-none absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 whitespace-nowrap"
           style="font-size: clamp(40px, 12vw, 160px);">
        {{ currentSolarMonth.getYear() }}年{{ String(currentSolarMonth.getMonth()).padStart(2, '0') }}月
      </div>
    

    <div class="grid grid-cols-7 gap-[clamp(2px,0.8vw,6px)] mb-[clamp(6px,1.4vw,10px)] text-center text-gray-500 text-[clamp(10px,2.6vw,13px)] relative z-10">
      <div v-for="w in weeks" :key="w.name" :class="{ 'text-red-500': w.isWeekend }">
        {{ w.name }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-[clamp(2px,0.8vw,6px)] relative z-10">
      <div
        v-for="(d, i) in days42"
        :key="i"
        class="relative aspect-square rounded-lg border border-transparent p-[clamp(2px,0.8vw,6px)] flex flex-col justify-center cursor-pointer select-none transition-colors"
        :class="getCellClasses(d)"
        @click="selectDay(d)"
      >
        <div class="moonbox absolute top-[clamp(2px,0.7vw,6px)] left-[clamp(2px,0.7vw,6px)] 
              w-[clamp(8px,3vw,18px)] h-[clamp(8px,3vw,18px)]
              bg-contain bg-no-repeat opacity-80"
        ></div>

        <div class="text-center font-semibold leading-none pt-[clamp(2px,0.7vw,6px)] text-[clamp(12px,3.8vw,18px)]" 
             :class="getSolarTextClass(d)">
          {{ d.day }}
        </div>

        <div class="text-center truncate mt-[clamp(2px,0.6vw,6px)] px-[clamp(2px,0.6vw,6px)] text-[clamp(9px,2.2vw,12px)] font-medium" 
             :class="getLunarTextClass(d)">
          {{ d.text }}
        </div>

        <div class="absolute -top-[clamp(2px,0.6vw,5px)] -right-[clamp(2px,0.6vw,5px)] z-10">
          <span
            v-if="d.holiday && !d.holiday.isWork"
            class="flex items-center justify-center w-[clamp(12px,3.2vw,18px)] h-[clamp(12px,3.2vw,18px)] rounded bg-red-500 text-white text-[clamp(8px,2vw,10px)] shadow-sm leading-none font-bold"
          >
            休
          </span>
          <span
            v-else-if="d.holiday && d.holiday.isWork"
            class="flex items-center justify-center w-[clamp(12px,3.2vw,18px)] h-[clamp(12px,3.2vw,18px)] rounded bg-gray-600 text-white text-[clamp(8px,2vw,10px)] shadow-sm leading-none font-bold"
          >
            班
          </span>
          <span 
            v-else-if="d.isToday" 
            class="flex items-center justify-center w-[clamp(12px,3.2vw,18px)] h-[clamp(12px,3.2vw,18px)] rounded bg-blue-600 text-white text-[clamp(8px,2vw,10px)] shadow-sm leading-none font-bold"
          >
            今
          </span>
        </div>
      </div>
    </div>
    </div>

    <div class="mt-[clamp(10px,2vw,16px)] rounded-xl bg-gray-50 p-[clamp(10px,2vw,14px)] relative z-10 border border-gray-100">
      <div class="text-gray-800 font-semibold text-[clamp(12px,3.2vw,16px)]">{{ huangli.solar }}</div>
      <div class="mt-1 text-gray-600 text-[clamp(10px,2.6vw,13px)]">{{ huangli.lunar }} {{ huangli.gz }}</div>

      <div class="mt-[clamp(8px,1.8vw,12px)] grid grid-cols-1 sm:grid-cols-2 gap-[clamp(8px,1.6vw,12px)] text-[clamp(10px,2.4vw,12px)]">
        <div>
          <div class="text-gray-500 mb-1">宜</div>
          <div class="flex flex-wrap gap-1">
            <span v-for="x in huangli.yi" :key="x" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{{ x }}</span>
          </div>
        </div>
        <div>
          <div class="text-gray-500 mb-1">忌</div>
          <div class="flex flex-wrap gap-1">
            <span v-for="x in huangli.ji" :key="x" class="px-2 py-0.5 rounded bg-rose-50 text-rose-700">{{ x }}</span>
          </div>
        </div>

        <div class="space-y-1 text-gray-700">
          <div>纳音：{{ huangli.sound }}</div>
          <div>冲：{{ huangli.chong }}　煞：{{ huangli.sha }}</div>
          <div>建除：{{ huangli.duty }}　十二神：{{ huangli.twelveStar }}</div>
          <div>二十八宿：{{ huangli.twentyEightStar }}</div>
        </div>
        <div class="space-y-1 text-gray-700">
          <div>吉神：{{ huangli.god.ji.join(' ') || '—' }}</div>
          <div>凶神：{{ huangli.god.xiong.join(' ') || '—' }}</div>
          <div>胎神：{{ huangli.fetus }}</div>
          <div>彭祖：{{ huangli.pz.join(' ') }}</div>
        </div>
      </div>

      <div class="mt-[clamp(8px,1.8vw,12px)] text-gray-500 text-[clamp(10px,2.4vw,12px)]">时辰吉凶</div>
      <div class="mt-1 flex flex-wrap gap-1 text-[clamp(10px,2.4vw,12px)]">
        <span v-for="x in huangli.hours" :key="x" class="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700">{{ x }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, reactive } from 'vue'
import { Week, SolarMonth, SolarDay } from 'tyme4ts'

// ---------- 类型 ----------
interface WeekHead { name: string; isWeekend: boolean }
interface DayCell {
  solarDay: SolarDay
  day: number
  holiday: { isWork: boolean } | null
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  text: string
  isFestivalOrTerm: boolean 
  moon: boolean
  moonIndex: number
}

interface HuangliInfo {
  solar: string
  week: string
  lunar: string
  gz: string
  yi: string[]
  ji: string[]
  sound: string
  chong: string
  sha: string
  twelveStar: string
  twentyEightStar: string
  god: { ji: string[]; xiong: string[] }
  duty: string
  fetus: string
  pz: string[]
  hours: string[]
}

// ---------- 常量 ----------
const weekStart = 1
const now = new Date()

// ---------- 响应式 ----------
const weeks = ref<WeekHead[]>([])
const currentSolarMonth = shallowRef(SolarMonth.fromYm(now.getFullYear(), now.getMonth() + 1))
const selectedSolarDay = shallowRef<SolarDay>(SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate()))

// 弹窗状态
const showPicker = ref(false)
const pickerMode = ref<'year' | 'month'>('month')
const pickerSelection = reactive({ year: now.getFullYear(), month: now.getMonth() + 1 })
const pickerBaseYear = ref(now.getFullYear())

// 标题
// const monthName = computed(() => currentSolarMonth.value.toString())
const huangli = computed<HuangliInfo>(() => computeHuangli(selectedSolarDay.value))

// 42 格数据
const days42 = computed<DayCell[]>(() => {
  const arr: DayCell[] = []
  const weeksList = currentSolarMonth.value.getWeeks(weekStart)
  
  weeksList.forEach(w =>
    w.getDays().forEach(d => {
      arr.push(buildDayCell(d))
    })
  )
  
  return arr.slice(0, 42)
})

// 年份列表
const pickerYears = computed(() => {
  const start = pickerBaseYear.value - 6
  const list = []
  for (let i = 0; i < 12; i++) {
    list.push(start + i)
  }
  return list
})

// ---------- 逻辑函数 ----------
// 1. 样式逻辑
function getCellClasses(d: DayCell): string[] {
  const cls: string[] = []
  
  // 核心修改：默认背景透明，以便显示水印
  if (selectedSolarDay.value.equals(d.solarDay)) {
    // 选中态：给一个带透明度的背景，或纯色背景
    cls.push('bg-blue-50/90 ring-2 ring-blue-500 z-10')
  } else {
    // 默认透明
    cls.push('bg-transparent hover:bg-white/50') // hover时稍微给点白底
    
    if (!d.isCurrentMonth) {
      // 非本月
    } else if (d.isToday) {
      cls.push('ring-2 ring-indigo-400')
    }
  }

  // 节假日背景
  if (d.holiday && !d.holiday.isWork) {
    // 休：红底（带点透明度）
    cls.push('!bg-red-50/80')
  }

  /* ===== 月相 ===== */
  if (d.moon) {
    cls.push('moon')
    cls.push(`moon-${d.moonIndex}`)
  }
  return cls
}

function getSolarTextClass(d: DayCell): string {
  if (!d.isCurrentMonth) return 'text-gray-300'
  
  if (d.holiday && !d.holiday.isWork) return 'text-red-500' // 休
  if (d.holiday && d.holiday.isWork) return 'text-gray-900' // 班
  if (d.isWeekend) return 'text-red-500' // 周末
  
  return 'text-gray-900'
}

function getLunarTextClass(d: DayCell): string {
  if (!d.isCurrentMonth) return 'text-gray-300'
  
  // 节气/节日 蓝字
  if (d.isFestivalOrTerm) return 'text-blue-600 font-semibold'
  
  return 'text-gray-500'
}

// 2. 选择器与导航逻辑
function openPicker(mode: 'year' | 'month') {
  pickerMode.value = mode
  pickerSelection.year = currentSolarMonth.value.getYear()
  pickerSelection.month = currentSolarMonth.value.getMonth()
  pickerBaseYear.value = pickerSelection.year
  showPicker.value = true
}

function changePickerYearRange(delta: number) {
  pickerBaseYear.value += delta
}

function selectPickerYear(y: number) {
  pickerSelection.year = y
  pickerMode.value = 'month'
}

function selectPickerMonth(m: number) {
  pickerSelection.month = m
  confirmPicker()
}

function confirmPicker() {
  currentSolarMonth.value = SolarMonth.fromYm(pickerSelection.year, pickerSelection.month)
  const maxDay = currentSolarMonth.value.getDayCount()
  const day = Math.min(selectedSolarDay.value.getDay(), maxDay)
  selectedSolarDay.value = SolarDay.fromYmd(pickerSelection.year, pickerSelection.month, day)
  showPicker.value = false
}

function prevMonth() {
  const m = currentSolarMonth.value.next(-1)
  currentSolarMonth.value = m
  const day = Math.min(selectedSolarDay.value.getDay(), m.getDayCount())
  selectedSolarDay.value = SolarDay.fromYmd(m.getYear(), m.getMonth(), day)
}
function nextMonth() {
  const m = currentSolarMonth.value.next(1)
  currentSolarMonth.value = m
  const day = Math.min(selectedSolarDay.value.getDay(), m.getDayCount())
  selectedSolarDay.value = SolarDay.fromYmd(m.getYear(), m.getMonth(), day)
}

function goToday() {
  const n = new Date()
  currentSolarMonth.value = SolarMonth.fromYm(n.getFullYear(), n.getMonth() + 1)
  selectedSolarDay.value = SolarDay.fromYmd(n.getFullYear(), n.getMonth() + 1, n.getDate())
}

function selectDay(d: DayCell) {
  if (!d.isCurrentMonth) {
    currentSolarMonth.value = d.solarDay.getSolarMonth()
  }
  selectedSolarDay.value = d.solarDay
}

// 3. 数据构造逻辑
function buildWeekHeads(): WeekHead[] {
  const heads: WeekHead[] = []
  let w = Week.fromIndex(weekStart)
  for (let i = 0; i < 7; i++) {
    heads.push({ isWeekend: w.getIndex() === 0 || w.getIndex() === 6, name: w.getName() })
    w = w.next(1)
  }
  return heads
}

function buildDayCell(solarDay: SolarDay): DayCell {
  const lunarDay = solarDay.getLunarDay()
  const holiday  = solarDay.getLegalHoliday()
  const weekIdx  = solarDay.getWeek().getIndex()
  const term     = solarDay.getTerm()
  const phaseDay = solarDay.getPhaseDay()

  let isWeekend = weekIdx === 0 || weekIdx === 6
  if (holiday && holiday.isWork()) isWeekend = false

  // 文字优先级
  let text = ''
  let isFestivalOrTerm = false

  const f1 = solarDay.getFestival()
  const f2 = lunarDay.getFestival()
  const isTerm = term && term.getSolarDay().equals(solarDay)

  if (f1) {
    text = f1.getName()
    isFestivalOrTerm = true
  }
  else if (f2) {
    text = f2.getName()
    isFestivalOrTerm = true
  }
  else if (isTerm) {
    text = term.getName()
    if (term.isJie()) text += ' ' + lunarDay.getMonthSixtyCycle() + '月'
    isFestivalOrTerm = true
  }
  else if (lunarDay.getDay() === 1) {
    const lm = lunarDay.getLunarMonth()
    text = lm.getName()
    if (lm.getMonthWithLeap() === 1) text = lm.getLunarYear().getSixtyCycle().getName() + '年' + text
  } 
  
  if (!text) text = lunarDay.getName()

  return {
    solarDay,
    day: solarDay.getDay(),
    holiday: holiday ? { isWork: holiday.isWork() } : null,
    isCurrentMonth: solarDay.getSolarMonth().equals(currentSolarMonth.value),
    isToday: solarDay.getYear() === now.getFullYear() && solarDay.getMonth() === now.getMonth() + 1 && solarDay.getDay() === now.getDate(),
    isWeekend,
    text,
    isFestivalOrTerm,
    moon: phaseDay.getDayIndex() === 0,
    moonIndex: phaseDay.getPhase().getIndex()
  }
}

function computeHuangli(solarDay: SolarDay): HuangliInfo {
  const lunarDay: any = solarDay.getLunarDay()
  const lunarMonth: any = lunarDay.getLunarMonth()
  const threePillars: any = lunarDay.getThreePillars()
  const sixtyCycle: any = threePillars.getDay()
  const heavenStem: any = sixtyCycle.getHeavenStem()
  const earthBranch: any = sixtyCycle.getEarthBranch()

  const yi = lunarDay.getRecommends().map((x: any) => x.toString())
  const ji = lunarDay.getAvoids().map((x: any) => x.toString())

  const twelveStar: any = lunarDay.getTwelveStar()
  const twelveStarText = `${twelveStar.toString()}(${twelveStar.getEcliptic().getLuck()})`

  const gods: any[] = lunarDay.getGods()
  const jiGods: string[] = []
  const xiongGods: string[] = []
  gods.forEach((g: any) => {
    const name = g.toString()
    if (String(g.getLuck()) === '吉') jiGods.push(name)
    else xiongGods.push(name)
  })

  const twentyEightStar: any = lunarDay.getTwentyEightStar()

  const hours: string[] = lunarDay.getHours().map((h: any) => `${h.getSixtyCycle()}${h.getTwelveStar().getEcliptic().getLuck()}`)

  return {
    solar: `${solarDay.toString()} 星期${solarDay.getWeek().getName()}`,
    week: solarDay.getWeek().toString(),
    lunar: `${lunarMonth.getName()}${lunarDay.getName()}`,
    gz: `${threePillars.getYear()}(${threePillars.getYear().getEarthBranch().getZodiac()})年 ${threePillars.getMonth()}月 ${sixtyCycle}日`,
    yi,
    ji,
    sound: sixtyCycle.getSound().toString(),
    chong: earthBranch.getOpposite().getZodiac().toString(),
    sha: earthBranch.getOminous().toString(),
    twelveStar: twelveStarText,
    twentyEightStar: `${twentyEightStar}${twentyEightStar.getSevenStar()}${twentyEightStar.getAnimal()} ${twentyEightStar.getLuck()}`,
    god: { ji: jiGods, xiong: xiongGods },
    duty: lunarDay.getDuty().toString(),
    fetus: lunarDay.getFetusDay().toString(),
    pz: [heavenStem.getPengZuHeavenStem().toString(), earthBranch.getPengZuEarthBranch().toString()],
    hours
  }
}

// ---------- 挂载 ----------
onMounted(() => {
  weeks.value = buildWeekHeads()
})
</script>

<style scoped>
/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 月相图标样式保持不变 */
.moon .moonbox {
  background-repeat: no-repeat;
}
.moon-0 .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M127.658667 492.885333c0 69.632 17.066667 134.144 51.541333 192.853334s80.896 105.813333 139.946667 139.946666S442.368 877.226667 512 877.226667s133.802667-17.066667 192.853333-51.541334 105.472-80.896 139.605334-139.946666 51.541333-123.221333 51.541333-192.853334-17.066667-133.802667-51.541333-192.853333-80.896-105.472-139.605334-139.605333S581.632 108.885333 512 108.885333s-133.802667 17.408-192.853333 51.541334-105.813333 80.896-139.946667 139.605333-51.541333 123.221333-51.541333 192.853333z" style="fill: rgb(100, 108, 119);"></path></svg>');
}
.moon-1 .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 128.06 511.829 C 128.06 459.946 138.3 410.111 158.439 362.666 C 178.578 315.221 206.226 274.602 240.359 240.127 C 274.492 205.653 315.452 178.346 362.898 158.207 C 410.343 138.069 459.836 127.829 512.06 127.829 C 564.284 127.829 613.778 138.069 661.223 158.207 C 708.668 178.346 749.628 205.994 784.103 240.127 C 818.578 274.261 845.884 315.221 866.023 362.666 C 886.162 410.111 896.402 459.605 896.402 511.829 C 896.402 564.053 886.162 613.546 866.023 660.991 C 845.884 708.437 818.236 749.397 784.103 783.871 C 749.97 818.346 709.01 845.653 661.223 865.791 C 613.436 885.93 563.943 896.17 512.06 896.17 C 460.178 896.17 410.343 885.93 362.898 865.791 C 315.452 845.653 274.834 818.005 240.359 783.871 C 205.884 749.738 178.578 708.778 158.439 660.991 C 138.3 613.205 128.06 564.053 128.06 511.829 Z M 559.506 171.861 C 615.484 202.581 661.564 246.954 697.404 304.981 C 733.244 363.007 750.994 431.957 750.994 511.829 C 750.994 679.082 692.284 791.722 574.866 849.407 C 655.079 834.389 721.98 795.135 775.228 731.989 C 828.476 668.842 855.1 595.455 855.1 511.829 C 855.1 455.167 842.13 402.261 816.188 352.767 C 790.247 303.274 754.748 262.997 709.351 230.911 C 663.954 198.826 614.802 179.711 559.506 171.861 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
.moon-2 .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 127.83 511.829 C 127.83 459.947 138.07 410.112 158.208 362.667 C 178.347 315.221 205.995 274.603 240.128 240.128 C 274.262 205.653 315.222 178.347 362.667 158.208 C 410.112 138.069 459.606 127.829 511.83 127.829 C 564.054 127.829 613.547 138.069 660.992 158.208 C 708.438 178.347 749.398 205.995 783.872 240.128 C 818.347 274.261 845.654 315.221 865.792 362.667 C 885.931 410.112 896.171 459.605 896.171 511.829 C 896.171 564.053 885.931 613.547 865.792 660.992 C 845.654 708.437 818.006 749.397 783.872 783.872 C 749.739 818.347 708.779 845.653 660.992 865.792 C 613.206 885.931 563.712 896.171 511.83 896.171 C 459.947 896.171 410.112 885.931 362.667 865.792 C 315.222 845.653 274.603 818.005 240.128 783.872 C 205.654 749.739 178.347 708.779 158.208 660.992 C 138.07 613.205 127.83 564.053 127.83 511.829 Z M 505.344 855.552 L 511.83 855.552 C 558.592 855.552 602.966 846.336 645.291 828.245 C 687.616 810.155 724.139 785.579 754.859 754.859 C 785.579 724.139 809.814 687.616 828.246 645.291 C 846.678 602.965 855.552 558.592 855.552 511.829 C 855.552 465.408 846.336 421.035 828.246 378.709 C 810.155 336.384 785.579 299.861 754.859 269.141 C 724.139 238.421 687.616 214.187 645.291 195.755 C 602.966 177.323 558.592 168.448 511.83 168.448 L 505.344 168.448 L 505.344 855.552 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
.moon-3 .moonbox  {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 127.829 511.829 C 127.829 442.538 144.895 378.368 179.37 319.317 C 213.845 260.266 260.266 213.504 319.317 179.37 C 378.367 145.237 442.538 127.829 511.829 127.829 C 563.711 127.829 613.546 138.069 660.991 158.208 C 708.437 178.346 749.397 205.994 783.871 240.128 C 818.346 274.261 845.653 315.221 865.791 362.666 C 885.93 410.112 896.17 459.605 896.17 511.829 C 896.17 564.053 885.93 613.546 865.791 660.992 C 845.653 708.437 818.005 749.397 783.871 783.872 C 749.738 818.346 708.778 845.653 660.991 865.792 C 613.205 885.93 563.711 896.17 511.829 896.17 C 459.946 896.17 410.111 885.93 362.666 865.792 C 315.221 845.653 274.261 818.005 240.127 783.872 C 205.994 749.738 178.687 708.778 158.207 660.992 C 137.727 613.205 127.829 564.053 127.829 511.829 Z M 359.935 511.829 C 359.935 663.381 399.871 777.386 479.402 853.845 C 481.791 853.845 485.205 853.845 489.642 854.186 C 494.079 854.528 498.175 854.869 501.589 854.869 C 505.002 854.869 508.415 855.21 511.829 855.21 C 558.25 855.21 602.623 845.994 644.949 827.904 C 687.274 809.813 724.138 785.237 754.858 754.517 C 785.578 723.797 809.813 687.274 828.245 644.949 C 846.677 602.624 855.551 558.25 855.551 511.488 C 855.551 465.066 846.335 420.693 828.245 378.368 C 810.154 336.042 785.578 299.52 754.858 268.8 C 724.138 238.08 687.615 213.845 644.949 195.413 C 602.282 176.981 557.909 168.106 511.829 168.106 C 499.541 168.106 490.325 168.448 484.181 169.13 C 447.317 210.773 417.279 260.949 394.069 320 C 370.858 379.05 359.935 443.221 359.935 511.829 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
.moon-4  .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 127.318 512.341 C 127.318 460.117 137.558 409.941 157.696 362.496 C 177.835 315.051 205.483 274.091 239.616 239.616 C 273.75 205.141 314.71 177.835 362.496 157.696 C 410.283 137.557 459.776 127.317 511.659 127.317 C 563.883 127.317 614.059 137.557 661.504 157.696 C 708.95 177.835 749.91 205.483 784.384 239.616 C 818.859 273.749 846.166 314.709 866.304 362.496 C 886.443 410.283 896.683 459.776 896.683 512.341 C 896.683 564.224 886.443 614.059 866.304 661.504 C 846.166 708.949 818.518 749.909 784.384 784.384 C 750.251 818.859 709.291 846.165 661.504 866.304 C 613.718 886.443 564.224 896.683 511.659 896.683 C 459.776 896.683 409.942 886.443 362.496 866.304 C 315.051 846.165 274.091 818.517 239.616 784.384 C 205.142 750.251 177.835 709.291 157.696 661.504 C 137.558 613.717 127.318 564.565 127.318 512.341 Z M 168.278 512.341 C 168.278 558.763 177.494 603.136 195.584 645.461 C 213.675 687.787 238.251 724.651 268.971 755.371 C 299.691 786.091 336.214 810.325 378.88 828.757 C 421.547 847.189 465.92 856.064 512 856.064 C 558.763 856.064 603.136 846.848 645.462 828.757 C 687.787 810.667 724.31 786.091 755.371 755.371 C 786.432 724.651 810.667 688.128 828.758 645.461 C 846.848 602.795 856.064 558.421 856.064 512.341 C 856.064 450.219 840.704 392.875 809.984 339.968 C 779.264 287.061 737.28 245.419 684.374 214.357 C 631.467 183.296 574.123 168.277 512 168.277 C 465.579 168.277 421.206 177.493 378.88 195.584 C 336.555 213.675 299.691 238.251 268.971 269.312 C 238.251 300.373 214.016 336.896 195.584 379.221 C 177.152 421.547 168.278 465.92 168.278 512.341 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
.moon-5  .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 127.829 511.829 C 127.829 459.947 138.069 410.112 158.207 362.667 C 178.346 315.221 205.994 274.603 240.127 240.128 C 274.261 205.653 315.221 178.347 362.666 158.208 C 410.111 138.069 459.605 127.829 511.829 127.829 C 564.053 127.829 613.546 138.069 660.991 158.208 C 708.437 178.347 749.397 205.995 783.871 240.128 C 818.346 274.261 845.653 315.221 865.791 362.667 C 885.93 410.112 896.17 459.605 896.17 511.829 C 896.17 564.053 885.93 613.547 865.791 660.992 C 845.653 708.437 818.005 749.397 783.871 783.872 C 749.738 818.347 708.778 845.653 660.991 865.792 C 613.205 885.931 563.711 896.171 511.829 896.171 C 459.946 896.171 410.111 885.931 362.666 865.792 C 315.221 845.653 274.602 818.005 240.127 783.872 C 205.653 749.739 178.346 708.779 158.207 660.992 C 138.069 613.205 127.829 564.053 127.829 511.829 Z M 168.789 511.829 C 168.789 558.592 178.005 602.965 196.095 645.291 C 214.186 687.616 238.762 724.139 269.482 754.859 C 300.202 785.579 336.725 809.813 379.05 828.245 C 421.375 846.677 465.749 855.552 512.17 855.552 C 523.434 855.552 531.967 855.552 537.087 855.211 C 563.711 834.389 586.239 810.496 603.989 783.189 C 621.738 755.883 635.391 726.528 644.266 695.467 C 653.141 664.405 659.285 634.368 662.698 605.696 C 666.111 577.024 667.818 545.963 667.818 512.171 C 667.818 446.976 656.895 383.829 634.709 323.072 C 612.522 262.315 578.389 211.115 531.626 169.813 C 527.189 169.472 520.703 169.472 511.487 169.472 C 465.066 169.472 420.693 178.688 378.367 196.779 C 336.042 214.869 300.202 238.763 269.482 269.483 C 238.762 300.203 214.527 336.725 196.095 379.051 C 177.663 421.376 168.789 465.749 168.789 511.829 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
.moon-6  .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 127.829 511.829 C 127.829 459.947 138.069 410.112 158.207 362.667 C 178.346 315.221 205.994 274.603 240.127 240.128 C 274.261 205.653 315.221 178.347 362.666 158.208 C 410.111 138.069 459.605 127.829 511.829 127.829 C 564.053 127.829 613.546 138.069 660.991 158.208 C 708.437 178.347 749.397 205.995 783.871 240.128 C 818.346 274.261 845.653 315.221 865.791 362.667 C 885.93 410.112 896.17 459.605 896.17 511.829 C 896.17 564.053 885.93 613.547 865.791 660.992 C 845.653 708.437 818.005 749.397 783.871 783.872 C 749.738 818.347 708.778 845.653 660.991 865.792 C 613.205 885.931 563.711 896.171 511.829 896.171 C 459.946 896.171 410.111 885.931 362.666 865.792 C 315.221 845.653 274.602 818.005 240.127 783.872 C 205.653 749.739 178.346 708.779 158.207 660.992 C 138.069 613.205 127.829 564.053 127.829 511.829 Z M 168.789 511.829 C 168.789 558.592 178.005 602.965 196.095 645.291 C 214.186 687.616 238.762 724.139 269.482 754.859 C 300.202 785.579 336.725 809.813 379.05 828.245 C 421.375 846.677 465.749 855.552 512.17 855.552 L 519.338 855.552 L 519.338 168.789 L 512.17 168.789 C 465.749 168.789 421.375 178.005 379.05 196.096 C 336.725 214.187 300.202 238.763 269.482 269.483 C 238.762 300.203 214.527 336.725 196.095 379.051 C 177.663 421.376 168.789 465.749 168.789 511.829 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
.moon-7  .moonbox {
  background-image: url('data:image/svg+xml,<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><ellipse style="stroke: rgb(0, 0, 0); fill: rgb(245, 186, 69);" cx="511.394" cy="512.303" rx="383.796" ry="382.991"/><path d="M 127.829 511.829 C 127.829 459.947 138.069 410.112 158.207 362.667 C 178.346 315.221 205.994 274.603 240.127 240.128 C 274.261 205.653 315.221 178.347 362.666 158.208 C 410.111 138.069 459.605 127.829 511.829 127.829 C 564.053 127.829 613.546 138.069 660.991 158.208 C 708.437 178.347 749.397 205.995 783.871 240.128 C 818.346 274.261 845.653 315.221 865.791 362.667 C 885.93 410.112 896.17 459.605 896.17 511.829 C 896.17 564.053 885.93 613.547 865.791 660.992 C 845.653 708.437 818.005 749.397 783.871 783.872 C 749.738 818.347 708.778 845.653 660.991 865.792 C 613.205 885.931 563.711 896.171 511.829 896.171 C 459.946 896.171 410.111 885.931 362.666 865.792 C 315.221 845.653 274.602 818.005 240.127 783.872 C 205.653 749.739 178.346 708.779 158.207 660.992 C 138.069 613.205 127.829 564.053 127.829 511.829 Z M 168.789 511.829 C 168.789 596.48 196.095 670.891 251.05 734.72 C 306.005 798.549 374.613 837.461 456.874 851.115 C 422.399 834.048 393.386 813.568 369.493 788.992 C 345.599 764.416 326.826 737.792 313.855 708.096 C 300.885 678.4 291.327 647.68 285.525 615.936 C 279.722 584.192 276.65 549.376 276.65 511.488 C 276.65 439.467 293.717 372.907 327.509 312.149 C 361.301 251.392 408.405 204.288 468.138 171.52 C 412.501 178.688 361.983 197.803 316.245 229.547 C 270.506 261.291 234.666 302.251 208.383 352.085 C 182.101 401.92 168.789 454.827 168.789 511.829 Z" style="fill: rgb(100, 108, 119);"/></svg>');
}
</style>