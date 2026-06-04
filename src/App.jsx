import { useState, useEffect, useRef } from "react";
import { hasSupabase } from './services/supabaseClient.js';
import { signIn, signUp, signOutUser, sendPasswordReset, getSession, onAuthChange, toAuthUser } from './services/auth.service.js';
import { useCloudSync } from './hooks/useCloudSync.js';
import { deleteAccount } from './services/account.service.js';
import { initStatusBar, isNative } from './services/platform.service.js';
import SupportScreen from './components/legal/SupportScreen.jsx';
import PrivacyPolicyScreen from './components/legal/PrivacyPolicyScreen.jsx';
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
} from './constants/data.js';
import {
  getLifePathNumber,
  getCurrentPhase,
  getToday,
  getDayOfYear,
  getDailyTextFromLibrary,
  getDailyActivityFromLibrary,
  API_URL,
  APP_SECRET,
  fetchAI,
  _store,
  safeGet,
  safeGetJSON,
  copyText,
  safeSet,
  getChineseZodiac,
  getZodiacFromDate,
  getMonthKey,
  getActiveCampaign,
  getWeekKey,
  getCurrentMonth,
  getSeasonalTheme,
  getVarietyTask,
  getVarietyTexts
} from './utils/helpers.js';
import {
  NeedBadge,
  NeuroBadge,
  PremiumGate,
  SHCBadge,
  SHCRow,
  LPPBadge,
  NeuroPanel,
  PhaseCard,
  ReminderCard,
  Toast
} from './components/primitives.jsx';

