import { useAppState } from '../../state/AppStateProvider.jsx';

export default function TodayTab() {
  const scope = useAppState();
  const {
    DAILY_TRUTHS,
    DATE_IDEAS,
    EXTENDED_TASKS,
    EXTENDED_TEXTS,
    HOME_ACTIVITIES,
    MONTHS,
    anniversaryDate,
    copyText,
    currentStreak,
    cycleDay,
    cycleStartDate,
    dateDoneMonth,
    getDayOfYear,
    getToday,
    getWeekKey,
    lastActivityDate,
    lastTextDate,
    logNote,
    logRating,
    phase,
    safeSet,
    setDateDoneMonth,
    setLastActivityDate,
    setLastTextDate,
    setLogNote,
    setLogRating,
    setShowLogForm,
    setTab,
    setTaskLog,
    setUsedTaskIds,
    setWeeklyScore,
    showLogForm,
    taskLog,
    taskTurn,
    setTaskTurn,
    textTurn,
    setTextTurn,
    activityTurn,
    setActivityTurn,
    wifeBirthDay,
    wifeBirthMonth,
  } = scope;

  return (
    <div>
    
                {/* ── Anniversary & Birthday Reminders ─────────────── */}
                {(() => {
        const now = new Date();
        const alerts = [];
    
        // Anniversary reminder
        if (anniversaryDate) {
          const anniv = new Date(anniversaryDate);
          let next = new Date(now.getFullYear(), anniv.getMonth(), anniv.getDate());
          if (next <= now) next = new Date(now.getFullYear() + 1, anniv.getMonth(), anniv.getDate());
          const days = Math.ceil((next - now) / 864e5);
          if (days <= 21 && days > 0) {
            const years = next.getFullYear() - anniv.getFullYear();
            alerts.push({
              emoji: "💍",
              color: "#e67e22",
              title: days === 1 ? "Anniversary TOMORROW" : days <= 7 ? `Anniversary in ${days} days` : `Anniversary in ${days} days — start planning`,
              body: days === 1 ? `${years} year${years !== 1 ? "s" : ""} together. Have you planned something? Tomorrow is the day.` : days <= 7 ? `${years} year${years !== 1 ? "s" : ""} together. ${days} days — don't wing it. She remembers everything.` : `${years} year${years !== 1 ? "s" : ""} together. ${days} days out. Book the restaurant, plan the experience, get the gift now — not the night before.`,
              urgency: days <= 2 ? "🚨 Act now" : days <= 7 ? "⚠️ Plan this week" : "📅 Start planning",
              urgencyColor: days <= 2 ? "#e74c3c" : days <= 7 ? "#f39c12" : "#27ae60"
            });
          }
        }
    
        // Birthday reminder
        if (wifeBirthMonth && wifeBirthDay) {
          const bMonth = parseInt(wifeBirthMonth) - 1;
          const bDay = parseInt(wifeBirthDay);
          let nextBday = new Date(now.getFullYear(), bMonth, bDay);
          if (nextBday <= now) nextBday = new Date(now.getFullYear() + 1, bMonth, bDay);
          const bDays = Math.ceil((nextBday - now) / 864e5);
          if (bDays <= 21 && bDays > 0) {
            alerts.push({
              emoji: "🎂",
              color: "#e91e8c",
              title: bDays === 1 ? "Her Birthday TOMORROW" : bDays <= 7 ? `Her Birthday in ${bDays} days` : `Her Birthday in ${bDays} days — start planning`,
              body: bDays === 1 ? "Tomorrow is her birthday. Is everything ready? Make her feel like the most celebrated woman alive." : bDays <= 7 ? `${bDays} days. Have you planned something, ordered something, or arranged something she'd love? Not generic — specific to her.` : `${bDays} days out. The best gifts and experiences need lead time. Book the restaurant, order the thing, plan the day now — not the night before.`,
              urgency: bDays <= 2 ? "🚨 Act now" : bDays <= 7 ? "⚠️ Order/book now" : "📅 Start planning",
              urgencyColor: bDays <= 2 ? "#e74c3c" : bDays <= 7 ? "#f39c12" : "#e91e8c"
            });
          }
        }
        if (alerts.length === 0) return null;
        return alerts.map((alert, i) => <div key={i} style={{
          background: `linear-gradient(135deg,${alert.color}18,#0d0d0d)`,
          border: `2px solid ${alert.color}60`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12
        }}>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          }}>
                        <div style={{
              display: "flex",
              gap: 8,
              alignItems: "center"
            }}>
                          <span style={{
                fontSize: 20
              }}>{alert.emoji}</span>
                          <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: alert.color
              }}>{alert.title}</span>
                        </div>
                        <span style={{
              fontSize: 10,
              color: alert.urgencyColor,
              fontWeight: 700,
              background: alert.urgencyColor + "18",
              borderRadius: 6,
              padding: "2px 8px"
            }}>{alert.urgency}</span>
                      </div>
                      <div style={{
            fontSize: 13,
            color: "#ccc",
            lineHeight: 1.6
          }}>{alert.body}</div>
                    </div>);
      })()}
    
                {/* ── HER CYCLE — BIG, first thing he sees ─────────── */}
                {cycleStartDate && (() => {
        const phases = [{
          key: "menstrual",
          label: "Menstrual",
          days: "Days 1–5",
          color: "#e74c3c",
          emoji: "🌑",
          need: "Rest, warmth, low demand. Don't take her mood personally."
        }, {
          key: "follicular",
          label: "Follicular",
          days: "Days 6–11",
          color: "#3498db",
          emoji: "🌒",
          need: "Energy rising. She wants fun and novelty. Plan something."
        }, {
          key: "ovulation",
          label: "Ovulation",
          days: "Days 12–16",
          color: "#f1c40f",
          emoji: "🌕",
          need: "Peak romance window. She wants to feel chosen and desired."
        }, {
          key: "luteal",
          label: "Luteal",
          days: "Days 17–28",
          color: "#8e44ad",
          emoji: "🌗",
          need: "Everything feels heavier. She needs your calm and patience."
        }];
        const current = phases.find(p => p.key === phase.key) || phases[0];
        return <div style={{
          background: `linear-gradient(135deg,${current.color}22,${current.color}08)`,
          border: `2px solid ${current.color}60`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 16
        }}>
                      {/* Phase progress bar */}
                      <div style={{
            display: "flex",
            gap: 3,
            marginBottom: 20
          }}>
                        {phases.map(p => <div key={p.key} style={{
              flex: p.key === "luteal" ? 2 : 1,
              height: 5,
              borderRadius: 3,
              background: p.key === phase.key ? current.color : "#2a2a2a",
              transition: "background 0.3s"
            }} />)}
                      </div>
    
                      {/* Big phase display */}
                      <div style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 16
          }}>
                        <div style={{
              fontSize: 52,
              flexShrink: 0
            }}>{current.emoji}</div>
                        <div>
                          <div style={{
                fontSize: 10,
                color: current.color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 4
              }}>Day {cycleDay} of 28</div>
                          <div style={{
                fontSize: 28,
                fontWeight: 900,
                color: current.color,
                fontFamily: "'Playfair Display',serif",
                lineHeight: 1
              }}>{current.label}</div>
                          <div style={{
                fontSize: 12,
                color: "#666",
                marginTop: 4
              }}>{current.days}</div>
                        </div>
                      </div>
    
                      {/* What she needs */}
                      <div style={{
            background: "#00000040",
            borderRadius: 12,
            padding: "12px 14px"
          }}>
                        <div style={{
              fontSize: 10,
              color: current.color,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 6
            }}>What she needs right now</div>
                        <div style={{
              fontSize: 14,
              color: "#f0ece4",
              lineHeight: 1.6,
              fontWeight: 500
            }}>{current.need}</div>
                        {(phase.whatSheNeeds?.fromYou || []).slice(0, 2).map((item, i) => <div key={i} style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
              alignItems: "flex-start"
            }}>
                            <span style={{
                color: current.color,
                fontSize: 12,
                flexShrink: 0,
                marginTop: 2
              }}>→</span>
                            <span style={{
                fontSize: 13,
                color: "#ccc",
                lineHeight: 1.5
              }}>{item}</span>
                          </div>)}
                      </div>
                    </div>;
      })()}
    
                {/* Cycle date missing prompt */}
                {!cycleStartDate && <div onClick={() => setTab("profile")} style={{
        background: "#1a1a1a",
        border: "1px dashed #8e44ad50",
        borderRadius: 16,
        padding: "14px 18px",
        marginBottom: 14,
        cursor: "pointer",
        display: "flex",
        gap: 12,
        alignItems: "center"
      }}>
                    <span style={{
          fontSize: 24,
          flexShrink: 0
        }}>🌙</span>
                    <div>
                      <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#8e44ad",
            marginBottom: 3
          }}>Add her period start date</div>
                      <div style={{
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }}>Tap to go to Profile → Cycle. Enter her last period date and the app tracks everything automatically.</div>
                    </div>
                    <span style={{
          color: "#555",
          fontSize: 16,
          flexShrink: 0
        }}>→</span>
                  </div>}
    
                {/* ── TODAY'S MISSION ───────────────────────────────── */}
                {(() => {
        const todayKey = getToday();
        const wk = getWeekKey();
        const pool = EXTENDED_TASKS.filter(t => !t.phase || t.phase === phase.key);
        const seed = parseInt(todayKey.replace(/-/g, "")) % pool.length;
        // Advance on completion: taskTurn bumps each time a mission is logged, so the next one shows.
        const task = pool[(seed + taskTurn) % pool.length] || pool[0];
        if (!task) return null;
        return <div style={{
          marginBottom: 12
        }}>
                      <div style={{
            fontSize: 10,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 700,
            marginBottom: 8
          }}>Today's Mission</div>
                      <div style={{
            background: "#1a1a1a",
            border: `1px solid ${phase.color}40`,
            borderRadius: 14,
            padding: 16
          }}>
                          <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#f0ece4",
              lineHeight: 1.5,
              marginBottom: 4
            }}>{task.task}</div>
                          <div style={{
              fontSize: 12,
              color: "#555",
              lineHeight: 1.5,
              marginBottom: 14
            }}>{task.why}</div>
                          <button onClick={() => setShowLogForm(true)} style={{
              width: "100%",
              background: phase.color,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "13px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer"
            }}>✓ Mark as Done</button>
                        </div>
                      {showLogForm && <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 14,
            padding: 16,
            marginTop: 8
          }}>
                          <div style={{
              fontSize: 12,
              color: "#888",
              marginBottom: 10
            }}>How did it go?</div>
                          <div style={{
              display: "flex",
              gap: 6,
              marginBottom: 12
            }}>
                            {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setLogRating(n)} style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 8,
                border: `1px solid ${logRating === n ? phase.color : "#2a2a2a"}`,
                background: logRating === n ? phase.color + "20" : "#111",
                color: logRating === n ? phase.color : "#444",
                fontSize: 15,
                cursor: "pointer"
              }}>{"★".repeat(n)}</button>)}
                          </div>
                          <textarea value={logNote} onChange={e => setLogNote(e.target.value)} placeholder="How did she respond?" rows={2} style={{
              width: "100%",
              background: "#111",
              border: "1px solid #2a2a2a",
              color: "#f0ece4",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 13,
              resize: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              marginBottom: 10
            }} />
                          <button onClick={() => {
              const entry = {
                date: todayKey,
                task: task.task,
                rating: logRating || 3,
                note: logNote,
                phase: phase.label
              };
              setTaskLog(p => [entry, ...p]);
              setWeeklyScore(p => ({
                ...p,
                [wk]: (p[wk] || 0) + 1
              }));
              setUsedTaskIds(p => ({
                ...p,
                [wk]: [...(p[wk] || []), task.id]
              }));
              setTaskTurn(t => t + 1); // advance to the next mission
              setShowLogForm(false);
              setLogNote("");
              setLogRating(0);
              const el = document.createElement('div');
              el.textContent = "✓ Logged. Keep going.";
              el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;pointer-events:none';
              document.body.appendChild(el);
              setTimeout(() => {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.5s';
                setTimeout(() => el.remove(), 500);
              }, 2000);
            }} style={{
              width: "100%",
              background: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}>Save</button>
                        </div>}
                    </div>;
      })()}
    
                {/* ── TODAY'S TEXT ─────────────────────────────────── */}
                {(() => {
        const todayKey = getToday();
        const pool = EXTENDED_TEXTS.filter(t => !t.phase || t.phase === phase.key);
        const seed = parseInt(todayKey.replace(/-/g, "")) % pool.length;
        // Advance on send: textTurn bumps when the user marks a text as sent, so the next one shows.
        const t = pool[(seed + textTurn) % pool.length] || pool[0];
        if (!t) return null;
        return <div style={{
          marginBottom: 12
        }}>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          }}>
                        <div style={{
              fontSize: 10,
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700
            }}>Today's Text</div>
                        <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#27ae60"
            }}>
                          📬 Send it
                        </div>
                      </div>
                      <div style={{
            background: "#1a1a1a",
            border: `1px solid ${phase.color}30`,
            borderRadius: 14,
            padding: 16
          }}>
                        <div style={{
              fontSize: 15,
              color: "#f0ece4",
              lineHeight: 1.7,
              fontStyle: "italic",
              marginBottom: 14
            }}>"{t.text}"</div>
                        <div style={{
              display: "flex",
              gap: 8
            }}>
                          <button onClick={() => copyText(t.text, () => {})} style={{
                flex: 1,
                background: "#111",
                border: `1px solid ${phase.color}40`,
                borderRadius: 8,
                padding: "11px 0",
                fontSize: 13,
                color: phase.color,
                fontWeight: 600,
                cursor: "pointer"
              }}>Copy</button>
                          <button onClick={() => {
                setLastTextDate(todayKey);
                setTextTurn(n => n + 1); // advance to the next text
                const el = document.createElement('div');
                el.textContent = "✓ Sent.";
                el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;pointer-events:none';
                document.body.appendChild(el);
                setTimeout(() => {
                  el.style.opacity = '0';
                  el.style.transition = 'opacity 0.5s';
                  setTimeout(() => el.remove(), 500);
                }, 2000);
              }} style={{
                flex: 1,
                background: "#27ae60",
                color: "#fff",
                border: "1px solid transparent",
                borderRadius: 8,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer"
              }}>
                            Mark Sent
                          </button>
                        </div>
                      </div>
                    </div>;
      })()}
    
                {/* ── THIS WEEK'S ACTIVITY ─────────────────────────── */}
                {(() => {
        const wk = getWeekKey();
        const pool = HOME_ACTIVITIES.filter(a => !a.phase || a.phase === phase.key);
        const seed = parseInt(wk.replace(/-/g, "")) % pool.length;
        // Advance on completion: activityTurn bumps when the user marks the activity done.
        const act = pool[(seed + activityTurn) % pool.length] || pool[0];
        if (!act) return null;
        return <div style={{
          marginBottom: 12
        }}>
                      <div style={{
            fontSize: 10,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 700,
            marginBottom: 8
          }}>This Week's Activity</div>
                      <div style={{
            background: "#1a1a1a",
            border: "1px solid #9b59b630",
            borderRadius: 14,
            padding: 16
          }}>
                        <div style={{
              display: "flex",
              gap: 10,
              marginBottom: 12
            }}>
                          <span style={{
                fontSize: 22
              }}>{act.emoji || "🎲"}</span>
                          <div>
                            <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#f0ece4",
                  marginBottom: 3
                }}>{act.title}</div>
                            <div style={{
                  fontSize: 12,
                  color: "#666",
                  lineHeight: 1.5
                }}>{act.howTo || act.description}</div>
                          </div>
                        </div>
                        <button onClick={() => { setLastActivityDate(wk); setActivityTurn(n => n + 1); }} style={{
              width: "100%",
              background: "#9b59b6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}>✓ Done This Week</button>
                      </div>
                    </div>;
      })()}
    
                {/* ── MONTHLY DATE ─────────────────────────────────── */}
                {(() => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const seed = (now.getFullYear() * 12 + now.getMonth()) % DATE_IDEAS.length;
        const d = DATE_IDEAS[seed] || DATE_IDEAS[0];
        const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
        const done = dateDoneMonth === monthKey;
        return <div style={{
          marginBottom: 20
        }}>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8
          }}>
                        <div style={{
              fontSize: 10,
              color: "#1abc9c",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700
            }}>🗓️ {MONTHS[now.getMonth()]}'s Date</div>
                        <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: daysLeft <= 7 ? "#e74c3c" : daysLeft <= 14 ? "#f39c12" : "#1abc9c"
            }}>{daysLeft}d left</div>
                      </div>
                      <div style={{
            background: "#1a1a1a",
            border: `1px solid ${done ? "#27ae6030" : "#1abc9c30"}`,
            borderRadius: 14,
            padding: 16
          }}>
                        <div style={{
              display: "flex",
              gap: 10,
              marginBottom: done ? 0 : 12
            }}>
                          <span style={{
                fontSize: 22
              }}>{d.emoji || "🗓️"}</span>
                          <div>
                            <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#f0ece4",
                  marginBottom: 3
                }}>{d.title}</div>
                            <div style={{
                  fontSize: 12,
                  color: "#666",
                  lineHeight: 1.5
                }}>{d.description || d.why}</div>
                          </div>
                        </div>
                        {done ? <div style={{
              textAlign: "center",
              fontSize: 12,
              color: "#1abc9c",
              fontWeight: 600,
              paddingTop: 10
            }}>✓ Done this month 🎉</div> : <button onClick={() => {
              safeSet(`dateDone-${monthKey}`, "1");
              setDateDoneMonth(monthKey);
            }} style={{
              width: "100%",
              background: "#1abc9c",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}>✓ We Did This</button>}
                      </div>
                    </div>;
      })()}
    
                {/* ── DIVIDER ──────────────────────────────────────── */}
                <div style={{
        height: 1,
        background: "#1a1a1a",
        marginBottom: 20
      }} />
    
                {/* ── STREAK — bottom ──────────────────────────────── */}
                {currentStreak > 0 && <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }}>
                    <div style={{
          display: "flex",
          gap: 6,
          alignItems: "center"
        }}>
                      <span>{currentStreak >= 30 ? "🏆" : currentStreak >= 14 ? "🔥" : currentStreak >= 7 ? "⚡" : "📅"}</span>
                      <span style={{
            fontSize: 12,
            color: "#555",
            fontWeight: 600
          }}>{currentStreak} day streak</span>
                    </div>
                    <div style={{
          display: "flex",
          gap: 2
        }}>
                      {[1, 2, 3, 4, 5, 6, 7].map(d => <div key={d} style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: d <= Math.min(currentStreak, 7) ? "#27ae60" : "#2a2a2a"
          }} />)}
                    </div>
                  </div>}
    
                {/* Milestone celebration */}
                {[7, 14, 30, 60, 90, 180, 365].includes(currentStreak) && <div style={{
        background: "linear-gradient(135deg,#1a1500,#0d0d0d)",
        border: "2px solid #f1c40f60",
        borderRadius: 16,
        padding: "16px 18px",
        marginBottom: 12,
        textAlign: "center"
      }}>
                    <div style={{
          fontSize: 28,
          marginBottom: 6
        }}>{currentStreak >= 365 ? "👑" : currentStreak >= 90 ? "💎" : "🔥"}</div>
                    <div style={{
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "'Playfair Display',serif",
          color: "#f1c40f",
          marginBottom: 4
        }}>{currentStreak} Day Streak</div>
                    <div style={{
          fontSize: 12,
          color: "#aaa",
          lineHeight: 1.6
        }}>
                      {currentStreak === 7 ? "One week. She's already feeling the difference." : currentStreak === 14 ? "Two weeks. Most men quit before this. You didn't." : currentStreak === 30 ? "30 days. You are not the same partner you were a month ago." : currentStreak === 60 ? "60 days. This is who you are now." : currentStreak === 90 ? "90 days. Top 1%. She knows it." : currentStreak === 180 ? "6 months. You've changed your relationship." : "One year. This is mastery."}
                    </div>
                  </div>}
    
                {/* ── TODAY'S TRUTH — bottom ───────────────────────── */}
                {(() => {
        const truth = DAILY_TRUTHS[getDayOfYear(new Date()) % DAILY_TRUTHS.length];
        return <div style={{
          borderLeft: `2px solid #333`,
          paddingLeft: 12,
          marginBottom: 20
        }}>
                      <div style={{
            fontSize: 10,
            color: "#444",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4
          }}>Today's Truth</div>
                      <div style={{
            fontSize: 13,
            fontStyle: "italic",
            color: "#666",
            lineHeight: 1.6
          }}>"{truth}"</div>
                    </div>;
      })()}
    
              </div>
  );
}
