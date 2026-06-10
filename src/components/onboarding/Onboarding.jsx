import { safeSet } from "../../utils/helpers.js";

// Onboarding slides — shown after auth+subscription until completed (or when replaying the guide).
// State is owned by App and passed in as props.
export default function Onboarding({ onboardSlide, setOnboardSlide, onboarded, setOnboarded, replayGuide, setReplayGuide, setTab, wifeNickname }) {
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
}
