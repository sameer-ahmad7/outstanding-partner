import { useAppState } from '../../state/AppStateProvider.jsx';

export default function TextsTab() {
  const scope = useAppState();
  const {
    EXTENDED_TEXTS,
    NEURO,
    PHASE_SCRIPTS,
    copyText,
    getToday,
    lastTextDate,
    phase,
    sentTextIds,
    setLastTextDate,
    setSentTextIds,
    setSheSaid,
    setSheSaidInput,
    setShowScripts,
    sheSaid,
    sheSaidInput,
    showScripts,
  } = scope;

  return (
    <div>
                {/* Cadence */}
                {(() => {
        const today = getToday();
        const days = lastTextDate ? Math.floor((new Date(today) - new Date(lastTextDate)) / 864e5) : null;
        const sent = lastTextDate === today;
        let msg, color;
        if (sent) {
          msg = "Text sent today — let it breathe 2-3 days";
          color = "#27ae60";
        } else if (days === null) {
          msg = "You haven't sent a text yet — start today";
          color = "#c0392b";
        } else if (days >= 3) {
          msg = `${days} days since last text — send today`;
          color = "#e74c3c";
        } else if (days === 2) {
          msg = "2 days since last text — today's the window";
          color = "#f39c12";
        } else {
          msg = "Good — send again tomorrow";
          color = "#3498db";
        }
        return <div style={{
          background: color + "15",
          border: `1.5px solid ${color}40`,
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 16,
          display: "flex",
          gap: 10,
          alignItems: "center"
        }}>
                      <span style={{
            fontSize: 16,
            flexShrink: 0
          }}>{sent ? "✅" : "💬"}</span>
                      <div style={{
            fontSize: 13,
            fontWeight: 600,
            color
          }}>{msg}</div>
                    </div>;
      })()}
    
                {/* Phase Scripts */}
                {(() => {
        const s = PHASE_SCRIPTS && PHASE_SCRIPTS[phase.key];
        if (!s) return null;
        return <div style={{
          marginBottom: 16
        }}>
                      <button onClick={() => setShowScripts(v => !v)} style={{
            width: "100%",
            background: "#1a1a1a",
            border: `1px solid ${phase.color}40`,
            borderRadius: 12,
            padding: "13px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: showScripts ? 8 : 0
          }}>
                        <div style={{
              textAlign: "left"
            }}>
                          <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: phase.color
              }}>💬 What to Say Tonight</div>
                          <div style={{
                fontSize: 11,
                color: "#666",
                marginTop: 2
              }}>{s.headline || "Phase-matched conversation starters"}</div>
                        </div>
                        <span style={{
              color: "#555",
              fontSize: 12
            }}>{showScripts ? "▲" : "▼"}</span>
                      </button>
                      {showScripts && <div style={{
            background: "#1a1a1a",
            border: `1px solid ${phase.color}25`,
            borderRadius: 12,
            overflow: "hidden"
          }}>
                          {s.context && <div style={{
              padding: "10px 16px",
              borderBottom: "1px solid #2a2a2a",
              fontSize: 12,
              color: "#888",
              fontStyle: "italic"
            }}>{s.context}</div>}
                          {(s.scripts || []).map((sc, i) => <div key={i} style={{
              padding: "14px 16px",
              borderBottom: i < s.scripts.length - 1 ? "1px solid #2a2a2a" : "none"
            }}>
                              <div style={{
                fontSize: 14,
                color: "#f0ece4",
                fontStyle: "italic",
                lineHeight: 1.6,
                marginBottom: 8
              }}>"{sc.line}"</div>
                              {sc.why && <div style={{
                fontSize: 11,
                color: "#555",
                lineHeight: 1.5,
                marginBottom: 8
              }}>🧠 {sc.why}</div>}
                              <button onClick={() => copyText(sc.line, () => {
                const el = document.createElement('div');
                el.textContent = "✓ Copied";
                el.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:700;z-index:9999;pointer-events:none';
                document.body.appendChild(el);
                setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.5s'; setTimeout(() => el.remove(), 500); }, 1500);
              })} style={{
                background: "transparent",
                border: `1px solid ${phase.color}40`,
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: 11,
                color: phase.color,
                cursor: "pointer",
                fontWeight: 600
              }}>Copy</button>
                            </div>)}
                          {s.avoid && <div style={{
              padding: "10px 16px",
              background: "#1a0a0a",
              borderTop: "1px solid #e74c3c20"
            }}>
                              <div style={{
                fontSize: 11,
                color: "#e74c3c",
                fontWeight: 700,
                marginBottom: 3
              }}>⚠️ Avoid tonight</div>
                              <div style={{
                fontSize: 11,
                color: "#888",
                lineHeight: 1.5
              }}>{s.avoid}</div>
                            </div>}
                        </div>}
                    </div>;
      })()}
    
                {/* She Said quick capture */}
                <div style={{
        marginBottom: 16
      }}>
                  <div style={{
          fontSize: 10,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 700,
          marginBottom: 8
        }}>She Said</div>
                  <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 8
        }}>
                    <input value={sheSaidInput} onChange={e => setSheSaidInput(e.target.value)} onKeyDown={e => {
            if (e.key === "Enter" && sheSaidInput.trim()) {
              setSheSaid(p => [{
                text: sheSaidInput.trim(),
                date: getToday(),
                phase: phase.label
              }, ...p].slice(0, 100));
              setSheSaidInput("");
            }
          }} placeholder="She just mentioned something..." style={{
            flex: 1,
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#f0ece4",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            fontFamily: "inherit"
          }} />
                    <button onClick={() => {
            if (sheSaidInput.trim()) {
              setSheSaid(p => [{
                text: sheSaidInput.trim(),
                date: getToday(),
                phase: phase.label
              }, ...p].slice(0, 100));
              setSheSaidInput("");
            }
          }} style={{
            background: "#c0392b",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer"
          }}>+</button>
                  </div>
                  {sheSaid.slice(0, 3).map((s, i) => <div key={i} style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          padding: "8px 14px",
          marginBottom: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
                      <div>
                        <div style={{
              fontSize: 12,
              color: "#ddd"
            }}>{s.text}</div>
                        <div style={{
              fontSize: 10,
              color: "#444",
              marginTop: 2
            }}>{s.date} · {s.phase}</div>
                      </div>
                      <button onClick={() => setSheSaid(p => p.filter((_, j) => j !== i))} style={{
            background: "transparent",
            border: "none",
            color: "#333",
            fontSize: 14,
            cursor: "pointer",
            padding: "0 4px"
          }}>✕</button>
                    </div>)}
                  {sheSaid.length > 3 && <div style={{
          fontSize: 11,
          color: "#555",
          textAlign: "center",
          marginTop: 4
        }}>+{sheSaid.length - 3} more in She Said tab</div>}
                </div>
    
                {/* Phase texts with NEURO tags */}
                <div style={{
        fontSize: 10,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontWeight: 700,
        marginBottom: 10
      }}>{phase.label} Texts</div>
                {(() => {
        const recentlySent = (sentTextIds || []).slice(-15);
        const pool = EXTENDED_TEXTS.filter(t => !t.phase || t.phase === phase.key);
        const available = pool.filter(t => !recentlySent.includes(t.id));
        const activePool = available.length >= 3 ? available : pool;
        return activePool.slice(0, 6).map((t, i) => {
          const alreadySent = (sentTextIds || []).includes(t.id);
          return <div key={i} style={{
            background: "#1a1a1a",
            border: `1px solid ${alreadySent ? "#27ae6025" : "#2a2a2a"}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            opacity: alreadySent ? 0.75 : 1
          }}>
                        {alreadySent && <div style={{
              fontSize: 10,
              color: "#27ae60",
              fontWeight: 700,
              marginBottom: 6
            }}>✓ Already sent</div>}
                        <div style={{
              fontSize: 14,
              color: "#f0ece4",
              lineHeight: 1.7,
              fontStyle: "italic",
              marginBottom: 12
            }}>"{t.text}"</div>
                        {(t.chemicals || t.neuro || []).length > 0 && <div style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap",
              marginBottom: 12
            }}>
                            {(t.chemicals || t.neuro || []).map(c => <span key={c} style={{
                fontSize: 10,
                color: NEURO[c]?.color || "#e67e22",
                background: (NEURO[c]?.color || "#e67e22") + "18",
                borderRadius: 8,
                padding: "2px 8px",
                fontWeight: 600,
                border: `1px solid ${NEURO[c]?.color || "#e67e22"}30`
              }}>
                                {NEURO[c]?.emoji} {NEURO[c]?.label || c}
                              </span>)}
                          </div>}
                        <button onClick={() => {
              copyText(t.text, () => {});
              setLastTextDate(getToday());
              setSentTextIds && setSentTextIds(p => [...new Set([...p, t.id])]);
            }} style={{
              width: "100%",
              background: alreadySent ? "#1a2a1a" : phase.color,
              color: alreadySent ? "#27ae60" : "#fff",
              border: `1px solid ${alreadySent ? "#27ae6040" : "transparent"}`,
              borderRadius: 10,
              padding: "11px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}>
                          {alreadySent ? "Copy again" : "Copy & Mark Sent"}
                        </button>
                      </div>;
        });
      })()}
              </div>
  );
}
