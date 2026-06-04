// AUTO-EXTRACTED from the original single-file app during Phase 2 refactor.
// Content preserved verbatim; only `export` added and modules split by concern.

import {
  NEURO,
  SHC,
  LPP,
  TASK_LPP,
  ZODIAC_SIGNS,
  CHINESE_ZODIAC,
  NUMEROLOGY,
  REMINDER_LIBRARY,
  CATEGORIES,
  DAYS_OF_WEEK,
  DAY_LABELS,
  CYCLE_PHASES,
  NEEDS,
  NEED_COLORS,
  DAILY_TASKS,
  TEXT_SAMPLES,
  MONTHS,
  DAILY_TRUTHS,
  PHASE_SCRIPTS,
  DIAGNOSTIC_QUESTIONS,
  CHALLENGE_30,
  CHALLENGE_60,
  CHALLENGE_90,
  CHALLENGE_MONTHLY,
  SEASONAL_THEMES,
  EXTENDED_TASKS,
  EXTENDED_TEXTS,
  DATE_IDEAS,
  TEXT_SHC,
  TASK_SHC,
  SEASONAL_CAMPAIGNS,
  HOME_ACTIVITIES,
  HOME_ACTIVITY_TASKS,
  HOME_ACTIVITY_REMINDERS,
  ALL_REMINDERS
} from '../constants/data.js';

export function getLifePathNumber(day, month, year) {
  if (!day || !month || !year) return null;
  const str = `${month}${day}${year}`;
  let sum = str.split("").reduce((a,b)=>a+parseInt(b),0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split("").reduce((a,b)=>a+parseInt(b),0);
  }
  return sum;
}

// ─── Reminder Library ─────────────────────────────────────────────────────────

export function getCurrentPhase(d) {
  for (const [k,p] of Object.entries(CYCLE_PHASES)) if (p.days.includes(d)) return {key:k,...p};
  return {key:"menstrual",...CYCLE_PHASES.menstrual};
}

export function getToday() { return new Date().toISOString().split("T")[0]; }

export function getDayOfYear(date) { return Math.floor((date - new Date(date.getFullYear(),0,0)) / 864e5); }

// Pick today's text from the library — deterministic by date, filtered by phase needs

export function getDailyTextFromLibrary(phaseNeeds, offset=0) {
  const base = getDayOfYear(new Date());
  // Prefer phase-matched texts
  const phaseMatched = EXTENDED_TEXTS.filter(t => (t.needs||[]).some(n => phaseNeeds.includes(n)));
  const pool = phaseMatched.length >= 5 ? phaseMatched : EXTENDED_TEXTS;
  const idx = (base + offset) % pool.length;
  return pool[idx];
}

// Pick today's activity from HOME_ACTIVITIES — deterministic by date

export function getDailyActivityFromLibrary(phaseNeeds, offset=0) {
  const base = getDayOfYear(new Date());
  const phaseMatched = HOME_ACTIVITIES.filter(a => (a.needs||[]).some(n => phaseNeeds.includes(n)));
  const pool = phaseMatched.length >= 3 ? phaseMatched : HOME_ACTIVITIES;
  const idx = (base + offset) % pool.length;
  return pool[idx];
}
// Backend proxy — key lives on server, never in browser

export const API_URL = typeof process !== "undefined" && process.env?.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "";

export const APP_SECRET = typeof process !== "undefined" && process.env?.REACT_APP_APP_SECRET ? process.env.REACT_APP_APP_SECRET : "";

// NOTE: AI generation is intentionally disabled in this build.
// The previous implementation called the Anthropic API directly from the client,
// which would expose an API key. It will be re-enabled in a later phase via a
// secure Supabase Edge Function (server-side key, premium-gated) — see ai.service.js.

export async function fetchAI(_prompt) {
  return "✨ AI suggestions are coming soon — this feature is being set up securely.";
}

// ─── Safe Storage (works in artifacts + browser) ─────────────────────────────

export const _store = {};

export function safeGet(key, def="") {
  try { return localStorage.getItem(key) ?? def; } catch(e) { return _store[key] ?? def; }
}

export function safeGetJSON(key, def) {
  try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(def)); } catch(e) { return _store[key] ?? def; }
}

