import { useAppState } from '../../state/AppStateProvider.jsx';

export default function GuideTab() {
  const scope = useAppState();
  const {
    CHALLENGE_30,
    CHALLENGE_60,
    CHALLENGE_90,
    CHALLENGE_MONTHLY,
    MONTHS,
    completedDays,
    safeGetJSON,
    setCompletedDays,
  } = scope;

  return (
    <div>
    
                {/* 30/60/90 Day Challenge */}
                {(() => {
        const allDone = completedDays.length;
        const l2done = safeGetJSON("level2Completed", []).length;
        const l3done = safeGetJSON("level3Completed", []).length;
        const currentLevel = allDone < 30 ? 1 : l2done < 30 ? 2 : l3done < 30 ? 3 : 4;
        const currentPool = currentLevel === 1 ? CHALLENGE_30 : currentLevel === 2 ? CHALLENGE_60 : currentLevel === 3 ? CHALLENGE_90 : CHALLENGE_MONTHLY;
        const currentProgress = currentLevel === 1 ? allDone : currentLevel === 2 ? l2done : currentLevel === 3 ? l3done : 0;
        const progressMax = currentLevel === 4 ? 12 : 30;
        const levelColor = currentLevel === 4 ? "#f1c40f" : currentLevel === 3 ? "#f1c40f" : currentLevel === 2 ? "#8e44ad" : "#27ae60";
        const levelLabel = currentLevel === 4 ? "♾️ Lifelong Partner" : currentLevel === 3 ? "👑 Level 3 — Master" : currentLevel === 2 ? "🔥 Level 2 — Advanced" : "Level 1 — 30 Days";
        const todayTask = currentLevel < 4 ? currentPool[Math.min(currentProgress, currentPool.length - 1)] : null;
        const monthlyTask = currentLevel === 4 ? CHALLENGE_MONTHLY[new Date().getMonth()] : null;
        return <div style={{
          marginBottom: 20
        }}>
                      <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}>
                        <div style={{
              fontSize: 10,
              color: levelColor,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 700
            }}>🏆 {levelLabel}</div>
                        <div style={{
              fontSize: 11,
              color: "#555"
            }}>{currentLevel < 4 ? `${currentProgress}/${progressMax}` : "Month " + (new Date().getMonth() + 1)}</div>
                      </div>
                      {currentLevel < 4 && <div style={{
            background: "#2a2a2a",
            borderRadius: 4,
            height: 4,
            overflow: "hidden",
            marginBottom: 16
          }}>
                          <div style={{
              width: `${currentProgress / progressMax * 100}%`,
              height: "100%",
              background: levelColor,
              borderRadius: 4
            }} />
                        </div>}
                      {todayTask && <div style={{
            background: "#1a1a1a",
            border: `1px solid ${levelColor}30`,
            borderRadius: 14,
            padding: 16,
            marginBottom: 12
          }}>
                          <div style={{
              fontSize: 11,
              color: levelColor,
              fontWeight: 700,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}>Day {currentProgress + 1} · {todayTask.theme}</div>
                          <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#f0ece4",
              lineHeight: 1.5,
              marginBottom: 8
            }}>{todayTask.task}</div>
                          <div style={{
              fontSize: 11,
              color: "#666",
              fontStyle: "italic",
              lineHeight: 1.5,
              marginBottom: 12
            }}>{todayTask.tip}</div>
                          {!completedDays.includes(todayTask.day) && currentLevel === 1 ? <button onClick={() => setCompletedDays(p => [...p, todayTask.day])} style={{
              width: "100%",
              background: levelColor,
              color: "#111",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}>✓ Done Today</button> : completedDays.includes(todayTask.day) && currentLevel === 1 ? <div style={{
              textAlign: "center",
              fontSize: 12,
              color: levelColor,
              fontWeight: 600
            }}>✓ Done — come back tomorrow</div> : null}
                        </div>}
                      {monthlyTask && <div style={{
            background: "#1a1a1a",
            border: `1px solid ${levelColor}30`,
            borderRadius: 14,
            padding: 16
          }}>
                          <div style={{
              fontSize: 11,
              color: levelColor,
              fontWeight: 700,
              marginBottom: 6,
              textTransform: "uppercase"
            }}>{MONTHS[new Date().getMonth()]} Mission · {monthlyTask.theme}</div>
                          <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#f0ece4",
              lineHeight: 1.5,
              marginBottom: 8
            }}>{monthlyTask.mission}</div>
                          <div style={{
              fontSize: 11,
              color: "#666",
              fontStyle: "italic",
              marginBottom: 12
            }}>{monthlyTask.why}</div>
                        </div>}
                    </div>;
      })()}
    
              </div>
  );
}