export default function App() {
  const [tab,setTab] = useState("today");
  const [onboarded,setOnboarded] = useState(false); // fresh start

  // ─── Auth & Subscription State ───────────────────────────────
  const [authScreen,setAuthScreen] = useState("login"); // login | signup | forgot
  const [authUser,setAuthUser] = useState(null); // fresh start
  const [authEmail,setAuthEmail] = useState("");
  const [authPassword,setAuthPassword] = useState("");
  const [authName,setAuthName] = useState("");
  const [authLoading,setAuthLoading] = useState(false);
  const [authError,setAuthError] = useState("");
  const [subscribed,setSubscribed] = useState(false); // fresh start
  const [subTier,setSubTier] = useState("basic"); // fresh start // "basic" | "premium"
  const [subLoading,setSubLoading] = useState(false);
  const [cycleDay,setCycleDay] = useState(1); // fresh start
  const [wifeName,setWifeName] = useState(()=>safeGet("wifeName",""));
  const [wifeNickname,setWifeNickname] = useState(()=>safeGet("wifeNickname",""));
  const [wifeBirthMonth,setWifeBirthMonth] = useState(()=>safeGet("wifeBirthMonth",""));
  const [wifeBirthDay,setWifeBirthDay] = useState(()=>safeGet("wifeBirthDay",""));
  const [wifeBirthYear,setWifeBirthYear] = useState(()=>safeGet("wifeBirthYear",""));
  const [cycleStartDate,setCycleStartDate] = useState(()=>{
    const saved = safeGet("cycleStartDate","");
    const name  = safeGet("wifeName","");
    if(!name){ safeSet("cycleStartDate",""); return ""; }
    return saved;
  });

  const handleCycleStart = (val) => {
    setCycleStartDate(val);
    safeSet("cycleStartDate", val);
    if(val){
      const start = new Date(val);
      const now   = new Date();
      const diff  = Math.floor((now - start) / 864e5) + 1;
      const day   = Math.max(1, Math.min(28, ((diff - 1) % 28) + 1));
      setCycleDay(day);
      safeSet("cycleDay", String(day));
    }
  };

  const [taskLog,setTaskLog]                   = useState(()=>safeGetJSON("taskLog",[]));
  const [wifeNeeds,setWifeNeeds]               = useState(()=>safeGetJSON("wifeNeeds",[]));
  const [level2Completed,setLevel2Completed]   = useState(()=>safeGetJSON("level2Completed",[]));
  const [level3Completed,setLevel3Completed]   = useState(()=>safeGetJSON("level3Completed",[]));
  const [diagnosticStep,setDiagnosticStep]     = useState(0);
  const [todayActivity,setTodayActivity]       = useState(null);

  // ── Know Her — Important Details ─────────────────────────────
  const [anniversaryDate,setAnniversaryDate]   = useState(()=>safeGet("anniversaryDate",""));
  const [firstDateDate,setFirstDateDate]       = useState(()=>safeGet("firstDateDate",""));
  const [favRestaurant,setFavRestaurant]       = useState(()=>safeGet("favRestaurant",""));
  const [favFood,setFavFood]                   = useState(()=>safeGet("favFood",""));
  const [favDrink,setFavDrink]                 = useState(()=>safeGet("favDrink",""));
  const [favStarbucks,setFavStarbucks]         = useState(()=>safeGet("favStarbucks",""));
  const [favFlower,setFavFlower]               = useState(()=>safeGet("favFlower",""));
  const [favColor,setFavColor]                 = useState(()=>safeGet("favColor",""));
  const [favMovie,setFavMovie]                 = useState(()=>safeGet("favMovie",""));
  const [favShow,setFavShow]                   = useState(()=>safeGet("favShow",""));
  const [favSong,setFavSong]                   = useState(()=>safeGet("favSong",""));
  const [favArtist,setFavArtist]               = useState(()=>safeGet("favArtist",""));
  const [loveLanguage,setLoveLanguage]         = useState(()=>safeGet("loveLanguage",""));
  const [biggestDream,setBiggestDream]         = useState(()=>safeGet("biggestDream",""));
  const [biggestFear,setBiggestFear]           = useState(()=>safeGet("biggestFear",""));
  const [whatStresses,setWhatStresses]         = useState(()=>safeGet("whatStresses",""));
  const [whatLightsUp,setWhatLightsUp]         = useState(()=>safeGet("whatLightsUp",""));
  const [howSheFeelsLoved,setHowSheFeelsLoved] = useState(()=>safeGet("howSheFeelsLoved",""));
  const [kidsNames,setKidsNames]               = useState(()=>safeGet("kidsNames",""));
  const [petsNames,setPetsNames]               = useState(()=>safeGet("petsNames",""));
  const [herMom,setHerMom]                     = useState(()=>safeGet("herMom",""));
  const [herDad,setHerDad]                     = useState(()=>safeGet("herDad",""));
  const [herBestFriend,setHerBestFriend]       = useState(()=>safeGet("herBestFriend",""));
  const [husbandNotes,setHusbandNotes]         = useState(()=>safeGet("husbandNotes",""));
  const [weeklyScore,setWeeklyScore] = useState({}); // fresh start
  const [husbandMood,setHusbandMood] = useState("");

  // ── New feature state ─────────────────────────────────────────
  const [sheSaid,setSheSaid] = useState([]); // fresh start
  const [sheSaidInput,setSheSaidInput] = useState("");
  const [diagnosticAnswers,setDiagnosticAnswers] = useState({});
  const [diagnosticResult,setDiagnosticResult] = useState("");
  const [diagnosticLoading,setDiagnosticLoading] = useState(false);
  const [diagnosticDone,setDiagnosticDone] = useState(false);
  const [showResetConfirm,setShowResetConfirm] = useState(false);
  const [legalView,setLegalView] = useState(null); // 'support' | 'privacy' | null
  const [showDeleteConfirm,setShowDeleteConfirm] = useState(false);
  const [deleteLoading,setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try { if (!isPreviewMode) await deleteAccount(); } catch(e) { /* proceed to local wipe regardless */ }
    try { if (!isPreviewMode) await signOutUser(); } catch(e) {}
    try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
    setAuthUser(null); setSubscribed(false); setSubTier("basic");
    location.reload();
  };
  const [challengeDay,setChallengeDay] = useState(0); // fresh start
  const [challengeStarted,setChallengeStarted] = useState(false); // fresh start
  const [completedDays,setCompletedDays] = useState(()=>safeGetJSON("completedDays",[]));
  const [showChallenge,setShowChallenge] = useState(true);
  const [showScripts,setShowScripts] = useState(false);
  const [activityFilter,setActivityFilter] = useState("all");
  const [sentTextIds,setSentTextIds] = useState(()=>safeGetJSON("sentTextIds",[]));
  const [sheSaidDone,setSheSaidDone] = useState(()=>safeGetJSON("sheSaidDone",[]));
  const [replayGuide,setReplayGuide] = useState(false);
  const [onboardSlide,setOnboardSlide] = useState(0);
  const [todayTask,setTodayTask] = useState(null);
  const [taskDone,setTaskDone] = useState(false);
  const [taskRating,setTaskRating] = useState(null);
  const [taskNote,setTaskNote] = useState("");
  const [showLogForm,setShowLogForm] = useState(false);
  const [logRating,setLogRating] = useState(0);
  const [logNote,setLogNote] = useState("");
  const [currentStreak,setCurrentStreak] = useState(()=>parseInt(safeGet("currentStreak","0")||"0"));
  const [longestStreak,setLongestStreak] = useState(()=>parseInt(safeGet("longestStreak","0")||"0"));
  const [lastOpenDate,setLastOpenDate] = useState(()=>safeGet("lastOpenDate",""));
  const [showRecovery,setShowRecovery] = useState(false);
  const [dateDoneMonth,setDateDoneMonth] = useState(()=>{
    const now=new Date();
    const mk=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    return safeGet(`dateDone-${mk}`,"")!==""?mk:"";
  });
  const [aiText,setAiText] = useState("");
  const [aiLoading,setAiLoading] = useState(false);
  const [taskWorked,setTaskWorked] = useState(null);
  const [taskMood,setTaskMood] = useState("");
  const [taskWin,setTaskWin] = useState("");
  const [expandedLog,setExpandedLog] = useState(null);
  const [expandedText,setExpandedText] = useState(null);
  const [usedTaskIds,setUsedTaskIds] = useState({}); // fresh start
  const [usedTextIds,setUsedTextIds] = useState({}); // fresh start
  const [varietyTexts,setVarietyTexts] = useState([]);
  const [showNeuroGuide,setShowNeuroGuide] = useState(false);
  const [coachHistory,setCoachHistory] = useState([]); // fresh start
  const [homeChemFilter,setHomeChemFilter] = useState("all");
  const [dailyTextMsg,setDailyTextMsg] = useState("");
  const [dailyTextMeta,setDailyTextMeta] = useState(null);
  const [dailyTextLoading,setDailyTextLoading] = useState(false);
  const [dailyTextCopied,setDailyTextCopied] = useState(false);
  const [showTextOptions,setShowTextOptions] = useState(false);
  const [suggestedTextTime,setSuggestedTextTime] = useState(()=>safeGetJSON("suggestedTextTime",{}));
  const [textTimeHistory,setTextTimeHistory] = useState(()=>safeGetJSON("textTimeHistory",{}));
  // ── Cadence system — text every 2-3 days, activity once a week ──
  const [lastTextDate,setLastTextDate] = useState(()=>safeGet("lastTextDate",""));
  const [lastActivityDate,setLastActivityDate] = useState(""); // fresh start
  const [textSentToday,setTextSentToday] = useState(()=>safeGet("textSentToday","")===getToday());
  const [activityDoneThisWeek,setActivityDoneThisWeek] = useState(()=>safeGet("activityWeek","")===getWeekKey());
  const [textCadenceDays] = useState(()=>{ const d=getDayOfYear(new Date()); return d%2===0?2:3; }); // alternates 2 or 3 days
  const [textOffset,setTextOffset] = useState(0);
  const [genOffset,setGenOffset] = useState(0);
  const [genText,setGenText] = useState(null);
  const [genCopied,setGenCopied] = useState(false);
  const [dateOffset,setDateOffset] = useState(0);
  const [dateIdea,setDateIdea] = useState(null);
  const [dailyActivity,setDailyActivity] = useState(null);
  const [dailyActivityLoading,setDailyActivityLoading] = useState(false);
  const [activityOffset,setActivityOffset] = useState(0);
  const [activeReminders,setActiveReminders] = useState({}); // fresh start
  const [schedules,setSchedules] = useState(()=>safeGetJSON("schedules", {}));
  const [reminderCat,setReminderCat] = useState("all");
  const [toasts,setToasts] = useState([]);
  const [notifPermission,setNotifPermission] = useState("default");
  const [profileSection,setProfileSection] = useState("overview");
  const intervalRef = useRef(null);

  const phase = getCurrentPhase(cycleDay);
  const zodiac = getZodiacFromDate(wifeBirthMonth, wifeBirthDay);
  const chineseZodiac = getChineseZodiac(parseInt(wifeBirthYear));
  const lifePathNum = getLifePathNumber(wifeBirthDay, wifeBirthMonth, wifeBirthYear);
  const numerology = lifePathNum ? NUMEROLOGY[lifePathNum] : null;
  // Dev-only bypass: skip real auth when explicitly enabled, or when Supabase isn't configured.
  const isPreviewMode = (import.meta.env.VITE_DEV_AUTH_BYPASS === 'true') || !hasSupabase;
  const isPremium = subTier === "premium" || isPreviewMode;

  // Cloud sync: hydrate from / push to Supabase while authenticated (Supabase mode only).
  useCloudSync(authUser?.id, !isPreviewMode && !!authUser);

  // Restore Supabase session on launch + subscribe to auth changes.
  useEffect(() => {
    if (isPreviewMode) return;
    let mounted = true;
    getSession().then(({ data }) => {
      const u = data?.session?.user;
      if (mounted && u) { setAuthUser(toAuthUser(u)); setSubscribed(true); }
    });
    const { data: sub } = onAuthChange((session) => {
      if (!mounted) return;
      if (session?.user) { setAuthUser(toAuthUser(session.user)); setSubscribed(true); }
      else { setAuthUser(null); }
    });
    return () => { mounted = false; sub?.subscription?.unsubscribe?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Native shell: status bar + Android hardware back button.
  const navStateRef = useRef({ legalView, tab });
  navStateRef.current = { legalView, tab };
  useEffect(() => {
    if (!isNative()) return;
    initStatusBar();
    let handle;
    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.addListener('backButton', () => {
        const st = navStateRef.current;
        if (st.legalView) { setLegalView(null); return; }
        if (st.tab && st.tab !== 'today') { setTab('today'); return; }
        CapApp.exitApp();
      }).then((h) => { handle = h; });
    });
    return () => { if (handle) handle.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{safeSet("cycleDay",cycleDay);},[cycleDay]);
  useEffect(()=>{safeSet("cycleStartDate",cycleStartDate);},[cycleStartDate]);
  useEffect(()=>{safeSet("taskLog",JSON.stringify(taskLog));},[taskLog]);
  useEffect(()=>{safeSet("currentStreak",String(currentStreak));},[currentStreak]);
  useEffect(()=>{safeSet("longestStreak",String(longestStreak));},[longestStreak]);
  useEffect(()=>{safeSet("lastOpenDate",lastOpenDate);},[lastOpenDate]);

  // Streak calculation on open
  useEffect(()=>{
    const today=getToday();
    if(lastOpenDate===today) return;
    const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr=yesterday.toISOString().split("T")[0];
    if(lastOpenDate===yStr){
      const ns=currentStreak+1; setCurrentStreak(ns);
      if(ns>longestStreak) setLongestStreak(ns);
    } else if(lastOpenDate&&lastOpenDate<yStr){
      setShowRecovery(true); setCurrentStreak(1);
    } else { setCurrentStreak(1); }
    setLastOpenDate(today);
  // eslint-disable-next-line
  },[]);
  useEffect(()=>{safeSet("wifeNeeds",JSON.stringify(wifeNeeds));},[wifeNeeds]);
  useEffect(()=>{safeSet("wifeName",wifeName);},[wifeName]);
  useEffect(()=>{safeSet("wifeNickname",wifeNickname);},[wifeNickname]);
  useEffect(()=>{safeSet("wifeBirthMonth",wifeBirthMonth);},[wifeBirthMonth]);
  useEffect(()=>{safeSet("wifeBirthDay",wifeBirthDay);},[wifeBirthDay]);
  useEffect(()=>{safeSet("wifeBirthYear",wifeBirthYear);},[wifeBirthYear]);
  useEffect(()=>{safeSet("anniversaryDate",anniversaryDate);},[anniversaryDate]);
  useEffect(()=>{safeSet("firstDateDate",firstDateDate);},[firstDateDate]);
  useEffect(()=>{safeSet("favRestaurant",favRestaurant);},[favRestaurant]);
  useEffect(()=>{safeSet("favFood",favFood);},[favFood]);
  useEffect(()=>{safeSet("favDrink",favDrink);},[favDrink]);
  useEffect(()=>{safeSet("favStarbucks",favStarbucks);},[favStarbucks]);
  useEffect(()=>{safeSet("favFlower",favFlower);},[favFlower]);
  useEffect(()=>{safeSet("favColor",favColor);},[favColor]);
  useEffect(()=>{safeSet("favMovie",favMovie);},[favMovie]);
  useEffect(()=>{safeSet("favShow",favShow);},[favShow]);
  useEffect(()=>{safeSet("favSong",favSong);},[favSong]);
  useEffect(()=>{safeSet("favArtist",favArtist);},[favArtist]);
  useEffect(()=>{safeSet("loveLanguage",loveLanguage);},[loveLanguage]);
  useEffect(()=>{safeSet("biggestDream",biggestDream);},[biggestDream]);
  useEffect(()=>{safeSet("biggestFear",biggestFear);},[biggestFear]);
  useEffect(()=>{safeSet("whatStresses",whatStresses);},[whatStresses]);
  useEffect(()=>{safeSet("whatLightsUp",whatLightsUp);},[whatLightsUp]);
  useEffect(()=>{safeSet("howSheFeelsLoved",howSheFeelsLoved);},[howSheFeelsLoved]);
  useEffect(()=>{safeSet("kidsNames",kidsNames);},[kidsNames]);
  useEffect(()=>{safeSet("petsNames",petsNames);},[petsNames]);
  useEffect(()=>{safeSet("herMom",herMom);},[herMom]);
  useEffect(()=>{safeSet("herDad",herDad);},[herDad]);
  useEffect(()=>{safeSet("herBestFriend",herBestFriend);},[herBestFriend]);
  useEffect(()=>{safeSet("husbandNotes",husbandNotes);},[husbandNotes]);
  useEffect(()=>{safeSet("weeklyScore",JSON.stringify(weeklyScore));},[weeklyScore]);
  useEffect(()=>{safeSet("sentTextIds",JSON.stringify(sentTextIds));},[sentTextIds]);
  useEffect(()=>{safeSet("sheSaidDone",JSON.stringify(sheSaidDone));},[sheSaidDone]);
  useEffect(()=>{safeSet("sheSaid",JSON.stringify(sheSaid));},[sheSaid]);
  useEffect(()=>{safeSet("challengeDay",challengeDay);},[challengeDay]);
  useEffect(()=>{safeSet("challengeStarted",challengeStarted?"1":"");},[challengeStarted]);
  useEffect(()=>{safeSet("completedDays",JSON.stringify(completedDays));},[completedDays]);
  useEffect(()=>{safeSet("activeReminders",JSON.stringify(activeReminders));},[activeReminders]);
  useEffect(()=>{safeSet("schedules",JSON.stringify(schedules));},[schedules]);
  useEffect(()=>{safeSet("coachHistory",JSON.stringify(coachHistory));},[coachHistory]);
  useEffect(()=>{safeSet("usedTaskIds",JSON.stringify(usedTaskIds));},[usedTaskIds]);
  useEffect(()=>{safeSet("usedTextIds",JSON.stringify(usedTextIds));},[usedTextIds]);
  useEffect(()=>{safeSet("suggestedTextTime",JSON.stringify(suggestedTextTime));},[suggestedTextTime]);
  useEffect(()=>{safeSet("subTier",subTier);},[subTier]);
  useEffect(()=>{safeSet("textTimeHistory",JSON.stringify(textTimeHistory));},[textTimeHistory]);
  useEffect(()=>{safeSet("lastTextDate",lastTextDate);},[lastTextDate]);
  useEffect(()=>{safeSet("lastActivityDate",lastActivityDate);},[lastActivityDate]);
  useEffect(()=>{if(textSentToday)safeSet("textSentToday",getToday());},[textSentToday]);
  useEffect(()=>{if(activityDoneThisWeek)safeSet("activityWeek",getWeekKey());},[activityDoneThisWeek]);

  // Generate a new random suggested text time each day
  useEffect(()=>{
    const today = getToday();
    if (!suggestedTextTime[today]) {
      // Random time pools by feel — morning, midday, afternoon, evening
      const pools = [
        ["7:45 AM","8:10 AM","8:30 AM","9:00 AM","9:20 AM"],  // morning
        ["11:30 AM","12:05 PM","12:20 PM","12:45 PM","1:10 PM"], // midday
        ["2:30 PM","3:00 PM","3:45 PM","4:15 PM","4:50 PM"],   // afternoon
        ["5:30 PM","6:00 PM","6:20 PM","7:00 PM","7:30 PM"],   // evening
      ];
      const dayOfYear = getDayOfYear(new Date());
      const poolIdx = dayOfYear % pools.length;
      const timeIdx = Math.floor((dayOfYear / pools.length)) % pools[poolIdx].length;
      const time = pools[poolIdx][timeIdx];
      const label = poolIdx===0?"Morning check-in":poolIdx===1?"Midday surprise":poolIdx===2?"Afternoon lift":"Evening connection";
      const newEntry = {time, label, date:today};
      // Save today and move today to history if switching day
      const yesterday = Object.keys(suggestedTextTime)[0];
      if (yesterday && yesterday !== today) {
        setTextTimeHistory(prev=>({...prev,[yesterday]:suggestedTextTime[yesterday]}));
      }
      setSuggestedTextTime({[today]:newEntry});
    }
  },[]);

  useEffect(()=>{
    const monthKey = getMonthKey();
    const monthUsed = usedTaskIds[monthKey] || [];
    const task = getVarietyTask(monthUsed, phase.needs);
    setTodayTask(task);
    // Build variety texts for this week
    const weekKey = getWeekKey();
    const weekUsed = usedTextIds[weekKey] || [];
    setVarietyTexts(getVarietyTexts(weekUsed));
    const tl=taskLog.find(l=>l.date===getToday());
    if(tl){setTaskDone(true);setTaskRating(tl.rating);}
    // (Auth session is restored via Supabase in a dedicated effect above.)
    // Auto-load today's text and activity
    pickDailyText(0);
    pickDailyActivity(0);
  },[cycleDay]);

  useEffect(()=>{if("Notification" in window)setNotifPermission(Notification.permission);},[]);

  useEffect(()=>{
    const check=()=>{
      const now=new Date();
      const curDay=DAYS_OF_WEEK[now.getDay()];
      const curTime=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      const lastFired=safeGetJSON("lastFired", {});
      ALL_REMINDERS().forEach(r=>{
        if(!activeReminders[r.id])return;
        const sched=schedules[r.id];
        const time=sched?.time||r.defaultTime;
        const days=sched?.days||r.defaultDays;
        const fk=`${r.id}-${getToday()}-${time}`;
        if(days.includes(curDay)&&curTime===time&&!lastFired[fk]){
          safeSet("lastFired",JSON.stringify({...lastFired,[fk]:true}));
          if(notifPermission==="granted") new Notification(`💪 ${r.title}`,{body:r.body});
          const id=Date.now();
          setToasts(prev=>[...prev,{id,icon:r.icon,title:r.title,body:r.body}]);
          setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),8000);
        }
      });
    };
    intervalRef.current=setInterval(check,30000);
    return()=>clearInterval(intervalRef.current);
  },[activeReminders,schedules,notifPermission]);

  const requestPermission=async()=>{if(!("Notification" in window))return;const p=await Notification.requestPermission();setNotifPermission(p);};
  const dismissToast=(id)=>setToasts(prev=>prev.filter(t=>t.id!==id));
  const toggleReminder=(id)=>setActiveReminders(prev=>({...prev,[id]:!prev[id]}));
  const updateSchedule=(id,data)=>setSchedules(prev=>({...prev,[id]:data}));
  const logTask=()=>{
    const entry={date:getToday(),task:todayTask?.task,taskId:todayTask?.id,rating:taskRating,note:taskNote,win:taskWin,phase:phase.label,neuro:todayTask?.neuro,worked:taskWorked,mood:taskMood};
    setTaskLog(prev=>[entry,...prev.filter(l=>l.date!==getToday())]);
    const monthKey = getMonthKey();
    const prev = usedTaskIds[monthKey] || [];
    if (todayTask?.id && !prev.includes(todayTask.id)) setUsedTaskIds(p=>({...p,[monthKey]:[...prev,todayTask.id]}));
    // Weekly score
    const wk = getWeekKey();
    setWeeklyScore(p=>({...p,[wk]:(p[wk]||0)+1}));
    setTaskDone(true);setShowLogForm(false);setTaskWorked(null);setTaskMood("");setTaskWin("");
  };

  // ── Cadence helpers ───────────────────────────────────────────────────────
  const getDaysBetween = (dateStr) => {
    if (!dateStr) return 999;
    return Math.floor((new Date() - new Date(dateStr)) / 864e5);
  };

  // Text cadence: every 2-3 days, alternates so it never feels mechanical
  // Uses week number to decide — odd weeks = every 2 days, even weeks = every 3 days
  const getTextCadenceDays = () => {
    const weekNum = parseInt(getWeekKey().split("-W")[1]||"1");
    return weekNum % 2 === 0 ? 3 : 2;
  };

  // Is it a text day?
  const isTextDay = () => {
    const days = getDaysBetween(lastTextDate);
    return days >= getTextCadenceDays();
  };

  // Is it an activity week? (once per week, suggested Thu/Fri so he has the weekend)
  const isActivityWeek = () => {
    return safeGet("activityWeek","") !== getWeekKey();
  };

  // Days until next text
  const daysUntilNextText = () => {
    const days = getDaysBetween(lastTextDate);
    const cadence = getTextCadenceDays();
    return Math.max(0, cadence - days);
  };

  // Pick the phase-matched text — filtered hard to her current phase
  const pickDailyText = (offset=0) => {
    // Phase-specific pools — strict match first, then phase-adjacent, then full
    const phaseStrict = EXTENDED_TEXTS.filter(t =>
      (t.needs||[]).some(n => (phase.needs||[]).includes(n)) &&
      (phase.key === "menstrual"  ? ["sweet","supportive","deep"].includes(t.mood) :
       phase.key === "follicular" ? ["playful","deep","affirming"].includes(t.mood) :
       phase.key === "ovulation"  ? ["sweet","affirming","deep"].includes(t.mood) :
                                    ["supportive","deep","affirming"].includes(t.mood))
    );
    const base = getDayOfYear(new Date());
    const pool = phaseStrict.length >= 4 ? phaseStrict :
                 EXTENDED_TEXTS.filter(t => (t.needs||[]).some(n => (phase.needs||[]).includes(n))).length >= 4 ?
                 EXTENDED_TEXTS.filter(t => (t.needs||[]).some(n => (phase.needs||[]).includes(n))) :
                 EXTENDED_TEXTS;
    const t = pool[(base + offset) % pool.length];
    if (!t) return;
    setDailyTextMsg(t.text);
    setDailyTextMeta({
      feel: (TEXT_SHC[t.id]||[])[0] || "",
      pillar: TASK_LPP[t.id] || "",
      neuro: t.neuro || [],
      why: t.why || "",
      mood: t.mood || "",
      phase: phase.label,
    });
    setDailyTextCopied(false);
  };

  // Mark text as sent and update cadence
  const markTextSent = () => {
    const today = getToday();
    setLastTextDate(today);
    setTextSentToday(true);
    safeSet("lastTextDate", today);
    safeSet("textSentToday", today);
  };

  // Pick phase-matched activity for the week
  const pickDailyActivity = (offset=0) => {
    // Strict phase match — activity must align with what she needs this week
    const phaseActivityMap = {
      menstrual:  a => a.chems.includes("oxytocin") || a.chems.includes("serotonin"),   // comfort, warmth
      follicular: a => a.chems.includes("dopamine")  || a.chems.includes("endorphins"),  // fun, novelty
      ovulation:  a => a.chems.includes("oxytocin") || a.chems.includes("dopamine"),    // connection, romance
      luteal:     a => a.chems.includes("serotonin") || a.chems.includes("oxytocin"),   // calm, service
    };
    const phaseFilter = phaseActivityMap[phase.key] || (() => true);
    const phaseMatch = HOME_ACTIVITIES.filter(a =>
      (a.needs||[]).some(n => (phase.needs||[]).includes(n)) && phaseFilter(a)
    );
    const base = getDayOfYear(new Date());
    const pool = phaseMatch.length >= 3 ? phaseMatch : HOME_ACTIVITIES;
    const a = pool[(base + offset) % pool.length];
    if (!a) return;
    setDailyActivity({
      name: a.title,
      emoji: a.emoji,
      effort: a.effort,
      duration: a.duration,
      doThis: a.howTo,
      whatToSay: getActivityIntro(phase.key, a.title),
      feels: (a.needs||[]).map(n => {
        if (n==="love"||n==="connection") return "chosen";
        if (n==="significance") return "seen";
        if (n==="certainty") return "safe";
        if (n==="variety"||n==="growth") return "alive";
        return "chosen";
      })[0] || "chosen",
      pillar: a.chems?.includes("oxytocin") ? "protect" : a.chems?.includes("dopamine") ? "lead" : "provide",
      neuro: a.scienceNote,
      chems: a.chems,
      description: a.description,
      phaseReason: getActivityPhaseReason(phase.key),
    });
  };

  // Natural intro lines by phase — not generic
  const getActivityIntro = (phaseKey, activityName) => {
    const lines = {
      menstrual:  ["Hey, I planned something low-key for us tonight. Nothing you have to do.", "I've got us something easy and warm tonight.", "No pressure tonight — I've got something simple planned for us."],
      follicular: [`I want to try something with you tonight — you in?`, "I booked us something fun. Clear your evening.", "I've got a plan for tonight. You're going to like it."],
      ovulation:  ["I've got tonight handled. Dress how you want to feel.", "Clear tonight. I've planned something for us.", "I want to spend the evening with you. I've taken care of it."],
      luteal:     ["Tonight I'm taking everything off your plate. You just have to show up.", "I've got tonight covered. All you need to do is be there.", "I planned something for us. Nothing for you to organize."],
    };
    const pool = lines[phaseKey] || lines.follicular;
    return pool[getDayOfYear(new Date()) % pool.length];
  };

  // Why this activity fits this phase — shown to him as context
  const getActivityPhaseReason = (phaseKey) => {
    return {
      menstrual:  "She's in her rest phase — her body needs warmth and low demand. This activity gives her comfort without pressure.",
      follicular: "Her energy is rising and she's open to new things. This activity meets her curiosity and desire for novelty.",
      ovulation:  "She's at peak connection and wants to feel chosen. This activity creates the closeness she craves this week.",
      luteal:     "She's pre-menstrual and her nervous system is sensitive. This activity calms, reassures, and reduces her load.",
    }[phaseKey] || "";
  };

  // Mark activity as done for this week
  const markActivityDone = () => {
    const wk = getWeekKey();
    setActivityDoneThisWeek(true);
    setLastActivityDate(getToday());
    safeSet("activityWeek", wk);
    safeSet("lastActivityDate", getToday());
  };

  const pickGenText = (offset=0) => {
    const base = getDayOfYear(new Date());
    const phaseMatch = EXTENDED_TEXTS.filter(t=>(t.needs||[]).some(n=>(phase.needs||[]).includes(n)));
    const pool = phaseMatch.length>=5 ? phaseMatch : EXTENDED_TEXTS;
    const t = pool[(base+offset)%pool.length];
    setGenText(t);
    setGenCopied(false);
  };

  // ─── Auth Handlers ────────────────────────────────────────────
  // In preview/artifact mode (no API_URL) — bypass auth automatically

  const handleLogin = async () => {
    if (isPreviewMode) {
      // Dev bypass — skip auth, go straight in
      setAuthUser({ id:"preview", email:authEmail||"preview@outstandingpartner.app", name:"Preview" });
      setSubscribed(true); safeSet("subscribed","1");
      return;
    }
    if (!authEmail||!authPassword) { setAuthError("Please enter your email and password."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const { data, error } = await signIn(authEmail, authPassword);
      if (error) { setAuthError(error.message||"Login failed. Check your email and password."); setAuthLoading(false); return; }
      setAuthUser(toAuthUser(data.user));
      setSubscribed(true); safeSet("subscribed","1"); // TEMP: real entitlement check arrives with RevenueCat (Phase 5)
    } catch(e) { setAuthError("Connection error. Please try again."); }
    setAuthLoading(false);
  };

  const handleSignup = async () => {
    if (isPreviewMode) {
      setAuthUser({ id:"preview", email:authEmail||"preview@outstandingpartner.app", name:authName||"Preview" });
      setSubscribed(true); safeSet("subscribed","1");
      return;
    }
    if (!authName) { setAuthError("Please enter your first name."); return; }
    if (!authEmail||!authEmail.includes("@")) { setAuthError("Please enter a valid email address."); return; }
    if (!authPassword||authPassword.length<8) { setAuthError("Password must be at least 8 characters."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const { data, error } = await signUp(authEmail, authPassword, authName);
      if (error) { setAuthError(error.message||"Signup failed. Try a different email."); setAuthLoading(false); return; }
      if (data.session && data.user) {
        // Email confirmation disabled → session is live immediately.
        setAuthUser(toAuthUser(data.user));
        setSubscribed(true); safeSet("subscribed","1"); // TEMP until RevenueCat (Phase 5)
      } else {
        // Email confirmation enabled → user must confirm before signing in.
        setAuthError("Account created — check your email to confirm, then sign in.");
        setAuthScreen("login");
      }
    } catch(e) { setAuthError("Connection error. Please try again."); }
    setAuthLoading(false);
  };

  const handleForgot = async () => {
    if (isPreviewMode) { setAuthError("Reset link sent — check your inbox."); return; }
    if (!authEmail) { setAuthError("Enter your email address first."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const { error } = await sendPasswordReset(authEmail);
      setAuthError(error ? (error.message||"Could not send reset email.") : "Reset link sent — check your inbox.");
    } catch(e) { setAuthError("Connection error. Please try again."); }
    setAuthLoading(false);
  };

  const handleSubscribe = async (plan="basic") => {
    if (isPreviewMode) {
      setSubscribed(true); safeSet("subscribed","1");
      const tier = plan==="premium" ? "premium" : "basic";
      setSubTier(tier); safeSet("subTier", tier);
      setSubLoading(false);
      return;
    }
    setSubLoading(true);
    try {
      const token = safeGet("authToken","");
      const res = await fetch(`${API_URL}/api/billing/checkout`, {
        method:"POST", headers:{"Content-Type":"application/json","x-app-secret":APP_SECRET,"x-auth-token":token},
        body: JSON.stringify({ email:authUser?.email, plan:"monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          if (attempts > 100) { clearInterval(poll); setSubLoading(false); return; }
          try {
            const check = await fetch(`${API_URL}/api/billing/status`, {
              headers:{"x-app-secret":APP_SECRET,"x-auth-token":token}
            });
            const status = await check.json();
            if (status.subscribed) {
              setSubscribed(true); safeSet("subscribed","1");
              clearInterval(poll); setSubLoading(false);
            }
          } catch(e) {}
        }, 3000);
      }
    } catch(e) { setSubLoading(false); }
  };

  const pickDateIdea = (offset=0) => {
    const base = getDayOfYear(new Date());
    // Use dedicated DATE_IDEAS pool — separate from tonight's activities
    const phaseMatch = DATE_IDEAS.filter(a=>(a.needs||[]).some(n=>(phase.needs||[]).includes(n)));
    const pool = phaseMatch.length>=3 ? phaseMatch : DATE_IDEAS;
    const a = pool[(base+offset)%pool.length];
    setDateIdea(a);
  };


  const generateAIText=async()=>{
    setAiLoading(true);setAiText("");
    try {
      const needs=wifeNeeds.length>0?wifeNeeds.join(", "):phase.needs.join(", ");
      const zodiacCtx = zodiac ? `Her Western zodiac is ${zodiac.sign} (${zodiac.element} sign). ${zodiac.textsLike}` : "";
      const czCtx = chineseZodiac ? `Her Chinese zodiac is the ${chineseZodiac.sign}. ${chineseZodiac.loveStyle}` : "";
      const r=await fetchAI(`You are helping a husband write a text to his wife that makes her feel SEEN, HEARD, CHOSEN, SAFE, ALIVE, and FEMININE.

HER FEELINGS (what she needs to feel):
- SEEN = noticed in the specific details of her life, effort, and who she is
- HEARD = her words and feelings truly matter, received without judgment
- CHOSEN = deliberately selected — he'd pick her again today, on purpose
- SAFE = emotionally protected, no fear of judgment, consistent and calm
- ALIVE = energized and vibrant — being with him makes her more herself, more lit up, more awake to her own life

HIS PILLARS (what drives him):
- LEAD = creates direction, makes decisions, takes ownership
- PROTECT = shields her peace, reputation, and emotional world
- PROVIDE = shows up with presence, stability, vision, and care
- STAY ATTRACTIVE = keeps growing, stays sharp, gives her something to be drawn to
- BE MASCULINE = grounded, certain, present — his calm is her anchor and her femininity's permission

WIFE PROFILE:
- Cycle phase: ${phase.label}. ${phase.tip}
- Emotional needs: ${needs}
- ${zodiacCtx}
- ${czCtx}

Write ONE short, authentic text (2-3 sentences) that naturally makes her feel seen, heard, chosen, safe, or alive — while expressing leadership, protection, or provision. No clichés. A real man, real words.

Then:
MAKES HER FEEL: [Seen / Heard / Chosen / Safe / Alive — pick strongest]
HIS PILLAR: [Lead / Protect / Provide / Stay Attractive / Be Masculine]
NEURO: [brain chemicals triggered + one sentence why]`);
      setAiText(r||"");
    } catch(e) { console.error(e); }
    finally { setAiLoading(false); }
  };

  const generateAIActivity=async()=>{
    setActivityLoading(true);setAiActivity("");
    try {
      const needs=wifeNeeds.length>0?wifeNeeds.join(", "):phase.needs.join(", ");
      const zodiacCtx = zodiac ? `Western zodiac: ${zodiac.sign} — she loves: ${zodiac.dateIdeas.join(", ")}` : "";
      const czCtx = chineseZodiac ? `Chinese zodiac: ${chineseZodiac.sign} — ideal experiences: ${chineseZodiac.gifts.join(", ")}` : "";
      const r=await fetchAI(`You are helping a husband plan an activity that makes his wife feel SEEN, HEARD, CHOSEN, SAFE, ALIVE, and FEMININE — while he shows up as a man who Leads, Protects, and Provides.

HER FEELINGS:
- SEEN = noticed in the specific details of who she is
- HEARD = her desires and feelings genuinely matter
- CHOSEN = deliberately pursued and prioritized, not taken for granted
- SAFE = emotionally protected — calm, consistent, no walking on eggshells
- ALIVE = energized, vibrant, more herself — being with him lights her up

HIS PILLARS:
- LEAD = creates the plan, makes decisions, sets the tone
- PROTECT = shields her from stress, creates safety in the experience
- PROVIDE = brings presence, investment, and care to the activity
- STAY ATTRACTIVE = shows up as his best self — engaged, disciplined, growing
- BE MASCULINE = grounded presence so deep she can fully exhale into her femininity

WIFE PROFILE:
- Cycle phase: ${phase.label} — ${phase.tip}
- Emotional needs: ${needs}
- ${zodiacCtx}
- ${czCtx}

Design ONE specific, actionable activity that naturally hits both her emotional needs AND his role as a man who leads, protects, and provides.

Format exactly:
ACTIVITY: [name]
WHAT TO DO: [2-3 specific sentences — exactly what to do and how]
MAKES HER FEEL: [which of Seen / Heard / Chosen / Safe / Alive and why]
HIS PILLAR: [which of Lead / Protect / Provide / Stay Attractive / Be Masculine this expresses most]
NEURO IMPACT: [brain chemicals + the mechanism]
PRO TIP: [one insider detail that elevates this from good to unforgettable]`);
      setAiActivity(r||"");
    } catch(e) { console.error(e); }
    finally { setActivityLoading(false); }
  };

  const parseAIText=(raw)=>{
    const lines=raw.split("\n").filter(l=>l.trim());
    const ni=lines.findIndex(l=>l.startsWith("NEURO:"));
    const fi=lines.findIndex(l=>l.startsWith("MAKES HER FEEL:"));
    const pi=lines.findIndex(l=>l.startsWith("HIS PILLAR:"));
    const msgLines=lines.filter((_,i)=>i!==ni&&i!==fi&&i!==pi&&lines[i]&&!lines[i].startsWith("MAKES HER FEEL")&&!lines[i].startsWith("HIS PILLAR")&&!lines[i].startsWith("NEURO:"));
    return{
      msg:msgLines.join(" ")||raw,
      neuro:ni>=0?lines[ni].replace("NEURO:","").trim():"",
      feels:fi>=0?lines[fi].replace("MAKES HER FEEL:","").trim():"",
      pillar:pi>=0?lines[pi].replace("HIS PILLAR:","").trim():"",
    };
  };
  const parseAIActivity=(raw)=>{
    const get=k=>{const m=raw.match(new RegExp(`${k}:\\s*(.+?)(?=\\n[A-Z ]+:|$)`,"s"));return m?m[1].trim():"";};
    return{activity:get("ACTIVITY"),what:get("WHAT TO DO"),feels:get("MAKES HER FEEL"),pillar:get("HIS PILLAR"),neuro:get("NEURO IMPACT"),tip:get("PRO TIP")};
  };
  const allReminders = ALL_REMINDERS();
  const filteredReminders = reminderCat==="all" ? allReminders : allReminders.filter(r=>r.category===reminderCat);
  const activeCount=Object.values(activeReminders).filter(Boolean).length;
  const parsedAI=aiText?parseAIText(aiText):null;

  const renderCalendar=()=>{
    const days=Array.from({length:28},(_,i)=>i+1);
    return(
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6}}>
        {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:11,color:"#666",fontWeight:700,padding:"4px 0"}}>{d}</div>)}
        {days.map(day=>{const p=getCurrentPhase(day);const it=day===cycleDay;return(
          <div key={day} onClick={()=>setCycleDay(day)} style={{background:it?p.color:`${p.color}20`,color:it?"#fff":p.color,borderRadius:10,padding:"8px 4px",textAlign:"center",fontSize:13,fontWeight:it?700:500,cursor:"pointer",border:it?`2px solid ${p.color}`:"2px solid transparent",transition:"all 0.2s"}}>{day}</div>
        );})}
      </div>
    );
  };

  const tabs=[
    {id:"today",    icon:"🌅", label:"Today"},
    {id:"texts",    icon:"💬", label:"Texts"},
    {id:"home",     icon:"🎲", label:"Activities"},
    {id:"coach",    icon:"📚", label:"Guide"},
    {id:"log",      icon:"📓", label:"Log"},
    {id:"reminders",icon:"🔔", label:"Remind"},
    {id:"profile",  icon:"⭐", label:"Profile"},
  ];

  // ─── Profile Tab Sections ─────────────────────────────────────────────────
  const renderProfile = () => {
    const sections = [
      {id:"overview",label:"Overview",   icon:"👤"},
      {id:"cycle",   label:"Cycle",      icon:"🗓️"},
      {id:"lpp",     label:"Your Code",  icon:"🧭"},
      {id:"western", label:"Zodiac",     icon:"♈"},
      {id:"chinese", label:"Chinese",    icon:"🐉"},
      {id:"numerology",label:"Numbers",  icon:"🔢"},
      
    ];
    return (
      <div>
        {/* Sub-nav */}
        <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
          {sections.map(s=>(
            <button key={s.id} onClick={()=>setProfileSection(s.id)} style={{background:profileSection===s.id?"#c0392b":"#1a1a1a",color:profileSection===s.id?"#fff":"#888",border:`1px solid ${profileSection===s.id?"#c0392b":"#333"}`,borderRadius:20,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{s.icon} {s.label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {profileSection==="overview"&&(
          <div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Her Name</div>
              <input value={wifeName} onChange={e=>setWifeName(e.target.value)} placeholder="Enter her name..." style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>

            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Her Nickname</div>
              <div style={{fontSize:11,color:"#555",marginBottom:8,lineHeight:1.5}}>The special name only you call her — babe, love, mama, queen, whatever makes her smile when she hears it from you.</div>
              <input value={wifeNickname} onChange={e=>setWifeNickname(e.target.value)} placeholder="e.g. Babe, Love, Baby girl, Queen..." style={{width:"100%",background:"#1a1a1a",border:`1px solid ${wifeNickname?"#e91e8c40":"#333"}`,color:"#f0ece4",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit"}}/>
              {wifeNickname&&(
                <div style={{marginTop:8,padding:"8px 12px",background:"#1a0a0a",border:"1px solid #e91e8c30",borderRadius:10,display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:16}}>💕</span>
                  <span style={{fontSize:13,color:"#e91e8c"}}>Use "<strong>{wifeNickname}</strong>" when you text her, talk to her, and introduce her. She notices every time.</span>
                </div>
              )}
            </div>

            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Her Birthday</div>
              <div style={{display:"flex",gap:8}}>
                <input value={wifeBirthMonth} onChange={e=>setWifeBirthMonth(e.target.value)} placeholder="Month (1-12)" type="number" min="1" max="12" style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"12px 14px",fontSize:14,boxSizing:"border-box",fontFamily:"inherit"}}/>
                <input value={wifeBirthDay} onChange={e=>setWifeBirthDay(e.target.value)} placeholder="Day" type="number" min="1" max="31" style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"12px 14px",fontSize:14,boxSizing:"border-box",fontFamily:"inherit"}}/>
                <input value={wifeBirthYear} onChange={e=>setWifeBirthYear(e.target.value)} placeholder="Year" type="number" min="1920" max="2010" style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"12px 14px",fontSize:14,boxSizing:"border-box",fontFamily:"inherit"}}/>
              </div>
            </div>

            {/* ── Period & Cycle Tracking ── */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Period Start Date</div>
              <div style={{fontSize:12,color:"#555",marginBottom:10,lineHeight:1.5}}>Enter the first day of her last period. The app automatically calculates her current cycle day and phase.</div>
              <input
                type="date"
                value={cycleStartDate}
                onChange={e=>handleCycleStart(e.target.value)}
                style={{width:"100%",background:"#1a1a1a",border:"1px solid #c0392b40",color:"#f0ece4",borderRadius:12,padding:"12px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit"}}
              />
            </div>

            {/* Live cycle status card */}
            <div style={{background:`linear-gradient(135deg,${phase.color}18,${phase.color}06)`,border:`1.5px solid ${phase.color}40`,borderRadius:18,padding:18,marginBottom:20}}>
              <div style={{fontSize:11,color:phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Current Cycle Status</div>

              {/* Progress bar */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:"#aaa"}}>Day {cycleDay} of 28</span>
                  <span style={{fontSize:12,color:phase.color,fontWeight:700}}>{phase.emoji} {phase.label} Phase</span>
                </div>
                <div style={{background:"#2a2a2a",borderRadius:8,height:10,overflow:"hidden"}}>
                  <div style={{width:`${(cycleDay/28)*100}%`,height:"100%",background:`linear-gradient(90deg,#c0392b,${phase.color})`,borderRadius:8,transition:"width 0.5s ease"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                  {Object.entries(CYCLE_PHASES).map(([k,p])=>(
                    <span key={k} style={{fontSize:9,color:phase.key===k?p.color:"#444",fontWeight:600,textTransform:"uppercase"}}>{p.label.slice(0,3)}</span>
                  ))}
                </div>
              </div>

              {/* Phase details */}
              <div style={{background:"#00000030",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:13,color:"#ccc",lineHeight:1.6}}>{phase.tip}</div>
              </div>

              {/* Days breakdown */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {(()=>{
                  const daysLeft = 28 - cycleDay;
                  const nextPeriod = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + 28*864e5) : null;
                  const nextPeriodStr = nextPeriod ? nextPeriod.toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—";
                  // Next phase
                  const phases = Object.entries(CYCLE_PHASES);
                  const currentIdx = phases.findIndex(([k])=>k===phase.key);
                  const nextPhase = phases[(currentIdx+1)%phases.length];
                  const daysToNextPhase = nextPhase[1].days[0] - cycleDay;
                  return (
                    <>
                      <div style={{background:"#1a1a1a",borderRadius:10,padding:"10px 12px"}}>
                        <div style={{fontSize:20,fontWeight:700,color:phase.color}}>{daysLeft}</div>
                        <div style={{fontSize:11,color:"#666"}}>days left in cycle</div>
                      </div>
                      <div style={{background:"#1a1a1a",borderRadius:10,padding:"10px 12px"}}>
                        <div style={{fontSize:16,fontWeight:700,color:"#c0392b"}}>{nextPeriodStr}</div>
                        <div style={{fontSize:11,color:"#666"}}>next period est.</div>
                      </div>
                      {daysToNextPhase > 0 && (
                        <div style={{background:"#1a1a1a",borderRadius:10,padding:"10px 12px",gridColumn:"1/-1"}}>
                          <div style={{fontSize:13,color:nextPhase[1].color,fontWeight:600}}>{nextPhase[1].emoji} {nextPhase[1].label} phase in {daysToNextPhase} day{daysToNextPhase!==1?"s":""}</div>
                          <div style={{fontSize:11,color:"#666",marginTop:2}}>{nextPhase[1].tip}</div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Manual day adjust */}
              <div style={{marginTop:12,display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:11,color:"#666",flex:1}}>Fine-tune cycle day:</div>
                <button onClick={()=>setCycleDay(d=>Math.max(1,d-1))} style={{width:36,height:36,borderRadius:10,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",fontSize:18,cursor:"pointer"}}>−</button>
                <span style={{fontSize:13,fontWeight:700,color:phase.color,minWidth:50,textAlign:"center"}}>Day {cycleDay}</span>
                <button onClick={()=>setCycleDay(d=>Math.min(28,d+1))} style={{width:36,height:36,borderRadius:10,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",fontSize:18,cursor:"pointer"}}>+</button>
              </div>
            </div>

            {/* Auto-detected signs */}
            {(zodiac||chineseZodiac||numerology)&&(
              <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:20}}>
                <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Detected Profile</div>
                {zodiac&&(
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10,padding:"12px 14px",background:`${zodiac.color}12`,border:`1px solid ${zodiac.color}30`,borderRadius:12}}>
                    <span style={{fontSize:26}}>{zodiac.emoji}</span>
                    <div><div style={{fontSize:15,fontWeight:700,color:zodiac.color}}>{zodiac.sign}</div><div style={{fontSize:11,color:"#888"}}>{zodiac.dates} · {zodiac.element} Sign</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{zodiac.traits.map(t=><span key={t} style={{fontSize:10,color:zodiac.color,background:zodiac.color+"15",borderRadius:10,padding:"1px 7px",fontWeight:600}}>{t}</span>)}</div></div>
                  </div>
                )}
                {chineseZodiac&&(
                  <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10,padding:"12px 14px",background:`${chineseZodiac.color}12`,border:`1px solid ${chineseZodiac.color}30`,borderRadius:12}}>
                    <span style={{fontSize:26}}>{chineseZodiac.emoji}</span>
                    <div><div style={{fontSize:15,fontWeight:700,color:chineseZodiac.color}}>Year of the {chineseZodiac.sign}</div><div style={{fontSize:11,color:"#888"}}>Chinese Zodiac · {wifeBirthYear}</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{chineseZodiac.traits.map(t=><span key={t} style={{fontSize:10,color:chineseZodiac.color,background:chineseZodiac.color+"15",borderRadius:10,padding:"1px 7px",fontWeight:600}}>{t}</span>)}</div></div>
                  </div>
                )}
                {numerology&&(
                  <div style={{display:"flex",gap:12,alignItems:"center",padding:"12px 14px",background:`${numerology.color}12`,border:`1px solid ${numerology.color}30`,borderRadius:12}}>
                    <div style={{fontSize:26,fontWeight:800,color:numerology.color,minWidth:36,textAlign:"center"}}>{numerology.number}</div>
                    <div><div style={{fontSize:15,fontWeight:700,color:numerology.color}}>Life Path {numerology.number} — {numerology.name}</div><div style={{fontSize:11,color:"#888"}}>Numerology · {numerology.emoji}</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{numerology.traits.map(t=><span key={t} style={{fontSize:10,color:numerology.color,background:numerology.color+"15",borderRadius:10,padding:"1px 7px",fontWeight:600}}>{t}</span>)}</div></div>
                  </div>
                )}
              </div>
            )}

            {/* Her Core Needs */}
            <div style={{marginBottom:20}}>
            {/* ══ KNOW HER ══════════════════════════════════════════ */}
            <div style={{marginBottom:24}}>
              <div style={{background:"linear-gradient(135deg,#1a0a1a,#0d0d0d)",border:"1px solid #e91e8c25",borderRadius:16,padding:"14px 18px",marginBottom:16}}>
                <div style={{fontSize:11,color:"#e91e8c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:2}}>Know Her</div>
                <div style={{fontSize:13,color:"#888",lineHeight:1.5}}>The details that show her you actually pay attention. The more you fill in, the more the app personalizes everything.</div>
              </div>

              {/* Important Dates */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#e67e22",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>📅 Important Dates</div>
                {[
                  {label:"Anniversary Date",value:anniversaryDate,set:setAnniversaryDate,type:"date",ph:"Your anniversary",icon:"💍"},
                  {label:"First Date",value:firstDateDate,set:setFirstDateDate,type:"date",ph:"When you first went out",icon:"🌹"},
                ].map(f=>(
                  <div key={f.label} style={{marginBottom:10}}>
                    <div style={{fontSize:12,color:"#666",marginBottom:5,display:"flex",gap:6,alignItems:"center"}}><span>{f.icon}</span>{f.label}</div>
                    <input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",background:"#1a1a1a",border:`1px solid ${f.value?"#e67e2250":"#2a2a2a"}`,color:"#f0ece4",borderRadius:10,padding:"11px 14px",fontSize:14,boxSizing:"border-box",fontFamily:"inherit"}}/>
                  </div>
                ))}
              </div>

              {/* Upcoming anniversary reminder */}
              {anniversaryDate&&(()=>{
                const today = new Date();
                const thisYear = today.getFullYear();
                const anniv = new Date(anniversaryDate);
                let next = new Date(thisYear, anniv.getMonth(), anniv.getDate());
                if (next < today) next = new Date(thisYear+1, anniv.getMonth(), anniv.getDate());
                const daysAway = Math.ceil((next - today) / 864e5);
                const years = thisYear - anniv.getFullYear() + (next.getFullYear()===thisYear?0:1);
                if (daysAway > 90) return null;
                return (
                  <div style={{background:"#1a0a00",border:"1px solid #e67e2240",borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:20}}>💍</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#e67e22"}}>Anniversary in {daysAway} day{daysAway!==1?"s":""}!</div>
                      <div style={{fontSize:11,color:"#888"}}>{years} year{years!==1?"s":""} together · {next ? next.toLocaleDateString("en-US",{month:"long",day:"numeric"}) : "—"}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Her Favorites */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#e91e8c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>❤️ Her Favorites</div>
                {[
                  {label:"Favorite Restaurant",value:favRestaurant,set:setFavRestaurant,ph:"Where she always wants to go",icon:"🍽️"},
                  {label:"Favorite Food",value:favFood,set:setFavFood,ph:"Her go-to comfort food",icon:"🍕"},
                  {label:"Favorite Drink",value:favDrink,set:setFavDrink,ph:"Wine, cocktail, whatever she loves",icon:"🍷"},
                  {label:"Starbucks Order",value:favStarbucks,set:setFavStarbucks,ph:"Her exact Starbucks order",icon:"☕"},
                  {label:"Favorite Flower",value:favFlower,set:setFavFlower,ph:"What to bring her",icon:"💐"},
                  {label:"Favorite Color",value:favColor,set:setFavColor,ph:"Her color",icon:"🎨"},
                  {label:"Favorite Movie",value:favMovie,set:setFavMovie,ph:"The one she can watch again and again",icon:"🎬"},
                  {label:"Favorite TV Show",value:favShow,set:setFavShow,ph:"What she's watching right now",icon:"📺"},
                  {label:"Favorite Song or Artist",value:favSong,set:setFavSong,ph:"What makes her sing along",icon:"🎵"},
                ].map(f=>(
                  <div key={f.label} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:18,minWidth:26,textAlign:"center"}}>{f.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#555",marginBottom:3}}>{f.label}</div>
                      <input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",background:"#1a1a1a",border:`1px solid ${f.value?"#e91e8c30":"#2a2a2a"}`,color:"#f0ece4",borderRadius:10,padding:"9px 12px",fontSize:13,boxSizing:"border-box",fontFamily:"inherit"}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Love Language */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#3498db",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>💗 How She Feels Loved</div>
                <div style={{fontSize:11,color:"#555",marginBottom:10,lineHeight:1.5}}>Select her primary way of feeling loved and valued.</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {[
                    {key:"Verbal Affirmation",   emoji:"💬", desc:"She needs to hear it — out loud, specifically, often. Never assume she knows how you feel. Say it. Text it. Write it."},
                    {key:"Undivided Presence",   emoji:"⏱️", desc:"Full attention, no phone, eyes on her. Time that is completely and only about her. Be here — fully here."},
                    {key:"Thoughtful Gestures",  emoji:"🎁", desc:"It's not about money — it's about the fact that you saw something and thought of her. Small and specific beats big and generic."},
                    {key:"Acts of Service",      emoji:"🛠️", desc:"She feels deeply loved when you do things without being asked. Notice what needs doing and handle it before she mentions it."},
                    {key:"Physical Connection",  emoji:"🤝", desc:"Non-sexual touch matters as much as intimacy. Hold her hand. Hug her first. A hand on her back says more than you think."},
                  ].map(l=>(
                    <button key={l.key} onClick={()=>setLoveLanguage(loveLanguage===l.key?"":l.key)} style={{padding:"8px 14px",borderRadius:20,border:`1px solid ${loveLanguage===l.key?"#3498db":"#2a2a2a"}`,background:loveLanguage===l.key?"#3498db20":"#1a1a1a",color:loveLanguage===l.key?"#3498db":"#777",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.2s",display:"flex",gap:5,alignItems:"center"}}>
                      <span>{l.emoji}</span> {l.key}
                    </button>
                  ))}
                </div>
                {loveLanguage&&(()=>{
                  const found = [{key:"Verbal Affirmation",emoji:"💬",desc:"She needs to hear it — out loud, specifically, often. Never assume she knows how you feel. Say it. Text it. Write it."},{key:"Undivided Presence",emoji:"⏱️",desc:"Full attention, no phone, eyes on her. Time that is completely and only about her. Be here — fully here."},{key:"Thoughtful Gestures",emoji:"🎁",desc:"It's not about money — it's about the fact that you saw something and thought of her. Small and specific beats big and generic."},{key:"Acts of Service",emoji:"🛠️",desc:"She feels deeply loved when you do things without being asked. Notice what needs doing and handle it before she mentions it."},{key:"Physical Connection",emoji:"🤝",desc:"Non-sexual touch matters as much as intimacy. Hold her hand. Hug her first. A hand on her back says more than you think."}].find(l=>l.key===loveLanguage);
                  if(!found) return null;
                  return(
                    <div style={{background:"#0d1a2a",border:"1px solid #3498db25",borderRadius:10,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                      <span style={{fontSize:18,flexShrink:0}}>{found.emoji}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:"#3498db",marginBottom:3}}>{found.key}</div>
                        <div style={{fontSize:12,color:"#6ab0d8",lineHeight:1.6}}>{found.desc}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Know Her Deeper */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#9b59b6",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>🧠 Know Her Deeper</div>
                {[
                  {label:"Her Biggest Dream",value:biggestDream,set:setBiggestDream,ph:"What does she really want in life?",icon:"✨",rows:2},
                  {label:"Her Biggest Fear",value:biggestFear,set:setBiggestFear,ph:"What keeps her up at night?",icon:"💭",rows:2},
                  {label:"What Stresses Her Out",value:whatStresses,set:setWhatStresses,ph:"What drains her most?",icon:"😮‍💨",rows:2},
                  {label:"What Lights Her Up",value:whatLightsUp,set:setWhatLightsUp,ph:"What makes her eyes go bright?",icon:"🔆",rows:2},
                  {label:"How She Feels Most Loved",value:howSheFeelsLoved,set:setHowSheFeelsLoved,ph:"In her own words — what does being loved feel like to her?",icon:"💕",rows:2},
                ].map(f=>(
                  <div key={f.label} style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:"#666",marginBottom:5,display:"flex",gap:6,alignItems:"center"}}><span>{f.icon}</span>{f.label}</div>
                    <textarea value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.ph} rows={f.rows} style={{width:"100%",background:"#1a1a1a",border:`1px solid ${f.value?"#9b59b630":"#2a2a2a"}`,color:"#f0ece4",borderRadius:10,padding:"10px 12px",fontSize:13,resize:"none",boxSizing:"border-box",fontFamily:"inherit",lineHeight:1.5}}/>
                  </div>
                ))}
              </div>

              {/* Her People */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#27ae60",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>👨‍👩‍👧 Her People</div>
                {[
                  {label:"Kids Names & Ages",value:kidsNames,set:setKidsNames,ph:"e.g. Emma (7), Liam (4)",icon:"👶"},
                  {label:"Pets",value:petsNames,set:setPetsNames,ph:"Their names and type",icon:"🐾"},
                  {label:"Her Mom",value:herMom,set:setHerMom,ph:"Name and anything important about their relationship",icon:"👩"},
                  {label:"Her Dad",value:herDad,set:setHerDad,ph:"Name and anything important",icon:"👨"},
                  {label:"Her Best Friend",value:herBestFriend,set:setHerBestFriend,ph:"Name — the person she tells everything to",icon:"👯"},
                ].map(f=>(
                  <div key={f.label} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:18,minWidth:26,textAlign:"center"}}>{f.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:10,color:"#555",marginBottom:3}}>{f.label}</div>
                      <input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",background:"#1a1a1a",border:`1px solid ${f.value?"#27ae6030":"#2a2a2a"}`,color:"#f0ece4",borderRadius:10,padding:"9px 12px",fontSize:13,boxSizing:"border-box",fontFamily:"inherit"}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Husband's Private Notes */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:11,color:"#f39c12",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>📝 Your Private Notes About Her</div>
                <div style={{fontSize:11,color:"#555",marginBottom:8,lineHeight:1.5}}>Anything you want to remember. Things she said. Moments that mattered. What she's going through right now. What you're working on together.</div>
                <textarea
                  value={husbandNotes}
                  onChange={e=>setHusbandNotes(e.target.value)}
                  placeholder={"Write anything here...\n\n• Something she mentioned she wanted\n• A moment she was really happy\n• Something she's struggling with\n• What you're trying to get better at\n• Things you never want to forget about her"}
                  rows={8}
                  style={{width:"100%",background:"#1a1a1a",border:`1px solid ${husbandNotes?"#f39c1230":"#2a2a2a"}`,color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",lineHeight:1.7}}
                />
                {husbandNotes&&<div style={{fontSize:10,color:"#555",marginTop:4,textAlign:"right"}}>{husbandNotes.length} characters · private to you</div>}
              </div>
            </div>

            {/* Her Core Needs */}
            <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Her Core Needs (customize)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {NEEDS.map(need=>(
                  <button key={need} onClick={()=>toggleNeed(need)} style={{background:wifeNeeds.includes(need)?NEED_COLORS[need]:"#1a1a1a",color:wifeNeeds.includes(need)?"#fff":"#aaa",border:`1.5px solid ${wifeNeeds.includes(need)?NEED_COLORS[need]:"#333"}`,borderRadius:20,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",textTransform:"capitalize",transition:"all 0.2s"}}>{need}</button>
                ))}
              </div>
            </div>

            {/* Account Info */}
            {authUser&&(
              <div style={{marginBottom:20,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:14,padding:16}}>
                <div style={{fontSize:12,color:"#666",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Your Account</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:14,color:"#f0ece4",fontWeight:600}}>{authUser.name||"Your account"}</div>
                    <div style={{fontSize:12,color:"#666",marginTop:2}}>{authUser.email}</div>
                    <div style={{fontSize:11,marginTop:4,fontWeight:600,color:isPremium?"#8e44ad":"#27ae60"}}>
                      '✓ Outstanding Partner — $21.99/month'
                    </div>
                  </div>
                  <button onClick={async()=>{
                    if (!isPreviewMode) { try { await signOutUser(); } catch(e) {} }
                    try { Object.keys(localStorage).forEach(k=>{ if(k.startsWith('op_hydrated_')) sessionStorage.removeItem(k); }); } catch(e) {}
                    safeSet("authToken",""); safeSet("authUser",""); safeSet("subscribed",""); safeSet("subTier","basic");
                    setAuthUser(null); setSubscribed(false); setSubTier("basic"); setAuthEmail(""); setAuthPassword("");
                  }} style={{background:"#111",border:"1px solid #333",borderRadius:10,padding:"8px 14px",fontSize:12,color:"#888",cursor:"pointer"}}>
                    Sign Out
                  </button>
                </div>
                {!isPremium&&(
                  <button onClick={()=>setSubscribed(false)} style={{width:"100%",background:"linear-gradient(135deg,#8e44ad,#c0392b)",color:"#fff",border:"none",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8}}>
                    
                  </button>
                )}
                <button onClick={()=>{setOnboardSlide(0);setReplayGuide(true);}} style={{width:"100%",background:"#111",border:"1px solid #2a2a2a",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#888",cursor:"pointer"}}>
                  📖 Replay App Guide
                </button>
              </div>
            )}

            {/* Danger zone - Reset */}
            <div style={{marginBottom:20,background:"#1a0a0a",border:"1px solid #e74c3c20",borderRadius:14,padding:16}}>
              <div style={{fontSize:12,color:"#e74c3c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>⚠️ Reset App</div>
              <div style={{fontSize:12,color:"#777",lineHeight:1.5,marginBottom:10}}>Clears all data — profile, logs, reminders, history. Use if you entered wrong information and want to start fresh.</div>
              <div>
                {!showResetConfirm?(
                  <button onClick={()=>setShowResetConfirm(true)} style={{background:"#1a0a0a",border:"1px solid #e74c3c40",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:700,color:"#e74c3c",cursor:"pointer"}}>
                    Reset All Data
                  </button>
                ):(
                  <div style={{background:"#2a0a0a",border:"1px solid #e74c3c60",borderRadius:10,padding:14}}>
                    <div style={{fontSize:12,color:"#f0ece4",marginBottom:10,fontWeight:600}}>Are you sure? This cannot be undone.</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>{
                        ["wifeName","wifeNickname","wifeBirthMonth","wifeBirthDay","wifeBirthYear","cycleDay","cycleStartDate","taskLog","wifeNeeds","usedTaskIds","usedTextIds","weeklyScore","onboarded","anniversaryDate","firstDateDate","favRestaurant","favFood","favDrink","favStarbucks","favFlower","favColor","favMovie","favShow","favSong","favArtist","loveLanguage","biggestDream","biggestFear","whatStresses","whatLightsUp","howSheFeelsLoved","kidsNames","petsNames","herMom","herDad","herBestFriend","husbandNotes","lastTextDate","lastActivityDate","sheSaid","completedDays","currentStreak","longestStreak","lastOpenDate","sentTextIds","sheSaidDone","dateDone"].forEach(k=>safeSet(k,""));
                        setWifeName(""); setWifeNickname(""); setCycleDay(1); setCycleStartDate("");
                        setTaskLog([]); setCompletedDays([]); setCurrentStreak(0);
                        setSheSaid([]); setSentTextIds([]); setLastTextDate("");
                        setOnboarded(false); setShowResetConfirm(false); setTab("today");
                      }} style={{flex:1,background:"#e74c3c",color:"#fff",border:"none",borderRadius:8,padding:"9px 0",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        Yes, Reset Everything
                      </button>
                      <button onClick={()=>setShowResetConfirm(false)} style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#888",borderRadius:8,padding:"9px 0",fontSize:12,cursor:"pointer"}}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About & Legal */}
            <div style={{marginBottom:20,background:"#141414",border:"1px solid #2a2a2a",borderRadius:14,padding:16}}>
              <div style={{fontSize:12,color:"#888",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>About & Legal</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <button onClick={()=>setLegalView("support")} style={{textAlign:"left",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,padding:"12px 14px",fontSize:14,color:"#f0ece4",cursor:"pointer"}}>💬 Support & FAQ</button>
                <button onClick={()=>setLegalView("privacy")} style={{textAlign:"left",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,padding:"12px 14px",fontSize:14,color:"#f0ece4",cursor:"pointer"}}>🔒 Privacy Policy</button>
              </div>
            </div>

            {/* Danger zone - Delete account */}
            <div style={{marginBottom:20,background:"#1a0a0a",border:"1px solid #e74c3c20",borderRadius:14,padding:16}}>
              <div style={{fontSize:12,color:"#e74c3c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>🗑️ Delete Account</div>
              <div style={{fontSize:12,color:"#777",lineHeight:1.5,marginBottom:10}}>Permanently deletes your account and all data from our servers. This cannot be undone.</div>
              {!showDeleteConfirm?(
                <button onClick={()=>setShowDeleteConfirm(true)} style={{background:"#1a0a0a",border:"1px solid #e74c3c40",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:700,color:"#e74c3c",cursor:"pointer"}}>
                  Delete My Account
                </button>
              ):(
                <div style={{background:"#2a0a0a",border:"1px solid #e74c3c60",borderRadius:10,padding:14}}>
                  <div style={{fontSize:12,color:"#f0ece4",marginBottom:10,fontWeight:600}}>Permanently delete your account and all data?</div>
                  <div style={{display:"flex",gap:8}}>
                    <button disabled={deleteLoading} onClick={handleDeleteAccount} style={{flex:1,background:"#e74c3c",color:"#fff",border:"none",borderRadius:8,padding:"9px 0",fontSize:12,fontWeight:700,cursor:"pointer",opacity:deleteLoading?0.7:1}}>
                      {deleteLoading?"Deleting…":"Yes, Delete Forever"}
                    </button>
                    <button disabled={deleteLoading} onClick={()=>setShowDeleteConfirm(false)} style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#888",borderRadius:8,padding:"9px 0",fontSize:12,cursor:"pointer"}}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CYCLE CALENDAR TAB */}
        {profileSection==="cycle"&&(
          <div>
            {/* Current status hero */}
            <div style={{background:`linear-gradient(135deg,${phase.color}20,${phase.color}08)`,border:`1.5px solid ${phase.color}40`,borderRadius:20,padding:20,marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <span style={{fontSize:42}}>{phase.emoji}</span>
                <div>
                  <div style={{fontSize:11,color:phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Right Now</div>
                  <div style={{fontSize:24,fontWeight:700,color:"#f0ece4",fontFamily:"'Playfair Display',serif"}}>{phase.label} Phase</div>
                  <div style={{fontSize:13,color:"#888"}}>Day {cycleDay} of 28</div>
                </div>
              </div>
              {/* Full bar */}
              <div style={{background:"#00000040",borderRadius:10,height:12,overflow:"hidden",marginBottom:8}}>
                <div style={{width:`${(cycleDay/28)*100}%`,height:"100%",background:`linear-gradient(90deg,#c0392b,${phase.color})`,borderRadius:10}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                {Object.entries(CYCLE_PHASES).map(([k,p])=>(
                  <span key={k} style={{fontSize:10,color:k===phase.key?p.color:"#444",fontWeight:700}}>{p.emoji}</span>
                ))}
              </div>
              <p style={{fontSize:13,color:"#ccc",lineHeight:1.6,marginTop:12,marginBottom:0}}>{phase.tip}</p>
            </div>

            {/* 28-day visual calendar */}
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>28-Day Cycle Map</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginBottom:8}}>
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                  <div key={d} style={{textAlign:"center",fontSize:9,color:"#555",fontWeight:700,padding:"2px 0"}}>{d}</div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
                {Array.from({length:28},(_,i)=>i+1).map(day=>{
                  const p = getCurrentPhase(day);
                  const isToday = day===cycleDay;
                  const isPast = day<cycleDay;
                  const isFuture = day>cycleDay;
                  // Calculate real calendar date for this day
                  const calDate = cycleStartDate ? new Date(new Date(cycleStartDate).getTime()+(day-1)*864e5) : null;
                  const dateLabel = calDate ? calDate.toLocaleDateString("en-US",{month:"numeric",day:"numeric"}) : "";
                  return (
                    <div key={day} onClick={()=>setCycleDay(day)} style={{
                      background: isToday ? p.color : isPast ? `${p.color}35` : `${p.color}12`,
                      color: isToday ? "#fff" : isPast ? p.color : p.color+"88",
                      borderRadius:10,
                      padding:"6px 2px 4px",
                      textAlign:"center",
                      cursor:"pointer",
                      border: isToday ? `2px solid ${p.color}` : "2px solid transparent",
                      transition:"all 0.2s",
                      position:"relative",
                    }}>
                      <div style={{fontSize:14,fontWeight:isToday?800:isPast?600:400,lineHeight:1}}>{day}</div>
                      <div style={{fontSize:8,opacity:0.7,marginTop:2}}>{dateLabel}</div>
                      {isToday&&<div style={{position:"absolute",top:-4,right:-4,background:"#fff",borderRadius:6,width:8,height:8,border:`2px solid ${p.color}`}}/>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phase legend with dates */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Phase Schedule</div>
              {Object.entries(CYCLE_PHASES).map(([key,p])=>{
                const startDay = p.days[0];
                const endDay = p.days[p.days.length-1];
                const startDate = cycleStartDate ? new Date(new Date(cycleStartDate).getTime()+(startDay-1)*864e5) : null;
                const endDate = cycleStartDate ? new Date(new Date(cycleStartDate).getTime()+(endDay-1)*864e5) : null;
                const fmt = d=>d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—";
                const isActive = key===phase.key;
                return (
                  <div key={key} style={{
                    background: isActive?`${p.color}15`:"#1a1a1a",
                    borderLeft:`4px solid ${p.color}`,
                    borderRadius:"0 14px 14px 0",
                    padding:"14px 16px",
                    marginBottom:8,
                    border: isActive?`1px solid ${p.color}40`:"1px solid #2a2a2a",
                    borderLeft:`4px solid ${p.color}`,
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontWeight:700,color:p.color,fontSize:14}}>{p.emoji} {p.label}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {isActive&&<span style={{fontSize:10,background:p.color,color:"#fff",borderRadius:8,padding:"2px 7px",fontWeight:700}}>NOW</span>}
                        <span style={{fontSize:12,color:"#666"}}>Days {startDay}–{endDay}</span>
                      </div>
                    </div>
                    <div style={{fontSize:12,color:"#777",marginBottom:6}}>{fmt(startDate)} – {fmt(endDate)}</div>
                    <div style={{fontSize:12,color:"#aaa",lineHeight:1.5}}>{p.tip}</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>{p.needs.map(n=><NeedBadge key={n} need={n}/>)}</div>
                  </div>
                );
              })}
            </div>

            {/* Next period prediction */}
            <div style={{background:"#1a0a0a",border:"1px solid #c0392b30",borderRadius:16,padding:18,marginBottom:20}}>
              <div style={{fontSize:12,color:"#c0392b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>🌑 Next Period Prediction</div>
              {(()=>{
                const next1 = cycleStartDate ? new Date(new Date(cycleStartDate).getTime()+28*864e5) : null;
                const next2 = cycleStartDate ? new Date(new Date(cycleStartDate).getTime()+56*864e5) : null;
                const fmt = d=>d ? d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}) : "—";
                const daysUntil = next1 ? Math.max(0,Math.round((next1-new Date())/864e5)) : 0;
                return (
                  <div>
                    <div style={{display:"flex",gap:12,marginBottom:12}}>
                      <div style={{flex:1,background:"#2a1a1a",borderRadius:12,padding:"12px 14px"}}>
                        <div style={{fontSize:15,fontWeight:700,color:"#c0392b"}}>{fmt(next1)}</div>
                        <div style={{fontSize:11,color:"#666",marginTop:2}}>Next period · in {daysUntil} day{daysUntil!==1?"s":""}</div>
                      </div>
                      <div style={{flex:1,background:"#1a1a1a",borderRadius:12,padding:"12px 14px"}}>
                        <div style={{fontSize:15,fontWeight:700,color:"#888"}}>{fmt(next2)}</div>
                        <div style={{fontSize:11,color:"#555",marginTop:2}}>Following cycle</div>
                      </div>
                    </div>
                    <div style={{fontSize:12,color:"#666",lineHeight:1.5}}>💡 Period predictions are estimates based on a 28-day cycle. Adjust the start date if her cycle runs early or late.</div>
                  </div>
                );
              })()}
            </div>

            {/* What to expect this week */}
            <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18}}>
              <div style={{fontSize:12,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>What to Expect This Week</div>
              {(()=>{
                const tips = {
                  menstrual:["She may have cramps or fatigue — don't take low energy personally","Heat helps: offer a heating pad or warm bath","Skip heavy plans and let her rest","Physical affection (gentle) matters more than grand gestures","This is the week to do extra household tasks without being asked"],
                  follicular:["Her energy and mood are rising — great week to make plans","She's more open to new ideas and activities","Good time to introduce something new you want to try together","Flirtation and light playfulness land well this week","She may be more social — plan something out or invite friends"],
                  ovulation:["She's at peak connection and magnetism — she wants to feel chosen","This is the best week for romance, dates, and deep conversations","Tell her specifically what you love about her","Physical affection and intimacy are very welcome","She may want to dress up or go somewhere she can shine — plan for it"],
                  luteal:["Her body is preparing for menstruation — everything feels heavier hormonally","Handle tasks before she asks — anticipate her needs, don't wait","Stay calm when she's emotional — your regulated nervous system calms hers","Validate without trying to fix. Listen without solutions","Comfort food, chocolate, massages, warm baths — do these unprompted","Don't take her mood personally — it is not a verdict on you"],
                };
                return (tips[phase.key]||[]).map((tip,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<4?"1px solid #2a2a2a":"none"}}>
                    <span style={{color:phase.color,fontSize:14,flexShrink:0,marginTop:1}}>→</span>
                    <span style={{fontSize:13,color:"#ccc",lineHeight:1.5}}>{tip}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* YOUR CODE — LEAD · PROTECT · PROVIDE */}
        {profileSection==="lpp"&&(
          <div>
            {/* Header */}
            <div style={{background:"linear-gradient(135deg,#1a0e00,#0d0d0d)",border:"1px solid #e67e2240",borderRadius:18,padding:20,marginBottom:20}}>
              <div style={{fontSize:11,color:"#e67e22",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>The Husband's Code</div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif",marginBottom:10,lineHeight:1.3}}>Lead · Protect · Provide · Stay Attractive · Be Masculine</div>
              <div style={{fontSize:13,color:"#aaa",lineHeight:1.7}}>Five pillars. One mission — she feels Seen, Heard, Chosen, Safe, Alive, and <span style={{color:"#e91e8c",fontWeight:700}}>Feminine</span>. Radiant and fully herself because of the man standing next to her.</div>
            </div>

            {/* SHC connection banner */}
            <div style={{background:"#111",border:"1px solid #2a2a2a",borderRadius:14,padding:"12px 16px",marginBottom:20}}>
              <div style={{fontSize:12,color:"#888",lineHeight:1.8}}>
                <span style={{color:"#e67e22",fontWeight:700}}>Your five pillars</span> unlock <span style={{color:"#9b59b6",fontWeight:700}}>her six feelings</span>. Lead + <span style={{color:"#d35400",fontWeight:700}}>Be Masculine</span> → she feels <span style={{color:"#f1c40f"}}>Alive</span> + <span style={{color:"#e91e8c"}}>Chosen</span> + <span style={{color:"#e91e8c"}}>Feminine</span>. Protect → <span style={{color:"#27ae60"}}>Safe</span> + <span style={{color:"#3498db"}}>Heard</span>. Provide → <span style={{color:"#e91e8c"}}>Chosen</span> + <span style={{color:"#9b59b6"}}>Seen</span>. Stay Attractive → <span style={{color:"#f1c40f"}}>Alive</span> + <span style={{color:"#e91e8c"}}>Feminine</span>.
              </div>
            </div>

            {/* Three pillars */}
            {Object.entries(LPP).map(([key,p])=>(
              <div key={key} style={{background:"#1a1a1a",border:`1.5px solid ${p.color}30`,borderRadius:18,overflow:"hidden",marginBottom:16}}>
                {/* Pillar header */}
                <div style={{background:`linear-gradient(135deg,${p.color}20,${p.color}08)`,padding:"18px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
                    <span style={{fontSize:34}}>{p.emoji}</span>
                    <div>
                      <div style={{fontSize:22,fontWeight:700,color:p.color,fontFamily:"'Playfair Display',serif"}}>{p.label}</div>
                      <div style={{display:"flex",gap:5,marginTop:4}}>
                        {p.neuro.map(c=><NeuroBadge key={c} chem={c} showLabel/>)}
                      </div>
                    </div>
                  </div>
                  <p style={{fontSize:13,color:"#ccc",lineHeight:1.7,margin:0}}>{p.desc}</p>
                </div>

                {/* Daily actions */}
                <div style={{padding:"14px 20px",borderTop:`1px solid ${p.color}20`}}>
                  <div style={{fontSize:11,color:p.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Daily Actions</div>
                  {p.dailyActions.map((a,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<p.dailyActions.length-1?`1px solid #2a2a2a`:"none"}}>
                      <span style={{color:p.color,fontWeight:700,flexShrink:0}}>→</span>
                      <span style={{fontSize:13,color:"#ccc",lineHeight:1.5}}>{a}</span>
                    </div>
                  ))}
                </div>

                {/* What to say */}
                <div style={{padding:"12px 20px",borderTop:`1px solid ${p.color}20`,background:"#111"}}>
                  <div style={{fontSize:11,color:"#666",fontWeight:600,marginBottom:6}}>WHAT TO SAY</div>
                  <div style={{fontSize:14,color:"#f0ece4",fontStyle:"italic",lineHeight:1.6}}>"{p.scriptLine}"</div>
                </div>

                {/* Neuro science */}
                <div style={{padding:"12px 20px",borderTop:`1px solid ${p.color}20`}}>
                  <div style={{fontSize:11,color:"#666",fontWeight:600,marginBottom:6}}>🧠 WHY IT WORKS</div>
                  <div style={{fontSize:12,color:"#888",lineHeight:1.6}}>{p.neuroWhy}</div>
                </div>

                {/* Avoidance */}
                <div style={{padding:"12px 20px",borderTop:`1px solid #e74c3c20`,background:"#1a0a0a"}}>
                  <div style={{fontSize:11,color:"#e74c3c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>⚠️ Important Distinction</div>
                  <div style={{fontSize:12,color:"#aaa",lineHeight:1.6}}>{p.avoidance}</div>
                </div>
              </div>
            ))}

            {/* Daily commitment card */}
            <div style={{background:"linear-gradient(135deg,#1a0e00,#0a0a1a)",border:"1px solid #e67e2230",borderRadius:16,padding:20,marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e67e22",marginBottom:12}}>🧭 Daily Commitment Check</div>
              {[
                {q:"Did I make at least one decision today so she didn't have to?", pillar:"lead"},
                {q:"Did I shield her from at least one stressor today?", pillar:"protect"},
                {q:"Did I provide presence, not just presence in the building?", pillar:"provide"},
                {q:"Did she feel more alive — more herself — because I was there?", pillar:"lead"},
                {q:"Am I someone she still finds attractive? Did I invest in myself?", pillar:"attractive"},
                {q:"Was I grounded and certain today — did she feel my masculine presence?", pillar:"masculine"},
                {q:"Did she get to be soft, playful, or fully her feminine self around me today?", pillar:"masculine"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:i<2?"1px solid #2a2a2a":"none"}}>
                  <span style={{fontSize:11,fontWeight:700,color:LPP[item.pillar]?.color||"#e67e22",background:(LPP[item.pillar]?.color||"#e67e22")+"20",borderRadius:8,padding:"2px 8px",flexShrink:0,marginTop:2}}>{LPP[item.pillar]?.label||item.pillar}</span>
                  <span style={{fontSize:13,color:"#ccc",lineHeight:1.5}}>{item.q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUMEROLOGY */}
        {profileSection==="numerology"&&(
          <div>
            {!numerology?(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔢</div>
                <div style={{fontSize:15}}>Enter her full birthday in Overview to calculate her Life Path number</div>
              </div>
            ):(
              <div>
                {/* Hero */}
                <div style={{background:`linear-gradient(135deg,${numerology.color}22,${numerology.color}08)`,border:`1.5px solid ${numerology.color}40`,borderRadius:20,padding:22,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
                    <div style={{width:56,height:56,borderRadius:16,background:numerology.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff",flexShrink:0}}>{numerology.number}</div>
                    <div>
                      <div style={{fontSize:11,color:numerology.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em"}}>Life Path Number</div>
                      <div style={{fontSize:22,fontWeight:700,color:"#f0ece4",fontFamily:"'Playfair Display',serif"}}>{numerology.name} {numerology.emoji}</div>
                    </div>
                  </div>
                  <p style={{fontSize:14,color:"#ccc",lineHeight:1.7,margin:"0 0 12px"}}>{numerology.loveStyle}</p>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{numerology.traits.map(t=><span key={t} style={{fontSize:11,color:numerology.color,background:numerology.color+"18",borderRadius:10,padding:"2px 10px",fontWeight:600}}>{t}</span>)}</div>
                </div>

                {/* Game Plan */}
                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:12,color:"#f39c12",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>🎯 Your Game Plan</div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.7}}>{numerology.gamePlan}</div>
                </div>

                {/* Date ideas */}
                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:12,color:"#1abc9c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>🗓️ Date Ideas She'll Love</div>
                  {numerology.dateIdeas.map((d,i)=><div key={i} style={{fontSize:13,color:"#ccc",padding:"6px 0",borderBottom:i<numerology.dateIdeas.length-1?"1px solid #2a2a2a":"none"}}>→ {d}</div>)}
                </div>

                {/* Texts she likes */}
                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:12,color:"#9b59b6",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>💬 How She Likes to Be Texted</div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.7}}>{numerology.textsLike}</div>
                </div>

                {/* Avoid */}
                <div style={{background:"#1a0a0a",border:"1px solid #e74c3c30",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:12,color:"#e74c3c",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>⚠️ What to Avoid</div>
                  <div style={{fontSize:13,color:"#aaa",lineHeight:1.7}}>{numerology.avoid}</div>
                </div>

                {/* How calculated */}
                <div style={{background:"#111",borderRadius:12,padding:"12px 14px"}}>
                  <div style={{fontSize:11,color:"#555",lineHeight:1.6}}>
                    Life Path = all digits of birthday reduced to a single digit (or master number 11/22/33). 
                    Calculated from {wifeBirthMonth}/{wifeBirthDay}/{wifeBirthYear} = <strong style={{color:numerology.color}}>{numerology.number}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WESTERN ZODIAC */}
        {profileSection==="western"&&(
          <div>
            {!zodiac?(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
                <div style={{fontSize:40,marginBottom:12}}>♈</div>
                <div style={{fontSize:15}}>Enter her birthday in Overview to unlock her zodiac profile</div>
              </div>
            ):(
              <div>
                <div style={{background:`linear-gradient(135deg,${zodiac.color}20,${zodiac.color}08)`,border:`1.5px solid ${zodiac.color}40`,borderRadius:20,padding:20,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                    <span style={{fontSize:40}}>{zodiac.emoji}</span>
                    <div>
                      <div style={{fontSize:24,fontWeight:700,color:zodiac.color,fontFamily:"'Playfair Display',serif"}}>{zodiac.sign}</div>
                      <div style={{fontSize:13,color:"#888"}}>{zodiac.dates} · {zodiac.element} Sign</div>
                    </div>
                  </div>
                  <p style={{fontSize:14,color:"#ccc",lineHeight:1.7,margin:"0 0 12px"}}>{zodiac.loveStyle}</p>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{zodiac.traits.map(t=><span key={t} style={{fontSize:11,color:zodiac.color,background:zodiac.color+"18",borderRadius:10,padding:"2px 10px",fontWeight:600}}>{t}</span>)}</div>
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f0ece4",marginBottom:10}}>💡 What She Loves</div>
                  {zodiac.loves.map((l,i)=><div key={i} style={{fontSize:13,color:"#ccc",padding:"6px 0",borderBottom:i<zodiac.loves.length-1?"1px solid #2a2a2a":"none"}}>→ {l}</div>)}
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#e74c3c",marginBottom:10}}>⚠️ What She Avoids</div>
                  {zodiac.avoids.map((a,i)=><div key={i} style={{fontSize:13,color:"#ccc",padding:"6px 0",borderBottom:i<zodiac.avoids.length-1?"1px solid #2a2a2a":"none"}}>✕ {a}</div>)}
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f39c12",marginBottom:10}}>🎯 Game Plan</div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.7}}>{zodiac.gamePlan}</div>
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#9b59b6",marginBottom:10}}>📱 Texts She Loves</div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.7}}>{zodiac.textsLike}</div>
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1abc9c",marginBottom:10}}>🗓️ Date Ideas</div>
                  {zodiac.dateIdeas.map((d,i)=><div key={i} style={{fontSize:13,color:"#ccc",padding:"6px 0",borderBottom:i<zodiac.dateIdeas.length-1?"1px solid #2a2a2a":"none"}}>→ {d}</div>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHINESE ZODIAC */}
        {profileSection==="chinese"&&(
          <div>
            {!chineseZodiac?(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#555"}}>
                <div style={{fontSize:40,marginBottom:12}}>🐉</div>
                <div style={{fontSize:15}}>Enter her birth year in Overview to unlock her Chinese zodiac</div>
              </div>
            ):(
              <div>
                <div style={{background:`linear-gradient(135deg,${chineseZodiac.color}20,${chineseZodiac.color}08)`,border:`1.5px solid ${chineseZodiac.color}40`,borderRadius:20,padding:20,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                    <span style={{fontSize:40}}>{chineseZodiac.emoji}</span>
                    <div>
                      <div style={{fontSize:24,fontWeight:700,color:chineseZodiac.color,fontFamily:"'Playfair Display',serif"}}>Year of the {chineseZodiac.sign}</div>
                      <div style={{fontSize:13,color:"#888"}}>Chinese Zodiac · Born {wifeBirthYear}</div>
                    </div>
                  </div>
                  <p style={{fontSize:14,color:"#ccc",lineHeight:1.7,margin:"0 0 12px"}}>{chineseZodiac.loveStyle}</p>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{chineseZodiac.traits.map(t=><span key={t} style={{fontSize:11,color:chineseZodiac.color,background:chineseZodiac.color+"18",borderRadius:10,padding:"2px 10px",fontWeight:600}}>{t}</span>)}</div>
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#f39c12",marginBottom:10}}>🎯 Game Plan</div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.7}}>{chineseZodiac.gamePlan}</div>
                </div>

                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:18,marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1abc9c",marginBottom:10}}>🎁 Gifts & Experiences She'll Love</div>
                  {chineseZodiac.gifts.map((g,i)=><div key={i} style={{fontSize:13,color:"#ccc",padding:"6px 0",borderBottom:i<chineseZodiac.gifts.length-1?"1px solid #2a2a2a":"none"}}>→ {g}</div>)}
                </div>

                <div style={{background:"#1a0a0a",border:"1px solid #e74c3c30",borderRadius:16,padding:18}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#e74c3c",marginBottom:8}}>⚠️ Never Do This</div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.7}}>{chineseZodiac.avoid}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GAME PLAN */}
        {profileSection==="gameplan"&&(
          <div>
            {!isPremium?(
              <PremiumGate feature="Game Plan" onUpgrade={()=>{setSubscribed(false);}}/>
            ):(
            <div>
            <div style={{background:`${phase.color}12`,border:`1px solid ${phase.color}30`,borderRadius:14,padding:16,marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,color:phase.color,marginBottom:6}}>🎯 Monthly Game Plan</div>
              <div style={{fontSize:13,color:"#aaa",lineHeight:1.5}}>
                Combines her <span style={{color:phase.color}}>{phase.label} phase</span>
                {zodiac&&<>, <span style={{color:zodiac.color}}>{zodiac.sign}</span> zodiac</>}
                {chineseZodiac&&<>, <span style={{color:chineseZodiac.color}}>{chineseZodiac.sign}</span> Chinese zodiac</>}
                {wifeNeeds.length>0&&<> and her core needs</>} into one tailored strategy.
              </div>
            </div>

            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:36,marginBottom:12}}>🎯</div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif",color:"#f0ece4",marginBottom:8}}>Game Plan</div>
              <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>Your personalized strategy — built from her cycle, zodiac, and log data. Coming in the next update.</div>
            </div>
            </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#0d0d0d",color:"#f0ece4",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:"calc(90px + env(safe-area-inset-bottom))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ── LEGAL SCREENS (modal overlays) ──────────────────────── */}
      {legalView==="support"&&<SupportScreen onClose={()=>setLegalView(null)}/>}
      {legalView==="privacy"&&<PrivacyPolicyScreen onClose={()=>setLegalView(null)}/>}

      {/* ── AUTH SCREEN ────────────────────────────────────────── */}
      {!authUser&&(
        <div style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:9999,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 28px",boxSizing:"border-box",overflowY:"auto"}}>
          {authScreen==="login"&&(
            <div>
              <div style={{fontSize:11,color:"#c0392b",textTransform:"uppercase",letterSpacing:"0.16em",fontWeight:700,marginBottom:8}}>Better Husband</div>
              <div style={{fontSize:28,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:6}}>Welcome back.</div>
              <div style={{fontSize:14,color:"#666",marginBottom:16}}>Sign in to continue your journey.</div>

              {/* Psychology credential badge */}
              <div style={{background:"linear-gradient(135deg,#0a1a0a,#111)",border:"1px solid #27ae6040",borderRadius:14,padding:"12px 16px",marginBottom:20,display:"flex",gap:12,alignItems:"center"}}>
                <div style={{fontSize:26,flexShrink:0}}>🧠</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#27ae60",marginBottom:4}}>Developed in Consultation with Psychologists</div>
                  <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>Built in consultation with psychologists and grounded in relationship science, attachment theory, and neurochemistry.</div>
                </div>
              </div>
              {isPreviewMode&&(
                <div style={{background:"#1a1a00",border:"1px solid #f39c1240",borderRadius:12,padding:"12px 14px",marginBottom:20}}>
                  <div style={{fontSize:12,color:"#f39c12",fontWeight:700,marginBottom:4}}>⚡ Preview Mode</div>
                  <div style={{fontSize:12,color:"#888",lineHeight:1.5}}>No backend connected. Tap Sign In to enter the app directly — no real account needed for testing.</div>
                </div>
              )}
              <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Email address" type="email" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
              <input value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder={isPreviewMode?"Any password (preview mode)":"Password"} type="password" onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit",marginBottom:6}}/>
              <div style={{textAlign:"right",marginBottom:20}}>
                <button onClick={()=>setAuthScreen("forgot")} style={{background:"transparent",border:"none",color:"#555",fontSize:12,cursor:"pointer",padding:0}}>Forgot password?</button>
              </div>
              {authError&&<div style={{color:"#e74c3c",fontSize:13,marginBottom:12,padding:"10px 12px",background:"#1a0a0a",borderRadius:8}}>{authError}</div>}
              <button onClick={handleLogin} disabled={authLoading} style={{width:"100%",background:"#c0392b",color:"#fff",border:"none",borderRadius:14,padding:"16px 20px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:12,opacity:authLoading?0.7:1}}>
                {authLoading?"Signing in...":isPreviewMode?"Enter App →":"Sign In"}
              </button>
              <div style={{textAlign:"center",fontSize:13,color:"#555"}}>
                Don't have an account?{" "}
                <button onClick={()=>{setAuthScreen("signup");setAuthError("");}} style={{background:"transparent",border:"none",color:"#c0392b",fontSize:13,fontWeight:700,cursor:"pointer",padding:0}}>
                  Start free trial
                </button>
              </div>
            </div>
          )}

          {authScreen==="signup"&&(
            <div>
              <div style={{fontSize:11,color:"#c0392b",textTransform:"uppercase",letterSpacing:"0.16em",fontWeight:700,marginBottom:8}}>Better Husband</div>
              <div style={{fontSize:28,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:6}}>Start your 7-day free trial.</div>
              <div style={{fontSize:14,color:"#666",marginBottom:12}}>Then $21.99/month. Cancel anytime.</div>

              {/* Psychology credential badge */}
              <div style={{background:"linear-gradient(135deg,#0a1a0a,#111)",border:"1px solid #27ae6040",borderRadius:14,padding:"12px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
                <div style={{fontSize:24,flexShrink:0}}>🧠</div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#27ae60",marginBottom:4}}>Developed in Consultation with Psychologists</div>
                  <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>Built on relationship science, attachment theory, and neurochemistry — developed in consultation with psychologists.</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24,padding:"12px 16px",background:"#1a1a1a",borderRadius:12,border:"1px solid #2a2a2a"}}>
                {["200+ phase-matched texts — new ones added every month","100 date ideas + 60 at-home activities","AI coach for real situations","Full profile: zodiac, numerology, and cycle tracking","Desktop analytics dashboard"].map((f,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{color:"#27ae60",fontWeight:700,fontSize:14}}>✓</span>
                    <span style={{fontSize:12,color:"#aaa"}}>{f}</span>
                  </div>
                ))}
              </div>
              <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Your first name" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
              <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Email address" type="email" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
              <input value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Create a password (min 8 characters)" type="password" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit",marginBottom:6}}/>
              <div style={{fontSize:11,color:"#555",marginBottom:16,lineHeight:1.5}}>By signing up you agree to our Terms of Service and Privacy Policy. You can cancel anytime from your account settings.</div>
              {authError&&<div style={{color:"#e74c3c",fontSize:13,marginBottom:12,padding:"10px 12px",background:"#1a0a0a",borderRadius:8}}>{authError}</div>}
              <button onClick={handleSignup} disabled={authLoading} style={{width:"100%",background:"#c0392b",color:"#fff",border:"none",borderRadius:14,padding:"16px 20px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:12,opacity:authLoading?0.7:1}}>
                {authLoading?"Creating account...":"Start Free Trial →"}
              </button>
              <div style={{textAlign:"center",fontSize:13,color:"#555"}}>
                Already have an account?{" "}
                <button onClick={()=>{setAuthScreen("login");setAuthError("");}} style={{background:"transparent",border:"none",color:"#c0392b",fontSize:13,fontWeight:700,cursor:"pointer",padding:0}}>
                  Sign in
                </button>
              </div>
            </div>
          )}

          {authScreen==="forgot"&&(
            <div>
              <div style={{fontSize:28,fontWeight:700,fontFamily:"'Playfair Display',serif",marginBottom:8}}>Reset Password</div>
              <div style={{fontSize:14,color:"#666",marginBottom:24}}>We'll send you a reset link.</div>
              <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Your email address" type="email" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:12,padding:"14px 16px",fontSize:15,boxSizing:"border-box",fontFamily:"inherit",marginBottom:16}}/>
              {authError&&<div style={{color:authError.includes("sent")?"#27ae60":"#e74c3c",fontSize:13,marginBottom:12,padding:"10px 12px",background:"#111",borderRadius:8}}>{authError}</div>}
              <button onClick={handleForgot} disabled={authLoading} style={{width:"100%",background:"#c0392b",color:"#fff",border:"none",borderRadius:14,padding:"16px 20px",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:12,opacity:authLoading?0.7:1}}>
                {authLoading?"Sending...":"Send Reset Link"}
              </button>
              <button onClick={()=>{setAuthScreen("login");setAuthError("");}} style={{width:"100%",background:"transparent",border:"none",color:"#555",fontSize:13,cursor:"pointer",padding:"8px"}}>
                ← Back to login
              </button>
            </div>
          )}

          {/* Legal links — accessible without an account (App Store requirement) */}
          <div style={{display:"flex",justifyContent:"center",gap:18,marginTop:28}}>
            <button onClick={()=>setLegalView("privacy")} style={{background:"transparent",border:"none",color:"#555",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Privacy Policy</button>
            <button onClick={()=>setLegalView("support")} style={{background:"transparent",border:"none",color:"#555",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Support</button>
          </div>
        </div>
      )}

      {/* ── SUBSCRIPTION GATE ──────────────────────────────────── */}
      {authUser&&!subscribed&&(
        <div style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:9998,display:"flex",flexDirection:"column",justifyContent:"center",padding:"32px 24px",boxSizing:"border-box",overflowY:"auto"}}>

          {/* Header */}
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:11,color:"#c0392b",textTransform:"uppercase",letterSpacing:"0.16em",fontWeight:700,marginBottom:8}}>Better Husband / Boyfriend</div>
            <div style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:6}}>Be the partner she brags about.</div>
            <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>7 days free. Cancel anytime. No commitment.</div>
          </div>

          {/* Psychology badge */}
          <div style={{background:"#0a1a0a",border:"1px solid #27ae6030",borderRadius:12,padding:"10px 14px",marginBottom:20,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:18}}>🧠</span>
            <div style={{fontSize:12,color:"#27ae60",fontWeight:700}}>Developed in consultation with psychologists · Built on relationship science</div>
          </div>

          {/* Single plan */}
          <div style={{background:"#1a1a1a",border:"2px solid #c0392b60",borderRadius:18,padding:22,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:28,fontWeight:900,color:"#f0ece4",lineHeight:1}}>$21.99<span style={{fontSize:13,color:"#666",fontWeight:400}}>/mo</span></div>
                <div style={{fontSize:12,color:"#27ae60",fontWeight:600,marginTop:4}}>✓ 7 days free — then $21.99/month</div>
              </div>
              <div style={{background:"#c0392b",borderRadius:8,padding:"4px 10px",fontSize:10,color:"#fff",fontWeight:700}}>FULL ACCESS</div>
            </div>
            {[
              "200 phase-matched texts — fresh every 2-3 days",
              "60 at-home activities matched to her cycle",
              "100 date ideas — every budget and energy level",
              "Daily missions tailored to her phase",
              "Full cycle tracker — what she needs each week",
              "30/60/90-Day Partner Challenge",
              "Zodiac + numerology personality profile",
              "Know Her profile — favourites, notes, needs",
              "New content added every month",
            ].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:6,alignItems:"flex-start"}}>
                <span style={{color:"#27ae60",fontSize:13,flexShrink:0,marginTop:1}}>✓</span>
                <span style={{fontSize:12,color:"#ccc"}}>{f}</span>
              </div>
            ))}
            <button onClick={()=>handleSubscribe("basic")} disabled={subLoading} style={{width:"100%",background:"linear-gradient(135deg,#c0392b,#8e44ad)",color:"#fff",border:"none",borderRadius:12,padding:"15px 14px",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:16,opacity:subLoading?0.7:1,letterSpacing:"0.02em"}}>
              {isPreviewMode?"Enter App →":"Start 7-Day Free Trial →"}
            </button>
          </div>

          <div style={{fontSize:11,color:"#333",textAlign:"center",lineHeight:1.7,marginBottom:10}}>
            {isPreviewMode?"Preview mode — no payment required.":"No charge for 7 days. Cancel anytime before trial ends."}
          </div>
          <button onClick={()=>setAuthUser(null)} style={{background:"transparent",border:"none",color:"#333",fontSize:11,cursor:"pointer",textAlign:"center",width:"100%"}}>Sign out</button>
          <div style={{display:"flex",justifyContent:"center",gap:18,marginTop:14}}>
            <button onClick={()=>setLegalView("privacy")} style={{background:"transparent",border:"none",color:"#444",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Privacy Policy</button>
            <button onClick={()=>setLegalView("support")} style={{background:"transparent",border:"none",color:"#444",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>Support</button>
          </div>
        </div>
      )}

      {/* ── ONBOARDING (after auth + subscription) ─────────────── */}
      {authUser&&subscribed&&(!onboarded||replayGuide)&&(()=>{
        const ONBOARDING_SLIDES = [
          {
            id:"welcome", emoji:"💍", color:"#c0392b",
            title:"Welcome to Outstanding Partner.",
            subtitle:"<u>Be the husband/boyfriend she brags about to her friends.</u>",
            body:"Most men love their partner. Very few make her feel it every day.\n\nThis app changes that. Built on relationship science, her menstrual cycle, and brain chemistry — every text, mission, and activity is designed around her specifically.\n\nNot because you're perfect. Because you're intentional.",
            tip:"🏅 Developed in Consultation with Psychologists. Built on attachment theory, relationship science, and neurochemistry.",
            cta:null,
          },
          {
            id:"skip",
            emoji:"⚡",
            color:"#1abc9c",
            title:"Here's all you need to know.",
            subtitle:"Or read the full science → tap the 📖 icon anytime.",
            body:"🌙 HER CYCLE — She has 4 different emotional phases every month. Menstrual, Follicular, Ovulation, Luteal. Each one shifts what she needs from you. The app tracks it automatically and adjusts every recommendation.\n\n🧠 BRAIN CHEMISTRY — Every text, mission, and activity targets specific brain chemicals. Dopamine (anticipation), Oxytocin (bonding), Serotonin (calm), Endorphins (joy). You're not just doing nice things — you're triggering specific feelings.\n\n⏱️ THE FACT — Women need at least 48 minutes of uninterrupted daily connection. Most couples average under 4. That gap explains almost everything.\n\n📋 YOUR ROUTINE — Morning: check her phase + today's mission. Day: send the text. Night: log how it went.",
            tip:"📖 Tap the book icon in the top right corner of the app anytime to re-read the full science guide.",
          },
          {
            id:"duties",
            emoji:"🧭",
            color:"#e67e22",
            title:"Your Six Duties as a Husband / Boyfriend.",
            subtitle:"This is what she needs from you every day.",
            body:"This app is built around six core duties. Master these and everything else falls into place.\n\n🧭 LEAD — Make decisions. Set the direction. When you lead well, she can relax.\n\n🛡️ PROTECT — Her peace, her safety, her emotional world. Be the man she never has to be afraid of.\n\n💪 PROVIDE — Not just financially. Provide your presence, your attention, your energy.\n\n🔥 STAY ATTRACTIVE — Keep working on yourself. She fell for a man who was growing. Keep growing.\n\n😂 MAKE HER LAUGH — Laughter is connection. A woman who laughs with you stays with you.\n\n⏱️ 48 MINUTES — Give her at least 48 minutes of uninterrupted time every day. No phone. No distractions. Just you and her. Fully present.",
            tip:"⏱️ The 48 minutes minimum is not optional — it is the foundation. Every other duty sits on top of this one. Without presence, nothing else lands.",
            isSkip:true,
          },
                    {
            id:"science",
            emoji:"🧬",
            color:"#e91e8c",
            title:"She's Not Complicated. She's Neurochemical.",
            subtitle:"The science behind why this works.",
            body:"Women are deeply emotional beings — not because they're weak, but because they are wired for deep connection, safety, and meaning. Her emotions are a biological feature. Not a flaw.\n\nEvery feeling she has is driven by four brain chemicals. This app engineers every text, task, and activity around them:\n\n⚡ DOPAMINE — Anticipation and reward. Triggered by surprise, novelty, and pursuit.\n\n🤝 OXYTOCIN — The bonding hormone. Released by touch, eye contact, and being truly seen.\n\n☀️ SEROTONIN — Calm and security. Activated when she feels safe, respected, and valued.\n\n🔥 ENDORPHINS — Joy and euphoria. Released through laughter, movement, and shared play.",
            tip:"🧠 You're not just doing nice things. You're targeting specific brain chemicals. That's the difference.",
          },
          {
            id:"cycle",
            emoji:"🌙",
            color:"#8e44ad",
            title:"Her Cycle Changes Everything.",
            subtitle:"She has 4 different emotional phases every month.",
            body:"Her menstrual cycle isn't just physical — it completely shifts her emotional needs, her energy, and what she needs from you. Every 28 days she cycles through four phases:\n\n🌑 MENSTRUAL (Days 1–5) — She needs rest, warmth, and patience. Low demand. High care. Don't take her low energy personally.\n\n🌒 FOLLICULAR (Days 6–11) — Energy rises. She's curious, open, and ready for novelty. Plan something new. Match her enthusiasm.\n\n🌕 OVULATION (Days 12–16) — Peak connection. She wants to feel chosen, desired, and deeply seen. This is your romance window.\n\n🌗 LUTEAL (Days 17–28) — Pre-menstrual. Everything feels heavier. She needs your calm, your service, and your patience most.",
            tip:"📌 Enter her period start date in Profile. The app tracks her phase and adjusts every recommendation automatically.",
          },
          {
            id:"feelings",
            emoji:"💎",
            color:"#9b59b6",
            title:"Her Six Core Feelings.",
            subtitle:"What she actually needs to feel — every day.",
            body:"Research shows women need these six feelings from their partner to feel truly loved:\n\n👁️ SEEN — Noticed in the specific details.\n👂 HEARD — Her words and feelings truly matter.\n💎 CHOSEN — Deliberately selected. Not settled for.\n🛡️ SAFE — No walking on eggshells. No fear.\n🔆 ALIVE — Being with you makes her more herself.\n🌸 FEMININE — Free to be soft and fully herself.",
            tip:"⏱️ RESEARCH FACT — Women need at least 48 minutes of uninterrupted connection with their partner every day. No phones. No distractions. Just present. Most couples average under 4 minutes. That gap explains almost everything.",
          },
          {
            id:"today",
            emoji:"🌅",
            color:"#e67e22",
            title:"Today Tab",
            subtitle:"WHY → HOW → WHAT. Open this every morning.",
            body:"WHY — Her six feelings and your five pillars. The purpose behind everything.\n\nHOW — Her current cycle phase and what she needs right now, backed by science.\n\nWHAT — Your daily mission, the right text to send, and the week's activity.\n\nOpen this first every morning. Takes 60 seconds.",
            tip:"📌 Set this app on your home screen so it's the first thing you see.",
          },
          {
            id:"texts",
            emoji:"💬",
            color:"#3498db",
            title:"Texts Tab",
            subtitle:"190+ texts. Phase-matched. New content added every month.",
            body:"Every text targets specific brain chemicals and matches her current cycle phase.\n\nThe cadence: text every 2-3 days. Not every day. Consistency beats frequency every time.\n\nCopy → paste → send. Every text shows which chemicals it triggers and why it lands.\n\nTexts update regularly so content always feels fresh.",
            tip:"💡 Add her nickname in Profile first. Every text hits harder when it opens with her name.",
          },
          {
            id:"activities",
            emoji:"🎲",
            color:"#1abc9c",
            title:"Activities Tab",
            subtitle:"One activity per week. Built around her phase.",
            body:"100 date ideas and 60 at-home activities — each one matched to her cycle phase and tagged with the brain chemicals it triggers.\n\nMenstrual → comfort and warmth.\nFollicular → novelty and fun.\nOvulation → romance and closeness.\nLuteal → calm, service, reduce her load.\n\nEach activity includes a step-by-step how-to and the exact line to say when you invite her.",
            tip:"📅 Plan on Thursday or Friday. That gives you the weekend to execute.",
          },
          {
            id:"challenge",
            emoji:"🏆",
            color:"#27ae60",
            title:"The 30-Day Challenge.",
            subtitle:"Build the habit. See the results. Day by day.",
            body:"WEEK 1 — Build the habit. Daily texts + one mission. Simple and repeatable.\n\nWEEK 2 — Add depth. Compliments, connection, planning. She starts to feel the shift.\n\nWEEK 3 — Use the tools. Phase activities, the diagnostic, the guide. Real results.\n\nWEEK 4 — Build your playbook. Game plan, log review, what specifically works with YOUR wife.\n\nBy Day 30 you have 30 data points on what she responds to. The men who finish don't cancel — because cancelling feels like quitting on their marriage.",
            tip:"📍 Where to find it: Tap the Coach tab (bottom nav) → scroll down to the green 🏆 30-Day Better Husband Challenge card → tap Start the Challenge.",
          },
          {
            id:"profile",
            emoji:"⭐",
            color:"#f39c12",
            title:"Profile Tab",
            subtitle:"The more you fill in, the smarter everything gets.",
            body:"Start with her name, nickname, birthday, and period start date. That unlocks everything.\n\nHer zodiac, Chinese zodiac, and numerology auto-calculate.\n\nKnow Her — her favorites, love language, biggest dreams, biggest fears, her people.\n\nShe Said — capture anything she mentions so you never forget it.\n\nGame Plan — a personalized monthly strategy from all her data combined.",
            tip:"🔑 Period start date first. Everything calibrates to her cycle from that one field.",
          },



          {
            id:"howto", emoji:"📋", color:"#1abc9c",
            title:"3 Minutes a Day. That's It.",
            subtitle:"Morning · During the day · Night.",
            body:"☀️ MORNING (2 min) — Open Today. Check her cycle phase. Glance at your mission. Know what she needs before you say a word.\n\n💬 DURING THE DAY (1 min) — Send the suggested text. One thoughtful, bonding text that makes her feel chosen.\n\n🌙 NIGHT (2 min) — Mark your mission done. Log how it went. Ask yourself: did she feel chosen today? Did she get her 48 minutes?",
            tip:"📌 The nightly log is the most underrated feature. The more you track, the more you learn what works with your partner specifically.",
          },
          {
            id:"ready", emoji:"⚡", color:"#c0392b",
            title:"You're Ready.",
            subtitle:"One last thing.",
            body:"Start with her profile — her name, nickname, and period start date. 60 seconds. Unlocks everything.\n\nThen open Today. Send the text. Do the mission. Log it at night.\n\nDo that for 7 days. Notice what changes.",
            cta:"profile",
          },
        ]
        const slide = onboardSlide;
        const setSlide = setOnboardSlide;
        const current = ONBOARDING_SLIDES[Math.min(slide, ONBOARDING_SLIDES.length-1)];
        const isLast = slide === ONBOARDING_SLIDES.length - 1;
        const isFirst = slide === 0;

        const totalSlides = ONBOARDING_SLIDES.length;
        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        };
        const handleTouchEnd = (e) => {
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
          if (Math.abs(dx) < 40 || dy > Math.abs(dx)) return;
          if (dx < 0 && slide < totalSlides - 1) setSlide(s => s + 1);
          if (dx > 0 && slide > 0) setSlide(s => s - 1);
        };

        return (
          <div
            style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:9997,display:"flex",flexDirection:"column",boxSizing:"border-box"}}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Progress dots */}
            <div style={{display:"flex",gap:6,justifyContent:"center",paddingTop:52,paddingBottom:16,flexShrink:0}}>
              {ONBOARDING_SLIDES.map((_,i)=>(
                <div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?24:7,height:7,borderRadius:4,background:i===slide?current.color:"#2a2a2a",transition:"all 0.3s",cursor:"pointer"}}/>
              ))}
            </div>

            {/* Slide content */}
            <div id="onboard-scroll" style={{flex:1,overflowY:"auto",padding:"20px 28px 0"}}
              ref={el=>{
                if(el){
                  el.scrollTop=0;
                  setTimeout(()=>{
                    const indicator=document.getElementById("scroll-indicator");
                    if(indicator) indicator.style.opacity=el.scrollHeight>el.clientHeight?"1":"0";
                  },100);
                }
              }}
              onScroll={e=>{
                const el=e.target;
                const atBottom=el.scrollTop+el.clientHeight>=el.scrollHeight-10;
                const indicator=document.getElementById("scroll-indicator");
                if(indicator) indicator.style.opacity=atBottom?"0":"1";
              }}
            >
              {/* Emoji hero */}
              <div style={{width:72,height:72,borderRadius:20,background:current.color+"20",border:`2px solid ${current.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,marginBottom:20}}>
                {current.emoji}
              </div>

              {/* Welcome slide — special hero layout */}
              {current.id==="welcome"?(
                <div>
                  {/* Hero tagline */}
                  <div style={{
                    fontSize:32,
                    fontWeight:800,
                    fontFamily:"'Playfair Display',serif",
                    lineHeight:1.25,
                    marginBottom:24,
                    background:"linear-gradient(135deg,#f0ece4 0%,#e67e22 60%,#c0392b 100%)",
                    WebkitBackgroundClip:"text",
                    WebkitTextFillColor:"transparent",
                    backgroundClip:"text",
                  }}>
                    Be the husband/boyfriend she brags about to her friends.
                  </div>

                  {/* Body */}
                  <div style={{marginBottom:24}}>
                    {current.body.split("\n").filter(l=>l.trim()).map((line,i)=>(
                      <div key={i} style={{fontSize:14,color:"#aaa",lineHeight:1.8,marginBottom:8}}>{line}</div>
                    ))}
                  </div>

                  {/* Psychology seal — gold, premium */}
                  <div style={{
                    background:"linear-gradient(135deg,#1a1500,#111)",
                    border:"2px solid #f1c40f60",
                    borderRadius:16,
                    padding:"16px 18px",
                    display:"flex",
                    gap:14,
                    alignItems:"center",
                    marginBottom:8,
                  }}>
                    <div style={{fontSize:30,flexShrink:0}}>🏅</div>
                    <div>
                      <div style={{
                        fontSize:14,
                        fontWeight:800,
                        color:"#f1c40f",
                        marginBottom:4,
                        letterSpacing:"0.02em",
                      }}>Developed in Consultation with Psychologists</div>
                      <div style={{fontSize:12,color:"#aaa",lineHeight:1.5}}>
                        Built on attachment theory, relationship science, and neurochemistry. Designed to create real, lasting change.
                      </div>
                    </div>
                  </div>
                </div>

              /* Feelings slide — six feelings + 48-min hero stat */
              ):current.id==="feelings"?(
                <div>
                  <div style={{fontSize:11,color:current.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:6}}>{current.subtitle}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:16,color:"#f0ece4"}}>{current.title}</div>
                  <div style={{fontSize:14,color:"#aaa",lineHeight:1.6,marginBottom:14}}>Research shows women need these six feelings from their partner to feel truly loved:</div>

                  {/* Six feelings list */}
                  {[
                    {e:"👁️",l:"Seen",d:"Noticed in the specific details of her life."},
                    {e:"👂",l:"Heard",d:"Her words and feelings truly matter to you."},
                    {e:"💎",l:"Chosen",d:"Deliberately selected. Not settled for."},
                    {e:"🛡️",l:"Safe",d:"No walking on eggshells. No fear of your reaction."},
                    {e:"🔆",l:"Alive",d:"Being with you makes her more herself."},
                    {e:"🌸",l:"Feminine",d:"Free to be soft, playful, and fully herself."},
                  ].map((f,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:i<5?"1px solid #1a1a1a":"none"}}>
                      <span style={{fontSize:18,minWidth:28,textAlign:"center"}}>{f.e}</span>
                      <div>
                        <span style={{fontSize:13,fontWeight:700,color:"#f0ece4"}}>{f.l}</span>
                        <span style={{fontSize:12,color:"#666"}}> — {f.d}</span>
                      </div>
                    </div>
                  ))}

                  {/* 48-minute hero stat */}
                  <div style={{
                    background:"linear-gradient(135deg,#0a1a2a,#0d0d0d)",
                    border:"2px solid #3498db80",
                    borderRadius:18,
                    padding:"22px 20px",
                    marginTop:20,
                    marginBottom:8,
                    textAlign:"center",
                  }}>
                    <div style={{fontSize:11,color:"#3498db",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:8}}>Psychologist Research · Women's Survey</div>
                    <div style={{
                      fontSize:72,
                      fontWeight:900,
                      color:"#f0ece4",
                      fontFamily:"'Playfair Display',serif",
                      lineHeight:1,
                      marginBottom:4,
                    }}>48</div>
                    <div style={{fontSize:18,fontWeight:700,color:"#3498db",marginBottom:14,letterSpacing:"0.04em"}}>MINUTES PER DAY</div>
                    <div style={{fontSize:13,color:"#aaa",lineHeight:1.7,marginBottom:16}}>
                      Women need <strong style={{color:"#f0ece4"}}>at least 48 minutes of uninterrupted connection</strong> with their partner every day. No phone. No distractions. Fully present.
                    </div>
                    <div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center"}}>
                      <div style={{flex:1,background:"#1a1a2a",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                        <div style={{fontSize:26,fontWeight:800,color:"#e74c3c"}}>4</div>
                        <div style={{fontSize:10,color:"#555",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>avg. minutes</div>
                        <div style={{fontSize:10,color:"#555"}}>most couples</div>
                      </div>
                      <div style={{fontSize:22,color:"#333",fontWeight:700}}>→</div>
                      <div style={{flex:1,background:"#0a1a2a",border:"1px solid #3498db40",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                        <div style={{fontSize:26,fontWeight:800,color:"#3498db"}}>48</div>
                        <div style={{fontSize:10,color:"#3498db",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>goal minutes</div>
                        <div style={{fontSize:10,color:"#555"}}>what she needs</div>
                      </div>
                    </div>
                    <div style={{marginTop:14,fontSize:12,color:"#555",fontStyle:"italic",lineHeight:1.5}}>That gap — 4 minutes vs 48 — explains most of the distance she feels.</div>
                  </div>
                </div>

              /* Cycle slide — phase cards + tracking banner */
              ):current.id==="cycle"?(
                <div>
                  <div style={{fontSize:11,color:current.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:6}}>{current.subtitle}</div>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:16,color:"#f0ece4"}}>{current.title}</div>
                  <div style={{fontSize:14,color:"#aaa",lineHeight:1.7,marginBottom:18}}>Her menstrual cycle isn't just physical — it completely shifts her emotional needs, her energy, and what she needs from you.</div>

                  {/* Phase cards */}
                  {[
                    {emoji:"🌑",label:"Menstrual",days:"Days 1–5",color:"#e74c3c",need:"Rest, warmth, patience. Low demand. High care."},
                    {emoji:"🌒",label:"Follicular",days:"Days 6–11",color:"#3498db",need:"Energy rising. Plan something new. Match her enthusiasm."},
                    {emoji:"🌕",label:"Ovulation",days:"Days 12–16",color:"#f1c40f",need:"Peak romance window. She wants to feel chosen and desired."},
                    {emoji:"🌗",label:"Luteal",days:"Days 17–28",color:"#8e44ad",need:"Everything feels heavier. She needs your calm and patience most."},
                  ].map((p,i)=>(
                    <div key={i} style={{background:`${p.color}12`,border:`1.5px solid ${p.color}40`,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                      <span style={{fontSize:22,flexShrink:0,marginTop:2}}>{p.emoji}</span>
                      <div>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                          <span style={{fontSize:13,fontWeight:700,color:p.color}}>{p.label}</span>
                          <span style={{fontSize:11,color:"#555",background:"#1a1a1a",borderRadius:6,padding:"1px 7px"}}>{p.days}</span>
                        </div>
                        <div style={{fontSize:12,color:"#ccc",lineHeight:1.5}}>{p.need}</div>
                      </div>
                    </div>
                  ))}

                  {/* Tracking selling point banner */}
                  <div style={{
                    background:"linear-gradient(135deg,#1a0a2a,#0d0d1a)",
                    border:"2px solid #8e44ad80",
                    borderRadius:16,
                    padding:"18px 18px",
                    marginTop:6,
                    marginBottom:8,
                  }}>
                    <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
                      <span style={{fontSize:26}}>🔄</span>
                      <div style={{fontSize:16,fontWeight:800,color:"#f0ece4",fontFamily:"'Playfair Display',serif",lineHeight:1.3}}>The App Tracks Her Cycle Automatically</div>
                    </div>
                    <div style={{fontSize:13,color:"#ccc",lineHeight:1.7,marginBottom:12}}>
                      Enter her period start date once. Every day, the app knows exactly which phase she's in — and adjusts every text, activity, mission, and recommendation around it. No guessing. No generic advice.
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {["Phase-matched texts","Daily missions","Activity timing","What to say tonight","What she needs"].map((tag,i)=>(
                        <span key={i} style={{fontSize:11,fontWeight:700,color:"#8e44ad",background:"#8e44ad18",borderRadius:8,padding:"3px 10px"}}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ):(
                <div>
                  {/* Standard slide — title + subtitle + body + tip */}
                  <div style={{fontSize:11,color:current.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:6}} dangerouslySetInnerHTML={{__html:current.subtitle}}/>
                  <div style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:20,color:"#f0ece4"}}>{current.title}</div>

                  {/* Body */}
                  <div style={{marginBottom:current.tip?16:0}}>
                    {current.body.split("\n").filter(l=>l.trim()).map((line,i)=>{
                      const isBold = line.startsWith("WHY")||line.startsWith("HOW")||line.startsWith("WHAT")||/^\d\./.test(line)||line.startsWith("WEEK")||/^[🧭🛡️💪🔥😂⏱️👁️👂💎🛡🔆🌸⚡]/.test(line);
                      return (
                        <div key={i} style={{fontSize:14,color:isBold?"#f0ece4":"#aaa",lineHeight:1.7,marginBottom:isBold?4:10,fontWeight:isBold?600:400}}>
                          {line}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tip */}
                  {current.tip&&(
                    <div style={{background:current.color+"15",border:`1px solid ${current.color}30`,borderRadius:12,padding:"12px 16px",marginBottom:24}}>
                      <div style={{fontSize:13,color:current.color,lineHeight:1.6}}>{current.tip}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom padding so content clears the scroll arrow */}
              <div style={{height:16}}/>
            </div>

            {/* Scroll indicator */}
            <div id="scroll-indicator" style={{
              position:"absolute",
              bottom:130,
              left:"50%",
              transform:"translateX(-50%)",
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              gap:4,
              transition:"opacity 0.3s",
              pointerEvents:"none",
            }}>
              <div style={{fontSize:10,color:current.color,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.14em",opacity:0.8}}>scroll for more</div>
              <div style={{
                width:36,
                height:36,
                borderRadius:"50%",
                background:current.color+"25",
                border:`2px solid ${current.color}60`,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:18,
                color:current.color,
                animation:"bounceDown 1.2s ease-in-out infinite",
              }}>↓</div>
            </div>
            <style>{`@keyframes bounceDown{0%,100%{transform:translateY(0);}50%{transform:translateY(8px);}}`}</style>



            {/* Navigation */}
            <div style={{padding:"20px 28px 36px",flexShrink:0}}>
              {isLast?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"flex",gap:10}}>
                    <button onClick={()=>setSlide(s=>s-1)} style={{flex:"0 0 auto",background:"#1a1a1a",border:"1px solid #333",color:"#888",borderRadius:14,padding:"16px 20px",fontSize:14,cursor:"pointer"}}>
                      ←
                    </button>
                    <button onClick={()=>{safeSet("onboarded","1");setOnboarded(true);setReplayGuide(false);setTab("profile");}} style={{flex:1,background:current.color,color:"#fff",border:"none",borderRadius:14,padding:"16px 20px",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                      Set Up Her Profile →
                    </button>
                  </div>
                  <button onClick={()=>{safeSet("onboarded","1");setOnboarded(true);setReplayGuide(false);}} style={{background:"transparent",color:"#555",border:"none",padding:"10px",fontSize:13,cursor:"pointer"}}>
                    I'll explore on my own
                  </button>
                </div>
              ):current.isSkip?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <button onClick={()=>{safeSet("onboarded","1");setOnboarded(true);setReplayGuide(false);setTab("profile");}} style={{width:"100%",background:"#1abc9c",color:"#fff",border:"none",borderRadius:14,padding:"16px 20px",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                    I'm Ready — Let's Go →
                  </button>
                  <button onClick={()=>setSlide(s=>s+1)} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",color:"#888",borderRadius:14,padding:"14px 20px",fontSize:14,cursor:"pointer"}}>
                    Read the Full Science Guide →
                  </button>
                </div>
              ):(
                <div style={{display:"flex",gap:10}}>
                  {!isFirst&&(
                    <button onClick={()=>setSlide(s=>s-1)} style={{flex:"0 0 auto",background:"#1a1a1a",border:"1px solid #333",color:"#888",borderRadius:14,padding:"16px 20px",fontSize:14,cursor:"pointer"}}>
                      ←
                    </button>
                  )}
                  <button onClick={()=>setSlide(s=>s+1)} style={{flex:1,background:current.color,color:"#fff",border:"none",borderRadius:14,padding:"16px 20px",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
      <Toast toasts={toasts} onDismiss={dismissToast}/>

      {/* Header */}
      <div style={{padding:"16px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          {wifeNickname&&(
            <div style={{fontSize:13,color:"#e91e8c",fontWeight:600}}>💕 {wifeNickname}</div>
          )}
          {loveLanguage&&(
            <div style={{fontSize:11,color:"#3498db",fontWeight:600,marginTop:2}}>
              {loveLanguage==="Verbal Affirmation"?"💬":loveLanguage==="Undivided Presence"?"⏱️":loveLanguage==="Thoughtful Gestures"?"🎁":loveLanguage==="Acts of Service"?"🛠️":"🤝"} {loveLanguage}
            </div>
          )}
          {anniversaryDate&&(()=>{
            const today=new Date(); const anniv=new Date(anniversaryDate);
            let next=new Date(today.getFullYear(),anniv.getMonth(),anniv.getDate());
            if(next<today) next=new Date(today.getFullYear()+1,anniv.getMonth(),anniv.getDate());
            const days=Math.ceil((next-today)/864e5);
            if(days>60) return null;
            return(
              <div style={{fontSize:11,color:"#e67e22",fontWeight:600,marginTop:2}}>
                💍 {days===0?"Anniversary TODAY":days===1?"Anniversary tomorrow":`Anniversary in ${days} days`}
              </div>
            );
          })()}
        </div>
        <button onClick={()=>{setOnboardSlide(0);setReplayGuide(true);}} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer"}}>📖</button>
      </div>
      <div style={{padding:"20px 20px 0"}}>

        {/* TODAY */}
        {tab==="today"&&(
          <div>

            {/* ── Anniversary & Birthday Reminders ─────────────── */}
            {(()=>{
              const now = new Date();
              const alerts = [];

              // Anniversary reminder
              if(anniversaryDate){
                const anniv = new Date(anniversaryDate);
                let next = new Date(now.getFullYear(), anniv.getMonth(), anniv.getDate());
                if(next <= now) next = new Date(now.getFullYear()+1, anniv.getMonth(), anniv.getDate());
                const days = Math.ceil((next - now) / 864e5);
                if(days <= 21 && days > 0){
                  const years = next.getFullYear() - anniv.getFullYear();
                  alerts.push({
                    emoji:"💍", color:"#e67e22",
                    title: days===1 ? "Anniversary TOMORROW" : days<=7 ? `Anniversary in ${days} days` : `Anniversary in ${days} days — start planning`,
                    body: days===1
                      ? `${years} year${years!==1?"s":""} together. Have you planned something? Tomorrow is the day.`
                      : days<=7
                      ? `${years} year${years!==1?"s":""} together. ${days} days — don't wing it. She remembers everything.`
                      : `${years} year${years!==1?"s":""} together. ${days} days out. Book the restaurant, plan the experience, get the gift now — not the night before.`,
                    urgency: days<=2 ? "🚨 Act now" : days<=7 ? "⚠️ Plan this week" : "📅 Start planning",
                    urgencyColor: days<=2 ? "#e74c3c" : days<=7 ? "#f39c12" : "#27ae60",
                  });
                }
              }

              // Birthday reminder
              if(wifeBirthMonth && wifeBirthDay){
                const bMonth = parseInt(wifeBirthMonth) - 1;
                const bDay   = parseInt(wifeBirthDay);
                let nextBday = new Date(now.getFullYear(), bMonth, bDay);
                if(nextBday <= now) nextBday = new Date(now.getFullYear()+1, bMonth, bDay);
                const bDays = Math.ceil((nextBday - now) / 864e5);
                if(bDays <= 21 && bDays > 0){
                  alerts.push({
                    emoji:"🎂", color:"#e91e8c",
                    title: bDays===1 ? "Her Birthday TOMORROW" : bDays<=7 ? `Her Birthday in ${bDays} days` : `Her Birthday in ${bDays} days — start planning`,
                    body: bDays===1
                      ? "Tomorrow is her birthday. Is everything ready? Make her feel like the most celebrated woman alive."
                      : bDays<=7
                      ? `${bDays} days. Have you planned something, ordered something, or arranged something she'd love? Not generic — specific to her.`
                      : `${bDays} days out. The best gifts and experiences need lead time. Book the restaurant, order the thing, plan the day now — not the night before.`,
                    urgency: bDays<=2 ? "🚨 Act now" : bDays<=7 ? "⚠️ Order/book now" : "📅 Start planning",
                    urgencyColor: bDays<=2 ? "#e74c3c" : bDays<=7 ? "#f39c12" : "#e91e8c",
                  });
                }
              }

              if(alerts.length === 0) return null;
              return alerts.map((alert, i) => (
                <div key={i} style={{background:`linear-gradient(135deg,${alert.color}18,#0d0d0d)`,border:`2px solid ${alert.color}60`,borderRadius:16,padding:16,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:20}}>{alert.emoji}</span>
                      <span style={{fontSize:14,fontWeight:800,color:alert.color}}>{alert.title}</span>
                    </div>
                    <span style={{fontSize:10,color:alert.urgencyColor,fontWeight:700,background:alert.urgencyColor+"18",borderRadius:6,padding:"2px 8px"}}>{alert.urgency}</span>
                  </div>
                  <div style={{fontSize:13,color:"#ccc",lineHeight:1.6}}>{alert.body}</div>
                </div>
              ));
            })()}

            {/* ── HER CYCLE — BIG, first thing he sees ─────────── */}
            {cycleStartDate&&(()=>{
              const phases=[
                {key:"menstrual", label:"Menstrual", days:"Days 1–5",  color:"#e74c3c", emoji:"🌑", need:"Rest, warmth, low demand. Don't take her mood personally."},
                {key:"follicular",label:"Follicular",days:"Days 6–11", color:"#3498db", emoji:"🌒", need:"Energy rising. She wants fun and novelty. Plan something."},
                {key:"ovulation", label:"Ovulation", days:"Days 12–16",color:"#f1c40f", emoji:"🌕", need:"Peak romance window. She wants to feel chosen and desired."},
                {key:"luteal",    label:"Luteal",    days:"Days 17–28",color:"#8e44ad", emoji:"🌗", need:"Everything feels heavier. She needs your calm and patience."},
              ];
              const current = phases.find(p=>p.key===phase.key)||phases[0];
              return(
                <div style={{background:`linear-gradient(135deg,${current.color}22,${current.color}08)`,border:`2px solid ${current.color}60`,borderRadius:20,padding:24,marginBottom:16}}>
                  {/* Phase progress bar */}
                  <div style={{display:"flex",gap:3,marginBottom:20}}>
                    {phases.map(p=>(
                      <div key={p.key} style={{
                        flex:p.key==="luteal"?2:1,
                        height:5,
                        borderRadius:3,
                        background:p.key===phase.key?current.color:"#2a2a2a",
                        transition:"background 0.3s"
                      }}/>
                    ))}
                  </div>

                  {/* Big phase display */}
                  <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
                    <div style={{fontSize:52,flexShrink:0}}>{current.emoji}</div>
                    <div>
                      <div style={{fontSize:10,color:current.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:4}}>Day {cycleDay} of 28</div>
                      <div style={{fontSize:28,fontWeight:900,color:current.color,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{current.label}</div>
                      <div style={{fontSize:12,color:"#666",marginTop:4}}>{current.days}</div>
                    </div>
                  </div>

                  {/* What she needs */}
                  <div style={{background:"#00000040",borderRadius:12,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:current.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>What she needs right now</div>
                    <div style={{fontSize:14,color:"#f0ece4",lineHeight:1.6,fontWeight:500}}>{current.need}</div>
                    {(phase.whatSheNeeds?.fromYou||[]).slice(0,2).map((item,i)=>(
                      <div key={i} style={{display:"flex",gap:8,marginTop:8,alignItems:"flex-start"}}>
                        <span style={{color:current.color,fontSize:12,flexShrink:0,marginTop:2}}>→</span>
                        <span style={{fontSize:13,color:"#ccc",lineHeight:1.5}}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Cycle date missing prompt */}
            {!cycleStartDate&&(
              <div onClick={()=>setTab("profile")} style={{background:"#1a1a1a",border:"1px dashed #8e44ad50",borderRadius:16,padding:"14px 18px",marginBottom:14,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:24,flexShrink:0}}>🌙</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#8e44ad",marginBottom:3}}>Add her period start date</div>
                  <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>Tap to go to Profile → Cycle. Enter her last period date and the app tracks everything automatically.</div>
                </div>
                <span style={{color:"#555",fontSize:16,flexShrink:0}}>→</span>
              </div>
            )}

            {/* ── TODAY'S MISSION ───────────────────────────────── */}
            {(()=>{
              const todayKey=getToday(); const wk=getWeekKey();
              const pool=EXTENDED_TASKS.filter(t=>!t.phase||t.phase===phase.key);
              const seed=parseInt(todayKey.replace(/-/g,""))%pool.length;
              const task=pool[seed]||pool[0];
              const done=taskLog.some(l=>l.date===todayKey);
              if(!task) return null;
              return(
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>Today's Mission</div>
                  {!done?(
                    <div style={{background:"#1a1a1a",border:`1px solid ${phase.color}40`,borderRadius:14,padding:16}}>
                      <div style={{fontSize:15,fontWeight:700,color:"#f0ece4",lineHeight:1.5,marginBottom:4}}>{task.task}</div>
                      <div style={{fontSize:12,color:"#555",lineHeight:1.5,marginBottom:14}}>{task.why}</div>
                      <button onClick={()=>setShowLogForm(true)} style={{width:"100%",background:phase.color,color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>✓ Mark as Done</button>
                    </div>
                  ):(
                    <div style={{background:"#0a1a0a",border:"1px solid #27ae6040",borderRadius:14,padding:"14px 18px",textAlign:"center"}}>
                      <div style={{fontSize:24,marginBottom:6}}>🎯</div>
                      <div style={{fontSize:15,fontWeight:700,color:"#27ae60"}}>Mission complete.</div>
                      <div style={{fontSize:12,color:"#555",marginTop:4}}>She felt that.</div>
                    </div>
                  )}
                  {showLogForm&&(
                    <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:14,padding:16,marginTop:8}}>
                      <div style={{fontSize:12,color:"#888",marginBottom:10}}>How did it go?</div>
                      <div style={{display:"flex",gap:6,marginBottom:12}}>
                        {[1,2,3,4,5].map(n=>(
                          <button key={n} onClick={()=>setLogRating(n)} style={{flex:1,padding:"9px 0",borderRadius:8,border:`1px solid ${logRating===n?phase.color:"#2a2a2a"}`,background:logRating===n?phase.color+"20":"#111",color:logRating===n?phase.color:"#444",fontSize:15,cursor:"pointer"}}>{"★".repeat(n)}</button>
                        ))}
                      </div>
                      <textarea value={logNote} onChange={e=>setLogNote(e.target.value)} placeholder="How did she respond?" rows={2} style={{width:"100%",background:"#111",border:"1px solid #2a2a2a",color:"#f0ece4",borderRadius:8,padding:"10px 12px",fontSize:13,resize:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:10}}/>
                      <button onClick={()=>{
                        const entry={date:todayKey,task:task.task,rating:logRating||3,note:logNote,phase:phase.label};
                        setTaskLog(p=>[entry,...p]);
                        setWeeklyScore(p=>({...p,[wk]:(p[wk]||0)+1}));
                        setUsedTaskIds(p=>({...p,[wk]:[...(p[wk]||[]),task.id]}));
                        setShowLogForm(false);setLogNote("");setLogRating(0);
                        const el=document.createElement('div');
                        el.textContent="✓ Logged. Keep going.";
                        el.style.cssText='position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;pointer-events:none';
                        document.body.appendChild(el);
                        setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity 0.5s';setTimeout(()=>el.remove(),500)},2000);
                      }} style={{width:"100%",background:"#27ae60",color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>Save</button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── TODAY'S TEXT ─────────────────────────────────── */}
            {(()=>{
              const todayKey=getToday();
              const pool=EXTENDED_TEXTS.filter(t=>!t.phase||t.phase===phase.key);
              const seed=parseInt(todayKey.replace(/-/g,""))%pool.length;
              const t=pool[seed]||pool[0];
              const sent=lastTextDate===todayKey;
              const days=lastTextDate?Math.floor((new Date()-new Date(lastTextDate))/864e5):99;
              if(!t) return null;
              return(
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700}}>Today's Text</div>
                    <div style={{fontSize:10,fontWeight:700,color:sent?"#27ae60":days>=2?"#27ae60":"#555"}}>
                      {sent?"✓ Sent":days>=2?"📬 Send today":`Next in ${2-days}d`}
                    </div>
                  </div>
                  <div style={{background:"#1a1a1a",border:`1px solid ${sent?"#27ae6030":phase.color+"30"}`,borderRadius:14,padding:16}}>
                    <div style={{fontSize:15,color:"#f0ece4",lineHeight:1.7,fontStyle:"italic",marginBottom:14}}>"{t.text}"</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>copyText(t.text,()=>{})} style={{flex:1,background:"#111",border:`1px solid ${phase.color}40`,borderRadius:8,padding:"11px 0",fontSize:13,color:phase.color,fontWeight:600,cursor:"pointer"}}>Copy</button>
                      <button onClick={()=>{
                        setLastTextDate(todayKey);
                        const el=document.createElement('div');el.textContent="✓ Sent.";
                        el.style.cssText='position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;pointer-events:none';
                        document.body.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity 0.5s';setTimeout(()=>el.remove(),500)},2000);
                      }} style={{flex:1,background:sent?"#1a2a1a":"#27ae60",color:sent?"#27ae60":"#fff",border:`1px solid ${sent?"#27ae6040":"transparent"}`,borderRadius:8,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                        {sent?"✓ Sent":"Mark Sent"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── THIS WEEK'S ACTIVITY ─────────────────────────── */}
            {(()=>{
              const wk=getWeekKey(); const done=lastActivityDate===wk;
              const pool=HOME_ACTIVITIES.filter(a=>!a.phase||a.phase===phase.key);
              const seed=parseInt(wk.replace(/-/g,""))%pool.length;
              const act=pool[seed]||pool[0];
              if(!act) return null;
              return(
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>This Week's Activity</div>
                  <div style={{background:"#1a1a1a",border:`1px solid ${done?"#27ae6030":"#9b59b630"}`,borderRadius:14,padding:16}}>
                    <div style={{display:"flex",gap:10,marginBottom:done?0:12}}>
                      <span style={{fontSize:22}}>{act.emoji||"🎲"}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#f0ece4",marginBottom:3}}>{act.title}</div>
                        <div style={{fontSize:12,color:"#666",lineHeight:1.5}}>{act.howTo||act.description}</div>
                      </div>
                    </div>
                    {!done?(
                      <button onClick={()=>setLastActivityDate(wk)} style={{width:"100%",background:"#9b59b6",color:"#fff",border:"none",borderRadius:8,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Done This Week</button>
                    ):(
                      <div style={{textAlign:"center",fontSize:12,color:"#27ae60",fontWeight:600,paddingTop:10}}>✓ Done this week</div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── MONTHLY DATE ─────────────────────────────────── */}
            {(()=>{
              const now=new Date(); const monthKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
              const seed=(now.getFullYear()*12+now.getMonth())%DATE_IDEAS.length;
              const d=DATE_IDEAS[seed]||DATE_IDEAS[0];
              const daysLeft=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()-now.getDate();
              const done=dateDoneMonth===monthKey;
              return(
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:10,color:"#1abc9c",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700}}>🗓️ {MONTHS[now.getMonth()]}'s Date</div>
                    <div style={{fontSize:10,fontWeight:700,color:daysLeft<=7?"#e74c3c":daysLeft<=14?"#f39c12":"#1abc9c"}}>{daysLeft}d left</div>
                  </div>
                  <div style={{background:"#1a1a1a",border:`1px solid ${done?"#27ae6030":"#1abc9c30"}`,borderRadius:14,padding:16}}>
                    <div style={{display:"flex",gap:10,marginBottom:done?0:12}}>
                      <span style={{fontSize:22}}>{d.emoji||"🗓️"}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#f0ece4",marginBottom:3}}>{d.title}</div>
                        <div style={{fontSize:12,color:"#666",lineHeight:1.5}}>{d.description||d.why}</div>
                      </div>
                    </div>
                    {done?(
                      <div style={{textAlign:"center",fontSize:12,color:"#1abc9c",fontWeight:600,paddingTop:10}}>✓ Done this month 🎉</div>
                    ):(
                      <button onClick={()=>{safeSet(`dateDone-${monthKey}`,"1");setDateDoneMonth(monthKey);}} style={{width:"100%",background:"#1abc9c",color:"#fff",border:"none",borderRadius:8,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ We Did This</button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── DIVIDER ──────────────────────────────────────── */}
            <div style={{height:1,background:"#1a1a1a",marginBottom:20}}/>

            {/* ── STREAK — bottom ──────────────────────────────── */}
            {currentStreak>0&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span>{currentStreak>=30?"🏆":currentStreak>=14?"🔥":currentStreak>=7?"⚡":"📅"}</span>
                  <span style={{fontSize:12,color:"#555",fontWeight:600}}>{currentStreak} day streak</span>
                </div>
                <div style={{display:"flex",gap:2}}>
                  {[1,2,3,4,5,6,7].map(d=><div key={d} style={{width:12,height:12,borderRadius:2,background:d<=Math.min(currentStreak,7)?"#27ae60":"#2a2a2a"}}/>)}
                </div>
              </div>
            )}

            {/* Milestone celebration */}
            {[7,14,30,60,90,180,365].includes(currentStreak)&&(
              <div style={{background:"linear-gradient(135deg,#1a1500,#0d0d0d)",border:"2px solid #f1c40f60",borderRadius:16,padding:"16px 18px",marginBottom:12,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:6}}>{currentStreak>=365?"👑":currentStreak>=90?"💎":"🔥"}</div>
                <div style={{fontSize:18,fontWeight:800,fontFamily:"'Playfair Display',serif",color:"#f1c40f",marginBottom:4}}>{currentStreak} Day Streak</div>
                <div style={{fontSize:12,color:"#aaa",lineHeight:1.6}}>
                  {currentStreak===7?"One week. She's already feeling the difference."
                  :currentStreak===14?"Two weeks. Most men quit before this. You didn't."
                  :currentStreak===30?"30 days. You are not the same partner you were a month ago."
                  :currentStreak===60?"60 days. This is who you are now."
                  :currentStreak===90?"90 days. Top 1%. She knows it."
                  :currentStreak===180?"6 months. You've changed your relationship."
                  :"One year. This is mastery."}
                </div>
              </div>
            )}

            {/* ── TODAY'S TRUTH — bottom ───────────────────────── */}
            {(()=>{
              const truth=DAILY_TRUTHS[getDayOfYear(new Date())%DAILY_TRUTHS.length];
              return(
                <div style={{borderLeft:`2px solid #333`,paddingLeft:12,marginBottom:20}}>
                  <div style={{fontSize:10,color:"#444",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Today's Truth</div>
                  <div style={{fontSize:13,fontStyle:"italic",color:"#666",lineHeight:1.6}}>"{truth}"</div>
                </div>
              );
            })()}

          </div>
        )}

        {tab==="texts"&&(
          <div>
            {/* Cadence */}
            {(()=>{
              const today=getToday();
              const days=lastTextDate?Math.floor((new Date(today)-new Date(lastTextDate))/864e5):null;
              const sent=lastTextDate===today;
              let msg,color;
              if(sent){msg="Text sent today — let it breathe 2-3 days";color="#27ae60";}
              else if(days===null){msg="You haven't sent a text yet — start today";color="#c0392b";}
              else if(days>=3){msg=`${days} days since last text — send today`;color="#e74c3c";}
              else if(days===2){msg="2 days since last text — today's the window";color="#f39c12";}
              else{msg="Good — send again tomorrow";color="#3498db";}
              return(
                <div style={{background:color+"15",border:`1.5px solid ${color}40`,borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{sent?"✅":"💬"}</span>
                  <div style={{fontSize:13,fontWeight:600,color}}>{msg}</div>
                </div>
              );
            })()}

            {/* Phase Scripts */}
            {(()=>{
              const s=PHASE_SCRIPTS&&PHASE_SCRIPTS[phase.key];
              if(!s) return null;
              return(
                <div style={{marginBottom:16}}>
                  <button onClick={()=>setShowScripts(v=>!v)} style={{width:"100%",background:"#1a1a1a",border:`1px solid ${phase.color}40`,borderRadius:12,padding:"13px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:showScripts?8:0}}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:13,fontWeight:700,color:phase.color}}>💬 What to Say Tonight</div>
                      <div style={{fontSize:11,color:"#666",marginTop:2}}>{s.headline||"Phase-matched conversation starters"}</div>
                    </div>
                    <span style={{color:"#555",fontSize:12}}>{showScripts?"▲":"▼"}</span>
                  </button>
                  {showScripts&&(
                    <div style={{background:"#1a1a1a",border:`1px solid ${phase.color}25`,borderRadius:12,overflow:"hidden"}}>
                      {s.context&&<div style={{padding:"10px 16px",borderBottom:"1px solid #2a2a2a",fontSize:12,color:"#888",fontStyle:"italic"}}>{s.context}</div>}
                      {(s.scripts||[]).map((sc,i)=>(
                        <div key={i} style={{padding:"14px 16px",borderBottom:i<(s.scripts.length-1)?"1px solid #2a2a2a":"none"}}>
                          <div style={{fontSize:14,color:"#f0ece4",fontStyle:"italic",lineHeight:1.6,marginBottom:8}}>"{sc.line}"</div>
                          {sc.why&&<div style={{fontSize:11,color:"#555",lineHeight:1.5,marginBottom:8}}>🧠 {sc.why}</div>}
                          <button onClick={()=>copyText(sc.line,()=>{})} style={{background:"transparent",border:`1px solid ${phase.color}40`,borderRadius:8,padding:"5px 12px",fontSize:11,color:phase.color,cursor:"pointer",fontWeight:600}}>Copy</button>
                        </div>
                      ))}
                      {s.avoid&&(
                        <div style={{padding:"10px 16px",background:"#1a0a0a",borderTop:"1px solid #e74c3c20"}}>
                          <div style={{fontSize:11,color:"#e74c3c",fontWeight:700,marginBottom:3}}>⚠️ Avoid tonight</div>
                          <div style={{fontSize:11,color:"#888",lineHeight:1.5}}>{s.avoid}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* She Said quick capture */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:8}}>She Said</div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input value={sheSaidInput} onChange={e=>setSheSaidInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&sheSaidInput.trim()){setSheSaid(p=>[{text:sheSaidInput.trim(),date:getToday(),phase:phase.label},...p].slice(0,100));setSheSaidInput("");}}}
                  placeholder="She just mentioned something..." style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:"inherit"}}/>
                <button onClick={()=>{if(sheSaidInput.trim()){setSheSaid(p=>[{text:sheSaidInput.trim(),date:getToday(),phase:phase.label},...p].slice(0,100));setSheSaidInput("");}}} style={{background:"#c0392b",color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",fontSize:15,fontWeight:700,cursor:"pointer"}}>+</button>
              </div>
              {sheSaid.slice(0,3).map((s,i)=>(
                <div key={i} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,color:"#ddd"}}>{s.text}</div>
                    <div style={{fontSize:10,color:"#444",marginTop:2}}>{s.date} · {s.phase}</div>
                  </div>
                  <button onClick={()=>setSheSaid(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#333",fontSize:14,cursor:"pointer",padding:"0 4px"}}>✕</button>
                </div>
              ))}
              {sheSaid.length>3&&<div style={{fontSize:11,color:"#555",textAlign:"center",marginTop:4}}>+{sheSaid.length-3} more in She Said tab</div>}
            </div>

            {/* Phase texts with NEURO tags */}
            <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:10}}>{phase.label} Texts</div>
            {(()=>{
              const recentlySent=(sentTextIds||[]).slice(-15);
              const pool=EXTENDED_TEXTS.filter(t=>!t.phase||t.phase===phase.key);
              const available=pool.filter(t=>!recentlySent.includes(t.id));
              const activePool=available.length>=3?available:pool;
              return activePool.slice(0,6).map((t,i)=>{
                const alreadySent=(sentTextIds||[]).includes(t.id);
                return(
                  <div key={i} style={{background:"#1a1a1a",border:`1px solid ${alreadySent?"#27ae6025":"#2a2a2a"}`,borderRadius:12,padding:16,marginBottom:12,opacity:alreadySent?0.75:1}}>
                    {alreadySent&&<div style={{fontSize:10,color:"#27ae60",fontWeight:700,marginBottom:6}}>✓ Already sent</div>}
                    <div style={{fontSize:14,color:"#f0ece4",lineHeight:1.7,fontStyle:"italic",marginBottom:12}}>"{t.text}"</div>
                    {(t.chemicals||(t.neuro)||[]).length>0&&(
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                        {(t.chemicals||t.neuro||[]).map(c=>(
                          <span key={c} style={{fontSize:10,color:NEURO[c]?.color||"#e67e22",background:(NEURO[c]?.color||"#e67e22")+"18",borderRadius:8,padding:"2px 8px",fontWeight:600,border:`1px solid ${(NEURO[c]?.color||"#e67e22")}30`}}>
                            {NEURO[c]?.emoji} {NEURO[c]?.label||c}
                          </span>
                        ))}
                      </div>
                    )}
                    <button onClick={()=>{
                      copyText(t.text,()=>{});
                      setLastTextDate(getToday());
                      setSentTextIds&&setSentTextIds(p=>[...new Set([...p,t.id])]);
                    }} style={{width:"100%",background:alreadySent?"#1a2a1a":phase.color,color:alreadySent?"#27ae60":"#fff",border:`1px solid ${alreadySent?"#27ae6040":"transparent"}`,borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      {alreadySent?"Copy again":"Copy & Mark Sent"}
                    </button>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* SHE SAID */}
        {tab==="reminders"&&(
          <div>
            <div style={{fontSize:12,color:"#555",lineHeight:1.6,marginBottom:14}}>Capture what she mentions — her dreams, things she wants, what she's worried about. Use it to show her you listen.</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <input value={sheSaidInput} onChange={e=>setSheSaidInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&sheSaidInput.trim()){setSheSaid(p=>[{text:sheSaidInput.trim(),date:getToday(),phase:phase.label},...p].slice(0,100));setSheSaidInput("");}}}
                placeholder="She just said something..." style={{flex:1,background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:10,padding:"11px 14px",fontSize:13,fontFamily:"inherit"}}/>
              <button onClick={()=>{if(sheSaidInput.trim()){setSheSaid(p=>[{text:sheSaidInput.trim(),date:getToday(),phase:phase.label},...p].slice(0,100));setSheSaidInput("");}}} style={{background:"#c0392b",color:"#fff",border:"none",borderRadius:10,padding:"11px 16px",fontSize:16,fontWeight:700,cursor:"pointer"}}>+</button>
            </div>
            {sheSaid.length===0?(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#333"}}>
                <div style={{fontSize:32,marginBottom:10}}>📝</div>
                <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>Nothing saved yet. When she mentions a restaurant, a dream, something she wants — capture it here. These become your secret weapon.</div>
              </div>
            ):sheSaid.map((s,i)=>{
              const done=sheSaidDone&&sheSaidDone.includes(i);
              return(
                <div key={i} style={{background:"#1a1a1a",border:`1px solid ${done?"#27ae6030":"#2a2a2a"}`,borderRadius:12,padding:"12px 14px",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:8}}>
                    <div style={{flex:1,fontSize:13,color:done?"#666":"#f0ece4",textDecoration:done?"line-through":"none",lineHeight:1.5}}>{s.text}</div>
                    <button onClick={()=>setSheSaid(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#333",fontSize:14,cursor:"pointer",flexShrink:0}}>✕</button>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:10,color:"#444"}}>{s.date} · {s.phase}</div>
                    <button onClick={()=>setSheSaidDone&&setSheSaidDone(p=>done?p.filter(x=>x!==i):[...p,i])} style={{background:"transparent",border:`1px solid ${done?"#27ae6060":"#333"}`,borderRadius:6,padding:"3px 10px",fontSize:11,color:done?"#27ae60":"#555",cursor:"pointer"}}>
                      {done?"✓ Done":"→ Act on this"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PROFILE */}
        {tab==="profile"&&renderProfile()}

        {/* LOG */}
        {tab==="log"&&(
          <div>
            {/* Monthly score */}
            {(()=>{
              const now=new Date();
              const mk=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
              const mLog=taskLog.filter(l=>l.date&&l.date.startsWith(mk));
              const avg=mLog.length>0?(mLog.reduce((s,l)=>s+(l.rating||3),0)/mLog.length).toFixed(1):null;
              const score=mLog.length>0?Math.round((parseFloat(avg)/5*0.6+Math.min(mLog.length/20,1)*0.4)*100):0;
              const level=score>=85?"Elite Partner 👑":score>=70?"Advanced 🔥":score>=55?"Consistent 💪":score>=40?"Building 🌱":"Getting Started";
              const color=score>=85?"#f1c40f":score>=70?"#27ae60":score>=55?"#3498db":score>=40?"#e67e22":"#888";
              return(
                <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:14,padding:18,marginBottom:16}}>
                  <div style={{fontSize:10,color:"#666",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>This Month</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:48,fontWeight:900,color,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{score}</div>
                      <div style={{fontSize:12,color,fontWeight:700,marginTop:4}}>{level}</div>
                    </div>
                    <div style={{textAlign:"right",fontSize:11,color:"#555"}}>
                      <div>{mLog.length} days logged</div>
                      <div>{currentStreak} day streak</div>
                      {avg&&<div>{avg}★ avg</div>}
                    </div>
                  </div>
                  <div style={{background:"#2a2a2a",borderRadius:4,height:5,overflow:"hidden"}}>
                    <div style={{width:`${score}%`,height:"100%",background:color,borderRadius:4}}/>
                  </div>
                </div>
              );
            })()}

            {/* Log history */}
            {taskLog.length===0?(
              <div style={{textAlign:"center",padding:"30px 0",color:"#444"}}>
                <div style={{fontSize:28,marginBottom:8}}>📓</div>
                <div style={{fontSize:13,color:"#555"}}>No entries yet. Mark missions done on Today to build your log.</div>
              </div>
            ):taskLog.slice(0,20).map((l,i)=>(
              <div key={i} style={{background:"#1a1a1a",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,color:"#ddd",lineHeight:1.4,marginBottom:2}}>{l.task}</div>
                  <div style={{fontSize:10,color:"#555"}}>{l.date} · {l.phase}</div>
                </div>
                <div style={{fontSize:13,color:"#f1c40f",flexShrink:0,marginLeft:10}}>{"★".repeat(l.rating||3)}</div>
              </div>
            ))}
          </div>
        )}

        {/* CHEMISTRY */}
        {tab==="home"&&(
          <div>
            {/* Phase filter */}
            <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
              {[
                {key:"all",      label:"All",       emoji:"✨"},
                {key:"menstrual",label:"Menstrual",  emoji:"🌑"},
                {key:"follicular",label:"Follicular",emoji:"🌒"},
                {key:"ovulation",label:"Ovulation",  emoji:"🌕"},
                {key:"luteal",   label:"Luteal",     emoji:"🌗"},
              ].map(f=>(
                <button key={f.key} onClick={()=>setActivityFilter(f.key)} style={{
                  background:activityFilter===f.key?"#1a1a1a":"transparent",
                  border:`1px solid ${activityFilter===f.key?phase.color:"#2a2a2a"}`,
                  color:activityFilter===f.key?phase.color:"#555",
                  borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,
                  cursor:"pointer",whiteSpace:"nowrap",flexShrink:0
                }}>{f.emoji} {f.label}</button>
              ))}
            </div>

            {/* At-Home Activities */}
            <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:10}}>🏠 At-Home Activities</div>
            {HOME_ACTIVITIES
              .filter(a=>activityFilter==="all"||!a.phase||a.phase===activityFilter)
              .map((act,i)=>(
              <div key={i} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:14,padding:16,marginBottom:10}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                  <span style={{fontSize:24,flexShrink:0}}>{act.emoji||"🎲"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#f0ece4",marginBottom:4}}>{act.title}</div>
                    <div style={{fontSize:12,color:"#666",lineHeight:1.6}}>{act.howTo||act.description}</div>
                  </div>
                </div>
                {act.whatToSay&&(
                  <div style={{background:"#111",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#aaa",fontStyle:"italic"}}>
                    "{act.whatToSay}"
                  </div>
                )}
                {(act.primaryChem?[act.primaryChem]:act.chems||act.chemicals||[]).length>0&&(
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {(act.primaryChem?[act.primaryChem]:act.chems||act.chemicals||[]).map(c=>(
                      <span key={c} style={{fontSize:10,color:NEURO[c]?.color||"#e67e22",background:(NEURO[c]?.color||"#e67e22")+"18",borderRadius:8,padding:"2px 8px",fontWeight:600,border:`1px solid ${(NEURO[c]?.color||"#e67e22")}30`}}>
                        {NEURO[c]?.emoji} {NEURO[c]?.label||c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Date Ideas */}
            <div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:10,marginTop:8}}>🗓️ Date Ideas</div>
            {DATE_IDEAS
              .filter(d=>activityFilter==="all"||!d.phase||(d.needs&&d.needs.includes(activityFilter)))
              .map((d,i)=>(
              <div key={i} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:14,padding:16,marginBottom:10}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                  <span style={{fontSize:24,flexShrink:0}}>{d.emoji||"🗓️"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#f0ece4",marginBottom:4}}>{d.title}</div>
                    <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                      {d.effort&&<span style={{fontSize:10,color:"#555",background:"#111",borderRadius:6,padding:"1px 8px"}}>{d.effort}</span>}
                      {d.duration&&<span style={{fontSize:10,color:"#555",background:"#111",borderRadius:6,padding:"1px 8px"}}>{d.duration}</span>}
                      {d.cost&&<span style={{fontSize:10,color:"#555",background:"#111",borderRadius:6,padding:"1px 8px"}}>{d.cost}</span>}
                    </div>
                    <div style={{fontSize:12,color:"#666",lineHeight:1.6}}>{d.description||d.why}</div>
                  </div>
                </div>
                {(d.chems||d.chemicals||[]).length>0&&(
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {(d.chems||d.chemicals||[]).map(c=>(
                      <span key={c} style={{fontSize:10,color:NEURO[c]?.color||"#e67e22",background:(NEURO[c]?.color||"#e67e22")+"18",borderRadius:8,padding:"2px 8px",fontWeight:600,border:`1px solid ${(NEURO[c]?.color||"#e67e22")}30`}}>
                        {NEURO[c]?.emoji} {NEURO[c]?.label||c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab==="coach"&&(
          <div>

            {/* 30/60/90 Day Challenge */}
            {(()=>{
              const allDone = completedDays.length;
              const l2done = safeGetJSON("level2Completed",[]).length;
              const l3done = safeGetJSON("level3Completed",[]).length;
              const currentLevel = allDone<30?1:l2done<30?2:l3done<30?3:4;
              const currentPool = currentLevel===1?CHALLENGE_30:currentLevel===2?CHALLENGE_60:currentLevel===3?CHALLENGE_90:CHALLENGE_MONTHLY;
              const currentProgress = currentLevel===1?allDone:currentLevel===2?l2done:currentLevel===3?l3done:0;
              const progressMax = currentLevel===4?12:30;
              const levelColor = currentLevel===4?"#f1c40f":currentLevel===3?"#f1c40f":currentLevel===2?"#8e44ad":"#27ae60";
              const levelLabel = currentLevel===4?"♾️ Lifelong Partner":currentLevel===3?"👑 Level 3 — Master":currentLevel===2?"🔥 Level 2 — Advanced":"Level 1 — 30 Days";

              const todayTask = currentLevel<4 ? currentPool[Math.min(currentProgress,currentPool.length-1)] : null;
              const monthlyTask = currentLevel===4 ? CHALLENGE_MONTHLY[(new Date().getMonth())] : null;

              return(
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{fontSize:10,color:levelColor,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700}}>🏆 {levelLabel}</div>
                    <div style={{fontSize:11,color:"#555"}}>{currentLevel<4?`${currentProgress}/${progressMax}`:"Month "+((new Date().getMonth()+1))}</div>
                  </div>
                  {currentLevel<4&&(
                    <div style={{background:"#2a2a2a",borderRadius:4,height:4,overflow:"hidden",marginBottom:16}}>
                      <div style={{width:`${(currentProgress/progressMax)*100}%`,height:"100%",background:levelColor,borderRadius:4}}/>
                    </div>
                  )}
                  {todayTask&&(
                    <div style={{background:"#1a1a1a",border:`1px solid ${levelColor}30`,borderRadius:14,padding:16,marginBottom:12}}>
                      <div style={{fontSize:11,color:levelColor,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Day {currentProgress+1} · {todayTask.theme}</div>
                      <div style={{fontSize:14,fontWeight:600,color:"#f0ece4",lineHeight:1.5,marginBottom:8}}>{todayTask.task}</div>
                      <div style={{fontSize:11,color:"#666",fontStyle:"italic",lineHeight:1.5,marginBottom:12}}>{todayTask.tip}</div>
                      {!completedDays.includes(todayTask.day)&&currentLevel===1?(
                        <button onClick={()=>setCompletedDays(p=>[...p,todayTask.day])} style={{width:"100%",background:levelColor,color:"#111",border:"none",borderRadius:10,padding:"12px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Done Today</button>
                      ):completedDays.includes(todayTask.day)&&currentLevel===1?(
                        <div style={{textAlign:"center",fontSize:12,color:levelColor,fontWeight:600}}>✓ Done — come back tomorrow</div>
                      ):null}
                    </div>
                  )}
                  {monthlyTask&&(
                    <div style={{background:"#1a1a1a",border:`1px solid ${levelColor}30`,borderRadius:14,padding:16}}>
                      <div style={{fontSize:11,color:levelColor,fontWeight:700,marginBottom:6,textTransform:"uppercase"}}>{MONTHS[new Date().getMonth()]} Mission · {monthlyTask.theme}</div>
                      <div style={{fontSize:14,fontWeight:600,color:"#f0ece4",lineHeight:1.5,marginBottom:8}}>{monthlyTask.mission}</div>
                      <div style={{fontSize:11,color:"#666",fontStyle:"italic",marginBottom:12}}>{monthlyTask.why}</div>
                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#111",borderTop:"1px solid #2a2a2a",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {tabs.map(t=>{
          const profileIncomplete = t.id==="profile" && (!wifeName||!wifeBirthYear||!cycleStartDate);
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 12px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===t.id?"#c0392b":"#555",transition:"color 0.2s",position:"relative"}}>
              <span style={{fontSize:18}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:600,letterSpacing:"0.04em"}}>{t.label}</span>
              {t.id==="reminders"&&activeCount>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 20px)",background:"#c0392b",color:"#fff",borderRadius:8,padding:"1px 4px",fontSize:8,fontWeight:700}}>{activeCount}</span>}
              {profileIncomplete&&<span style={{position:"absolute",top:6,right:"calc(50% - 16px)",width:7,height:7,borderRadius:"50%",background:"#f39c12"}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