export function copyText(text, onSuccess) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(()=>{
      const el = document.createElement('textarea');
      el.value = text; el.style.position = 'fixed'; el.style.opacity = '0';
      document.body.appendChild(el); el.select();
      try { document.execCommand('copy'); onSuccess(); } catch(e) {}
      document.body.removeChild(el);
    });
  } else {
    const el = document.createElement('textarea');
    el.value = text; el.style.position = 'fixed'; el.style.opacity = '0';
    document.body.appendChild(el); el.select();
    try { document.execCommand('copy'); onSuccess(); } catch(e) {}
    document.body.removeChild(el);
  }
}

export function safeSet(key, val) {
  _store[key] = val;
  try { localStorage.setItem(key, val); } catch(e) {}
}

export function getChineseZodiac(year) {
  if (!year) return null;
  const animals = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  const idx = ((year - 1900) % 12 + 12) % 12;
  return CHINESE_ZODIAC.find(z => z.sign === animals[idx]) || CHINESE_ZODIAC[idx];
}

export function getZodiacFromDate(month, day) {
  if (!month || !day) return null;
  const m = parseInt(month), d = parseInt(day);
  if ((m===3&&d>=21)||(m===4&&d<=19)) return ZODIAC_SIGNS.find(z=>z.sign==="Aries");
  if ((m===4&&d>=20)||(m===5&&d<=20)) return ZODIAC_SIGNS.find(z=>z.sign==="Taurus");
  if ((m===5&&d>=21)||(m===6&&d<=20)) return ZODIAC_SIGNS.find(z=>z.sign==="Gemini");
  if ((m===6&&d>=21)||(m===7&&d<=22)) return ZODIAC_SIGNS.find(z=>z.sign==="Cancer");
  if ((m===7&&d>=23)||(m===8&&d<=22)) return ZODIAC_SIGNS.find(z=>z.sign==="Leo");
  if ((m===8&&d>=23)||(m===9&&d<=22)) return ZODIAC_SIGNS.find(z=>z.sign==="Virgo");
  if ((m===9&&d>=23)||(m===10&&d<=22)) return ZODIAC_SIGNS.find(z=>z.sign==="Libra");
  if ((m===10&&d>=23)||(m===11&&d<=21)) return ZODIAC_SIGNS.find(z=>z.sign==="Scorpio");
  if ((m===11&&d>=22)||(m===12&&d<=21)) return ZODIAC_SIGNS.find(z=>z.sign==="Sagittarius");
  if ((m===12&&d>=22)||(m===1&&d<=19)) return ZODIAC_SIGNS.find(z=>z.sign==="Capricorn");
  if ((m===1&&d>=20)||(m===2&&d<=18)) return ZODIAC_SIGNS.find(z=>z.sign==="Aquarius");
  return ZODIAC_SIGNS.find(z=>z.sign==="Pisces");
}

// ─── Variety Engine ──────────────────────────────────────────────────────────

export function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}
// ─── Seasonal Campaigns ───────────────────────────────────────────────────────

