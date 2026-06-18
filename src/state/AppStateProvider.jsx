import { useState, useEffect, useRef, createContext, useContext } from "react";
import { hasSupabase } from '../services/supabaseClient.js';
import { signIn, signUp, signOutUser, sendPasswordReset, getSession, onAuthChange, toAuthUser, verifyEmailOtp, updatePassword, resendVerification } from '../services/auth.service.js';
import { useCloudSync } from '../hooks/useCloudSync.js';
import { deleteAccount } from '../services/account.service.js';
import { getUserSubscription } from '../services/appData.service.js';
import { useSubscription } from '../hooks/useSubscription.js';
import { rcLogOut } from '../services/revenuecat.service.js';
import { initStatusBar, isNative } from '../services/platform.service.js';
import { NEURO, SHC, LPP, TASK_LPP, ZODIAC_SIGNS, CHINESE_ZODIAC, NUMEROLOGY, REMINDER_LIBRARY, CATEGORIES, DAYS_OF_WEEK, DAY_LABELS, CYCLE_PHASES, NEEDS, NEED_COLORS, DAILY_TASKS, TEXT_SAMPLES, MONTHS, DAILY_TRUTHS, PHASE_SCRIPTS, DIAGNOSTIC_QUESTIONS, CHALLENGE_30, CHALLENGE_60, CHALLENGE_90, CHALLENGE_MONTHLY, SEASONAL_THEMES, EXTENDED_TASKS, EXTENDED_TEXTS, DATE_IDEAS, TEXT_SHC, TASK_SHC, SEASONAL_CAMPAIGNS, HOME_ACTIVITIES, HOME_ACTIVITY_TASKS, HOME_ACTIVITY_REMINDERS, ALL_REMINDERS } from '../constants/data.js';
import { getLifePathNumber, getCurrentPhase, getCycleDay, getToday, getDayOfYear, getDailyTextFromLibrary, getDailyActivityFromLibrary, API_URL, APP_SECRET, fetchAI, _store, safeGet, safeGetJSON, copyText, safeSet, getChineseZodiac, getZodiacFromDate, getMonthKey, getActiveCampaign, getWeekKey, getCurrentMonth, getSeasonalTheme, getVarietyTask, getVarietyTexts } from '../utils/helpers.js';
import { NeedBadge, NeuroBadge, PremiumGate, SHCBadge, SHCRow, LPPBadge, NeuroPanel, PhaseCard, ReminderCard } from '../components/primitives.jsx';

const AppStateContext = createContext(null);

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used within AppStateProvider');
  return value;
}

