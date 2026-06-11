import { useAppState } from '../../state/AppStateProvider.jsx';

export default function ProfileTab() {
  const scope = useAppState();
  const {
    CYCLE_PHASES,
    LPP,
    NEEDS,
    NEED_COLORS,
    NeedBadge,
    NeuroBadge,
    PremiumGate,
    anniversaryDate,
    authUser,
    biggestDream,
    biggestFear,
    chineseZodiac,
    cycleDay,
    cycleStartDate,
    deleteLoading,
    favColor,
    favDrink,
    favFlower,
    favFood,
    favMovie,
    favRestaurant,
    favShow,
    favSong,
    favStarbucks,
    firstDateDate,
    getCurrentPhase,
    handleCycleStart,
    handleDeleteAccount,
    herBestFriend,
    herDad,
    herMom,
    howSheFeelsLoved,
    husbandNotes,
    isPremium,
    isPreviewMode,
    lifetimeAccess,
    subscriptionPlan,
    kidsNames,
    loveLanguage,
    numerology,
    petsNames,
    phase,
    profileSection,
    rcLogOut,
    safeSet,
    setAnniversaryDate,
    setAuthEmail,
    setAuthPassword,
    setAuthUser,
    setBiggestDream,
    setBiggestFear,
    setCompletedDays,
    setCurrentStreak,
    setCycleDay,
    setCycleStartDate,
    setFavColor,
    setFavDrink,
    setFavFlower,
    setFavFood,
    setFavMovie,
    setFavRestaurant,
    setFavShow,
    setFavSong,
    setFavStarbucks,
    setFirstDateDate,
    setHerBestFriend,
    setHerDad,
    setHerMom,
    setHowSheFeelsLoved,
    setHusbandNotes,
    setKidsNames,
    setLastTextDate,
    setLegalView,
    setLoveLanguage,
    setOnboardSlide,
    setOnboarded,
    setPetsNames,
    setProfileSection,
    setReplayGuide,
    setSentTextIds,
    setSheSaid,
    setShowDeleteConfirm,
    setShowResetConfirm,
    setSubTier,
    setSubscribed,
    setTab,
    setTaskLog,
    setWhatLightsUp,
    setWhatStresses,
    setWifeBirthDay,
    setWifeBirthMonth,
    setWifeBirthYear,
    setWifeName,
    setWifeNickname,
    showDeleteConfirm,
    showResetConfirm,
    signOutUser,
    toggleNeed,
    whatLightsUp,
    whatStresses,
    wifeBirthDay,
    wifeBirthMonth,
    wifeBirthYear,
    wifeName,
    wifeNeeds,
    wifeNickname,
    zodiac,
  } = scope;
  const sections = [
    {id:"overview",label:"Overview",icon:"👤"},
    {id:"cycle",label:"Cycle",icon:"🗓️"},
    {id:"lpp",label:"Your Code",icon:"🧭"},
    {id:"western",label:"Zodiac",icon:"♈"},
    {id:"chinese",label:"Chinese",icon:"🐉"},
    {id:"numerology",label:"Numbers",icon:"🔢"},
  ];

  return (
    <div>
            {/* Sub-nav */}
            <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 20
      }}>
              {sections.map(s => <button key={s.id} onClick={() => setProfileSection(s.id)} style={{
          background: profileSection === s.id ? "#c0392b" : "#1a1a1a",
          color: profileSection === s.id ? "#fff" : "#888",
          border: `1px solid ${profileSection === s.id ? "#c0392b" : "#333"}`,
          borderRadius: 20,
          padding: "7px 14px",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0
        }}>{s.icon} {s.label}</button>)}
            </div>
    
            {/* OVERVIEW */}
            {profileSection === "overview" && <div>
                <div style={{
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>Her Name</div>
                  <input value={wifeName} onChange={e => setWifeName(e.target.value)} placeholder="Enter her name..." style={{
            width: "100%",
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#f0ece4",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 15,
            boxSizing: "border-box",
            fontFamily: "inherit"
          }} />
                </div>
    
                <div style={{
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 6
          }}>Her Nickname</div>
                  <div style={{
            fontSize: 11,
            color: "#555",
            marginBottom: 8,
            lineHeight: 1.5
          }}>The special name only you call her — babe, love, mama, queen, whatever makes her smile when she hears it from you.</div>
                  <input value={wifeNickname} onChange={e => setWifeNickname(e.target.value)} placeholder="e.g. Babe, Love, Baby girl, Queen..." style={{
            width: "100%",
            background: "#1a1a1a",
            border: `1px solid ${wifeNickname ? "#e91e8c40" : "#333"}`,
            color: "#f0ece4",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 15,
            boxSizing: "border-box",
            fontFamily: "inherit"
          }} />
                  {wifeNickname && <div style={{
            marginTop: 8,
            padding: "8px 12px",
            background: "#1a0a0a",
            border: "1px solid #e91e8c30",
            borderRadius: 10,
            display: "flex",
            gap: 8,
            alignItems: "center"
          }}>
                      <span style={{
              fontSize: 16
            }}>💕</span>
                      <span style={{
              fontSize: 13,
              color: "#e91e8c"
            }}>Use "<strong>{wifeNickname}</strong>" when you text her, talk to her, and introduce her. She notices every time.</span>
                    </div>}
                </div>
    
                <div style={{
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>Her Birthday</div>
                  <div style={{
            display: "flex",
            gap: 8
          }}>
                    <input value={wifeBirthMonth} onChange={e => setWifeBirthMonth(e.target.value)} placeholder="MM" type="number" min="1" max="12" style={{
              flex: 1,
              minWidth: 0,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#f0ece4",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 14,
              boxSizing: "border-box",
              fontFamily: "inherit"
            }} />
                    <input value={wifeBirthDay} onChange={e => setWifeBirthDay(e.target.value)} placeholder="DD" type="number" min="1" max="31" style={{
              flex: 1,
              minWidth: 0,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#f0ece4",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 14,
              boxSizing: "border-box",
              fontFamily: "inherit"
            }} />
                    <input value={wifeBirthYear} onChange={e => setWifeBirthYear(e.target.value)} placeholder="YYYY" type="number" min="1920" max="2010" style={{
              flex: 1,
              minWidth: 0,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#f0ece4",
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 14,
              boxSizing: "border-box",
              fontFamily: "inherit"
            }} />
                  </div>
                </div>
    
                {/* ── Period & Cycle Tracking ── */}
                <div style={{
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>Period Start Date</div>
                  <div style={{
            fontSize: 12,
            color: "#555",
            marginBottom: 10,
            lineHeight: 1.5
          }}>Enter the first day of her last period. The app automatically calculates her current cycle day and phase.</div>
                  <input type="date" value={cycleStartDate} onChange={e => handleCycleStart(e.target.value)} style={{
            width: "100%",
            background: "#1a1a1a",
            border: "1px solid #c0392b40",
            color: "#f0ece4",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 15,
            boxSizing: "border-box",
            fontFamily: "inherit"
          }} />
                </div>
    
                {/* Live cycle status card */}
                <div style={{
          background: `linear-gradient(135deg,${phase.color}18,${phase.color}06)`,
          border: `1.5px solid ${phase.color}40`,
          borderRadius: 18,
          padding: 18,
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 11,
            color: phase.color,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 12
          }}>Current Cycle Status</div>
    
                  {/* Progress bar */}
                  <div style={{
            marginBottom: 14
          }}>
                    <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6
            }}>
                      <span style={{
                fontSize: 12,
                color: "#aaa"
              }}>Day {cycleDay} of 28</span>
                      <span style={{
                fontSize: 12,
                color: phase.color,
                fontWeight: 700
              }}>{phase.emoji} {phase.label} Phase</span>
                    </div>
                    <div style={{
              background: "#2a2a2a",
              borderRadius: 8,
              height: 10,
              overflow: "hidden"
            }}>
                      <div style={{
                width: `${cycleDay / 28 * 100}%`,
                height: "100%",
                background: `linear-gradient(90deg,#c0392b,${phase.color})`,
                borderRadius: 8,
                transition: "width 0.5s ease"
              }} />
                    </div>
                    <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4
            }}>
                      {Object.entries(CYCLE_PHASES).map(([k, p]) => <span key={k} style={{
                fontSize: 9,
                color: phase.key === k ? p.color : "#444",
                fontWeight: 600,
                textTransform: "uppercase"
              }}>{p.label.slice(0, 3)}</span>)}
                    </div>
                  </div>
    
                  {/* Phase details */}
                  <div style={{
            background: "#00000030",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 12
          }}>
                    <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.6
            }}>{phase.tip}</div>
                  </div>
    
                  {/* Days breakdown */}
                  <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8
          }}>
                    {(() => {
              const daysLeft = 28 - cycleDay;
              const nextPeriod = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + 28 * 864e5) : null;
              const nextPeriodStr = nextPeriod ? nextPeriod.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              }) : "—";
              // Next phase
              const phases = Object.entries(CYCLE_PHASES);
              const currentIdx = phases.findIndex(([k]) => k === phase.key);
              const nextPhase = phases[(currentIdx + 1) % phases.length];
              const daysToNextPhase = nextPhase[1].days[0] - cycleDay;
              return <>
                          <div style={{
                  background: "#1a1a1a",
                  borderRadius: 10,
                  padding: "10px 12px"
                }}>
                            <div style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: phase.color
                  }}>{daysLeft}</div>
                            <div style={{
                    fontSize: 11,
                    color: "#666"
                  }}>days left in cycle</div>
                          </div>
                          <div style={{
                  background: "#1a1a1a",
                  borderRadius: 10,
                  padding: "10px 12px"
                }}>
                            <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#c0392b"
                  }}>{nextPeriodStr}</div>
                            <div style={{
                    fontSize: 11,
                    color: "#666"
                  }}>next period est.</div>
                          </div>
                          {daysToNextPhase > 0 && <div style={{
                  background: "#1a1a1a",
                  borderRadius: 10,
                  padding: "10px 12px",
                  gridColumn: "1/-1"
                }}>
                              <div style={{
                    fontSize: 13,
                    color: nextPhase[1].color,
                    fontWeight: 600
                  }}>{nextPhase[1].emoji} {nextPhase[1].label} phase in {daysToNextPhase} day{daysToNextPhase !== 1 ? "s" : ""}</div>
                              <div style={{
                    fontSize: 11,
                    color: "#666",
                    marginTop: 2
                  }}>{nextPhase[1].tip}</div>
                            </div>}
                        </>;
            })()}
                  </div>
    
                  {/* Manual day adjust */}
                  <div style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
                    <div style={{
              fontSize: 11,
              color: "#666",
              flex: 1
            }}>Fine-tune cycle day:</div>
                    <button onClick={() => setCycleDay(d => Math.max(1, d - 1))} style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#f0ece4",
              fontSize: 18,
              cursor: "pointer"
            }}>−</button>
                    <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: phase.color,
              minWidth: 50,
              textAlign: "center"
            }}>Day {cycleDay}</span>
                    <button onClick={() => setCycleDay(d => Math.min(28, d + 1))} style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#f0ece4",
              fontSize: 18,
              cursor: "pointer"
            }}>+</button>
                  </div>
                </div>
    
                {/* Auto-detected signs */}
                {(zodiac || chineseZodiac || numerology) && <div style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 16,
          padding: 18,
          marginBottom: 20
        }}>
                    <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 14
          }}>Detected Profile</div>
                    {zodiac && <div style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 10,
            padding: "12px 14px",
            background: `${zodiac.color}12`,
            border: `1px solid ${zodiac.color}30`,
            borderRadius: 12
          }}>
                        <span style={{
              fontSize: 26
            }}>{zodiac.emoji}</span>
                        <div><div style={{
                fontSize: 15,
                fontWeight: 700,
                color: zodiac.color
              }}>{zodiac.sign}</div><div style={{
                fontSize: 11,
                color: "#888"
              }}>{zodiac.dates} · {zodiac.element} Sign</div><div style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                marginTop: 4
              }}>{zodiac.traits.map(t => <span key={t} style={{
                  fontSize: 10,
                  color: zodiac.color,
                  background: zodiac.color + "15",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontWeight: 600
                }}>{t}</span>)}</div></div>
                      </div>}
                    {chineseZodiac && <div style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 10,
            padding: "12px 14px",
            background: `${chineseZodiac.color}12`,
            border: `1px solid ${chineseZodiac.color}30`,
            borderRadius: 12
          }}>
                        <span style={{
              fontSize: 26
            }}>{chineseZodiac.emoji}</span>
                        <div><div style={{
                fontSize: 15,
                fontWeight: 700,
                color: chineseZodiac.color
              }}>Year of the {chineseZodiac.sign}</div><div style={{
                fontSize: 11,
                color: "#888"
              }}>Chinese Zodiac · {wifeBirthYear}</div><div style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                marginTop: 4
              }}>{chineseZodiac.traits.map(t => <span key={t} style={{
                  fontSize: 10,
                  color: chineseZodiac.color,
                  background: chineseZodiac.color + "15",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontWeight: 600
                }}>{t}</span>)}</div></div>
                      </div>}
                    {numerology && <div style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "12px 14px",
            background: `${numerology.color}12`,
            border: `1px solid ${numerology.color}30`,
            borderRadius: 12
          }}>
                        <div style={{
              fontSize: 26,
              fontWeight: 800,
              color: numerology.color,
              minWidth: 36,
              textAlign: "center"
            }}>{numerology.number}</div>
                        <div><div style={{
                fontSize: 15,
                fontWeight: 700,
                color: numerology.color
              }}>Life Path {numerology.number} — {numerology.name}</div><div style={{
                fontSize: 11,
                color: "#888"
              }}>Numerology · {numerology.emoji}</div><div style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
                marginTop: 4
              }}>{numerology.traits.map(t => <span key={t} style={{
                  fontSize: 10,
                  color: numerology.color,
                  background: numerology.color + "15",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontWeight: 600
                }}>{t}</span>)}</div></div>
                      </div>}
                  </div>}
    
                {/* Her Core Needs */}
                <div style={{
          marginBottom: 20
        }}>
                {/* ══ KNOW HER ══════════════════════════════════════════ */}
                <div style={{
            marginBottom: 24
          }}>
                  <div style={{
              background: "linear-gradient(135deg,#1a0a1a,#0d0d0d)",
              border: "1px solid #e91e8c25",
              borderRadius: 16,
              padding: "14px 18px",
              marginBottom: 16
            }}>
                    <div style={{
                fontSize: 11,
                color: "#e91e8c",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 2
              }}>Know Her</div>
                    <div style={{
                fontSize: 13,
                color: "#888",
                lineHeight: 1.5
              }}>The details that show her you actually pay attention. The more you fill in, the more the app personalizes everything.</div>
                  </div>
    
                  {/* Important Dates */}
                  <div style={{
              marginBottom: 16
            }}>
                    <div style={{
                fontSize: 11,
                color: "#e67e22",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10
              }}>📅 Important Dates</div>
                    {[{
                label: "Anniversary Date",
                value: anniversaryDate,
                set: setAnniversaryDate,
                type: "date",
                ph: "Your anniversary",
                icon: "💍"
              }, {
                label: "First Date",
                value: firstDateDate,
                set: setFirstDateDate,
                type: "date",
                ph: "When you first went out",
                icon: "🌹"
              }].map(f => <div key={f.label} style={{
                marginBottom: 10
              }}>
                        <div style={{
                  fontSize: 12,
                  color: "#666",
                  marginBottom: 5,
                  display: "flex",
                  gap: 6,
                  alignItems: "center"
                }}><span>{f.icon}</span>{f.label}</div>
                        <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: `1px solid ${f.value ? "#e67e2250" : "#2a2a2a"}`,
                  color: "#f0ece4",
                  borderRadius: 10,
                  padding: "11px 14px",
                  fontSize: 14,
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }} />
                      </div>)}
                  </div>
    
                  {/* Upcoming anniversary reminder */}
                  {anniversaryDate && (() => {
              const today = new Date();
              const thisYear = today.getFullYear();
              const anniv = new Date(anniversaryDate);
              let next = new Date(thisYear, anniv.getMonth(), anniv.getDate());
              if (next < today) next = new Date(thisYear + 1, anniv.getMonth(), anniv.getDate());
              const daysAway = Math.ceil((next - today) / 864e5);
              const years = thisYear - anniv.getFullYear() + (next.getFullYear() === thisYear ? 0 : 1);
              if (daysAway > 90) return null;
              return <div style={{
                background: "#1a0a00",
                border: "1px solid #e67e2240",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 16,
                display: "flex",
                gap: 10,
                alignItems: "center"
              }}>
                        <span style={{
                  fontSize: 20
                }}>💍</span>
                        <div>
                          <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e67e22"
                  }}>Anniversary in {daysAway} day{daysAway !== 1 ? "s" : ""}!</div>
                          <div style={{
                    fontSize: 11,
                    color: "#888"
                  }}>{years} year{years !== 1 ? "s" : ""} together · {next ? next.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric"
                    }) : "—"}</div>
                        </div>
                      </div>;
            })()}
    
                  {/* Her Favorites */}
                  <div style={{
              marginBottom: 16
            }}>
                    <div style={{
                fontSize: 11,
                color: "#e91e8c",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10
              }}>❤️ Her Favorites</div>
                    {[{
                label: "Favorite Restaurant",
                value: favRestaurant,
                set: setFavRestaurant,
                ph: "Where she always wants to go",
                icon: "🍽️"
              }, {
                label: "Favorite Food",
                value: favFood,
                set: setFavFood,
                ph: "Her go-to comfort food",
                icon: "🍕"
              }, {
                label: "Favorite Drink",
                value: favDrink,
                set: setFavDrink,
                ph: "Wine, cocktail, whatever she loves",
                icon: "🍷"
              }, {
                label: "Starbucks Order",
                value: favStarbucks,
                set: setFavStarbucks,
                ph: "Her exact Starbucks order",
                icon: "☕"
              }, {
                label: "Favorite Flower",
                value: favFlower,
                set: setFavFlower,
                ph: "What to bring her",
                icon: "💐"
              }, {
                label: "Favorite Color",
                value: favColor,
                set: setFavColor,
                ph: "Her color",
                icon: "🎨"
              }, {
                label: "Favorite Movie",
                value: favMovie,
                set: setFavMovie,
                ph: "The one she can watch again and again",
                icon: "🎬"
              }, {
                label: "Favorite TV Show",
                value: favShow,
                set: setFavShow,
                ph: "What she's watching right now",
                icon: "📺"
              }, {
                label: "Favorite Song or Artist",
                value: favSong,
                set: setFavSong,
                ph: "What makes her sing along",
                icon: "🎵"
              }].map(f => <div key={f.label} style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 8
              }}>
                        <span style={{
                  fontSize: 18,
                  minWidth: 26,
                  textAlign: "center"
                }}>{f.icon}</span>
                        <div style={{
                  flex: 1
                }}>
                          <div style={{
                    fontSize: 10,
                    color: "#555",
                    marginBottom: 3
                  }}>{f.label}</div>
                          <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: `1px solid ${f.value ? "#e91e8c30" : "#2a2a2a"}`,
                    color: "#f0ece4",
                    borderRadius: 10,
                    padding: "9px 12px",
                    fontSize: 13,
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }} />
                        </div>
                      </div>)}
                  </div>
    
                  {/* Love Language */}
                  <div style={{
              marginBottom: 16
            }}>
                    <div style={{
                fontSize: 11,
                color: "#3498db",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4
              }}>💗 How She Feels Loved</div>
                    <div style={{
                fontSize: 11,
                color: "#555",
                marginBottom: 10,
                lineHeight: 1.5
              }}>Select her primary way of feeling loved and valued.</div>
                    <div style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 10
              }}>
                      {[{
                  key: "Verbal Affirmation",
                  emoji: "💬",
                  desc: "She needs to hear it — out loud, specifically, often. Never assume she knows how you feel. Say it. Text it. Write it."
                }, {
                  key: "Undivided Presence",
                  emoji: "⏱️",
                  desc: "Full attention, no phone, eyes on her. Time that is completely and only about her. Be here — fully here."
                }, {
                  key: "Thoughtful Gestures",
                  emoji: "🎁",
                  desc: "It's not about money — it's about the fact that you saw something and thought of her. Small and specific beats big and generic."
                }, {
                  key: "Acts of Service",
                  emoji: "🛠️",
                  desc: "She feels deeply loved when you do things without being asked. Notice what needs doing and handle it before she mentions it."
                }, {
                  key: "Physical Connection",
                  emoji: "🤝",
                  desc: "Non-sexual touch matters as much as intimacy. Hold her hand. Hug her first. A hand on her back says more than you think."
                }].map(l => <button key={l.key} onClick={() => setLoveLanguage(loveLanguage === l.key ? "" : l.key)} style={{
                  padding: "8px 14px",
                  borderRadius: 20,
                  border: `1px solid ${loveLanguage === l.key ? "#3498db" : "#2a2a2a"}`,
                  background: loveLanguage === l.key ? "#3498db20" : "#1a1a1a",
                  color: loveLanguage === l.key ? "#3498db" : "#777",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  gap: 5,
                  alignItems: "center"
                }}>
                          <span>{l.emoji}</span> {l.key}
                        </button>)}
                    </div>
                    {loveLanguage && (() => {
                const found = [{
                  key: "Verbal Affirmation",
                  emoji: "💬",
                  desc: "She needs to hear it — out loud, specifically, often. Never assume she knows how you feel. Say it. Text it. Write it."
                }, {
                  key: "Undivided Presence",
                  emoji: "⏱️",
                  desc: "Full attention, no phone, eyes on her. Time that is completely and only about her. Be here — fully here."
                }, {
                  key: "Thoughtful Gestures",
                  emoji: "🎁",
                  desc: "It's not about money — it's about the fact that you saw something and thought of her. Small and specific beats big and generic."
                }, {
                  key: "Acts of Service",
                  emoji: "🛠️",
                  desc: "She feels deeply loved when you do things without being asked. Notice what needs doing and handle it before she mentions it."
                }, {
                  key: "Physical Connection",
                  emoji: "🤝",
                  desc: "Non-sexual touch matters as much as intimacy. Hold her hand. Hug her first. A hand on her back says more than you think."
                }].find(l => l.key === loveLanguage);
                if (!found) return null;
                return <div style={{
                  background: "#0d1a2a",
                  border: "1px solid #3498db25",
                  borderRadius: 10,
                  padding: "12px 14px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start"
                }}>
                          <span style={{
                    fontSize: 18,
                    flexShrink: 0
                  }}>{found.emoji}</span>
                          <div>
                            <div style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#3498db",
                      marginBottom: 3
                    }}>{found.key}</div>
                            <div style={{
                      fontSize: 12,
                      color: "#6ab0d8",
                      lineHeight: 1.6
                    }}>{found.desc}</div>
                          </div>
                        </div>;
              })()}
                  </div>
    
                  {/* Know Her Deeper */}
                  <div style={{
              marginBottom: 16
            }}>
                    <div style={{
                fontSize: 11,
                color: "#9b59b6",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10
              }}>🧠 Know Her Deeper</div>
                    {[{
                label: "Her Biggest Dream",
                value: biggestDream,
                set: setBiggestDream,
                ph: "What does she really want in life?",
                icon: "✨",
                rows: 2
              }, {
                label: "Her Biggest Fear",
                value: biggestFear,
                set: setBiggestFear,
                ph: "What keeps her up at night?",
                icon: "💭",
                rows: 2
              }, {
                label: "What Stresses Her Out",
                value: whatStresses,
                set: setWhatStresses,
                ph: "What drains her most?",
                icon: "😮‍💨",
                rows: 2
              }, {
                label: "What Lights Her Up",
                value: whatLightsUp,
                set: setWhatLightsUp,
                ph: "What makes her eyes go bright?",
                icon: "🔆",
                rows: 2
              }, {
                label: "How She Feels Most Loved",
                value: howSheFeelsLoved,
                set: setHowSheFeelsLoved,
                ph: "In her own words — what does being loved feel like to her?",
                icon: "💕",
                rows: 2
              }].map(f => <div key={f.label} style={{
                marginBottom: 10
              }}>
                        <div style={{
                  fontSize: 11,
                  color: "#666",
                  marginBottom: 5,
                  display: "flex",
                  gap: 6,
                  alignItems: "center"
                }}><span>{f.icon}</span>{f.label}</div>
                        <textarea value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} rows={f.rows} style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: `1px solid ${f.value ? "#9b59b630" : "#2a2a2a"}`,
                  color: "#f0ece4",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 13,
                  resize: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  lineHeight: 1.5
                }} />
                      </div>)}
                  </div>
    
                  {/* Her People */}
                  <div style={{
              marginBottom: 16
            }}>
                    <div style={{
                fontSize: 11,
                color: "#27ae60",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10
              }}>👨‍👩‍👧 Her People</div>
                    {[{
                label: "Kids Names & Ages",
                value: kidsNames,
                set: setKidsNames,
                ph: "e.g. Emma (7), Liam (4)",
                icon: "👶"
              }, {
                label: "Pets",
                value: petsNames,
                set: setPetsNames,
                ph: "Their names and type",
                icon: "🐾"
              }, {
                label: "Her Mom",
                value: herMom,
                set: setHerMom,
                ph: "Name and anything important about their relationship",
                icon: "👩"
              }, {
                label: "Her Dad",
                value: herDad,
                set: setHerDad,
                ph: "Name and anything important",
                icon: "👨"
              }, {
                label: "Her Best Friend",
                value: herBestFriend,
                set: setHerBestFriend,
                ph: "Name — the person she tells everything to",
                icon: "👯"
              }].map(f => <div key={f.label} style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 8
              }}>
                        <span style={{
                  fontSize: 18,
                  minWidth: 26,
                  textAlign: "center"
                }}>{f.icon}</span>
                        <div style={{
                  flex: 1
                }}>
                          <div style={{
                    fontSize: 10,
                    color: "#555",
                    marginBottom: 3
                  }}>{f.label}</div>
                          <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: `1px solid ${f.value ? "#27ae6030" : "#2a2a2a"}`,
                    color: "#f0ece4",
                    borderRadius: 10,
                    padding: "9px 12px",
                    fontSize: 13,
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }} />
                        </div>
                      </div>)}
                  </div>
    
                  {/* Husband's Private Notes */}
                  <div style={{
              marginBottom: 8
            }}>
                    <div style={{
                fontSize: 11,
                color: "#f39c12",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 6
              }}>📝 Your Private Notes About Her</div>
                    <div style={{
                fontSize: 11,
                color: "#555",
                marginBottom: 8,
                lineHeight: 1.5
              }}>Anything you want to remember. Things she said. Moments that mattered. What she's going through right now. What you're working on together.</div>
                    <textarea value={husbandNotes} onChange={e => setHusbandNotes(e.target.value)} placeholder={"Write anything here...\n\n• Something she mentioned she wanted\n• A moment she was really happy\n• Something she's struggling with\n• What you're trying to get better at\n• Things you never want to forget about her"} rows={8} style={{
                width: "100%",
                background: "#1a1a1a",
                border: `1px solid ${husbandNotes ? "#f39c1230" : "#2a2a2a"}`,
                color: "#f0ece4",
                borderRadius: 12,
                padding: "14px 16px",
                fontSize: 13,
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
                lineHeight: 1.7
              }} />
                    {husbandNotes && <div style={{
                fontSize: 10,
                color: "#555",
                marginTop: 4,
                textAlign: "right"
              }}>{husbandNotes.length} characters · private to you</div>}
                  </div>
                </div>
    
                {/* Her Core Needs */}
                <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>Her Core Needs (customize)</div>
                  <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8
          }}>
                    {NEEDS.map(need => <button key={need} onClick={() => toggleNeed(need)} style={{
              background: wifeNeeds.includes(need) ? NEED_COLORS[need] : "#1a1a1a",
              color: wifeNeeds.includes(need) ? "#fff" : "#aaa",
              border: `1.5px solid ${wifeNeeds.includes(need) ? NEED_COLORS[need] : "#333"}`,
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.2s"
            }}>{need}</button>)}
                  </div>
                </div>
    
                {/* Account Info */}
                {authUser && <div style={{
          marginBottom: 20,
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: 16
        }}>
                    <div style={{
            fontSize: 12,
            color: "#666",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>Your Account</div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{
                fontSize: 14,
                color: "#f0ece4",
                fontWeight: 600
              }}>{authUser.name || "Your account"}</div>
                      <div style={{
                fontSize: 12,
                color: "#666",
                marginTop: 2,
                wordBreak: "break-all"
              }}>{authUser.email}</div>
                      <div style={{
                fontSize: 11,
                marginTop: 4,
                fontWeight: 600,
                color: lifetimeAccess ? "#27ae60" : isPremium ? "#8e44ad" : "#27ae60"
              }}>
                        {lifetimeAccess
                  ? "✓ Free Forever"
                  : subscriptionPlan
                    ? `✓ Outstanding Partner — ${
                        subscriptionPlan.priceString
                          ? `${subscriptionPlan.priceString}${subscriptionPlan.type === "annual" ? "/year" : subscriptionPlan.type === "monthly" ? "/month" : ""}`
                          : subscriptionPlan.type === "annual" ? "Yearly" : subscriptionPlan.type === "monthly" ? "Monthly" : "Premium"
                      }`
                    : isPremium
                      ? "✓ Outstanding Partner — Premium"
                      : "Free plan"}
                      </div>
                    </div>
                    <button onClick={async () => {
              try {
                await rcLogOut();
              } catch (e) {}
              if (!isPreviewMode) {
                try {
                  await signOutUser();
                } catch (e) {}
              }
              try {
                Object.keys(localStorage).forEach(k => {
                  if (k.startsWith('op_hydrated_')) sessionStorage.removeItem(k);
                });
              } catch (e) {}
              safeSet("authToken", "");
              safeSet("authUser", "");
              safeSet("subscribed", "");
              safeSet("subTier", "basic");
              setAuthUser(null);
              setSubscribed(false);
              setSubTier("basic");
              setAuthEmail("");
              setAuthPassword("");
            }} style={{
              width: "100%",
              background: "#111",
              border: "1px solid #333",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              color: "#888",
              cursor: "pointer",
              marginBottom: 8
            }}>
                      Sign Out
                    </button>
                    {!isPremium && <button onClick={() => setSubscribed(false)} style={{
            width: "100%",
            background: "linear-gradient(135deg,#8e44ad,#c0392b)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 8
          }}>
                        
                      </button>}
                    <button onClick={() => {
            setOnboardSlide(0);
            setReplayGuide(true);
          }} style={{
            width: "100%",
            background: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#888",
            cursor: "pointer"
          }}>
                      📖 Replay App Guide
                    </button>
                  </div>}
    
                {/* Danger zone - Reset */}
                <div style={{
          marginBottom: 20,
          background: "#1a0a0a",
          border: "1px solid #e74c3c20",
          borderRadius: 14,
          padding: 16
        }}>
                  <div style={{
            fontSize: 12,
            color: "#e74c3c",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 6
          }}>⚠️ Reset App</div>
                  <div style={{
            fontSize: 12,
            color: "#777",
            lineHeight: 1.5,
            marginBottom: 10
          }}>Clears all data — profile, logs, reminders, history. Use if you entered wrong information and want to start fresh.</div>
                  <div>
                    {!showResetConfirm ? <button onClick={() => setShowResetConfirm(true)} style={{
              background: "#1a0a0a",
              border: "1px solid #e74c3c40",
              borderRadius: 10,
              padding: "9px 16px",
              fontSize: 12,
              fontWeight: 700,
              color: "#e74c3c",
              cursor: "pointer"
            }}>
                        Reset All Data
                      </button> : <div style={{
              background: "#2a0a0a",
              border: "1px solid #e74c3c60",
              borderRadius: 10,
              padding: 14
            }}>
                        <div style={{
                fontSize: 12,
                color: "#f0ece4",
                marginBottom: 10,
                fontWeight: 600
              }}>Are you sure? This cannot be undone.</div>
                        <div style={{
                display: "flex",
                gap: 8
              }}>
                          <button onClick={() => {
                  ["wifeName", "wifeNickname", "wifeBirthMonth", "wifeBirthDay", "wifeBirthYear", "cycleDay", "cycleStartDate", "taskLog", "wifeNeeds", "usedTaskIds", "usedTextIds", "weeklyScore", "onboarded", "anniversaryDate", "firstDateDate", "favRestaurant", "favFood", "favDrink", "favStarbucks", "favFlower", "favColor", "favMovie", "favShow", "favSong", "favArtist", "loveLanguage", "biggestDream", "biggestFear", "whatStresses", "whatLightsUp", "howSheFeelsLoved", "kidsNames", "petsNames", "herMom", "herDad", "herBestFriend", "husbandNotes", "lastTextDate", "lastActivityDate", "sheSaid", "completedDays", "currentStreak", "longestStreak", "lastOpenDate", "sentTextIds", "sheSaidDone", "dateDone"].forEach(k => safeSet(k, ""));
                  setWifeName("");
                  setWifeNickname("");
                  setCycleDay(1);
                  setCycleStartDate("");
                  setTaskLog([]);
                  setCompletedDays([]);
                  setCurrentStreak(0);
                  setSheSaid([]);
                  setSentTextIds([]);
                  setLastTextDate("");
                  setOnboarded(false);
                  setShowResetConfirm(false);
                  setTab("today");
                }} style={{
                  flex: 1,
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 0",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}>
                            Yes, Reset Everything
                          </button>
                          <button onClick={() => setShowResetConfirm(false)} style={{
                  flex: 1,
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#888",
                  borderRadius: 8,
                  padding: "9px 0",
                  fontSize: 12,
                  cursor: "pointer"
                }}>
                            Cancel
                          </button>
                        </div>
                      </div>}
                  </div>
                </div>
    
                {/* About & Legal */}
                <div style={{
          marginBottom: 20,
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: 16
        }}>
                  <div style={{
            fontSize: 12,
            color: "#888",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>About & Legal</div>
                  <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}>
                    <button onClick={() => setLegalView("support")} style={{
              textAlign: "left",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14,
              color: "#f0ece4",
              cursor: "pointer"
            }}>💬 Support & FAQ</button>
                    <button onClick={() => setLegalView("privacy")} style={{
              textAlign: "left",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 14,
              color: "#f0ece4",
              cursor: "pointer"
            }}>🔒 Privacy Policy</button>
                  </div>
                </div>
    
                {/* Danger zone - Delete account */}
                <div style={{
          marginBottom: 20,
          background: "#1a0a0a",
          border: "1px solid #e74c3c20",
          borderRadius: 14,
          padding: 16
        }}>
                  <div style={{
            fontSize: 12,
            color: "#e74c3c",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 6
          }}>🗑️ Delete Account</div>
                  <div style={{
            fontSize: 12,
            color: "#777",
            lineHeight: 1.5,
            marginBottom: 10
          }}>Permanently deletes your account and all data from our servers. This cannot be undone.</div>
                  {!showDeleteConfirm ? <button onClick={() => setShowDeleteConfirm(true)} style={{
            background: "#1a0a0a",
            border: "1px solid #e74c3c40",
            borderRadius: 10,
            padding: "9px 16px",
            fontSize: 12,
            fontWeight: 700,
            color: "#e74c3c",
            cursor: "pointer"
          }}>
                      Delete My Account
                    </button> : <div style={{
            background: "#2a0a0a",
            border: "1px solid #e74c3c60",
            borderRadius: 10,
            padding: 14
          }}>
                      <div style={{
              fontSize: 12,
              color: "#f0ece4",
              marginBottom: 10,
              fontWeight: 600
            }}>Permanently delete your account and all data?</div>
                      <div style={{
              display: "flex",
              gap: 8
            }}>
                        <button disabled={deleteLoading} onClick={handleDeleteAccount} style={{
                flex: 1,
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 0",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                opacity: deleteLoading ? 0.7 : 1
              }}>
                          {deleteLoading ? "Deleting…" : "Yes, Delete Forever"}
                        </button>
                        <button disabled={deleteLoading} onClick={() => setShowDeleteConfirm(false)} style={{
                flex: 1,
                background: "#1a1a1a",
                border: "1px solid #333",
                color: "#888",
                borderRadius: 8,
                padding: "9px 0",
                fontSize: 12,
                cursor: "pointer"
              }}>
                          Cancel
                        </button>
                      </div>
                    </div>}
                </div>
              </div>}
    
            {/* CYCLE CALENDAR TAB */}
            {profileSection === "cycle" && <div>
                {/* Current status hero */}
                <div style={{
          background: `linear-gradient(135deg,${phase.color}20,${phase.color}08)`,
          border: `1.5px solid ${phase.color}40`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 20
        }}>
                  <div style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14
          }}>
                    <span style={{
              fontSize: 42
            }}>{phase.emoji}</span>
                    <div>
                      <div style={{
                fontSize: 11,
                color: phase.color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}>Right Now</div>
                      <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#f0ece4",
                fontFamily: "'Playfair Display',serif"
              }}>{phase.label} Phase</div>
                      <div style={{
                fontSize: 13,
                color: "#888"
              }}>Day {cycleDay} of 28</div>
                    </div>
                  </div>
                  {/* Full bar */}
                  <div style={{
            background: "#00000040",
            borderRadius: 10,
            height: 12,
            overflow: "hidden",
            marginBottom: 8
          }}>
                    <div style={{
              width: `${cycleDay / 28 * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg,#c0392b,${phase.color})`,
              borderRadius: 10
            }} />
                  </div>
                  <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
                    {Object.entries(CYCLE_PHASES).map(([k, p]) => <span key={k} style={{
              fontSize: 10,
              color: k === phase.key ? p.color : "#444",
              fontWeight: 700
            }}>{p.emoji}</span>)}
                  </div>
                  <p style={{
            fontSize: 13,
            color: "#ccc",
            lineHeight: 1.6,
            marginTop: 12,
            marginBottom: 0
          }}>{phase.tip}</p>
                </div>
    
                {/* 28-day visual calendar */}
                <div style={{
          marginBottom: 24
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 14
          }}>28-Day Cycle Map</div>
                  <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 5,
            marginBottom: 8
          }}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} style={{
              textAlign: "center",
              fontSize: 9,
              color: "#555",
              fontWeight: 700,
              padding: "2px 0"
            }}>{d}</div>)}
                  </div>
                  <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 5
          }}>
                    {Array.from({
              length: 28
            }, (_, i) => i + 1).map(day => {
              const p = getCurrentPhase(day);
              const isToday = day === cycleDay;
              const isPast = day < cycleDay;
              const isFuture = day > cycleDay;
              // Calculate real calendar date for this day
              const calDate = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + (day - 1) * 864e5) : null;
              const dateLabel = calDate ? calDate.toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric"
              }) : "";
              return <div key={day} onClick={() => setCycleDay(day)} style={{
                background: isToday ? p.color : isPast ? `${p.color}35` : `${p.color}12`,
                color: isToday ? "#fff" : isPast ? p.color : p.color + "88",
                borderRadius: 10,
                padding: "6px 2px 4px",
                textAlign: "center",
                cursor: "pointer",
                border: isToday ? `2px solid ${p.color}` : "2px solid transparent",
                transition: "all 0.2s",
                position: "relative"
              }}>
                          <div style={{
                  fontSize: 14,
                  fontWeight: isToday ? 800 : isPast ? 600 : 400,
                  lineHeight: 1
                }}>{day}</div>
                          <div style={{
                  fontSize: 8,
                  opacity: 0.7,
                  marginTop: 2
                }}>{dateLabel}</div>
                          {isToday && <div style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "#fff",
                  borderRadius: 6,
                  width: 8,
                  height: 8,
                  border: `2px solid ${p.color}`
                }} />}
                        </div>;
            })}
                  </div>
                </div>
    
                {/* Phase legend with dates */}
                <div style={{
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 12
          }}>Phase Schedule</div>
                  {Object.entries(CYCLE_PHASES).map(([key, p]) => {
            const startDay = p.days[0];
            const endDay = p.days[p.days.length - 1];
            const startDate = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + (startDay - 1) * 864e5) : null;
            const endDate = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + (endDay - 1) * 864e5) : null;
            const fmt = d => d ? d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            }) : "—";
            const isActive = key === phase.key;
            return <div key={key} style={{
              background: isActive ? `${p.color}15` : "#1a1a1a",
              borderLeft: `4px solid ${p.color}`,
              borderRadius: "0 14px 14px 0",
              padding: "14px 16px",
              marginBottom: 8,
              border: isActive ? `1px solid ${p.color}40` : "1px solid #2a2a2a"
            }}>
                        <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6
              }}>
                          <div style={{
                  fontWeight: 700,
                  color: p.color,
                  fontSize: 14
                }}>{p.emoji} {p.label}</div>
                          <div style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center"
                }}>
                            {isActive && <span style={{
                    fontSize: 10,
                    background: p.color,
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 7px",
                    fontWeight: 700
                  }}>NOW</span>}
                            <span style={{
                    fontSize: 12,
                    color: "#666"
                  }}>Days {startDay}–{endDay}</span>
                          </div>
                        </div>
                        <div style={{
                fontSize: 12,
                color: "#777",
                marginBottom: 6
              }}>{fmt(startDate)} – {fmt(endDate)}</div>
                        <div style={{
                fontSize: 12,
                color: "#aaa",
                lineHeight: 1.5
              }}>{p.tip}</div>
                        <div style={{
                display: "flex",
                gap: 5,
                flexWrap: "wrap",
                marginTop: 8
              }}>{p.needs.map(n => <NeedBadge key={n} need={n} />)}</div>
                      </div>;
          })}
                </div>
    
                {/* Next period prediction */}
                <div style={{
          background: "#1a0a0a",
          border: "1px solid #c0392b30",
          borderRadius: 16,
          padding: 18,
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#c0392b",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10
          }}>🌑 Next Period Prediction</div>
                  {(() => {
            const next1 = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + 28 * 864e5) : null;
            const next2 = cycleStartDate ? new Date(new Date(cycleStartDate).getTime() + 56 * 864e5) : null;
            const fmt = d => d ? d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric"
            }) : "—";
            const daysUntil = next1 ? Math.max(0, Math.round((next1 - new Date()) / 864e5)) : 0;
            return <div>
                        <div style={{
                display: "flex",
                gap: 12,
                marginBottom: 12
              }}>
                          <div style={{
                  flex: 1,
                  background: "#2a1a1a",
                  borderRadius: 12,
                  padding: "12px 14px"
                }}>
                            <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#c0392b"
                  }}>{fmt(next1)}</div>
                            <div style={{
                    fontSize: 11,
                    color: "#666",
                    marginTop: 2
                  }}>Next period · in {daysUntil} day{daysUntil !== 1 ? "s" : ""}</div>
                          </div>
                          <div style={{
                  flex: 1,
                  background: "#1a1a1a",
                  borderRadius: 12,
                  padding: "12px 14px"
                }}>
                            <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#888"
                  }}>{fmt(next2)}</div>
                            <div style={{
                    fontSize: 11,
                    color: "#555",
                    marginTop: 2
                  }}>Following cycle</div>
                          </div>
                        </div>
                        <div style={{
                fontSize: 12,
                color: "#666",
                lineHeight: 1.5
              }}>💡 Period predictions are estimates based on a 28-day cycle. Adjust the start date if her cycle runs early or late.</div>
                      </div>;
          })()}
                </div>
    
                {/* What to expect this week */}
                <div style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 16,
          padding: 18
        }}>
                  <div style={{
            fontSize: 12,
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 12
          }}>What to Expect This Week</div>
                  {(() => {
            const tips = {
              menstrual: ["She may have cramps or fatigue — don't take low energy personally", "Heat helps: offer a heating pad or warm bath", "Skip heavy plans and let her rest", "Physical affection (gentle) matters more than grand gestures", "This is the week to do extra household tasks without being asked"],
              follicular: ["Her energy and mood are rising — great week to make plans", "She's more open to new ideas and activities", "Good time to introduce something new you want to try together", "Flirtation and light playfulness land well this week", "She may be more social — plan something out or invite friends"],
              ovulation: ["She's at peak connection and magnetism — she wants to feel chosen", "This is the best week for romance, dates, and deep conversations", "Tell her specifically what you love about her", "Physical affection and intimacy are very welcome", "She may want to dress up or go somewhere she can shine — plan for it"],
              luteal: ["Her body is preparing for menstruation — everything feels heavier hormonally", "Handle tasks before she asks — anticipate her needs, don't wait", "Stay calm when she's emotional — your regulated nervous system calms hers", "Validate without trying to fix. Listen without solutions", "Comfort food, chocolate, massages, warm baths — do these unprompted", "Don't take her mood personally — it is not a verdict on you"]
            };
            return (tips[phase.key] || []).map((tip, i) => <div key={i} style={{
              display: "flex",
              gap: 10,
              padding: "8px 0",
              borderBottom: i < 4 ? "1px solid #2a2a2a" : "none"
            }}>
                        <span style={{
                color: phase.color,
                fontSize: 14,
                flexShrink: 0,
                marginTop: 1
              }}>→</span>
                        <span style={{
                fontSize: 13,
                color: "#ccc",
                lineHeight: 1.5
              }}>{tip}</span>
                      </div>);
          })()}
                </div>
              </div>}
    
            {/* YOUR CODE — LEAD · PROTECT · PROVIDE */}
            {profileSection === "lpp" && <div>
                {/* Header */}
                <div style={{
          background: "linear-gradient(135deg,#1a0e00,#0d0d0d)",
          border: "1px solid #e67e2240",
          borderRadius: 18,
          padding: 20,
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 11,
            color: "#e67e22",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 6
          }}>The Husband's Code</div>
                  <div style={{
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Playfair Display',serif",
            marginBottom: 10,
            lineHeight: 1.3
          }}>Lead · Protect · Provide · Stay Attractive · Be Masculine</div>
                  <div style={{
            fontSize: 13,
            color: "#aaa",
            lineHeight: 1.7
          }}>Five pillars. One mission — she feels Seen, Heard, Chosen, Safe, Alive, and <span style={{
              color: "#e91e8c",
              fontWeight: 700
            }}>Feminine</span>. Radiant and fully herself because of the man standing next to her.</div>
                </div>
    
                {/* SHC connection banner */}
                <div style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 12,
            color: "#888",
            lineHeight: 1.8
          }}>
                    <span style={{
              color: "#e67e22",
              fontWeight: 700
            }}>Your five pillars</span> unlock <span style={{
              color: "#9b59b6",
              fontWeight: 700
            }}>her six feelings</span>. Lead + <span style={{
              color: "#d35400",
              fontWeight: 700
            }}>Be Masculine</span> → she feels <span style={{
              color: "#f1c40f"
            }}>Alive</span> + <span style={{
              color: "#e91e8c"
            }}>Chosen</span> + <span style={{
              color: "#e91e8c"
            }}>Feminine</span>. Protect → <span style={{
              color: "#27ae60"
            }}>Safe</span> + <span style={{
              color: "#3498db"
            }}>Heard</span>. Provide → <span style={{
              color: "#e91e8c"
            }}>Chosen</span> + <span style={{
              color: "#9b59b6"
            }}>Seen</span>. Stay Attractive → <span style={{
              color: "#f1c40f"
            }}>Alive</span> + <span style={{
              color: "#e91e8c"
            }}>Feminine</span>.
                  </div>
                </div>
    
                {/* Three pillars */}
                {Object.entries(LPP).map(([key, p]) => <div key={key} style={{
          background: "#1a1a1a",
          border: `1.5px solid ${p.color}30`,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 16
        }}>
                    {/* Pillar header */}
                    <div style={{
            background: `linear-gradient(135deg,${p.color}20,${p.color}08)`,
            padding: "18px 20px"
          }}>
                      <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 10
            }}>
                        <span style={{
                fontSize: 34
              }}>{p.emoji}</span>
                        <div>
                          <div style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: p.color,
                  fontFamily: "'Playfair Display',serif"
                }}>{p.label}</div>
                          <div style={{
                  display: "flex",
                  gap: 5,
                  marginTop: 4
                }}>
                            {p.neuro.map(c => <NeuroBadge key={c} chem={c} showLabel />)}
                          </div>
                        </div>
                      </div>
                      <p style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7,
              margin: 0
            }}>{p.desc}</p>
                    </div>
    
                    {/* Daily actions */}
                    <div style={{
            padding: "14px 20px",
            borderTop: `1px solid ${p.color}20`
          }}>
                      <div style={{
              fontSize: 11,
              color: p.color,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10
            }}>Daily Actions</div>
                      {p.dailyActions.map((a, i) => <div key={i} style={{
              display: "flex",
              gap: 10,
              padding: "7px 0",
              borderBottom: i < p.dailyActions.length - 1 ? `1px solid #2a2a2a` : "none"
            }}>
                          <span style={{
                color: p.color,
                fontWeight: 700,
                flexShrink: 0
              }}>→</span>
                          <span style={{
                fontSize: 13,
                color: "#ccc",
                lineHeight: 1.5
              }}>{a}</span>
                        </div>)}
                    </div>
    
                    {/* What to say */}
                    <div style={{
            padding: "12px 20px",
            borderTop: `1px solid ${p.color}20`,
            background: "#111"
          }}>
                      <div style={{
              fontSize: 11,
              color: "#666",
              fontWeight: 600,
              marginBottom: 6
            }}>WHAT TO SAY</div>
                      <div style={{
              fontSize: 14,
              color: "#f0ece4",
              fontStyle: "italic",
              lineHeight: 1.6
            }}>"{p.scriptLine}"</div>
                    </div>
    
                    {/* Neuro science */}
                    <div style={{
            padding: "12px 20px",
            borderTop: `1px solid ${p.color}20`
          }}>
                      <div style={{
              fontSize: 11,
              color: "#666",
              fontWeight: 600,
              marginBottom: 6
            }}>🧠 WHY IT WORKS</div>
                      <div style={{
              fontSize: 12,
              color: "#888",
              lineHeight: 1.6
            }}>{p.neuroWhy}</div>
                    </div>
    
                    {/* Avoidance */}
                    <div style={{
            padding: "12px 20px",
            borderTop: `1px solid #e74c3c20`,
            background: "#1a0a0a"
          }}>
                      <div style={{
              fontSize: 11,
              color: "#e74c3c",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6
            }}>⚠️ Important Distinction</div>
                      <div style={{
              fontSize: 12,
              color: "#aaa",
              lineHeight: 1.6
            }}>{p.avoidance}</div>
                    </div>
                  </div>)}
    
                {/* Daily commitment card */}
                <div style={{
          background: "linear-gradient(135deg,#1a0e00,#0a0a1a)",
          border: "1px solid #e67e2230",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20
        }}>
                  <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#e67e22",
            marginBottom: 12
          }}>🧭 Daily Commitment Check</div>
                  {[{
            q: "Did I make at least one decision today so she didn't have to?",
            pillar: "lead"
          }, {
            q: "Did I shield her from at least one stressor today?",
            pillar: "protect"
          }, {
            q: "Did I provide presence, not just presence in the building?",
            pillar: "provide"
          }, {
            q: "Did she feel more alive — more herself — because I was there?",
            pillar: "lead"
          }, {
            q: "Am I someone she still finds attractive? Did I invest in myself?",
            pillar: "attractive"
          }, {
            q: "Was I grounded and certain today — did she feel my masculine presence?",
            pillar: "masculine"
          }, {
            q: "Did she get to be soft, playful, or fully her feminine self around me today?",
            pillar: "masculine"
          }].map((item, i) => <div key={i} style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            padding: "10px 0",
            borderBottom: i < 2 ? "1px solid #2a2a2a" : "none"
          }}>
                      <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: LPP[item.pillar]?.color || "#e67e22",
              background: (LPP[item.pillar]?.color || "#e67e22") + "20",
              borderRadius: 8,
              padding: "2px 8px",
              flexShrink: 0,
              marginTop: 2
            }}>{LPP[item.pillar]?.label || item.pillar}</span>
                      <span style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.5
            }}>{item.q}</span>
                    </div>)}
                </div>
              </div>}
    
            {/* NUMEROLOGY */}
            {profileSection === "numerology" && <div>
                {!numerology ? <div style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#555"
        }}>
                    <div style={{
            fontSize: 40,
            marginBottom: 12
          }}>🔢</div>
                    <div style={{
            fontSize: 15
          }}>Enter her full birthday in Overview to calculate her Life Path number</div>
                  </div> : <div>
                    {/* Hero */}
                    <div style={{
            background: `linear-gradient(135deg,${numerology.color}22,${numerology.color}08)`,
            border: `1.5px solid ${numerology.color}40`,
            borderRadius: 20,
            padding: 22,
            marginBottom: 20
          }}>
                      <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 14
            }}>
                        <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: numerology.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0
              }}>{numerology.number}</div>
                        <div>
                          <div style={{
                  fontSize: 11,
                  color: numerology.color,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em"
                }}>Life Path Number</div>
                          <div style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#f0ece4",
                  fontFamily: "'Playfair Display',serif"
                }}>{numerology.name} {numerology.emoji}</div>
                        </div>
                      </div>
                      <p style={{
              fontSize: 14,
              color: "#ccc",
              lineHeight: 1.7,
              margin: "0 0 12px"
            }}>{numerology.loveStyle}</p>
                      <div style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap"
            }}>{numerology.traits.map(t => <span key={t} style={{
                fontSize: 11,
                color: numerology.color,
                background: numerology.color + "18",
                borderRadius: 10,
                padding: "2px 10px",
                fontWeight: 600
              }}>{t}</span>)}</div>
                    </div>
    
                    {/* Game Plan */}
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 12,
              color: "#f39c12",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8
            }}>🎯 Your Game Plan</div>
                      <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7
            }}>{numerology.gamePlan}</div>
                    </div>
    
                    {/* Date ideas */}
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 12,
              color: "#1abc9c",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8
            }}>🗓️ Date Ideas She'll Love</div>
                      {numerology.dateIdeas.map((d, i) => <div key={i} style={{
              fontSize: 13,
              color: "#ccc",
              padding: "6px 0",
              borderBottom: i < numerology.dateIdeas.length - 1 ? "1px solid #2a2a2a" : "none"
            }}>→ {d}</div>)}
                    </div>
    
                    {/* Texts she likes */}
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 12,
              color: "#9b59b6",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8
            }}>💬 How She Likes to Be Texted</div>
                      <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7
            }}>{numerology.textsLike}</div>
                    </div>
    
                    {/* Avoid */}
                    <div style={{
            background: "#1a0a0a",
            border: "1px solid #e74c3c30",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 12,
              color: "#e74c3c",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8
            }}>⚠️ What to Avoid</div>
                      <div style={{
              fontSize: 13,
              color: "#aaa",
              lineHeight: 1.7
            }}>{numerology.avoid}</div>
                    </div>
    
                    {/* How calculated */}
                    <div style={{
            background: "#111",
            borderRadius: 12,
            padding: "12px 14px"
          }}>
                      <div style={{
              fontSize: 11,
              color: "#555",
              lineHeight: 1.6
            }}>
                        Life Path = all digits of birthday reduced to a single digit (or master number 11/22/33). 
                        Calculated from {wifeBirthMonth}/{wifeBirthDay}/{wifeBirthYear} = <strong style={{
                color: numerology.color
              }}>{numerology.number}</strong>
                      </div>
                    </div>
                  </div>}
              </div>}
    
            {/* WESTERN ZODIAC */}
            {profileSection === "western" && <div>
                {!zodiac ? <div style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#555"
        }}>
                    <div style={{
            fontSize: 40,
            marginBottom: 12
          }}>♈</div>
                    <div style={{
            fontSize: 15
          }}>Enter her birthday in Overview to unlock her zodiac profile</div>
                  </div> : <div>
                    <div style={{
            background: `linear-gradient(135deg,${zodiac.color}20,${zodiac.color}08)`,
            border: `1.5px solid ${zodiac.color}40`,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
          }}>
                      <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 14
            }}>
                        <span style={{
                fontSize: 40
              }}>{zodiac.emoji}</span>
                        <div>
                          <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: zodiac.color,
                  fontFamily: "'Playfair Display',serif"
                }}>{zodiac.sign}</div>
                          <div style={{
                  fontSize: 13,
                  color: "#888"
                }}>{zodiac.dates} · {zodiac.element} Sign</div>
                        </div>
                      </div>
                      <p style={{
              fontSize: 14,
              color: "#ccc",
              lineHeight: 1.7,
              margin: "0 0 12px"
            }}>{zodiac.loveStyle}</p>
                      <div style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap"
            }}>{zodiac.traits.map(t => <span key={t} style={{
                fontSize: 11,
                color: zodiac.color,
                background: zodiac.color + "18",
                borderRadius: 10,
                padding: "2px 10px",
                fontWeight: 600
              }}>{t}</span>)}</div>
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f0ece4",
              marginBottom: 10
            }}>💡 What She Loves</div>
                      {zodiac.loves.map((l, i) => <div key={i} style={{
              fontSize: 13,
              color: "#ccc",
              padding: "6px 0",
              borderBottom: i < zodiac.loves.length - 1 ? "1px solid #2a2a2a" : "none"
            }}>→ {l}</div>)}
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#e74c3c",
              marginBottom: 10
            }}>⚠️ What She Avoids</div>
                      {zodiac.avoids.map((a, i) => <div key={i} style={{
              fontSize: 13,
              color: "#ccc",
              padding: "6px 0",
              borderBottom: i < zodiac.avoids.length - 1 ? "1px solid #2a2a2a" : "none"
            }}>✕ {a}</div>)}
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f39c12",
              marginBottom: 10
            }}>🎯 Game Plan</div>
                      <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7
            }}>{zodiac.gamePlan}</div>
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#9b59b6",
              marginBottom: 10
            }}>📱 Texts She Loves</div>
                      <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7
            }}>{zodiac.textsLike}</div>
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1abc9c",
              marginBottom: 10
            }}>🗓️ Date Ideas</div>
                      {zodiac.dateIdeas.map((d, i) => <div key={i} style={{
              fontSize: 13,
              color: "#ccc",
              padding: "6px 0",
              borderBottom: i < zodiac.dateIdeas.length - 1 ? "1px solid #2a2a2a" : "none"
            }}>→ {d}</div>)}
                    </div>
                  </div>}
              </div>}
    
            {/* CHINESE ZODIAC */}
            {profileSection === "chinese" && <div>
                {!chineseZodiac ? <div style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#555"
        }}>
                    <div style={{
            fontSize: 40,
            marginBottom: 12
          }}>🐉</div>
                    <div style={{
            fontSize: 15
          }}>Enter her birth year in Overview to unlock her Chinese zodiac</div>
                  </div> : <div>
                    <div style={{
            background: `linear-gradient(135deg,${chineseZodiac.color}20,${chineseZodiac.color}08)`,
            border: `1.5px solid ${chineseZodiac.color}40`,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
          }}>
                      <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 14
            }}>
                        <span style={{
                fontSize: 40
              }}>{chineseZodiac.emoji}</span>
                        <div>
                          <div style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: chineseZodiac.color,
                  fontFamily: "'Playfair Display',serif"
                }}>Year of the {chineseZodiac.sign}</div>
                          <div style={{
                  fontSize: 13,
                  color: "#888"
                }}>Chinese Zodiac · Born {wifeBirthYear}</div>
                        </div>
                      </div>
                      <p style={{
              fontSize: 14,
              color: "#ccc",
              lineHeight: 1.7,
              margin: "0 0 12px"
            }}>{chineseZodiac.loveStyle}</p>
                      <div style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap"
            }}>{chineseZodiac.traits.map(t => <span key={t} style={{
                fontSize: 11,
                color: chineseZodiac.color,
                background: chineseZodiac.color + "18",
                borderRadius: 10,
                padding: "2px 10px",
                fontWeight: 600
              }}>{t}</span>)}</div>
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#f39c12",
              marginBottom: 10
            }}>🎯 Game Plan</div>
                      <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7
            }}>{chineseZodiac.gamePlan}</div>
                    </div>
    
                    <div style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            padding: 18,
            marginBottom: 14
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1abc9c",
              marginBottom: 10
            }}>🎁 Gifts & Experiences She'll Love</div>
                      {chineseZodiac.gifts.map((g, i) => <div key={i} style={{
              fontSize: 13,
              color: "#ccc",
              padding: "6px 0",
              borderBottom: i < chineseZodiac.gifts.length - 1 ? "1px solid #2a2a2a" : "none"
            }}>→ {g}</div>)}
                    </div>
    
                    <div style={{
            background: "#1a0a0a",
            border: "1px solid #e74c3c30",
            borderRadius: 16,
            padding: 18
          }}>
                      <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#e74c3c",
              marginBottom: 8
            }}>⚠️ Never Do This</div>
                      <div style={{
              fontSize: 13,
              color: "#ccc",
              lineHeight: 1.7
            }}>{chineseZodiac.avoid}</div>
                    </div>
                  </div>}
              </div>}
    
            {/* GAME PLAN */}
            {profileSection === "gameplan" && <div>
                {!isPremium ? <PremiumGate feature="Game Plan" onUpgrade={() => {
          setSubscribed(false);
        }} /> : <div>
                <div style={{
            background: `${phase.color}12`,
            border: `1px solid ${phase.color}30`,
            borderRadius: 14,
            padding: 16,
            marginBottom: 20
          }}>
                  <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: phase.color,
              marginBottom: 6
            }}>🎯 Monthly Game Plan</div>
                  <div style={{
              fontSize: 13,
              color: "#aaa",
              lineHeight: 1.5
            }}>
                    Combines her <span style={{
                color: phase.color
              }}>{phase.label} phase</span>
                    {zodiac && <>, <span style={{
                  color: zodiac.color
                }}>{zodiac.sign}</span> zodiac</>}
                    {chineseZodiac && <>, <span style={{
                  color: chineseZodiac.color
                }}>{chineseZodiac.sign}</span> Chinese zodiac</>}
                    {wifeNeeds.length > 0 && <> and her core needs</>} into one tailored strategy.
                  </div>
                </div>
    
                <div style={{
            textAlign: "center",
            padding: "20px 0"
          }}>
                  <div style={{
              fontSize: 36,
              marginBottom: 12
            }}>🎯</div>
                  <div style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'Playfair Display',serif",
              color: "#f0ece4",
              marginBottom: 8
            }}>Game Plan</div>
                  <div style={{
              fontSize: 13,
              color: "#555",
              lineHeight: 1.6
            }}>Your personalized strategy — built from her cycle, zodiac, and log data. Coming in the next update.</div>
                </div>
                </div>}
              </div>}
          </div>
  );
}
