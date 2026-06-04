// AUTO-EXTRACTED from the original single-file app during Phase 2 refactor.
// Content preserved verbatim; only `export` added and modules split by concern.

import { useState, useEffect, useRef } from 'react';
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
} from '../utils/helpers.js';

export function NeedBadge({need}) {
  return <span style={{background:NEED_COLORS[need]+"22",color:NEED_COLORS[need],border:`1px solid ${NEED_COLORS[need]}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{need}</span>;
}

export function NeuroBadge({chem,showLabel=false}) {
  const n=NEURO[chem];
  return <span style={{background:n.color+"20",color:n.color,border:`1px solid ${n.color}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{n.emoji}{showLabel?` ${n.label}`:""}</span>;
}

export function PremiumGate({onUpgrade, feature="This feature"}) {
  return (
    <div style={{background:"linear-gradient(135deg,#1a0a1a,#0d0d0d)",border:"1px solid #8e44ad40",borderRadius:16,padding:24,textAlign:"center"}}>
      <div style={{fontSize:28,marginBottom:8}}>👑</div>
      <div style={{fontSize:16,fontWeight:700,color:"#f0ece4",marginBottom:6,fontFamily:"'Playfair Display',serif"}}>{feature}</div>
      <div style={{fontSize:13,color:"#888",lineHeight:1.6,marginBottom:20}}>This is a <strong style={{color:"#8e44ad"}}>Premium Plan</strong> feature — your AI relationship strategist, available 24/7. Upgrade for personalized AI advice, weekly reports, and monthly game plans built around your wife specifically.</div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div style={{flex:1,background:"#1a1a2a",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#555",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Current</div>
          <div style={{fontSize:18,fontWeight:800,color:"#666"}}>$21.99</div>
          <div style={{fontSize:10,color:"#444"}}>System Plan</div>
        </div>
        <div style={{flex:1,background:"#1a0a1a",border:"1.5px solid #8e44ad50",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#8e44ad",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Upgrade</div>
          <div style={{fontSize:18,fontWeight:800,color:"#8e44ad"}}>$49.99</div>
          <div style={{fontSize:10,color:"#8e44ad80"}}>Premium Plan</div>
        </div>
      </div>
      <button onClick={onUpgrade} style={{width:"100%",background:"linear-gradient(135deg,#8e44ad,#c0392b)",color:"#fff",border:"none",borderRadius:12,padding:"13px 16px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
        Upgrade to Premium Plan
      </button>
    </div>
  );
}


export function SHCBadge({type}) {
  if(!type||!SHC[type]) return null;
  const s=SHC[type];
  return <span style={{background:s.color+"20",color:s.color,border:`1px solid ${s.color}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{s.emoji} {s.label}</span>;
}

export function SHCRow({types}) {
  if(!types||types.length===0) return null;
  return (
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
      {types.map(t=><SHCBadge key={t} type={t}/>)}
    </div>
  );
}

export function LPPBadge({type}) {
  if(!type||!LPP[type]) return null;
  const p=LPP[type];
  return <span style={{background:p.color+"20",color:p.color,border:`1px solid ${p.color}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{p.emoji} {p.label}</span>;
}

export function NeuroPanel({chems,why,taskId}) {
  const shcTypes = taskId ? (TASK_SHC[taskId]||[]) : [];
  const lppType  = taskId ? (TASK_LPP[taskId]||null) : null;
  return (
    <div style={{background:"#111",border:"1px solid #2a2a2a",borderRadius:12,padding:"12px 14px",marginTop:10}}>
      {/* Brain chemicals */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
        {chems.map(c=><NeuroBadge key={c} chem={c} showLabel/>)}
      </div>
      {/* SHC + LPP row */}
      {(shcTypes.length>0||lppType)&&(
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8,paddingTop:6,borderTop:"1px solid #1e1e1e"}}>
          {shcTypes.map(t=><SHCBadge key={t} type={t}/>)}
          {lppType&&<LPPBadge type={lppType}/>}
        </div>
      )}
      <div style={{fontSize:12,color:"#888",lineHeight:1.6,fontStyle:"italic"}}>🧠 {why}</div>
    </div>
  );
}

export function PhaseCard({phase, showNeeds=false}) {
  const [expanded, setExpanded] = useState(false);
  const wn = phase.whatSheNeeds;
  return (
    <div style={{marginBottom:24}}>
      {/* What She Needs headline — above everything */}
      {wn&&(
        <div style={{background:`${phase.color}22`,border:`1.5px solid ${phase.color}50`,borderRadius:16,padding:"14px 18px",marginBottom:10}}>
          <div style={{fontSize:10,color:phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:4}}>What She Needs Right Now</div>
          <div style={{fontSize:16,fontWeight:700,color:"#f0ece4",fontFamily:"'Playfair Display',serif",lineHeight:1.3,marginBottom:10}}>{wn.headline}</div>
          {/* From you — top priority */}
          <div style={{marginBottom:8}}>
            <div style={{fontSize:10,color:phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>From You</div>
            {wn.fromYou.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
                <span style={{color:phase.color,fontWeight:700,flexShrink:0,fontSize:13}}>→</span>
                <span style={{fontSize:13,color:"#ddd",lineHeight:1.5}}>{item}</span>
              </div>
            ))}
          </div>
          {/* Expand for more */}
          <button onClick={()=>setExpanded(v=>!v)} style={{background:"transparent",border:`1px solid ${phase.color}40`,borderRadius:10,padding:"5px 12px",fontSize:11,color:phase.color,cursor:"pointer",fontWeight:600}}>
            {expanded?"▲ Less":"▼ Full breakdown"}
          </button>
          {expanded&&(
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
              {[{label:"Physical needs",items:wn.physical},{label:"Emotional needs",items:wn.emotional},{label:"Avoid this",items:wn.avoid,warn:true}].map(section=>(
                <div key={section.label}>
                  <div style={{fontSize:10,color:section.warn?"#e74c3c":phase.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>{section.label}</div>
                  {section.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:4}}>
                      <span style={{color:section.warn?"#e74c3c":phase.color,flexShrink:0,fontSize:12}}>{section.warn?"✕":"·"}</span>
                      <span style={{fontSize:12,color:section.warn?"#c0392b":"#bbb",lineHeight:1.5}}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Phase card */}
      <div style={{background:`linear-gradient(135deg,${phase.color}14,${phase.color}06)`,border:`1.5px solid ${phase.color}35`,borderRadius:16,padding:"16px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <span style={{fontSize:28}}>{phase.emoji}</span>
          <div>
            <div style={{fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:"0.1em"}}>Current Phase</div>
            <div style={{fontSize:20,fontWeight:700,color:phase.color,fontFamily:"'Playfair Display',serif"}}>{phase.label} Phase</div>
          </div>
        </div>
        <p style={{color:"#ccc",fontSize:13,lineHeight:1.6,margin:"6px 0 10px"}}>{phase.tip}</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{phase.needs.map(n=><NeedBadge key={n} need={n}/>)}</div>
      </div>
    </div>
  );
}

// ─── Reminder Card ────────────────────────────────────────────────────────────

export function ReminderCard({reminder,active,scheduleData,onToggle,onScheduleChange,phaseKey}) {
  const [expanded,setExpanded] = useState(false);
  const isPhase = reminder.phases.includes("all")||reminder.phases.includes(phaseKey);
  return (
    <div style={{background:active?"#1a1a1a":"#141414",border:`1.5px solid ${active?(isPhase?"#c0392b60":"#333"):"#222"}`,borderRadius:16,overflow:"hidden",marginBottom:10,opacity:active?1:0.75}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpanded(e=>!e)}>
        <span style={{fontSize:24,minWidth:32}}>{reminder.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,color:active?"#f0ece4":"#888",marginBottom:4}}>{reminder.title}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {reminder.neuro.map(c=><NeuroBadge key={c} chem={c}/>)}
            {isPhase&&<span style={{background:"#c0392b20",color:"#c0392b",border:"1px solid #c0392b40",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>THIS PHASE</span>}
          </div>
        </div>
        <div onClick={e=>{e.stopPropagation();onToggle();}} style={{width:44,height:26,borderRadius:13,cursor:"pointer",position:"relative",flexShrink:0,background:active?"#c0392b":"#2a2a2a",transition:"background 0.3s"}}>
          <div style={{position:"absolute",top:3,left:active?20:3,width:20,height:20,borderRadius:10,background:"#fff",transition:"left 0.3s"}}/>
        </div>
      </div>
      {expanded&&(
        <div style={{borderTop:"1px solid #2a2a2a",padding:"14px 16px",background:"#111"}}>
          <div style={{fontSize:13,color:"#aaa",lineHeight:1.6,marginBottom:12,fontStyle:"italic"}}>{reminder.body}</div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Reminder Time</div>
            <input type="time" value={scheduleData?.time||reminder.defaultTime} onChange={e=>onScheduleChange({...scheduleData,time:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",color:"#f0ece4",borderRadius:10,padding:"8px 12px",fontSize:14,fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Repeat Days</div>
            <div style={{display:"flex",gap:6}}>
              {DAYS_OF_WEEK.map((d,i)=>{
                const sel=(scheduleData?.days||reminder.defaultDays).includes(d);
                return <button key={d} onClick={()=>{const cur=scheduleData?.days||reminder.defaultDays;const next=sel?cur.filter(x=>x!==d):[...cur,d];onScheduleChange({...scheduleData,days:next});}} style={{flex:1,padding:"6px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:sel?"#c0392b":"#2a2a2a",color:sel?"#fff":"#666",transition:"all 0.2s"}}>{DAY_LABELS[i][0]}</button>;
              })}
            </div>
          </div>
          <div style={{background:"#0d0d0d",borderRadius:10,padding:"10px 12px"}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>{reminder.neuro.map(c=><NeuroBadge key={c} chem={c} showLabel/>)}</div>
            <div style={{fontSize:11,color:"#666",lineHeight:1.5}}>🧠 {reminder.why}</div>
          </div>
        </div>
      )}
    </div>
  );
}


export function Toast({toasts,onDismiss}) {
  return (
    <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 40px)",maxWidth:440,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:"#1a1a1a",border:"1px solid #c0392b40",borderRadius:16,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",animation:"slideDown 0.3s ease"}}>
          <span style={{fontSize:24}}>{t.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#f0ece4",marginBottom:3}}>{t.title}</div>
            <div style={{fontSize:12,color:"#aaa",lineHeight:1.5}}>{t.body}</div>
          </div>
          <button onClick={()=>onDismiss(t.id)} style={{background:"none",border:"none",color:"#555",fontSize:18,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