export function AppStateProvider({ children }) {
  const [tab, setTab] = useState("today");
  
  const [onboarded, setOnboarded] = useState(() => safeGet("onboarded", "") === "1"); // hydrate so returning users skip the welcome slides
  
  // ─── Auth & Subscription State ───────────────────────────────
  
  // fresh start
  
  // ─── Auth & Subscription State ───────────────────────────────
  const [authScreen, setAuthScreen] = useState("login"); // login | signup | forgot | verify | reset

  // login | signup | forgot | verify | reset
  const [authUser, setAuthUser] = useState(null); // fresh start
  // Email address awaiting verification after signup (drives the "verify" screen).
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState("");
  // True once a password-recovery deep link has established a session — forces the "set new password" screen.
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  
  // fresh start
  const [authEmail, setAuthEmail] = useState("");
  
  const [authPassword, setAuthPassword] = useState("");
  
  const [authName, setAuthName] = useState("");
  
  const [authLoading, setAuthLoading] = useState(false);
  
  const [authError, setAuthError] = useState("");
  
  const [subscribed, setSubscribed] = useState(false); // fresh start
  
  // fresh start
  const [lifetimeAccess, setLifetimeAccess] = useState(false); // granted via redeemed access code
  // The user id the lifetime flag has been fetched for. Tracked per-user (not a bare boolean)
  // so there's no render gap when authUser changes — gates the paywall so already-subscribed
  // users never see a flash of the plans screen before access resolves.
  const [lifetimeCheckedFor, setLifetimeCheckedFor] = useState(null);

  // granted via redeemed access code
  const [selectedPlan, setSelectedPlan] = useState("annual"); // paywall: 'annual' | 'monthly'
  
  // paywall: 'annual' | 'monthly'
  const [subMsg, setSubMsg] = useState(""); // paywall status/error message
  
  // paywall status/error message
  const [codeInput, setCodeInput] = useState(""); // redeem-code field
  
  // redeem-code field
  const [redeeming, setRedeeming] = useState(false);
  
  const [subTier, setSubTier] = useState("basic"); // fresh start // "basic" | "premium"
  
  // fresh start // "basic" | "premium"
  const [subLoading, setSubLoading] = useState(false);
  
  const [cycleDay, setCycleDay] = useState(1); // fresh start
  
  // fresh start
  const [wifeName, setWifeName] = useState(() => safeGet("wifeName", ""));
  
  const [wifeNickname, setWifeNickname] = useState(() => safeGet("wifeNickname", ""));
  
  const [wifeBirthMonth, setWifeBirthMonth] = useState(() => safeGet("wifeBirthMonth", ""));
  
  const [wifeBirthDay, setWifeBirthDay] = useState(() => safeGet("wifeBirthDay", ""));
  
  const [wifeBirthYear, setWifeBirthYear] = useState(() => safeGet("wifeBirthYear", ""));
  
  const [cycleStartDate, setCycleStartDate] = useState(() => {
    const saved = safeGet("cycleStartDate", "");
    const name = safeGet("wifeName", "");
    if (!name) {
      safeSet("cycleStartDate", "");
      return "";
    }
    return saved;
  });
  
  const handleCycleStart = val => {
    setCycleStartDate(val);
    safeSet("cycleStartDate", val);
    const day = getCycleDay(val);
    if (day != null) {
      setCycleDay(day);
      safeSet("cycleDay", String(day));
    }
  };
  
  const [taskLog, setTaskLog] = useState(() => safeGetJSON("taskLog", []));
  
  const [wifeNeeds, setWifeNeeds] = useState(() => safeGetJSON("wifeNeeds", []));
  
  const [level2Completed, setLevel2Completed] = useState(() => safeGetJSON("level2Completed", []));
  
  const [level3Completed, setLevel3Completed] = useState(() => safeGetJSON("level3Completed", []));
  
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  
  const [todayActivity, setTodayActivity] = useState(null);
  
  // ── Know Her — Important Details ─────────────────────────────
  
  // ── Know Her — Important Details ─────────────────────────────
  const [anniversaryDate, setAnniversaryDate] = useState(() => safeGet("anniversaryDate", ""));
  
  const [firstDateDate, setFirstDateDate] = useState(() => safeGet("firstDateDate", ""));
  
  const [favRestaurant, setFavRestaurant] = useState(() => safeGet("favRestaurant", ""));
  
  const [favFood, setFavFood] = useState(() => safeGet("favFood", ""));
  
  const [favDrink, setFavDrink] = useState(() => safeGet("favDrink", ""));
  
  const [favStarbucks, setFavStarbucks] = useState(() => safeGet("favStarbucks", ""));
  
  const [favFlower, setFavFlower] = useState(() => safeGet("favFlower", ""));
  
  const [favColor, setFavColor] = useState(() => safeGet("favColor", ""));
  
  const [favMovie, setFavMovie] = useState(() => safeGet("favMovie", ""));
  
  const [favShow, setFavShow] = useState(() => safeGet("favShow", ""));
  
  const [favSong, setFavSong] = useState(() => safeGet("favSong", ""));
  
  const [favArtist, setFavArtist] = useState(() => safeGet("favArtist", ""));
  
  const [loveLanguage, setLoveLanguage] = useState(() => safeGet("loveLanguage", ""));
  
  const [biggestDream, setBiggestDream] = useState(() => safeGet("biggestDream", ""));
  
  const [biggestFear, setBiggestFear] = useState(() => safeGet("biggestFear", ""));
  
  const [whatStresses, setWhatStresses] = useState(() => safeGet("whatStresses", ""));
  
  const [whatLightsUp, setWhatLightsUp] = useState(() => safeGet("whatLightsUp", ""));
  
  const [howSheFeelsLoved, setHowSheFeelsLoved] = useState(() => safeGet("howSheFeelsLoved", ""));
  
  const [kidsNames, setKidsNames] = useState(() => safeGet("kidsNames", ""));
  
  const [petsNames, setPetsNames] = useState(() => safeGet("petsNames", ""));
  
  const [herMom, setHerMom] = useState(() => safeGet("herMom", ""));
  
  const [herDad, setHerDad] = useState(() => safeGet("herDad", ""));
  
  const [herBestFriend, setHerBestFriend] = useState(() => safeGet("herBestFriend", ""));
  
  const [husbandNotes, setHusbandNotes] = useState(() => safeGet("husbandNotes", ""));
  
  const [weeklyScore, setWeeklyScore] = useState({}); // fresh start
  
  // fresh start
  const [husbandMood, setHusbandMood] = useState("");
  
  // ── New feature state ─────────────────────────────────────────
  
  // ── New feature state ─────────────────────────────────────────
  const [sheSaid, setSheSaid] = useState([]); // fresh start
  
  // fresh start
  const [sheSaidInput, setSheSaidInput] = useState("");
  
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  
  const [diagnosticResult, setDiagnosticResult] = useState("");
  
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  
  const [diagnosticDone, setDiagnosticDone] = useState(false);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [legalView, setLegalView] = useState(null); // 'support' | 'privacy' | null
  
  // 'support' | 'privacy' | null
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      if (!isPreviewMode) await deleteAccount();
    } catch (e) {/* proceed to local wipe regardless */}
    try {
      await rcLogOut();
    } catch (e) {}
    try {
      if (!isPreviewMode) await signOutUser();
    } catch (e) {}
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    setAuthUser(null);
    setSubscribed(false);
    setSubTier("basic");
    location.reload();
  };
  
  const [challengeDay, setChallengeDay] = useState(0); // fresh start
  
  // fresh start
  const [challengeStarted, setChallengeStarted] = useState(false); // fresh start
  
  // fresh start
  const [completedDays, setCompletedDays] = useState(() => safeGetJSON("completedDays", []));
  
  const [showChallenge, setShowChallenge] = useState(true);
  
  const [showScripts, setShowScripts] = useState(false);
  
  const [activityFilter, setActivityFilter] = useState("all");
  
  const [sentTextIds, setSentTextIds] = useState(() => safeGetJSON("sentTextIds", []));
  
  const [sheSaidDone, setSheSaidDone] = useState(() => safeGetJSON("sheSaidDone", []));
  
  const [replayGuide, setReplayGuide] = useState(false);
  
  const [onboardSlide, setOnboardSlide] = useState(0);
  
  const [todayTask, setTodayTask] = useState(null);
  
  const [taskDone, setTaskDone] = useState(false);
  
  const [taskRating, setTaskRating] = useState(null);
  
  const [taskNote, setTaskNote] = useState("");
  
  const [showLogForm, setShowLogForm] = useState(false);
  
  const [logRating, setLogRating] = useState(0);
  
  const [logNote, setLogNote] = useState("");
  
  const [currentStreak, setCurrentStreak] = useState(() => parseInt(safeGet("currentStreak", "0") || "0"));
  
  const [longestStreak, setLongestStreak] = useState(() => parseInt(safeGet("longestStreak", "0") || "0"));
  
  const [lastOpenDate, setLastOpenDate] = useState(() => safeGet("lastOpenDate", ""));
  
  const [showRecovery, setShowRecovery] = useState(false);
  
  const [dateDoneMonth, setDateDoneMonth] = useState(() => {
    const now = new Date();
    const mk = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return safeGet(`dateDone-${mk}`, "") !== "" ? mk : "";
  });
  
  const [aiText, setAiText] = useState("");
  
  const [aiLoading, setAiLoading] = useState(false);
  
  const [aiActivity, setAiActivity] = useState("");
  
  const [activityLoading, setActivityLoading] = useState(false);
  
  const [taskWorked, setTaskWorked] = useState(null);
  
  const [taskMood, setTaskMood] = useState("");
  
  const [taskWin, setTaskWin] = useState("");
  
  const [expandedLog, setExpandedLog] = useState(null);
  
  const [expandedText, setExpandedText] = useState(null);
  
  const [usedTaskIds, setUsedTaskIds] = useState({}); // fresh start
  
  // fresh start
  const [usedTextIds, setUsedTextIds] = useState({}); // fresh start
  
  // fresh start
  const [varietyTexts, setVarietyTexts] = useState([]);
  
  const [showNeuroGuide, setShowNeuroGuide] = useState(false);
  
  const [coachHistory, setCoachHistory] = useState([]); // fresh start
  
  // fresh start
  const [homeChemFilter, setHomeChemFilter] = useState("all");
  
  const [dailyTextMsg, setDailyTextMsg] = useState("");
  
  const [dailyTextMeta, setDailyTextMeta] = useState(null);
  
  const [dailyTextLoading, setDailyTextLoading] = useState(false);
  
  const [dailyTextCopied, setDailyTextCopied] = useState(false);
  
  const [showTextOptions, setShowTextOptions] = useState(false);
  
  const [suggestedTextTime, setSuggestedTextTime] = useState(() => safeGetJSON("suggestedTextTime", {}));
  
  const [textTimeHistory, setTextTimeHistory] = useState(() => safeGetJSON("textTimeHistory", {}));
  // ── Cadence system — text every 2-3 days, activity once a week ──
  
  // ── Cadence system — text every 2-3 days, activity once a week ──
  const [lastTextDate, setLastTextDate] = useState(() => safeGet("lastTextDate", ""));
  
  const [lastActivityDate, setLastActivityDate] = useState(""); // fresh start
  
  // fresh start
  const [textSentToday, setTextSentToday] = useState(() => safeGet("textSentToday", "") === getToday());
  
  const [activityDoneThisWeek, setActivityDoneThisWeek] = useState(() => safeGet("activityWeek", "") === getWeekKey());
  
  const [textCadenceDays] = useState(() => {
    const d = getDayOfYear(new Date());
    return d % 2 === 0 ? 2 : 3;
  }); // alternates 2 or 3 days
  
  // alternates 2 or 3 days
  const [textOffset, setTextOffset] = useState(0);
  
  const [genOffset, setGenOffset] = useState(0);
  
  const [genText, setGenText] = useState(null);
  
  const [genCopied, setGenCopied] = useState(false);
  
  const [dateOffset, setDateOffset] = useState(0);
  
  const [dateIdea, setDateIdea] = useState(null);
  
  const [dailyActivity, setDailyActivity] = useState(null);
  
  const [dailyActivityLoading, setDailyActivityLoading] = useState(false);
  
  const [activityOffset, setActivityOffset] = useState(0);
  
  const [activeReminders, setActiveReminders] = useState({}); // fresh start
  
  // fresh start
  const [schedules, setSchedules] = useState(() => safeGetJSON("schedules", {}));
  
  const [reminderCat, setReminderCat] = useState("all");
  
  const [toasts, setToasts] = useState([]);
  // Transient success/info popup helper (auto-dismisses).
  const pushToast = (icon, title, body = "") => {
    const id = Date.now() + Math.floor(performance.now());
    setToasts(prev => [...prev, { id, icon, title, body }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const [notifPermission, setNotifPermission] = useState("default");
  
  const [profileSection, setProfileSection] = useState("overview");
  
  const intervalRef = useRef(null);
  
  const phase = getCurrentPhase(cycleDay);
  
  const zodiac = getZodiacFromDate(wifeBirthMonth, wifeBirthDay);
  
  const chineseZodiac = getChineseZodiac(parseInt(wifeBirthYear));
  
  const lifePathNum = getLifePathNumber(wifeBirthDay, wifeBirthMonth, wifeBirthYear);
  
  const numerology = lifePathNum ? NUMEROLOGY[lifePathNum] : null;
  // Dev-only bypass: skip real auth when explicitly enabled, or when Supabase isn't configured.
  
  // Dev-only bypass: skip real auth when explicitly enabled, or when Supabase isn't configured.
  const isPreviewMode = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true' || !hasSupabase;
  // Dev-only screenshot helper (default false; baked false in production builds).
  
  // Dev-only screenshot helper (default false; baked false in production builds).
  const SCREENSHOT = import.meta.env.VITE_SCREENSHOT === 'true';
  // Subscription-only app: an active subscription unlocks everything (no free tier).
  
  // Subscription-only app: an active subscription unlocks everything (no free tier).
  const isPremium = subscribed || isPreviewMode;

  // Email verification hard gate: dev bypass / screenshot mode skip it; otherwise the
  // signed-in user must have a confirmed email before reaching the paywall.
  const emailVerified = isPreviewMode || SCREENSHOT || !!authUser?.emailConfirmed;

  // RevenueCat entitlement state (native). Drives the hard paywall + access.
  
  // RevenueCat entitlement state (native). Drives the hard paywall + access.
  const subscription = useSubscription(authUser?.id);
  
  useEffect(() => {
    if (isPreviewMode) {
      setSubscribed(true);
      return;
    }
    setSubscribed(subscription.isSubscribed || lifetimeAccess);
  }, [subscription.isSubscribed, lifetimeAccess, isPreviewMode]);

  // Lifetime access (redeemed code) — read the flag from the subscription mirror on login.

  // Lifetime access (redeemed code) — read the flag from the subscription mirror on login.
  useEffect(() => {
    if (isPreviewMode || !authUser?.id) {
      setLifetimeAccess(false);
      setLifetimeCheckedFor(authUser?.id || "none");
      return;
    }
    getUserSubscription(authUser.id)
      .then(sub => setLifetimeAccess(!!sub?.lifetime))
      .catch(() => {})
      .finally(() => setLifetimeCheckedFor(authUser.id));
  }, [authUser?.id, isPreviewMode]);

  // Subscription status is "resolved" only once both RevenueCat is ready AND the lifetime
  // flag has been fetched for THIS user. Until then the paywall stays hidden (a loader shows)
  // so a subscribed user never sees a flash of the plans screen before access loads.
  const lifetimeChecked = !authUser?.id || lifetimeCheckedFor === authUser.id;
  const subscriptionReady = isPreviewMode || (subscription.ready && lifetimeChecked);
  
  // Dev-only (store screenshots): VITE_SCREENSHOT=true drives a deterministic screen without login.
  //  - bypass=false -> paywall;  bypass=true -> app at VITE_SCREENSHOT_TAB. No real data access (RLS).
  
  // Dev-only (store screenshots): VITE_SCREENSHOT=true drives a deterministic screen without login.
  //  - bypass=false -> paywall;  bypass=true -> app at VITE_SCREENSHOT_TAB. No real data access (RLS).
  useEffect(() => {
    if (!SCREENSHOT) return;
    setAuthUser({
      id: 'screenshot',
      email: 'demo@outstandingpartner.app',
      name: 'Demo'
    });
    setOnboarded(true);
    safeSet('onboarded', '1');
    const t = import.meta.env.VITE_SCREENSHOT_TAB;
    if (t) setTab(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Cloud sync: hydrate from / push to Supabase while authenticated (Supabase mode only).
  
  // eslint-disable-line react-hooks/exhaustive-deps
  
  // Cloud sync: hydrate from / push to Supabase while authenticated (Supabase mode only).
  useCloudSync(authUser?.id, !isPreviewMode && !!authUser);
  
  // Restore Supabase session on launch + subscribe to auth changes.
  // (Subscription status comes from RevenueCat, not set here.)
  
  // Restore Supabase session on launch + subscribe to auth changes.
  // (Subscription status comes from RevenueCat, not set here.)
  useEffect(() => {
    if (isPreviewMode || SCREENSHOT) return;
    let mounted = true;
    getSession().then(({
      data
    }) => {
      const u = data?.session?.user;
      if (mounted && u) setAuthUser(toAuthUser(u));
    });
    const {
      data: sub
    } = onAuthChange((session, event) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      if (session?.user) setAuthUser(toAuthUser(session.user));else setAuthUser(null);
    });
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Deep-link handler: email verification / password-reset links open the app via the
  // `outstandingpartner://auth/...?token_hash=&type=` custom scheme. We verify the token
  // (verifyOtp establishes a session) then route: recovery -> set-new-password screen;
  // signup/email -> verified, proceed into the app.
  useEffect(() => {
    if (isPreviewMode || SCREENSHOT) return;
    let mounted = true;
    let handle;
    const handleUrl = async (url) => {
      if (!url || !url.includes('token_hash')) return;
      let params;
      try { params = new URL(url).searchParams; }
      catch (e) { const q = url.split('?')[1] || ''; params = new URLSearchParams(q); }
      const tokenHash = params.get('token_hash');
      const type = params.get('type') || (/reset|recover/i.test(url) ? 'recovery' : 'signup');
      if (!tokenHash) return;
      try {
        const { data, error } = await verifyEmailOtp(tokenHash, type);
        if (!mounted) return;
        if (error) { setAuthError(error.message || 'This link is invalid or has expired. Request a new one.'); setAuthScreen('login'); return; }
        const u = data?.user || data?.session?.user;
        if (u) setAuthUser(toAuthUser(u));
        if (type === 'recovery') { setPasswordRecovery(true); setAuthScreen('reset'); }
        else { setPendingVerifyEmail(''); setAuthError(''); pushToast('✅', 'Email verified', 'Your account is confirmed — welcome!'); }
      } catch (e) {
        if (mounted) { setAuthError('Could not verify the link. Please try again.'); setAuthScreen('login'); }
      }
    };
    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.getLaunchUrl().then(res => { if (res?.url) handleUrl(res.url); }).catch(() => {});
      CapApp.addListener('appUrlOpen', (e) => handleUrl(e?.url)).then(h => { handle = h; });
    }).catch(() => {});
    return () => { mounted = false; if (handle) handle.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Native shell: status bar + Android hardware back button.
  
  // eslint-disable-line react-hooks/exhaustive-deps
  
  // Native shell: status bar + Android hardware back button.
  const navStateRef = useRef({
    legalView,
    tab
  });

  navStateRef.current = {
    legalView,
    tab
  };

  // Holds the latest verify-screen re-check, read by the app-resume listener (set up once).
  const verifyCheckRef = useRef(null);

  // Latest cycle start date, read by the once-registered resume listener to recompute the day.
  const cycleStartRef = useRef(cycleStartDate);
  cycleStartRef.current = cycleStartDate;

  useEffect(() => {
    if (!isNative()) return;
    initStatusBar();
    let handle;
    import('@capacitor/app').then(({
      App: CapApp
    }) => {
      CapApp.addListener('backButton', () => {
        const st = navStateRef.current;
        if (st.legalView) {
          setLegalView(null);
          return;
        }
        if (st.tab && st.tab !== 'today') {
          setTab('today');
          return;
        }
        CapApp.exitApp();
      }).then(h => {
        handle = h;
      });
    });
    return () => {
      if (handle) handle.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Re-check the subscription entitlement when the app returns to the foreground,
  // so a cancellation/expiry that happened while backgrounded flips access off.
  
  // eslint-disable-line react-hooks/exhaustive-deps
  
  // Re-check the subscription entitlement when the app returns to the foreground,
  // so a cancellation/expiry that happened while backgrounded flips access off.
  useEffect(() => {
    if (!isNative()) return;
    let handle;
    import('@capacitor/app').then(({
      App: CapApp
    }) => {
      CapApp.addListener('resume', () => {
        subscription.refresh?.();
        // If we're waiting on email verification (e.g. user just confirmed in a browser),
        // silently re-check so returning to the app picks up the verified status.
        const v = verifyCheckRef.current;
        if (v && v.authScreen === 'verify' && !v.authUser) v.check(true);
        // Re-derive the cycle day so a backgrounded app crossing midnight stays current.
        const d = getCycleDay(cycleStartRef.current);
        if (d != null) setCycleDay(d);
      }).then(h => {
        handle = h;
      });
    });
    return () => {
      if (handle) handle.remove();
    };
  }, [subscription.refresh]);
  
  useEffect(() => {
    safeSet("cycleDay", cycleDay);
  }, [cycleDay]);
  
  useEffect(() => {
    safeSet("cycleStartDate", cycleStartDate);
  }, [cycleStartDate]);

  // Auto-advance the cycle: derive the current day from the stored start date on every app
  // open (and whenever the start date changes), so "Day N of 28" + phase stay current.
  useEffect(() => {
    const d = getCycleDay(cycleStartDate);
    if (d != null) setCycleDay(d);
  }, [cycleStartDate]);

  useEffect(() => {
    safeSet("taskLog", JSON.stringify(taskLog));
  }, [taskLog]);
  
  useEffect(() => {
    safeSet("currentStreak", String(currentStreak));
  }, [currentStreak]);
  
  useEffect(() => {
    safeSet("longestStreak", String(longestStreak));
  }, [longestStreak]);
  
  useEffect(() => {
    safeSet("lastOpenDate", lastOpenDate);
  }, [lastOpenDate]);
  
  // Streak calculation on open
  
  // Streak calculation on open
  useEffect(() => {
    const today = getToday();
    if (lastOpenDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    if (lastOpenDate === yStr) {
      const ns = currentStreak + 1;
      setCurrentStreak(ns);
      if (ns > longestStreak) setLongestStreak(ns);
    } else if (lastOpenDate && lastOpenDate < yStr) {
      setShowRecovery(true);
      setCurrentStreak(1);
    } else {
      setCurrentStreak(1);
    }
    setLastOpenDate(today);
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    safeSet("wifeNeeds", JSON.stringify(wifeNeeds));
  }, [wifeNeeds]);
  
  useEffect(() => {
    safeSet("wifeName", wifeName);
  }, [wifeName]);
  
  useEffect(() => {
    safeSet("wifeNickname", wifeNickname);
  }, [wifeNickname]);
  
  useEffect(() => {
    safeSet("wifeBirthMonth", wifeBirthMonth);
  }, [wifeBirthMonth]);
  
  useEffect(() => {
    safeSet("wifeBirthDay", wifeBirthDay);
  }, [wifeBirthDay]);
  
  useEffect(() => {
    safeSet("wifeBirthYear", wifeBirthYear);
  }, [wifeBirthYear]);
  
  useEffect(() => {
    safeSet("anniversaryDate", anniversaryDate);
  }, [anniversaryDate]);
  
  useEffect(() => {
    safeSet("firstDateDate", firstDateDate);
  }, [firstDateDate]);
  
  useEffect(() => {
    safeSet("favRestaurant", favRestaurant);
  }, [favRestaurant]);
  
  useEffect(() => {
    safeSet("favFood", favFood);
  }, [favFood]);
  
  useEffect(() => {
    safeSet("favDrink", favDrink);
  }, [favDrink]);
  
  useEffect(() => {
    safeSet("favStarbucks", favStarbucks);
  }, [favStarbucks]);
  
  useEffect(() => {
    safeSet("favFlower", favFlower);
  }, [favFlower]);
  
  useEffect(() => {
    safeSet("favColor", favColor);
  }, [favColor]);
  
  useEffect(() => {
    safeSet("favMovie", favMovie);
  }, [favMovie]);
  
  useEffect(() => {
    safeSet("favShow", favShow);
  }, [favShow]);
  
  useEffect(() => {
    safeSet("favSong", favSong);
  }, [favSong]);
  
  useEffect(() => {
    safeSet("favArtist", favArtist);
  }, [favArtist]);
  
  useEffect(() => {
    safeSet("loveLanguage", loveLanguage);
  }, [loveLanguage]);
  
  useEffect(() => {
    safeSet("biggestDream", biggestDream);
  }, [biggestDream]);
  
  useEffect(() => {
    safeSet("biggestFear", biggestFear);
  }, [biggestFear]);
  
  useEffect(() => {
    safeSet("whatStresses", whatStresses);
  }, [whatStresses]);
  
  useEffect(() => {
    safeSet("whatLightsUp", whatLightsUp);
  }, [whatLightsUp]);
  
  useEffect(() => {
    safeSet("howSheFeelsLoved", howSheFeelsLoved);
  }, [howSheFeelsLoved]);
  
  useEffect(() => {
    safeSet("kidsNames", kidsNames);
  }, [kidsNames]);
  
  useEffect(() => {
    safeSet("petsNames", petsNames);
  }, [petsNames]);
  
  useEffect(() => {
    safeSet("herMom", herMom);
  }, [herMom]);
  
  useEffect(() => {
    safeSet("herDad", herDad);
  }, [herDad]);
  
  useEffect(() => {
    safeSet("herBestFriend", herBestFriend);
  }, [herBestFriend]);
  
  useEffect(() => {
    safeSet("husbandNotes", husbandNotes);
  }, [husbandNotes]);
  
  useEffect(() => {
    safeSet("weeklyScore", JSON.stringify(weeklyScore));
  }, [weeklyScore]);
  
  useEffect(() => {
    safeSet("sentTextIds", JSON.stringify(sentTextIds));
  }, [sentTextIds]);
  
  useEffect(() => {
    safeSet("sheSaidDone", JSON.stringify(sheSaidDone));
  }, [sheSaidDone]);
  
  useEffect(() => {
    safeSet("sheSaid", JSON.stringify(sheSaid));
  }, [sheSaid]);
  
  useEffect(() => {
    safeSet("challengeDay", challengeDay);
  }, [challengeDay]);
  
  useEffect(() => {
    safeSet("challengeStarted", challengeStarted ? "1" : "");
  }, [challengeStarted]);
  
  useEffect(() => {
    safeSet("completedDays", JSON.stringify(completedDays));
  }, [completedDays]);
  
  useEffect(() => {
    safeSet("activeReminders", JSON.stringify(activeReminders));
  }, [activeReminders]);
  
  useEffect(() => {
    safeSet("schedules", JSON.stringify(schedules));
  }, [schedules]);
  
  useEffect(() => {
    safeSet("coachHistory", JSON.stringify(coachHistory));
  }, [coachHistory]);
  
  useEffect(() => {
    safeSet("usedTaskIds", JSON.stringify(usedTaskIds));
  }, [usedTaskIds]);
  
  useEffect(() => {
    safeSet("usedTextIds", JSON.stringify(usedTextIds));
  }, [usedTextIds]);
  
  useEffect(() => {
    safeSet("suggestedTextTime", JSON.stringify(suggestedTextTime));
  }, [suggestedTextTime]);
  
  useEffect(() => {
    safeSet("subTier", subTier);
  }, [subTier]);
  
  useEffect(() => {
    safeSet("textTimeHistory", JSON.stringify(textTimeHistory));
  }, [textTimeHistory]);
  
  useEffect(() => {
    safeSet("lastTextDate", lastTextDate);
  }, [lastTextDate]);
  
  useEffect(() => {
    safeSet("lastActivityDate", lastActivityDate);
  }, [lastActivityDate]);
  
  useEffect(() => {
    if (textSentToday) safeSet("textSentToday", getToday());
  }, [textSentToday]);
  
  useEffect(() => {
    if (activityDoneThisWeek) safeSet("activityWeek", getWeekKey());
  }, [activityDoneThisWeek]);
  
  // Generate a new random suggested text time each day
  
  // Generate a new random suggested text time each day
  useEffect(() => {
    const today = getToday();
    if (!suggestedTextTime[today]) {
      // Random time pools by feel — morning, midday, afternoon, evening
      const pools = [["7:45 AM", "8:10 AM", "8:30 AM", "9:00 AM", "9:20 AM"],
      // morning
      ["11:30 AM", "12:05 PM", "12:20 PM", "12:45 PM", "1:10 PM"],
      // midday
      ["2:30 PM", "3:00 PM", "3:45 PM", "4:15 PM", "4:50 PM"],
      // afternoon
      ["5:30 PM", "6:00 PM", "6:20 PM", "7:00 PM", "7:30 PM"] // evening
      ];
      const dayOfYear = getDayOfYear(new Date());
      const poolIdx = dayOfYear % pools.length;
      const timeIdx = Math.floor(dayOfYear / pools.length) % pools[poolIdx].length;
      const time = pools[poolIdx][timeIdx];
      const label = poolIdx === 0 ? "Morning check-in" : poolIdx === 1 ? "Midday surprise" : poolIdx === 2 ? "Afternoon lift" : "Evening connection";
      const newEntry = {
        time,
        label,
        date: today
      };
      // Save today and move today to history if switching day
      const yesterday = Object.keys(suggestedTextTime)[0];
      if (yesterday && yesterday !== today) {
        setTextTimeHistory(prev => ({
          ...prev,
          [yesterday]: suggestedTextTime[yesterday]
        }));
      }
      setSuggestedTextTime({
        [today]: newEntry
      });
    }
  }, []);
  
  useEffect(() => {
    const monthKey = getMonthKey();
    const monthUsed = usedTaskIds[monthKey] || [];
    const task = getVarietyTask(monthUsed, phase.needs);
    setTodayTask(task);
    // Build variety texts for this week
    const weekKey = getWeekKey();
    const weekUsed = usedTextIds[weekKey] || [];
    setVarietyTexts(getVarietyTexts(weekUsed));
    const tl = taskLog.find(l => l.date === getToday());
    if (tl) {
      setTaskDone(true);
      setTaskRating(tl.rating);
    }
    // (Auth session is restored via Supabase in a dedicated effect above.)
    // Auto-load today's text and activity
    pickDailyText(0);
    pickDailyActivity(0);
  }, [cycleDay]);
  
  useEffect(() => {
    if ("Notification" in window) setNotifPermission(Notification.permission);
  }, []);
  
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const curDay = DAYS_OF_WEEK[now.getDay()];
      const curTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const lastFired = safeGetJSON("lastFired", {});
      ALL_REMINDERS().forEach(r => {
        if (!activeReminders[r.id]) return;
        const sched = schedules[r.id];
        const time = sched?.time || r.defaultTime;
        const days = sched?.days || r.defaultDays;
        const fk = `${r.id}-${getToday()}-${time}`;
        if (days.includes(curDay) && curTime === time && !lastFired[fk]) {
          safeSet("lastFired", JSON.stringify({
            ...lastFired,
            [fk]: true
          }));
          if (notifPermission === "granted") new Notification(`💪 ${r.title}`, {
            body: r.body
          });
          const id = Date.now();
          setToasts(prev => [...prev, {
            id,
            icon: r.icon,
            title: r.title,
            body: r.body
          }]);
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 8000);
        }
      });
    };
    intervalRef.current = setInterval(check, 30000);
    return () => clearInterval(intervalRef.current);
  }, [activeReminders, schedules, notifPermission]);
  
  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setNotifPermission(p);
  };
  
  const dismissToast = id => setToasts(prev => prev.filter(t => t.id !== id));
  
  const toggleNeed = need => setWifeNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
  
  const toggleReminder = id => setActiveReminders(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
  
  const updateSchedule = (id, data) => setSchedules(prev => ({
    ...prev,
    [id]: data
  }));
  
  const logTask = () => {
    const entry = {
      date: getToday(),
      task: todayTask?.task,
      taskId: todayTask?.id,
      rating: taskRating,
      note: taskNote,
      win: taskWin,
      phase: phase.label,
      neuro: todayTask?.neuro,
      worked: taskWorked,
      mood: taskMood
    };
    setTaskLog(prev => [entry, ...prev.filter(l => l.date !== getToday())]);
    const monthKey = getMonthKey();
    const prev = usedTaskIds[monthKey] || [];
    if (todayTask?.id && !prev.includes(todayTask.id)) setUsedTaskIds(p => ({
      ...p,
      [monthKey]: [...prev, todayTask.id]
    }));
    // Weekly score
    const wk = getWeekKey();
    setWeeklyScore(p => ({
      ...p,
      [wk]: (p[wk] || 0) + 1
    }));
    setTaskDone(true);
    setShowLogForm(false);
    setTaskWorked(null);
    setTaskMood("");
    setTaskWin("");
  };
  
  // ── Cadence helpers ───────────────────────────────────────────────────────
  
  // ── Cadence helpers ───────────────────────────────────────────────────────
  const getDaysBetween = dateStr => {
    if (!dateStr) return 999;
    return Math.floor((new Date() - new Date(dateStr)) / 864e5);
  };
  
  // Text cadence: every 2-3 days, alternates so it never feels mechanical
  // Uses week number to decide — odd weeks = every 2 days, even weeks = every 3 days
  
  // Text cadence: every 2-3 days, alternates so it never feels mechanical
  // Uses week number to decide — odd weeks = every 2 days, even weeks = every 3 days
  const getTextCadenceDays = () => {
    const weekNum = parseInt(getWeekKey().split("-W")[1] || "1");
    return weekNum % 2 === 0 ? 3 : 2;
  };
  
  // Is it a text day?
  
  // Is it a text day?
  const isTextDay = () => {
    const days = getDaysBetween(lastTextDate);
    return days >= getTextCadenceDays();
  };
  
  // Is it an activity week? (once per week, suggested Thu/Fri so he has the weekend)
  
  // Is it an activity week? (once per week, suggested Thu/Fri so he has the weekend)
  const isActivityWeek = () => {
    return safeGet("activityWeek", "") !== getWeekKey();
  };
  
  // Days until next text
  
  // Days until next text
  const daysUntilNextText = () => {
    const days = getDaysBetween(lastTextDate);
    const cadence = getTextCadenceDays();
    return Math.max(0, cadence - days);
  };
  
  // Pick the phase-matched text — filtered hard to her current phase
  
  // Pick the phase-matched text — filtered hard to her current phase
  const pickDailyText = (offset = 0) => {
    // Phase-specific pools — strict match first, then phase-adjacent, then full
    const phaseStrict = EXTENDED_TEXTS.filter(t => (t.needs || []).some(n => (phase.needs || []).includes(n)) && (phase.key === "menstrual" ? ["sweet", "supportive", "deep"].includes(t.mood) : phase.key === "follicular" ? ["playful", "deep", "affirming"].includes(t.mood) : phase.key === "ovulation" ? ["sweet", "affirming", "deep"].includes(t.mood) : ["supportive", "deep", "affirming"].includes(t.mood)));
    const base = getDayOfYear(new Date());
    const pool = phaseStrict.length >= 4 ? phaseStrict : EXTENDED_TEXTS.filter(t => (t.needs || []).some(n => (phase.needs || []).includes(n))).length >= 4 ? EXTENDED_TEXTS.filter(t => (t.needs || []).some(n => (phase.needs || []).includes(n))) : EXTENDED_TEXTS;
    const t = pool[(base + offset) % pool.length];
    if (!t) return;
    setDailyTextMsg(t.text);
    setDailyTextMeta({
      feel: (TEXT_SHC[t.id] || [])[0] || "",
      pillar: TASK_LPP[t.id] || "",
      neuro: t.neuro || [],
      why: t.why || "",
      mood: t.mood || "",
      phase: phase.label
    });
    setDailyTextCopied(false);
  };
  
  // Mark text as sent and update cadence
  
  // Mark text as sent and update cadence
  const markTextSent = () => {
    const today = getToday();
    setLastTextDate(today);
    setTextSentToday(true);
    safeSet("lastTextDate", today);
    safeSet("textSentToday", today);
  };
  
  // Pick phase-matched activity for the week
  
  // Pick phase-matched activity for the week
  const pickDailyActivity = (offset = 0) => {
    // Strict phase match — activity must align with what she needs this week
    const phaseActivityMap = {
      menstrual: a => a.chems.includes("oxytocin") || a.chems.includes("serotonin"),
      // comfort, warmth
      follicular: a => a.chems.includes("dopamine") || a.chems.includes("endorphins"),
      // fun, novelty
      ovulation: a => a.chems.includes("oxytocin") || a.chems.includes("dopamine"),
      // connection, romance
      luteal: a => a.chems.includes("serotonin") || a.chems.includes("oxytocin") // calm, service
    };
    const phaseFilter = phaseActivityMap[phase.key] || (() => true);
    const phaseMatch = HOME_ACTIVITIES.filter(a => (a.needs || []).some(n => (phase.needs || []).includes(n)) && phaseFilter(a));
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
      feels: (a.needs || []).map(n => {
        if (n === "love" || n === "connection") return "chosen";
        if (n === "significance") return "seen";
        if (n === "certainty") return "safe";
        if (n === "variety" || n === "growth") return "alive";
        return "chosen";
      })[0] || "chosen",
      pillar: a.chems?.includes("oxytocin") ? "protect" : a.chems?.includes("dopamine") ? "lead" : "provide",
      neuro: a.scienceNote,
      chems: a.chems,
      description: a.description,
      phaseReason: getActivityPhaseReason(phase.key)
    });
  };
  
  // Natural intro lines by phase — not generic
  
  // Natural intro lines by phase — not generic
  const getActivityIntro = (phaseKey, activityName) => {
    const lines = {
      menstrual: ["Hey, I planned something low-key for us tonight. Nothing you have to do.", "I've got us something easy and warm tonight.", "No pressure tonight — I've got something simple planned for us."],
      follicular: [`I want to try something with you tonight — you in?`, "I booked us something fun. Clear your evening.", "I've got a plan for tonight. You're going to like it."],
      ovulation: ["I've got tonight handled. Dress how you want to feel.", "Clear tonight. I've planned something for us.", "I want to spend the evening with you. I've taken care of it."],
      luteal: ["Tonight I'm taking everything off your plate. You just have to show up.", "I've got tonight covered. All you need to do is be there.", "I planned something for us. Nothing for you to organize."]
    };
    const pool = lines[phaseKey] || lines.follicular;
    return pool[getDayOfYear(new Date()) % pool.length];
  };
  
  // Why this activity fits this phase — shown to him as context
  
  // Why this activity fits this phase — shown to him as context
  const getActivityPhaseReason = phaseKey => {
    return {
      menstrual: "She's in her rest phase — her body needs warmth and low demand. This activity gives her comfort without pressure.",
      follicular: "Her energy is rising and she's open to new things. This activity meets her curiosity and desire for novelty.",
      ovulation: "She's at peak connection and wants to feel chosen. This activity creates the closeness she craves this week.",
      luteal: "She's pre-menstrual and her nervous system is sensitive. This activity calms, reassures, and reduces her load."
    }[phaseKey] || "";
  };
  
  // Mark activity as done for this week
  
  // Mark activity as done for this week
  const markActivityDone = () => {
    const wk = getWeekKey();
    setActivityDoneThisWeek(true);
    setLastActivityDate(getToday());
    safeSet("activityWeek", wk);
    safeSet("lastActivityDate", getToday());
  };
  
  const pickGenText = (offset = 0) => {
    const base = getDayOfYear(new Date());
    const phaseMatch = EXTENDED_TEXTS.filter(t => (t.needs || []).some(n => (phase.needs || []).includes(n)));
    const pool = phaseMatch.length >= 5 ? phaseMatch : EXTENDED_TEXTS;
    const t = pool[(base + offset) % pool.length];
    setGenText(t);
    setGenCopied(false);
  };
  
  // ─── Auth Handlers ────────────────────────────────────────────
  // In preview/artifact mode (no API_URL) — bypass auth automatically
  
  // ─── Auth Handlers ────────────────────────────────────────────
  // In preview/artifact mode (no API_URL) — bypass auth automatically
  
  const handleLogin = async () => {
    if (isPreviewMode) {
      // Dev bypass — skip auth, go straight in
      setAuthUser({
        id: "preview",
        email: authEmail || "preview@outstandingpartner.app",
        name: "Preview"
      });
      setSubscribed(true);
      safeSet("subscribed", "1");
      return;
    }
    if (!authEmail || !authPassword) {
      setAuthError("Please enter your email and password.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const {
        data,
        error
      } = await signIn(authEmail, authPassword);
      if (error) {
        // Unverified account → route to the verify screen with a resend option.
        if (error.code === 'email_not_confirmed' || /not confirmed/i.test(error.message || '')) {
          setPendingVerifyEmail(authEmail);
          setAuthScreen("verify");
          setAuthError("");
          setAuthLoading(false);
          return;
        }
        setAuthError(error.message || "Login failed. Check your email and password.");
        setAuthLoading(false);
        return;
      }
      setAuthUser(toAuthUser(data.user));
      // Access is granted by the RevenueCat 'premium' entitlement (see useSubscription).
    } catch (e) {
      setAuthError("Connection error. Please try again.");
    }
    setAuthLoading(false);
  };
  
  const handleSignup = async () => {
    if (isPreviewMode) {
      setAuthUser({
        id: "preview",
        email: authEmail || "preview@outstandingpartner.app",
        name: authName || "Preview"
      });
      setSubscribed(true);
      safeSet("subscribed", "1");
      return;
    }
    if (!authName) {
      setAuthError("Please enter your first name.");
      return;
    }
    if (!authEmail || !authEmail.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    if (!authPassword || authPassword.length < 8) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const {
        data,
        error
      } = await signUp(authEmail, authPassword, authName);
      if (error) {
        setAuthError(error.message || "Signup failed. Try a different email.");
        setAuthLoading(false);
        return;
      }
      // Supabase anti-enumeration: signing up with an ALREADY-registered email returns a user
      // with an empty identities[] and no email is sent. Detect it and tell the user to sign in
      // instead of showing the "check your email" screen for an email that never goes out.
      const alreadyRegistered = data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;
      if (alreadyRegistered) {
        setAuthError("An account with this email already exists. Please sign in.");
        setAuthScreen("login");
        setAuthLoading(false);
        return;
      }
      if (data.session && data.user) {
        // Email confirmation disabled → session is live immediately.
        setAuthUser(toAuthUser(data.user));
        // Access is granted by the RevenueCat 'premium' entitlement (see useSubscription).
      } else {
        // Email confirmation enabled → hard gate: show the "verify your email" screen.
        setPendingVerifyEmail(authEmail);
        setAuthScreen("verify");
        setAuthError("");
      }
    } catch (e) {
      setAuthError("Connection error. Please try again.");
    }
    setAuthLoading(false);
  };
  
  const handleForgot = async () => {
    if (isPreviewMode) {
      setAuthError("Reset link sent — check your inbox.");
      return;
    }
    if (!authEmail) {
      setAuthError("Enter your email address first.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const {
        error
      } = await sendPasswordReset(authEmail);
      setAuthError(error ? error.message || "Could not send reset email." : "Reset link sent — check your inbox.");
    } catch (e) {
      setAuthError("Connection error. Please try again.");
    }
    setAuthLoading(false);
  };

  // Re-send the signup verification email (from the "verify" screen).
  const handleResendVerification = async () => {
    const email = pendingVerifyEmail || authEmail;
    if (isPreviewMode) { setAuthError("Verification email sent — check your inbox."); return; }
    if (!email) { setAuthError("Enter your email address first."); return; }
    setAuthLoading(true);
    setAuthError("");
    try {
      const { error } = await resendVerification(email);
      setAuthError(error ? (error.message || "Could not resend the email.") : "Verification email sent — check your inbox.");
    } catch (e) {
      setAuthError("Connection error. Please try again.");
    }
    setAuthLoading(false);
  };

  // Re-check verification status (used by the "I've verified — Continue" button and on app resume).
  // If the user confirmed in a browser, there's no session in the app yet — so we try to sign in
  // with the credentials still in memory. `silent` suppresses messaging for the resume auto-check.
  const handleCheckVerification = async (silent = false) => {
    if (isPreviewMode) return;
    if (!authEmail || !authPassword) {
      // Credentials not in memory (e.g. app was reopened) — send them to sign in instead.
      if (!silent) { setAuthScreen("login"); setAuthError("Your email is verified — please sign in."); }
      return;
    }
    if (!silent) { setAuthLoading(true); setAuthError(""); }
    try {
      const { data, error } = await signIn(authEmail, authPassword);
      if (error) {
        if (!silent) {
          if (error.code === 'email_not_confirmed' || /not confirmed/i.test(error.message || '')) {
            setAuthError("Not verified yet — tap the link in your email first.");
          } else {
            setAuthError(error.message || "Couldn’t verify. Please sign in.");
          }
        }
        if (!silent) setAuthLoading(false);
        return;
      }
      setAuthUser(toAuthUser(data.user)); // verified → session established → app proceeds
    } catch (e) {
      if (!silent) setAuthError("Connection error. Please try again.");
    }
    if (!silent) setAuthLoading(false);
  };
  // Keep the resume listener's re-check pointed at current state.
  verifyCheckRef.current = { authScreen, authUser, check: handleCheckVerification };

  // Set a new password after a recovery deep link (the recovery session is already active).
  const handleResetPassword = async (newPw) => {
    if (!newPw || newPw.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
    setAuthLoading(true);
    setAuthError("");
    try {
      const { error } = await updatePassword(newPw);
      if (error) { setAuthError(error.message || "Could not update password."); setAuthLoading(false); return; }
      // Session stays active → clearing recovery lets AppShell route into the app.
      setPasswordRecovery(false);
      setAuthScreen("login");
      setAuthError("");
      pushToast('✅', 'Password updated', 'You can now use your new password.');
    } catch (e) {
      setAuthError("Connection error. Please try again.");
    }
    setAuthLoading(false);
  };

  // Change password for the signed-in user (Profile). Returns { ok, error } for the modal.
  const handleChangePassword = async (newPw) => {
    if (isPreviewMode) return { ok: true };
    if (!newPw || newPw.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    try {
      const { error } = await updatePassword(newPw);
      if (error) return { ok: false, error: error.message || "Could not update password." };
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Connection error. Please try again." };
    }
  };

  const handleSubscribe = async (plan = "basic") => {
    if (isPreviewMode) {
      setSubscribed(true);
      safeSet("subscribed", "1");
      const tier = plan === "premium" ? "premium" : "basic";
      setSubTier(tier);
      safeSet("subTier", tier);
      setSubLoading(false);
      return;
    }
    setSubLoading(true);
    try {
      const token = safeGet("authToken", "");
      const res = await fetch(`${API_URL}/api/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-secret": APP_SECRET,
          "x-auth-token": token
        },
        body: JSON.stringify({
          email: authUser?.email,
          plan: "monthly"
        })
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          if (attempts > 100) {
            clearInterval(poll);
            setSubLoading(false);
            return;
          }
          try {
            const check = await fetch(`${API_URL}/api/billing/status`, {
              headers: {
                "x-app-secret": APP_SECRET,
                "x-auth-token": token
              }
            });
            const status = await check.json();
            if (status.subscribed) {
              setSubscribed(true);
              safeSet("subscribed", "1");
              clearInterval(poll);
              setSubLoading(false);
            }
          } catch (e) {}
        }, 3000);
      }
    } catch (e) {
      setSubLoading(false);
    }
  };
  
  const pickDateIdea = (offset = 0) => {
    const base = getDayOfYear(new Date());
    // Use dedicated DATE_IDEAS pool — separate from tonight's activities
    const phaseMatch = DATE_IDEAS.filter(a => (a.needs || []).some(n => (phase.needs || []).includes(n)));
    const pool = phaseMatch.length >= 3 ? phaseMatch : DATE_IDEAS;
    const a = pool[(base + offset) % pool.length];
    setDateIdea(a);
  };
  
  const generateAIText = async () => {
    setAiLoading(true);
    setAiText("");
    try {
      const needs = wifeNeeds.length > 0 ? wifeNeeds.join(", ") : phase.needs.join(", ");
      const zodiacCtx = zodiac ? `Her Western zodiac is ${zodiac.sign} (${zodiac.element} sign). ${zodiac.textsLike}` : "";
      const czCtx = chineseZodiac ? `Her Chinese zodiac is the ${chineseZodiac.sign}. ${chineseZodiac.loveStyle}` : "";
      const r = await fetchAI(`You are helping a husband write a text to his wife that makes her feel SEEN, HEARD, CHOSEN, SAFE, ALIVE, and FEMININE.
  
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
      setAiText(r || "");
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };
  
  const generateAIActivity = async () => {
    setActivityLoading(true);
    setAiActivity("");
    try {
      const needs = wifeNeeds.length > 0 ? wifeNeeds.join(", ") : phase.needs.join(", ");
      const zodiacCtx = zodiac ? `Western zodiac: ${zodiac.sign} — she loves: ${zodiac.dateIdeas.join(", ")}` : "";
      const czCtx = chineseZodiac ? `Chinese zodiac: ${chineseZodiac.sign} — ideal experiences: ${chineseZodiac.gifts.join(", ")}` : "";
      const r = await fetchAI(`You are helping a husband plan an activity that makes his wife feel SEEN, HEARD, CHOSEN, SAFE, ALIVE, and FEMININE — while he shows up as a man who Leads, Protects, and Provides.
  
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
      setAiActivity(r || "");
    } catch (e) {
      console.error(e);
    } finally {
      setActivityLoading(false);
    }
  };
  
  const parseAIText = raw => {
    const lines = raw.split("\n").filter(l => l.trim());
    const ni = lines.findIndex(l => l.startsWith("NEURO:"));
    const fi = lines.findIndex(l => l.startsWith("MAKES HER FEEL:"));
    const pi = lines.findIndex(l => l.startsWith("HIS PILLAR:"));
    const msgLines = lines.filter((_, i) => i !== ni && i !== fi && i !== pi && lines[i] && !lines[i].startsWith("MAKES HER FEEL") && !lines[i].startsWith("HIS PILLAR") && !lines[i].startsWith("NEURO:"));
    return {
      msg: msgLines.join(" ") || raw,
      neuro: ni >= 0 ? lines[ni].replace("NEURO:", "").trim() : "",
      feels: fi >= 0 ? lines[fi].replace("MAKES HER FEEL:", "").trim() : "",
      pillar: pi >= 0 ? lines[pi].replace("HIS PILLAR:", "").trim() : ""
    };
  };
  
  const parseAIActivity = raw => {
    const get = k => {
      const m = raw.match(new RegExp(`${k}:\\s*(.+?)(?=\\n[A-Z ]+:|$)`, "s"));
      return m ? m[1].trim() : "";
    };
    return {
      activity: get("ACTIVITY"),
      what: get("WHAT TO DO"),
      feels: get("MAKES HER FEEL"),
      pillar: get("HIS PILLAR"),
      neuro: get("NEURO IMPACT"),
      tip: get("PRO TIP")
    };
  };
  
  const allReminders = ALL_REMINDERS();
  
  const filteredReminders = reminderCat === "all" ? allReminders : allReminders.filter(r => r.category === reminderCat);
  
  const activeCount = Object.values(activeReminders).filter(Boolean).length;
  
  const parsedAI = aiText ? parseAIText(aiText) : null;
  
  const renderCalendar = () => {
    const days = Array.from({
      length: 28
    }, (_, i) => i + 1);
    return <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 6
    }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} style={{
        textAlign: "center",
        fontSize: 11,
        color: "#666",
        fontWeight: 700,
        padding: "4px 0"
      }}>{d}</div>)}
          {days.map(day => {
        const p = getCurrentPhase(day);
        const it = day === cycleDay;
        return <div key={day} onClick={() => setCycleDay(day)} style={{
          background: it ? p.color : `${p.color}20`,
          color: it ? "#fff" : p.color,
          borderRadius: 10,
          padding: "8px 4px",
          textAlign: "center",
          fontSize: 13,
          fontWeight: it ? 700 : 500,
          cursor: "pointer",
          border: it ? `2px solid ${p.color}` : "2px solid transparent",
          transition: "all 0.2s"
        }}>{day}</div>;
      })}
        </div>;
  };
  
  const tabs = [{
    id: "today",
    icon: "🌅",
    label: "Today"
  }, {
    id: "texts",
    icon: "💬",
    label: "Texts"
  }, {
    id: "home",
    icon: "🎲",
    label: "Activities"
  }, {
    id: "coach",
    icon: "📚",
    label: "Guide"
  }, {
    id: "log",
    icon: "📓",
    label: "Log"
  }, {
    id: "reminders",
    icon: "🔔",
    label: "Remind"
  }, {
    id: "profile",
    icon: "⭐",
    label: "Profile"
  }];
  
  // ─── Profile Tab Sections ─────────────────────────────────────────────────

  const value = {
    hasSupabase,
    signIn,
    signUp,
    signOutUser,
    sendPasswordReset,
    getSession,
    onAuthChange,
    toAuthUser,
    useCloudSync,
    deleteAccount,
    getUserSubscription,
    useSubscription,
    rcLogOut,
    initStatusBar,
    isNative,
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
    ALL_REMINDERS,
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
    getVarietyTexts,
    NeedBadge,
    NeuroBadge,
    PremiumGate,
    SHCBadge,
    SHCRow,
    LPPBadge,
    NeuroPanel,
    PhaseCard,
    ReminderCard,
    tab,
    setTab,
    onboarded,
    setOnboarded,
    authScreen,
    setAuthScreen,
    authUser,
    setAuthUser,
    emailVerified,
    pendingVerifyEmail,
    setPendingVerifyEmail,
    passwordRecovery,
    setPasswordRecovery,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authName,
    setAuthName,
    authLoading,
    setAuthLoading,
    authError,
    setAuthError,
    subscribed,
    setSubscribed,
    subscriptionReady,
    subscriptionPlan: subscription.plan,
    lifetimeAccess,
    setLifetimeAccess,
    selectedPlan,
    setSelectedPlan,
    subMsg,
    setSubMsg,
    codeInput,
    setCodeInput,
    redeeming,
    setRedeeming,
    subTier,
    setSubTier,
    subLoading,
    setSubLoading,
    cycleDay,
    setCycleDay,
    wifeName,
    setWifeName,
    wifeNickname,
    setWifeNickname,
    wifeBirthMonth,
    setWifeBirthMonth,
    wifeBirthDay,
    setWifeBirthDay,
    wifeBirthYear,
    setWifeBirthYear,
    cycleStartDate,
    setCycleStartDate,
    handleCycleStart,
    taskLog,
    setTaskLog,
    wifeNeeds,
    setWifeNeeds,
    level2Completed,
    setLevel2Completed,
    level3Completed,
    setLevel3Completed,
    diagnosticStep,
    setDiagnosticStep,
    todayActivity,
    setTodayActivity,
    anniversaryDate,
    setAnniversaryDate,
    firstDateDate,
    setFirstDateDate,
    favRestaurant,
    setFavRestaurant,
    favFood,
    setFavFood,
    favDrink,
    setFavDrink,
    favStarbucks,
    setFavStarbucks,
    favFlower,
    setFavFlower,
    favColor,
    setFavColor,
    favMovie,
    setFavMovie,
    favShow,
    setFavShow,
    favSong,
    setFavSong,
    favArtist,
    setFavArtist,
    loveLanguage,
    setLoveLanguage,
    biggestDream,
    setBiggestDream,
    biggestFear,
    setBiggestFear,
    whatStresses,
    setWhatStresses,
    whatLightsUp,
    setWhatLightsUp,
    howSheFeelsLoved,
    setHowSheFeelsLoved,
    kidsNames,
    setKidsNames,
    petsNames,
    setPetsNames,
    herMom,
    setHerMom,
    herDad,
    setHerDad,
    herBestFriend,
    setHerBestFriend,
    husbandNotes,
    setHusbandNotes,
    weeklyScore,
    setWeeklyScore,
    husbandMood,
    setHusbandMood,
    sheSaid,
    setSheSaid,
    sheSaidInput,
    setSheSaidInput,
    diagnosticAnswers,
    setDiagnosticAnswers,
    diagnosticResult,
    setDiagnosticResult,
    diagnosticLoading,
    setDiagnosticLoading,
    diagnosticDone,
    setDiagnosticDone,
    showResetConfirm,
    setShowResetConfirm,
    legalView,
    setLegalView,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteLoading,
    setDeleteLoading,
    handleDeleteAccount,
    challengeDay,
    setChallengeDay,
    challengeStarted,
    setChallengeStarted,
    completedDays,
    setCompletedDays,
    showChallenge,
    setShowChallenge,
    showScripts,
    setShowScripts,
    activityFilter,
    setActivityFilter,
    sentTextIds,
    setSentTextIds,
    sheSaidDone,
    setSheSaidDone,
    replayGuide,
    setReplayGuide,
    onboardSlide,
    setOnboardSlide,
    todayTask,
    setTodayTask,
    taskDone,
    setTaskDone,
    taskRating,
    setTaskRating,
    taskNote,
    setTaskNote,
    showLogForm,
    setShowLogForm,
    logRating,
    setLogRating,
    logNote,
    setLogNote,
    currentStreak,
    setCurrentStreak,
    longestStreak,
    setLongestStreak,
    lastOpenDate,
    setLastOpenDate,
    showRecovery,
    setShowRecovery,
    dateDoneMonth,
    setDateDoneMonth,
    aiText,
    setAiText,
    aiLoading,
    setAiLoading,
    taskWorked,
    setTaskWorked,
    taskMood,
    setTaskMood,
    taskWin,
    setTaskWin,
    expandedLog,
    setExpandedLog,
    expandedText,
    setExpandedText,
    usedTaskIds,
    setUsedTaskIds,
    usedTextIds,
    setUsedTextIds,
    varietyTexts,
    setVarietyTexts,
    showNeuroGuide,
    setShowNeuroGuide,
    coachHistory,
    setCoachHistory,
    homeChemFilter,
    setHomeChemFilter,
    dailyTextMsg,
    setDailyTextMsg,
    dailyTextMeta,
    setDailyTextMeta,
    dailyTextLoading,
    setDailyTextLoading,
    dailyTextCopied,
    setDailyTextCopied,
    showTextOptions,
    setShowTextOptions,
    suggestedTextTime,
    setSuggestedTextTime,
    textTimeHistory,
    setTextTimeHistory,
    lastTextDate,
    setLastTextDate,
    lastActivityDate,
    setLastActivityDate,
    textSentToday,
    setTextSentToday,
    activityDoneThisWeek,
    setActivityDoneThisWeek,
    textCadenceDays,
    textOffset,
    setTextOffset,
    genOffset,
    setGenOffset,
    genText,
    setGenText,
    genCopied,
    setGenCopied,
    dateOffset,
    setDateOffset,
    dateIdea,
    setDateIdea,
    dailyActivity,
    setDailyActivity,
    dailyActivityLoading,
    setDailyActivityLoading,
    activityOffset,
    setActivityOffset,
    activeReminders,
    setActiveReminders,
    schedules,
    setSchedules,
    reminderCat,
    setReminderCat,
    toasts,
    setToasts,
    notifPermission,
    setNotifPermission,
    profileSection,
    setProfileSection,
    intervalRef,
    phase,
    zodiac,
    chineseZodiac,
    lifePathNum,
    numerology,
    isPreviewMode,
    SCREENSHOT,
    isPremium,
    subscription,
    navStateRef,
    requestPermission,
    dismissToast,
    toggleNeed,
    toggleReminder,
    updateSchedule,
    logTask,
    getDaysBetween,
    getTextCadenceDays,
    isTextDay,
    isActivityWeek,
    daysUntilNextText,
    pickDailyText,
    markTextSent,
    pickDailyActivity,
    getActivityIntro,
    getActivityPhaseReason,
    markActivityDone,
    pickGenText,
    handleLogin,
    handleSignup,
    handleForgot,
    handleResendVerification,
    handleCheckVerification,
    handleResetPassword,
    handleChangePassword,
    handleSubscribe,
    pickDateIdea,
    generateAIText,
    generateAIActivity,
    parseAIText,
    parseAIActivity,
    allReminders,
    filteredReminders,
    activeCount,
    parsedAI,
    renderCalendar,
    tabs,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