export function getActiveCampaign(anniversaryDate) {
  const now=new Date(); const year=now.getFullYear();
  const campaigns=[];
  const val=new Date(year,1,14); const valDays=Math.ceil((val-now)/864e5);
  if(valDays>=0&&valDays<=30) campaigns.push({campaign:SEASONAL_CAMPAIGNS.valentines,daysLeft:valDays});
  const xmas=new Date(year,11,25); const xmasDays=Math.ceil((xmas-now)/864e5);
  if(xmasDays>=0&&xmasDays<=30) campaigns.push({campaign:SEASONAL_CAMPAIGNS.christmas,daysLeft:xmasDays});
  const ny=new Date(year,11,31); const nyDays=Math.ceil((ny-now)/864e5);
  if(nyDays>=0&&nyDays<=14) campaigns.push({campaign:SEASONAL_CAMPAIGNS.newyear,daysLeft:nyDays});
  const mayFirst=new Date(year,4,1); const dow=mayFirst.getDay();
  const firstSun=dow===0?1:8-dow; const mdDate=new Date(year,4,firstSun+7);
  const mdDays=Math.ceil((mdDate-now)/864e5);
  if(mdDays>=0&&mdDays<=21) campaigns.push({campaign:SEASONAL_CAMPAIGNS.mothersday,daysLeft:mdDays});
  const halloween=new Date(year,9,31); const hwDays=Math.ceil((halloween-now)/864e5);
  if(hwDays>=0&&hwDays<=21) campaigns.push({campaign:SEASONAL_CAMPAIGNS.halloween,daysLeft:hwDays});
  if(anniversaryDate){
    const anniv=new Date(anniversaryDate);
    let next=new Date(year,anniv.getMonth(),anniv.getDate());
    if(next<now) next=new Date(year+1,anniv.getMonth(),anniv.getDate());
    const annivDays=Math.ceil((next-now)/864e5);
    if(annivDays>=0&&annivDays<=30){
      const yearsNum=next.getFullYear()-anniv.getFullYear();
      campaigns.push({campaign:{
        id:"anniversary",emoji:"💍",color:"#e67e22",title:`Anniversary in ${annivDays} Day${annivDays!==1?"s":""}`,
        urgencyFn:(d)=>d<=1?"💍 Tomorrow!":d<=7?"💍 This week":"💍 Plan it now",
        stages:[
          {daysLeft:30,headline:`${yearsNum} year${yearsNum!==1?"s":""} together — make it count`,body:"Your anniversary is the one day a year she measures whether she's still chosen.",actions:["Book something she wouldn't book for herself","Write her a letter — what she means to you after all this time","Think about what this year meant — what grew, what you're grateful for"]},
          {daysLeft:1,headline:"Tomorrow is your anniversary",body:`${yearsNum} year${yearsNum!==1?"s":""} with this woman. Let that land.`,actions:["Tell her tonight what this year meant to you","Make tomorrow about her from the first moment she wakes up","Be fully present — no phone, no distractions"]},
        ],
      },daysLeft:annivDays});
    }
  }
  return campaigns.sort((a,b)=>a.daysLeft-b.daysLeft)[0]||null;
}


export function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 864e5 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

export function getCurrentMonth() { return new Date().getMonth(); }

export function getSeasonalTheme() { return SEASONAL_THEMES[getCurrentMonth()]; }

// ─── Home Activities Library ──────────────────────────────────────────────────
// Every activity targets specific brain chemicals with explained mechanisms

export function getVarietyTask(usedTaskIds, phaseNeeds) {
  const month = getCurrentMonth();
  // Combine regular tasks + home activity tasks
  const allTasks = [...EXTENDED_TASKS, ...HOME_ACTIVITY_TASKS];
  const pool = allTasks.filter(t => {
    if (usedTaskIds.includes(t.id)) return false;
    if (t.seasons && !t.seasons.includes(month)) return false;
    return true;
  });
  // Every 3rd day, surface a home activity
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 864e5);
  const preferHome = dayOfYear % 3 === 0;
  const homePool = pool.filter(t => t.isHomeActivity);
  const regularPool = pool.filter(t => !t.isHomeActivity);
  if (preferHome && homePool.length > 0) {
    const phaseMatch = homePool.filter(t => (t.needs||[]).some(n => phaseNeeds.includes(n)));
    const src = phaseMatch.length > 0 ? phaseMatch : homePool;
    return src[Math.floor(Math.random() * src.length)];
  }
  const phaseMatch = regularPool.filter(t => (t.needs||[]).some(n => phaseNeeds.includes(n)));
  const source = phaseMatch.length > 0 ? phaseMatch : pool.length > 0 ? pool : allTasks;
  return source[Math.floor(Math.random() * source.length)];
}


export function getVarietyTexts(usedTextIds) {
  const available = EXTENDED_TEXTS.filter(t => !usedTextIds.includes(t.id));
  if (available.length < 4) return EXTENDED_TEXTS.slice(0, 10); // reset if exhausted
  // Shuffle and return mix of moods
  const moods = ["sweet","affirming","supportive","deep","playful"];
  const result = [];
  for (const mood of moods) {
    const match = available.filter(t => t.mood === mood && !result.includes(t));
    if (match.length > 0) result.push(match[Math.floor(Math.random() * match.length)]);
  }
  // Fill to 8 if needed
  while (result.length < 8) {
    const remaining = available.filter(t => !result.includes(t));
    if (remaining.length === 0) break;
    result.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }
  return result;
}

// ─── Badges ──────────────────────────────────────────────────────────────────
