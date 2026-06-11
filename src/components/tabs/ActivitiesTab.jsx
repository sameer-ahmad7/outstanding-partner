import { useAppState } from '../../state/AppStateProvider.jsx';

export default function ActivitiesTab() {
  const scope = useAppState();
  const {
    DATE_IDEAS,
    HOME_ACTIVITIES,
    NEURO,
    activityFilter,
    phase,
    setActivityFilter,
  } = scope;

  return (
    <div>
                {/* Phase filter */}
                <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 16
      }}>
                  {[{
          key: "all",
          label: "All",
          emoji: "✨"
        }, {
          key: "menstrual",
          label: "Menstrual",
          emoji: "🌑"
        }, {
          key: "follicular",
          label: "Follicular",
          emoji: "🌒"
        }, {
          key: "ovulation",
          label: "Ovulation",
          emoji: "🌕"
        }, {
          key: "luteal",
          label: "Luteal",
          emoji: "🌗"
        }].map(f => <button key={f.key} onClick={() => setActivityFilter(f.key)} style={{
          background: activityFilter === f.key ? "#1a1a1a" : "transparent",
          border: `1px solid ${activityFilter === f.key ? phase.color : "#2a2a2a"}`,
          color: activityFilter === f.key ? phase.color : "#555",
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0
        }}>{f.emoji} {f.label}</button>)}
                </div>
    
                {/* At-Home Activities */}
                <div style={{
        fontSize: 10,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontWeight: 700,
        marginBottom: 10
      }}>🏠 At-Home Activities</div>
                {HOME_ACTIVITIES.filter(a => activityFilter === "all" || !a.phase || a.phase === activityFilter).map((act, i) => <div key={i} style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 14,
        padding: 16,
        marginBottom: 10
      }}>
                    <div style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 10
        }}>
                      <span style={{
            fontSize: 24,
            flexShrink: 0
          }}>{act.emoji || "🎲"}</span>
                      <div style={{
            flex: 1
          }}>
                        <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#f0ece4",
              marginBottom: 4
            }}>{act.title}</div>
                        <div style={{
              fontSize: 12,
              color: "#666",
              lineHeight: 1.6
            }}>{act.howTo || act.description}</div>
                      </div>
                    </div>
                    {act.whatToSay && <div style={{
          background: "#111",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 10,
          fontSize: 12,
          color: "#aaa",
          fontStyle: "italic"
        }}>
                        "{act.whatToSay}"
                      </div>}
                    {(act.primaryChem ? [act.primaryChem] : act.chems || act.chemicals || []).length > 0 && <div style={{
          display: "flex",
          gap: 5,
          flexWrap: "wrap"
        }}>
                        {(act.primaryChem ? [act.primaryChem] : act.chems || act.chemicals || []).map(c => <span key={c} style={{
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
                  </div>)}
    
                {/* Date Ideas */}
                <div style={{
        fontSize: 10,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontWeight: 700,
        marginBottom: 10,
        marginTop: 8
      }}>🗓️ Date Ideas</div>
                {DATE_IDEAS.filter(d => activityFilter === "all" || !d.phase || d.needs && d.needs.includes(activityFilter)).map((d, i) => <div key={i} style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 14,
        padding: 16,
        marginBottom: 10
      }}>
                    <div style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 10
        }}>
                      <span style={{
            fontSize: 24,
            flexShrink: 0
          }}>{d.emoji || "🗓️"}</span>
                      <div style={{
            flex: 1
          }}>
                        <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#f0ece4",
              marginBottom: 4
            }}>{d.title}</div>
                        <div style={{
              display: "flex",
              gap: 6,
              marginBottom: 6,
              flexWrap: "wrap"
            }}>
                          {d.effort && <span style={{
                fontSize: 10,
                color: "#555",
                background: "#111",
                borderRadius: 6,
                padding: "1px 8px"
              }}>{d.effort}</span>}
                          {d.duration && <span style={{
                fontSize: 10,
                color: "#555",
                background: "#111",
                borderRadius: 6,
                padding: "1px 8px"
              }}>{d.duration}</span>}
                          {d.cost && <span style={{
                fontSize: 10,
                color: "#555",
                background: "#111",
                borderRadius: 6,
                padding: "1px 8px"
              }}>{d.cost}</span>}
                        </div>
                        <div style={{
              fontSize: 12,
              color: "#666",
              lineHeight: 1.6
            }}>{d.description || d.why}</div>
                      </div>
                    </div>
                    {(d.chems || d.chemicals || []).length > 0 && <div style={{
          display: "flex",
          gap: 5,
          flexWrap: "wrap"
        }}>
                        {(d.chems || d.chemicals || []).map(c => <span key={c} style={{
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
                  </div>)}
              </div>
  );
}
