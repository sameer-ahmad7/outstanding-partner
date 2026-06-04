import { useState, useEffect, useRef } from "react";

// ─── Neurochemistry ───────────────────────────────────────────────────────────
const NEURO = {
  dopamine:   { label:"Dopamine",   emoji:"⚡", color:"#f1c40f", short:"Anticipation & reward",  desc:"Triggered by surprise, novelty, and earned rewards. Creates excitement and motivation." },
  oxytocin:   { label:"Oxytocin",   emoji:"🤝", color:"#e91e8c", short:"Bonding & trust",        desc:"Released through touch, eye contact, and feeling truly seen. The 'love hormone'." },
  serotonin:  { label:"Serotonin",  emoji:"☀️", color:"#27ae60", short:"Calm & confidence",     desc:"Boosted when she feels respected, valued, and secure. Creates lasting mood elevation." },
  endorphins: { label:"Endorphins", emoji:"🔥", color:"#e67e22", short:"Joy & euphoria",         desc:"Released through laughter, physical activity, and pleasure. Natural highs." },
};

// ─── Seen · Heard · Chosen · Safe · Alive Framework ─────────────────────────
const SHC = {
  seen: {
    label:"Seen",
    emoji:"👁️",
    color:"#9b59b6",
    desc:"She feels noticed in the specific details — her effort, her mood, her growth, what she carries quietly.",
    triggers:["Name something specific you observed","Compliment effort not just result","Reference something she said weeks ago","Notice when she's off before she says anything"],
  },
  heard: {
    label:"Heard",
    emoji:"👂",
    color:"#3498db",
    desc:"She feels her words, feelings, and thoughts matter — that you listen without fixing, judging, or rushing.",
    triggers:["Ask a real question and stay silent after","Repeat back what she said in your own words","Don't offer solutions unless she asks","Follow up on something she mentioned before"],
  },
  chosen: {
    label:"Chosen",
    emoji:"💎",
    color:"#e91e8c",
    desc:"She feels deliberately selected — not settled for. That you'd pick her again today, on purpose, over everything else.",
    triggers:["Express a specific reason you love her life","Make a decision that clearly prioritizes her","Pursue her like you're still trying to win her","Tell her what life would look like without her — then don't let that happen"],
  },
  safe: {
    label:"Safe",
    emoji:"🛡️",
    color:"#27ae60",
    desc:"She feels emotionally protected — no walking on eggshells, no fear of judgment, no anxiety about your reaction. Safety is the foundation. Nothing else lands without it.",
    triggers:["Stay calm when she shares something hard","Never use her vulnerabilities against her","Be consistent — same man in public and private","React to her emotions without escalating","Make it safe to be honest, even when it's uncomfortable for you"],
  },
  alive: {
    label:"Alive",
    emoji:"🔆",
    color:"#f1c40f",
    desc:"She feels energized, vibrant, and fully awake to her own life. Not just loved — lit up. Like being with you makes her more of herself, not less.",
    triggers:["Plan something that sparks genuine excitement in her","Make her laugh until she can't breathe","Try something completely new together","Remind her of who she was before life got heavy","Create a moment she'll want to tell someone about"],
  },
  feminine: {
    label:"Feminine",
    emoji:"🌸",
    color:"#e91e8c",
    desc:"She feels free to be fully herself — soft, playful, sensual, emotional, radiant. Her feminine energy flourishes when she feels safe, chosen, and led by a grounded man. This is not a performance. It is her natural state when the conditions are right.",
    triggers:["Create so much safety she never has to be in survival mode around you","Pursue her — she should never feel like she has to chase your attention","Let her be soft without needing her to be strong","Lead so well she can relax into being, not doing","Flirt with her — treat her like a woman you are still trying to win","Compliment her grace and beauty, not just her strength"],
  },
};

// ─── Lead · Protect · Provide · Stay Attractive · Be Masculine ──────────────
const LPP = {
  lead: {
    label:"Lead",
    emoji:"🧭",
    color:"#e67e22",
    desc:"A man who leads doesn't control — he creates direction, makes decisions, and takes ownership so she never has to carry the weight alone. She can relax because he's got it.",
    dailyActions:[
      "Make a decision without asking her to make it for you",
      "Plan the evening — have it ready when she gets home",
      "Set the tone of the home when things get tense",
      "Initiate the hard conversation instead of avoiding it",
      "Own your mistakes fast and correct course — leaders don't hide from accountability",
    ],
    avoidance:"A man who leads does NOT dominate, dismiss, or demand. Leadership in love = direction with warmth. She follows a man she trusts, not one she fears.",
    scriptLine:"I've got this handled. You don't need to worry about it.",
    neuro:["serotonin","oxytocin"],
    neuroWhy:"When she trusts that someone capable is leading, her cortisol drops and serotonin rises. Her nervous system relaxes. Oxytocin follows naturally from that felt safety.",
  },
  protect: {
    label:"Protect",
    emoji:"🛡️",
    color:"#c0392b",
    desc:"Protection isn't just physical — it's emotional, social, and energetic. He protects her peace, her reputation, her heart, and her capacity to thrive. She should never feel alone in a storm.",
    dailyActions:[
      "Defend her when she's not in the room — never talk badly about her to others",
      "Shield her from unnecessary stress — intercept problems before she has to deal with them",
      "Stay calm when she's overwhelmed — your regulated nervous system regulates hers",
      "Create a home where she feels safe to fall apart if she needs to",
      "Protect her time and energy — say no to things that drain her",
    ],
    avoidance:"Protection is NOT possessiveness, jealousy, or controlling who she talks to. It is making her feel that the world is safer because you exist in her life.",
    scriptLine:"I'm not going anywhere. Whatever this is, we handle it together.",
    neuro:["oxytocin","serotonin","endorphins"],
    neuroWhy:"Feeling physically and emotionally protected is one of the most powerful oxytocin triggers in women. It also elevates serotonin through certainty and lowers cortisol through felt safety.",
  },
  provide: {
    label:"Provide",
    emoji:"💪",
    color:"#f39c12",
    desc:"Providing isn't only financial — it's providing emotional stability, presence, energy, attention, laughter, and a vision for the future. He fills the home with what she needs to flourish.",
    dailyActions:[
      "Provide presence — be fully there, not halfway somewhere else",
      "Provide emotional fuel — check in, affirm, and encourage her growth",
      "Provide stability — handle your finances, keep your word, stay consistent",
      "Provide vision — show her you're building toward something for both of you",
      "Provide joy — bring lightness to the home, not just responsibility",
    ],
    avoidance:"Providing is NOT transactional. It's not 'I pay the bills so I'm done.' She needs you to provide across all dimensions — not just the one that's easiest for you.",
    scriptLine:"I'm building something for us. I want you to have everything you deserve.",
    neuro:["dopamine","serotonin","oxytocin"],
    neuroWhy:"A sense of being provided for — emotionally, physically, financially — triggers deep serotonin (security) and dopamine (future anticipation). Feeling cared for holistically = oxytocin bonding.",
  },
  attractive: {
    label:"Stay Attractive",
    emoji:"🔥",
    color:"#8e44ad",
    desc:"Attraction doesn't maintain itself. A man who keeps growing, keeps his standards, stays sharp in mind and body — gives her something to stay drawn to. She needs to want you, not just love you.",
    dailyActions:[
      "Work out or move your body — she notices the discipline, not just the physique",
      "Dress with intention — don't let yourself go into comfort-only mode",
      "Keep growing intellectually — read, learn, have opinions worth discussing",
      "Maintain ambition — she needs to see you're building something, not just existing",
      "Have a life, hobbies, and friends — a man with depth is magnetic",
      "Groom and present yourself like you're still trying to impress her",
    ],
    avoidance:"Attraction isn't vanity. It's respect — for her, for yourself, for the relationship. Letting yourself go says 'I've already won.' She needs to feel like she's still choosing someone worth choosing.",
    scriptLine:"I never want you to stop feeling lucky you picked me.",
    neuro:["dopamine","serotonin"],
    neuroWhy:"Novelty and perceived mate value trigger dopamine — the same circuits activated in early attraction. When he stays sharp, she stays curious. Serotonin rises when she feels proud of her partner.",
  },
  masculine: {
    label:"Be Masculine",
    emoji:"⚡",
    color:"#d35400",
    desc:"Masculinity isn't aggression — it's presence, direction, groundedness, and depth. It's the ability to stay calm when she's emotional, make decisions without collapsing under pressure, and hold space so large that she can fully exhale. A man in his masculine polarity is one of the rarest things a woman will ever experience.",
    dailyActions:[
      "Hold your frame — don't collapse emotionally when challenged or tested",
      "Make a decision and own it completely — no second-guessing out loud",
      "Stay grounded when she's anxious or emotional — be the anchor, not the storm",
      "Have a clear vision for your life and be actively building toward it",
      "Speak less, mean more — let your presence say what words don't need to",
      "Don't seek her approval before acting — lead, then invite her along",
      "Maintain standards — for yourself, for the home, for how you're treated",
    ],
    avoidance:"Masculinity is NOT shutting down emotions or being cold. It is NOT controlling, bullying, or being rigid. It is being so grounded in who you are that nothing shakes you — and so present that she never feels alone. The man who performs masculinity is not masculine. The man who IS it, is.",
    scriptLine:"I've got this. Trust me.",
    neuro:["dopamine","serotonin"],
    neuroWhy:"A woman's nervous system reads masculine presence as safety. When he is calm, grounded, and certain — her cortisol drops and serotonin rises automatically. His nervous system regulation literally regulates hers. This is biology, not preference.",
  },
};

// LPP task mapping (by task id) — which pillar each task primarily serves
const TASK_LPP = {
  1:"lead", 2:"lead", 3:"lead", 4:"provide", 5:"protect",
  6:"protect", 7:"protect", 8:"provide", 9:"lead", 10:"lead",
  11:"provide", 12:"lead", 13:"provide", 14:"lead", 15:"provide",
  16:"lead", 17:"lead", 18:"protect", 19:"lead", 20:"provide",
  21:"protect", 22:"lead", 23:"lead", 24:"protect", 25:"lead",
  26:"provide", 27:"protect", 28:"lead", 29:"provide", 30:"protect",
  31:"lead", 32:"provide", 33:"provide", 34:"protect", 35:"lead",
  36:"provide", 37:"provide", 38:"lead", 39:"protect", 40:"lead",
};

// ─── Western Zodiac ───────────────────────────────────────────────────────────
const ZODIAC_SIGNS = [
  { sign:"Aries",       emoji:"♈", dates:"Mar 21–Apr 19", element:"Fire",  color:"#e74c3c",
    traits:["Bold","Passionate","Independent","Competitive","Spontaneous"],
    loves:["Being pursued","Excitement","Direct compliments","Physical affection","Leading"],
    avoids:["Being ignored","Slow pace","Indecision","Feeling controlled"],
    loveStyle:"She needs to feel desired and pursued. Match her energy. Be direct — she respects confidence.",
    dateIdeas:["Spontaneous road trip","Rock climbing or adventure sport","Trying something totally new together","Surprise plans she can brag about"],
    textsLike:"Bold, direct, a little playful. Don't overthink it — she wants authenticity.",
    gamePlan:"Lead with action. She doesn't need words nearly as much as she needs you to DO something bold. Surprise her with a decision already made." },
  { sign:"Taurus",      emoji:"♉", dates:"Apr 20–May 20", element:"Earth", color:"#27ae60",
    traits:["Loyal","Sensual","Patient","Stubborn","Comfort-loving"],
    loves:["Physical touch","Good food","Stability","Luxury experiences","Consistency"],
    avoids:["Sudden changes","Being rushed","Feeling insecure","Cheap gestures"],
    loveStyle:"She needs security and sensory pleasure. Quality over quantity always. Slow, intentional love.",
    dateIdeas:["Upscale dinner at home or out","Spa day or massage","Wine tasting","Beautiful nature walk"],
    textsLike:"Warm, consistent, grounding. She values steady over clever.",
    gamePlan:"Be rock solid. Show up exactly when you say you will. Create comfort and luxury. She blooms when she feels safe and indulged." },
  { sign:"Gemini",      emoji:"♊", dates:"May 21–Jun 20", element:"Air",   color:"#f39c12",
    traits:["Witty","Curious","Adaptable","Social","Dual-natured"],
    loves:["Intellectual conversation","Variety","Humor","Surprises","Learning new things"],
    avoids:["Boredom","Repetition","Being talked down to","Emotional heaviness"],
    loveStyle:"She needs mental stimulation as much as physical. Keep her guessing. Wit and intelligence are foreplay.",
    dateIdeas:["Trivia night","Explore a new neighborhood","Comedy show","Museum + dinner combo"],
    textsLike:"Playful, clever, unexpected. Make her laugh and think at the same time.",
    gamePlan:"Never let things get stale. Rotate what you do, what you talk about, where you go. Engage her mind first — everything else follows." },
  { sign:"Cancer",      emoji:"♋", dates:"Jun 21–Jul 22", element:"Water", color:"#3498db",
    traits:["Nurturing","Intuitive","Protective","Emotional","Home-loving"],
    loves:["Deep emotional safety","Acts of care","Nostalgia","Home-cooked meals","Being remembered"],
    avoids:["Feeling dismissed","Public conflict","Emotional coldness","Inconsistency"],
    loveStyle:"She needs to feel emotionally held. She reads energy. Show up soft, warm, and consistent.",
    dateIdeas:["Cook her favorite childhood meal","Recreate a first date","Cozy movie night at home","Scrapbook or memory making activity"],
    textsLike:"Warm, emotionally open, nostalgic. Reference a shared memory.",
    gamePlan:"Be her safe place. Emotional safety = everything. Remember the small details she's mentioned. She notices everything — the thing you forgot and the thing you remembered." },
  { sign:"Leo",         emoji:"♌", dates:"Jul 23–Aug 22", element:"Fire",  color:"#e67e22",
    traits:["Confident","Generous","Dramatic","Loyal","Attention-loving"],
    loves:["Being celebrated","Public affirmation","Grand gestures","Loyalty","Feeling like royalty"],
    avoids:["Being ignored","Criticism in public","Feeling ordinary","Disloyalty"],
    loveStyle:"She needs to feel like the most important person in the room — especially your room. Celebrate her loudly.",
    dateIdeas:["Fancy dinner where she can dress up","Event where she's the star","Surprise party or public declaration","VIP experience of any kind"],
    textsLike:"Expressive, celebratory, specific. Tell her exactly why she's extraordinary.",
    gamePlan:"Make her feel chosen, celebrated, and adored every single day. She gives 100% loyalty — she needs to feel worth it. Grand gestures matter to her more than most." },
  { sign:"Virgo",       emoji:"♍", dates:"Aug 23–Sep 22", element:"Earth", color:"#1abc9c",
    traits:["Analytical","Devoted","Detail-oriented","Practical","Perfectionist"],
    loves:["Thoughtful gestures","Organization","Being appreciated for effort","Quality time","Self-improvement"],
    avoids:["Chaos","Carelessness","Being criticized","Superficiality"],
    loveStyle:"She shows love through service and attention to detail. She needs the same in return — notice the small things she does.",
    dateIdeas:["Plan a perfectly organized trip","Cook together with a real recipe","Wellness activity","Bookstore + coffee date"],
    textsLike:"Thoughtful, specific, sincere. No fluff — she sees through it instantly.",
    gamePlan:"The details matter enormously to her. Notice what she's said. Follow through on small things. She won't ask twice — so do it right the first time." },
  { sign:"Libra",       emoji:"♎", dates:"Sep 23–Oct 22", element:"Air",   color:"#9b59b6",
    traits:["Harmonious","Charming","Romantic","Indecisive","Fair-minded"],
    loves:["Romance","Beautiful environments","Partnership","Thoughtful decisions","Being heard"],
    avoids:["Conflict","Imbalance","Ugliness","Being rushed to decide"],
    loveStyle:"She thrives in beauty and balance. She needs to feel like true partners. Make decisions — it relieves her.",
    dateIdeas:["Art gallery + dinner","Romantic picnic with beautiful setup","Live music","Couples spa"],
    textsLike:"Romantic, balanced, beautiful. Choose your words with care — she appreciates eloquence.",
    gamePlan:"Create beauty and harmony around her. Make the decisions she agonizes over. Be her partner in the truest sense — she wants to be a team, not just a couple." },
  { sign:"Scorpio",     emoji:"♏", dates:"Oct 23–Nov 21", element:"Water", color:"#c0392b",
    traits:["Intense","Loyal","Magnetic","Perceptive","Transformative"],
    loves:["Deep truth","Unwavering loyalty","Emotional depth","Mystery","Power dynamics"],
    avoids:["Betrayal","Superficiality","Being lied to","Weakness","Boredom"],
    loveStyle:"She needs depth and intensity. She will test you. Show strength, loyalty, and emotional courage.",
    dateIdeas:["Intimate private dinner","Deep conversation somewhere quiet","Escape room or mystery event","Transformative experience (retreat, workshop)"],
    textsLike:"Deep, honest, a little intense. Don't play games — she will win and lose respect for you.",
    gamePlan:"Be utterly loyal and emotionally brave. She senses everything beneath the surface. The fastest way to lose her = dishonesty. The fastest way to win her = showing up with full truth and strength." },
  { sign:"Sagittarius", emoji:"♐", dates:"Nov 22–Dec 21", element:"Fire",  color:"#e74c3c",
    traits:["Adventurous","Optimistic","Philosophical","Freedom-loving","Honest"],
    loves:["Travel","Big ideas","Laughter","Freedom","Growth"],
    avoids:["Being caged","Pessimism","Small talk","Jealousy","Routine"],
    loveStyle:"She needs to feel free even while committed. Be her adventure partner. She loves a man who is growing.",
    dateIdeas:["Book a trip — even just one night away","Outdoor adventure","TED talk + debate night","International food crawl"],
    textsLike:"Optimistic, philosophical, a little wild. Make her smile and think.",
    gamePlan:"Be the man who expands her world, not limits it. Keep growing yourself — she's watching. Plan adventures even when life is busy. She needs to see possibility." },
  { sign:"Capricorn",   emoji:"♑", dates:"Dec 22–Jan 19", element:"Earth", color:"#7f8c8d",
    traits:["Ambitious","Disciplined","Loyal","Practical","Responsible"],
    loves:["Reliability","Achievement","Quality","Long-term plans","Respect"],
    avoids:["Laziness","Irresponsibility","Superficiality","Broken promises"],
    loveStyle:"She respects ambition and reliability above all. Show her you're building something real.",
    dateIdeas:["Upscale dinner to celebrate a milestone","Plan your future together (literally map it out)","Quality experience over quantity","Business or creative collaboration"],
    textsLike:"Direct, purposeful, respectful. She values substance over style.",
    gamePlan:"Be consistent and ambitious. She's building a life — make her feel you're building it with her. Keep your word every single time. She's watching your patterns, not your promises." },
  { sign:"Aquarius",    emoji:"♒", dates:"Jan 20–Feb 18", element:"Air",   color:"#2980b9",
    traits:["Independent","Humanitarian","Innovative","Unpredictable","Intellectual"],
    loves:["Originality","Deep friendship","Causes and purpose","Intellectual debate","Freedom"],
    avoids:["Conformity","Emotional manipulation","Being boxed in","Predictability"],
    loveStyle:"She needs a best friend first, a lover second. Engage her mind. Support her uniqueness.",
    dateIdeas:["Volunteering or cause-based date","Unconventional experience","Documentary + discussion","Art or science exhibit"],
    textsLike:"Original, intellectual, quirky. Say something no one else would say.",
    gamePlan:"Be her intellectual equal and emotional ally. She doesn't need saving — she needs a partner who gets it. Support her mission in life and she'll love you fiercely." },
  { sign:"Pisces",      emoji:"♓", dates:"Feb 19–Mar 20", element:"Water", color:"#1abc9c",
    traits:["Empathetic","Creative","Dreamy","Intuitive","Romantic"],
    loves:["Imagination","Emotional depth","Creative expression","Being understood","Magic"],
    avoids:["Harshness","Reality-checks mid-dream","Being dismissed","Cruelty"],
    loveStyle:"She lives in a world of feeling and beauty. She needs to be seen in her full emotional richness.",
    dateIdeas:["Sunset picnic","Art or music experience","Write poetry together","Stargazing","Dream planning night"],
    textsLike:"Poetic, emotional, beautiful. Speak to her soul, not just her mind.",
    gamePlan:"Enter her world. She doesn't need you to fix reality — she needs you to meet her in the beauty she sees. Be her anchor without dulling her magic." },
];

// ─── Chinese Zodiac ───────────────────────────────────────────────────────────
const CHINESE_ZODIAC = [
  { sign:"Rat",     emoji:"🐀", color:"#c0392b", years:[1924,1936,1948,1960,1972,1984,1996,2008,2020],
    traits:["Clever","Resourceful","Charming","Sociable","Quick-witted"],
    loveStyle:"She appreciates intelligence and wit. She notices everything. Impress her with thoughtfulness.",
    gamePlan:"Stay mentally sharp with her. She loves clever surprises. Be her smartest decision — prove it through action, not just words.",
    gifts:["Thoughtful experience","Intellectual gift (books, courses)","Something clever and personal"],
    avoid:"Never underestimate her. She knows more than she lets on." },
  { sign:"Ox",      emoji:"🐂", color:"#7f8c8d", years:[1925,1937,1949,1961,1973,1985,1997,2009,2021],
    traits:["Reliable","Patient","Hardworking","Honest","Steadfast"],
    loveStyle:"She needs dependability above all. She gives everything to those she trusts. Be worthy of it.",
    gamePlan:"Show up consistently. No drama. No empty promises. She builds slowly and loves deeply — be the foundation she can count on.",
    gifts:["Quality practical gifts","Something built to last","Comfortable home upgrades"],
    avoid:"Don't flake. Ever. She won't forget and she won't always say it." },
  { sign:"Tiger",   emoji:"🐅", color:"#e67e22", years:[1926,1938,1950,1962,1974,1986,1998,2010,2022],
    traits:["Brave","Confident","Charismatic","Rebellious","Magnetic"],
    loveStyle:"She's a force. She needs a partner, not a follower. Match her fire or get out of the way.",
    gamePlan:"Be confident and decisive. She's attracted to strength. Plan bold experiences. Stand your ground when challenged — she respects it.",
    gifts:["Adventure experiences","Bold, statement gifts","Something that matches her energy"],
    avoid:"Don't be passive. She'll lose respect fast if you can't keep up." },
  { sign:"Rabbit",  emoji:"🐇", color:"#27ae60", years:[1927,1939,1951,1963,1975,1987,1999,2011,2023],
    traits:["Gentle","Elegant","Compassionate","Diplomatic","Refined"],
    loveStyle:"She craves peace, beauty, and gentleness. Harsh energy repels her. She responds to softness and care.",
    gamePlan:"Create a calm, beautiful environment. Speak softly and thoughtfully. Plan elegant experiences. She blooms when she feels safe and unjudged.",
    gifts:["Beautiful home items","Spa or self-care","Flowers or anything elegant"],
    avoid:"Never be harsh or aggressive with her. She'll retreat and not come back easily." },
  { sign:"Dragon",  emoji:"🐉", color:"#e74c3c", years:[1928,1940,1952,1964,1976,1988,2000,2012,2024],
    traits:["Powerful","Visionary","Charismatic","Confident","Ambitious"],
    loveStyle:"She sees herself as extraordinary — and she is. She needs a partner who recognizes that and can walk beside her greatness.",
    gamePlan:"Celebrate her ambition. Be ambitious yourself. Plan epic experiences. She doesn't want ordinary love — she wants legendary love.",
    gifts:["Grand gestures","Experiences that match her vision","Something that honors her power"],
    avoid:"Don't be small in your love. She needs someone who can handle her magnitude." },
  { sign:"Snake",   emoji:"🐍", color:"#9b59b6", years:[1929,1941,1953,1965,1977,1989,2001,2013,2025],
    traits:["Intuitive","Wise","Mysterious","Sensual","Deep"],
    loveStyle:"She reads people instantly. She's drawn to depth and sophistication. Superficiality bores her completely.",
    gamePlan:"Be genuine and layered. Engage her in deep conversations. Create sensual, beautiful experiences. She rewards loyalty with unwavering devotion.",
    gifts:["Luxury sensory experience","Meaningful jewelry or art","Something with depth and meaning"],
    avoid:"Never lie to her. Her intuition is a lie detector. Once trust is broken it is very hard to rebuild." },
  { sign:"Horse",   emoji:"🐎", color:"#f39c12", years:[1930,1942,1954,1966,1978,1990,2002,2014,2026],
    traits:["Free-spirited","Energetic","Adventurous","Independent","Enthusiastic"],
    loveStyle:"She needs freedom and movement. She loves hard but can't be caged. Be her adventure partner.",
    gamePlan:"Keep life exciting. Plan spontaneous trips. Never make her feel trapped. The more freedom you give her, the more she'll choose you.",
    gifts:["Travel or adventure experiences","Anything that represents freedom","Active experiences"],
    avoid:"Jealousy and control are her biggest turn-offs. Trust her or lose her." },
  { sign:"Goat",    emoji:"🐐", color:"#1abc9c", years:[1931,1943,1955,1967,1979,1991,2003,2015,2027],
    traits:["Creative","Gentle","Empathetic","Artistic","Peace-loving"],
    loveStyle:"She thrives in supportive, harmonious love. She's deeply creative and needs her emotional world honored.",
    gamePlan:"Create peace at home. Support her creative pursuits actively. Show up with gentleness and patience. She loves deeply when she feels truly supported.",
    gifts:["Art supplies or creative experiences","Something handmade or personal","Beautiful and calming gifts"],
    avoid:"Pressure and conflict drain her completely. Be her soft landing." },
  { sign:"Monkey",  emoji:"🐒", color:"#e67e22", years:[1932,1944,1956,1968,1980,1992,2004,2016,2028],
    traits:["Witty","Clever","Playful","Curious","Versatile"],
    loveStyle:"She needs mental stimulation and laughter. She's endlessly curious. Keep up or she'll get bored.",
    gamePlan:"Be funny, clever, and unpredictable. Try new things constantly. Engage her in playful banter. She falls for a man who can make her laugh AND think.",
    gifts:["Unique experiences","Gadgets or novelty gifts","Something that surprises and delights"],
    avoid:"Predictability kills attraction for her. Never stop being interesting." },
  { sign:"Rooster", emoji:"🐓", color:"#c0392b", years:[1933,1945,1957,1969,1981,1993,2005,2017,2029],
    traits:["Confident","Hardworking","Organized","Honest","Perfectionist"],
    loveStyle:"She has high standards — and she should. She notices everything that's right and everything that's wrong.",
    gamePlan:"Be impeccable. Keep the house clean, your word consistent, your effort visible. She needs to see you're actually trying at a high level.",
    gifts:["Quality and precision","Something that shows you paid attention to detail","Practical luxury"],
    avoid:"Sloppiness in any form — appearance, home, follow-through — chips away at her attraction." },
  { sign:"Dog",     emoji:"🐕", color:"#3498db", years:[1934,1946,1958,1970,1982,1994,2006,2018,2030],
    traits:["Loyal","Honest","Protective","Devoted","Reliable"],
    loveStyle:"She loves with fierce devotion. She needs to know you're equally loyal and that her trust is safe.",
    gamePlan:"Be her most loyal person. Show consistency over time. Defend her. Have her back in every room — including the ones she's not in.",
    gifts:["Sentimental and meaningful gifts","Experiences that reinforce loyalty and partnership","Something that says 'I'm not going anywhere'"],
    avoid:"Betrayal of any kind — even small dishonesty — is devastating to her." },
  { sign:"Pig",     emoji:"🐷", color:"#e91e8c", years:[1935,1947,1959,1971,1983,1995,2007,2019,2031],
    traits:["Generous","Compassionate","Sincere","Indulgent","Warm"],
    loveStyle:"She gives generously and loves warmly. She needs someone who matches her sincerity and doesn't take advantage of her big heart.",
    gamePlan:"Reciprocate her love fully and visibly. She notices when she's giving more than receiving. Surprise her with genuine generosity. Create warmth and comfort around her.",
    gifts:["Indulgent experiences (food, spa, comfort)","Heartfelt and personal gifts","Something that says you know her deeply"],
    avoid:"Taking her generosity for granted. She'll keep giving until she has nothing left — then she's gone." },
];

// ─── Numerology ───────────────────────────────────────────────────────────────
const NUMEROLOGY = {
  1:{ number:1, name:"The Leader", emoji:"☀️", color:"#e74c3c",
    traits:["Independent","Driven","Bold","Pioneer","Strong-willed"],
    loveStyle:"She needs to feel like she's with someone equally strong. She respects ambition and directness. She doesn't want to be led — she wants a partner who can keep up.",
    gamePlan:"Match her energy. Be decisive and bold. Never be passive. Show her you have direction and vision. She needs a man she respects, not one she has to carry.",
    needs:["significance","variety"],
    dateIdeas:["Ambitious shared goal or challenge","New experience she's never tried","Something that lets her shine"],
    textsLike:"Direct, confident, short. She respects brevity and intention.",
    avoid:"Weakness, indecision, or being clingy. She loses attraction for men who need constant reassurance." },
  2:{ number:2, name:"The Nurturer", emoji:"🌙", color:"#3498db",
    traits:["Sensitive","Loving","Diplomatic","Empathetic","Partnership-oriented"],
    loveStyle:"She is built for deep partnership. She gives endlessly and needs the same in return. She feels everything deeply and needs a safe emotional home.",
    gamePlan:"Be her safe place. Show consistent care. Check in emotionally. She tracks the small things — the things you remembered and the ones you forgot.",
    needs:["certainty","love","connection"],
    dateIdeas:["Intimate dinner at home","Stargazing","Cook together","Memory-making experience"],
    textsLike:"Warm, emotionally open, nostalgic. Tell her specifically what she means to you.",
    avoid:"Coldness, dismissiveness, or emotional unavailability. She will carry the pain quietly and it will compound." },
  3:{ number:3, name:"The Creator", emoji:"✨", color:"#f39c12",
    traits:["Creative","Expressive","Joyful","Social","Enthusiastic"],
    loveStyle:"She needs joy, creativity, and self-expression. Life with her should feel colorful. She falls deeper for a man who supports her creative spirit.",
    gamePlan:"Be her biggest fan. Celebrate her ideas. Keep life playful and surprising. She needs to feel like you see and delight in who she uniquely is.",
    needs:["variety","growth","significance"],
    dateIdeas:["Art class","Live music or comedy show","Creative project together","Spontaneous adventure"],
    textsLike:"Playful, expressive, specific compliments about her uniqueness.",
    avoid:"Routine, criticism of her ideas, or making her feel ordinary. She needs to feel special and seen." },
  4:{ number:4, name:"The Builder", emoji:"🏛️", color:"#7f8c8d",
    traits:["Loyal","Hardworking","Stable","Practical","Dependable"],
    loveStyle:"She values loyalty and stability above almost everything. She builds slowly and loves deeply. She needs consistency more than grand gestures.",
    gamePlan:"Be utterly reliable. Keep every promise. Build a life together intentionally. Show her your work ethic and commitment — she respects these above romance.",
    needs:["certainty","contribution"],
    dateIdeas:["Plan something meaningful together","Home project you build together","Long-term goal planning night","Quality practical experience"],
    textsLike:"Sincere, consistent, purposeful. She values substance over style.",
    avoid:"Unreliability, flakiness, or anything that feels unstable. She will quietly lose trust and it is hard to rebuild." },
  5:{ number:5, name:"The Free Spirit", emoji:"🦋", color:"#27ae60",
    traits:["Adventurous","Freedom-loving","Curious","Energetic","Spontaneous"],
    loveStyle:"She needs freedom, adventure, and constant novelty. She loves hard but can't be caged. Be her adventure partner, never her warden.",
    gamePlan:"Keep life exciting. Plan spontaneous experiences. Never make her feel trapped or bored. The more freedom you give her, the more she chooses you.",
    needs:["variety","growth","alive"],
    dateIdeas:["Spontaneous road trip","Try something completely new","Outdoor adventure","Festival or live event"],
    textsLike:"Playful, adventurous, a little unpredictable.",
    avoid:"Routine, jealousy, control, or possessiveness. She will pull away from anything that feels like a cage." },
  6:{ number:6, name:"The Caretaker", emoji:"💚", color:"#1abc9c",
    traits:["Loving","Responsible","Protective","Generous","Family-oriented"],
    loveStyle:"She gives deeply to those she loves — family, home, partner. She needs to feel that her love is matched, not taken for granted.",
    gamePlan:"Reciprocate her generosity visibly. Help carry the load at home. Honor her role. She needs to feel cherished and not used.",
    needs:["certainty","love","contribution"],
    dateIdeas:["Home-cooked meal together","Create something for the home","Family or meaningful gathering","Comfort and warmth experience"],
    textsLike:"Warm, appreciative, specific about what she contributes.",
    avoid:"Taking her caretaking for granted. She gives until empty — then she's gone. See her effort and say it." },
  7:{ number:7, name:"The Seeker", emoji:"🔮", color:"#8e44ad",
    traits:["Introspective","Intuitive","Wise","Private","Deep"],
    loveStyle:"She lives in depth. Small talk exhausts her. She needs genuine intellectual and spiritual connection. She reads people instantly.",
    gamePlan:"Go deep. Ask real questions. Read widely so you can engage her mind. She doesn't need constant company — she needs meaningful presence when you're there.",
    needs:["growth","connection","significance"],
    dateIdeas:["Deep conversation over wine","Museum or exhibit","Nature walk with real talk","Read the same book and discuss"],
    textsLike:"Thoughtful, philosophical, surprising depth. Avoid the obvious.",
    avoid:"Superficiality, lying, or pretending. Her intuition is a lie detector. She will feel inauthenticity instantly." },
  8:{ number:8, name:"The Powerhouse", emoji:"♾️", color:"#e67e22",
    traits:["Ambitious","Confident","Resilient","Strategic","Magnetic"],
    loveStyle:"She is a force. She needs a man who can hold his own beside her power, not be intimidated by it. She respects strength and ambition above sentiment.",
    gamePlan:"Stay ambitious. Match her drive. Make bold decisions. She needs to see you building something worthy of the life she's capable of creating.",
    needs:["significance","variety","growth"],
    dateIdeas:["Upscale experience","Shared ambition or project","Something that honors her power","Achievement celebration"],
    textsLike:"Bold, direct, specific about her strength and impact.",
    avoid:"Laziness, mediocrity, or being intimidated by her. She needs a partner, not someone she has to drag along." },
  9:{ number:9, name:"The Wise One", emoji:"🌍", color:"#c0392b",
    traits:["Compassionate","Idealistic","Generous","Wise","Humanitarian"],
    loveStyle:"She loves deeply and broadly — she cares about the world, not just your world. She needs a partner who has depth, purpose, and genuine values.",
    gamePlan:"Show her your values in action. Support what she cares about. Be generous — not just with her but with life. She's drawn to men with real purpose.",
    needs:["growth","connection","contribution"],
    dateIdeas:["Volunteer together","Meaningful cultural experience","Deep conversation about life and purpose","Give back in some way together"],
    textsLike:"Purposeful, meaningful, connected to something larger.",
    avoid:"Selfishness, pettiness, or shallow living. She sees the big picture and needs a partner who does too." },
  11:{ number:11, name:"The Intuitive", emoji:"⚡", color:"#9b59b6",
    traits:["Highly intuitive","Visionary","Sensitive","Inspiring","Deep empathy"],
    loveStyle:"An 11 feels everything at a heightened level. She is highly perceptive and needs emotional safety above all else. She can feel your energy before you say a word.",
    gamePlan:"Be emotionally consistent. Never fake it — she knows. Show up with your full authentic self. Honor her sensitivity as the gift it is, not a liability.",
    needs:["certainty","connection","safe"],
    dateIdeas:["Deeply personal experience","Spiritual or meaningful activity","Quiet intimacy","Something that honors her inner world"],
    textsLike:"Emotionally honest, deep, and authentic. She senses when words are hollow.",
    avoid:"Emotional dishonesty, instability, or treating her sensitivity as 'too much.' It is her superpower." },
  22:{ number:22, name:"The Master Builder", emoji:"🏗️", color:"#e74c3c",
    traits:["Visionary","Disciplined","Powerful","Ambitious","Practical dreamer"],
    loveStyle:"She operates at a high level and needs a partner who can match her vision while grounding her. She is building something large — she needs a partner, not a passenger.",
    gamePlan:"Be her equal partner in building a meaningful life. Show discipline and follow-through. The man who can hold her vision AND handle real life is her ideal.",
    needs:["certainty","growth","significance"],
    dateIdeas:["Future planning together","Something that honors her vision","Ambitious shared project","High-quality experience that matches her level"],
    textsLike:"Purposeful, visionary, direct.",
    avoid:"Mediocrity, lack of follow-through, or being unable to match her level of thinking and execution." },
  33:{ number:33, name:"The Master Nurturer", emoji:"💞", color:"#e91e8c",
    traits:["Deeply compassionate","Selfless","Inspiring","Loving","Teacher energy"],
    loveStyle:"She loves at a master level — unconditionally and deeply. She needs a man who can receive that love without taking advantage of it, and match its depth.",
    gamePlan:"Be worthy of her love. Show up fully. Grow constantly. She is capable of extraordinary devotion — honor it by becoming the best version of yourself every day.",
    needs:["love","connection","contribution"],
    dateIdeas:["Something that honors her giving nature","Create meaning together","Act of service or giving","Deep intimacy and connection"],
    textsLike:"From the heart. Raw, honest, and real.",
    avoid:"Taking her love for granted — ever. She gives everything. The moment she stops, she's already gone." },
};

function getLifePathNumber(day, month, year) {
  if (!day || !month || !year) return null;
  const str = `${month}${day}${year}`;
  let sum = str.split("").reduce((a,b)=>a+parseInt(b),0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split("").reduce((a,b)=>a+parseInt(b),0);
  }
  return sum;
}

// ─── Reminder Library ─────────────────────────────────────────────────────────
const REMINDER_LIBRARY = [
  { id:"r1",  category:"gifts",   icon:"🌹", title:"Buy her flowers",             body:"Stop by a florist or grocery store. No reason needed — that's the whole point.",                         neuro:["dopamine","oxytocin"],            phases:["ovulation","follicular"], defaultTime:"08:00", defaultDays:["MO","TH"], why:"Flowers spike dopamine (unexpected reward) + oxytocin (being chosen). No reason = bigger hit." },
  { id:"r2",  category:"gifts",   icon:"🍫", title:"Pick up her favorite candy",  body:"Chocolates or whatever she loves. Leave it somewhere she'll find it — don't announce it.",               neuro:["dopamine","serotonin"],           phases:["menstrual","luteal"],    defaultTime:"16:00", defaultDays:["WE","SA"], why:"Chocolate raises serotonin. Finding it unexpectedly = dopamine surge. Two-for-one." },
  { id:"r3",  category:"gifts",   icon:"☕", title:"Bring her coffee or tea",     body:"Her order, exactly how she likes it. Deliver it without being asked.",                                   neuro:["serotonin","oxytocin"],           phases:["menstrual","luteal"],    defaultTime:"07:30", defaultDays:["TU","FR"], why:"Morning attentiveness = serotonin stability. Oxytocin through small acts of care." },
  { id:"r4",  category:"gifts",   icon:"🎁", title:"Small surprise gift",         body:"A candle, snack, or book she mentioned. It's not the price — it's the attention.",                       neuro:["dopamine","serotonin"],           phases:["follicular","ovulation"], defaultTime:"12:00", defaultDays:["FR"],       why:"Unexpected gifts activate dopamine regardless of size. Serotonin from being remembered." },
  { id:"r5",  category:"gifts",   icon:"🌸", title:"Book her a spa treatment",    body:"Massage, facial, mani-pedi. Book it. Pay for it. Tell her when it is.",                                  neuro:["dopamine","endorphins"],          phases:["luteal","menstrual"],    defaultTime:"10:00", defaultDays:["SU"],       why:"Physical touch = endorphin release. The fact you booked it = dopamine anticipation." },
  { id:"r6",  category:"chores",  icon:"🍽️", title:"Wash the dishes",             body:"Do them before she sees they need doing. All of them. Don't mention it after.",                          neuro:["serotonin","oxytocin"],           phases:["all"],                   defaultTime:"19:00", defaultDays:["MO","WE","FR"], why:"Dishes done without asking = serotonin calm. She won't say it but she notices every time." },
  { id:"r7",  category:"chores",  icon:"🧹", title:"Vacuum the house",            body:"Don't wait to be asked. Run the vacuum through the main rooms tonight.",                                  neuro:["serotonin"],                     phases:["all"],                   defaultTime:"18:00", defaultDays:["SA"],       why:"Clean space reduces cortisol and elevates serotonin. Doing it unprompted = oxytocin bonus." },
  { id:"r8",  category:"chores",  icon:"🛒", title:"Handle the grocery run",      body:"Check what's low and handle it. Text her: 'I got groceries — anything specific you want?'",            neuro:["serotonin","dopamine"],           phases:["all"],                   defaultTime:"10:00", defaultDays:["SU","WE"],  why:"Removing the mental load = serotonin relief. The proactive text = dopamine." },
  { id:"r9",  category:"chores",  icon:"👕", title:"Do the laundry",              body:"Wash, dry, AND fold. Bonus: put it away. She will absolutely notice.",                                    neuro:["serotonin","oxytocin"],           phases:["all"],                   defaultTime:"09:00", defaultDays:["SA"],       why:"Clean clothes = serotonin order. The care it signals = oxytocin without a word." },
  { id:"r10", category:"chores",  icon:"🗑️", title:"Take out the trash",          body:"Before she touches it. All bins. Done.",                                                                  neuro:["serotonin"],                     phases:["all"],                   defaultTime:"07:00", defaultDays:["MO","TH"],  why:"Small but she tracks it. Consistent = serotonin baseline maintenance." },
  { id:"r11", category:"chores",  icon:"🧽", title:"Clean the bathroom",          body:"Wipe the sink, scrub the toilet, hang fresh towels. She'll feel it.",                                    neuro:["serotonin","oxytocin"],           phases:["luteal","menstrual"],    defaultTime:"08:00", defaultDays:["FR"],       why:"Clean space = elevated serotonin. During luteal/menstrual phases this hits especially hard." },
  { id:"r12", category:"chores",  icon:"🍳", title:"Cook dinner unannounced",     body:"Plan a meal and have it ready. No fanfare. Love in action.",                                             neuro:["serotonin","dopamine","oxytocin"],phases:["all"],                   defaultTime:"15:00", defaultDays:["TU","TH"],  why:"Food made with care = serotonin + dopamine. Anticipation of coming home to it = pure dopamine." },
  { id:"r13", category:"connect", icon:"💬", title:"Send a midday check-in text", body:"Not 'what's for dinner.' Ask how she's actually doing today.",                                           neuro:["serotonin","oxytocin"],           phases:["all"],                   defaultTime:"12:00", defaultDays:["MO","TU","WE","TH","FR"], why:"Midday check-in = oxytocin bridge. Serotonin from being thought of mid-day." },
  { id:"r14", category:"connect", icon:"🤗", title:"Give a real hug",             body:"20 seconds. Don't let go first. This is literally medicine.",                                             neuro:["oxytocin","endorphins"],          phases:["all"],                   defaultTime:"18:30", defaultDays:["MO","TU","WE","TH","FR"], why:"20-second hugs clinically spike oxytocin and drop cortisol." },
  { id:"r15", category:"connect", icon:"📝", title:"Leave her a love note",       body:"One sentence. Hidden somewhere she'll find it. Specific beats generic.",                                 neuro:["dopamine","serotonin"],           phases:["all"],                   defaultTime:"06:30", defaultDays:["WE","FR"],  why:"Finding a hidden note = dopamine discovery. Written love = serotonin all day." },
  { id:"r16", category:"connect", icon:"📵", title:"Phone-free evening",          body:"Phone in another room for the evening. Be fully present.",                                               neuro:["oxytocin","serotonin"],           phases:["all"],                   defaultTime:"19:00", defaultDays:["TU","TH"],  why:"Full presence = strongest oxytocin signal. Being genuinely prioritized = serotonin." },
  { id:"r17", category:"romance", icon:"🕯️", title:"Set candles for tonight",     body:"Candles, low light, her favorite playlist. Atmosphere for no reason.",                                  neuro:["dopamine","oxytocin"],            phases:["ovulation","follicular"], defaultTime:"17:00", defaultDays:["FR","SA"],  why:"Atmosphere creation = dopamine anticipation. Candles + intentionality = oxytocin readiness." },
  { id:"r18", category:"romance", icon:"💆", title:"Offer her a back massage",    body:"No expectations. Just offer. Let her lead.",                                                             neuro:["oxytocin","endorphins","serotonin"],phases:["luteal","menstrual"],  defaultTime:"20:00", defaultDays:["SU","WE"],  why:"Touch = oxytocin. Physical relief = endorphins. The offer alone = serotonin." },
  { id:"r19", category:"romance", icon:"🛁", title:"Draw her a bath",             body:"Warm water, Epsom salts, candle. Knock and say it's ready. Walk away.",                                  neuro:["endorphins","serotonin","oxytocin"],phases:["menstrual","luteal"],  defaultTime:"20:30", defaultDays:["TH","SU"],  why:"Warm water = endorphins. The thought behind it = oxytocin. Boundary respected = serotonin." },
  { id:"r20", category:"romance", icon:"🎶", title:"Dance with her tonight",      body:"Put on a song she loves and ask her to dance. Kitchen counts.",                                         neuro:["endorphins","oxytocin","dopamine"],phases:["ovulation","follicular"],defaultTime:"19:30", defaultDays:["FR","SA"],  why:"Physical synchrony = fastest oxytocin trigger. Music + movement = endorphin flood." },
];

const CATEGORIES = [
  { id:"all",     label:"All",        icon:"🔔" },
  { id:"gifts",   label:"Gifts",      icon:"🎁" },
  { id:"chores",  label:"Chores",     icon:"🏠" },
  { id:"connect", label:"Connect",    icon:"💬" },
  { id:"romance", label:"Romance",    icon:"❤️" },
  { id:"home",    label:"Activities", icon:"🎲" },
];
const DAYS_OF_WEEK = ["SU","MO","TU","WE","TH","FR","SA"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Cycle Phases ─────────────────────────────────────────────────────────────
const CYCLE_PHASES = {
  menstrual: {
    label:"Menstrual", days:[1,2,3,4,5], color:"#c0392b", emoji:"🌑",
    tip:"She needs rest, warmth, and deep understanding.",
    needs:["certainty","love"],
    whatSheNeeds:{
      headline:"She needs to be held, not handled.",
      physical:["Warmth — heating pad, warm bath, warm drinks","Rest without guilt or pressure","Gentle touch, not demanding affection","Comfortable clothes and a clean, calm space"],
      emotional:["No big decisions or heavy conversations","To feel it's okay to be low energy","Patience — her pain is real even when invisible","Validation without trying to fix anything"],
      fromYou:["Handle the home so she doesn't have to think about it","Check in softly — 'What do you need right now?'","Don't take her mood personally — it's physiological","Bring comfort food or her favorite snack without being asked","Let her rest completely without making her feel guilty"],
      avoid:["Pressuring her for plans, sex, or energy she doesn't have","Making her feel like a burden","Dismissing her pain as 'just PMS'","Starting arguments or bringing up unresolved issues"],
    },
  },
  follicular: {
    label:"Follicular", days:[6,7,8,9,10,11], color:"#27ae60", emoji:"🌒",
    tip:"Her energy is rising. Curious, optimistic, ready for new experiences.",
    needs:["variety","growth"],
    whatSheNeeds:{
      headline:"She needs stimulation, novelty, and to feel excited about life.",
      physical:["Activity and movement — she has energy to burn","New environments and experiences","Fresh, lighter foods and social energy","She's more physically open and receptive now"],
      emotional:["To dream and plan without limits","Intellectual engagement and real conversation","To feel like her life is expanding","Curiosity met with enthusiasm, not practicality"],
      fromYou:["Plan something new — even small, even simple","Ask her about her goals and dreams seriously","Be playful, flirty, and fun — she's receptive","Take her somewhere she's never been","Engage her mind — she wants to think and explore"],
      avoid:["Boring routines with no novelty","Shutting down her ideas with logistics","Being passive — she wants you to initiate","Heavy emotional processing when she wants lightness"],
    },
  },
  ovulation: {
    label:"Ovulation", days:[12,13,14,15,16], color:"#f39c12", emoji:"🌕",
    tip:"She's magnetic and deeply connected. Peak connection time.",
    needs:["significance","love","connection"],
    whatSheNeeds:{
      headline:"She needs to feel desired, chosen, and deeply connected.",
      physical:["Physical closeness and affection — she wants to be touched","To dress up and go somewhere she can feel beautiful","Her body feels its best — she has peak energy and confidence","Romance — candles, music, effort, intention"],
      emotional:["To feel like the most important person in your world","Deep conversation and genuine intimacy","To be pursued — not assumed","Compliments that are specific, real, and feel earned","To feel seen at her most magnetic"],
      fromYou:["Plan a real date — make an effort she can feel","Tell her specifically what you find irresistible about her","Initiate — don't wait for her to lead","Be fully present and engaged, no distractions","Create a moment she'll remember — something that makes her feel special"],
      avoid:["Taking her for granted when she's at her best","Being distracted or disengaged","Generic compliments — be specific or say nothing","Missing this window — it closes quickly"],
    },
  },
  luteal: {
    label:"Luteal (Pre-Menstrual)", shortLabel:"Luteal", days:[17,18,19,20,21,22,23,24,25,26,27,28], color:"#8e44ad", emoji:"🌗",
    tip:"Her body is preparing for menstruation. She may feel sensitive, tired, or overwhelmed. Stability, patience, and acts of service matter most.",
    needs:["certainty","contribution","significance"],
    whatSheNeeds:{
      headline:"She needs stability, patience, and for you to carry more — her body is already carrying a lot.",
      physical:[
        "Comfortable food — she may crave sugar, salt, or warmth (chocolate is medicine right now)",
        "Less demanding physical activity, more gentle movement like walking or stretching",
        "Physical relief — back rubs, shoulder massage, a warm bath drawn for her",
        "Rest without the world demanding things from her",
        "Her body temperature may drop — warm blankets, warm drinks, heating pad",
      ],
      emotional:[
        "To feel like she's not carrying everything alone — because hormonally, everything feels heavier",
        "Her feelings validated without being minimized or problem-solved",
        "Predictability — no surprises, no new stressors, no big decisions",
        "To know you're stable and present even when she's not at her best",
        "Extra patience — her nervous system is more sensitive, her threshold lower",
      ],
      fromYou:[
        "Handle household tasks before she has to ask — anticipate, don't wait",
        "Cook dinner, take over logistics, reduce her mental load without making it a big deal",
        "Listen without offering solutions unless she explicitly asks for them",
        "Stay calm when she's emotional — your regulated nervous system literally calms hers",
        "Check in specifically: 'What can I take off your plate today?'",
        "Tell her she's doing a great job even when she feels like she isn't",
        "Don't take her mood personally — it is hormonal, not a verdict on you or the relationship",
      ],
      avoid:[
        "Adding to her stress or creating new demands on her time or energy",
        "Getting defensive when she's overwhelmed — it escalates everything",
        "Disappearing emotionally when she needs your presence most",
        "Pointing out that she 'seems off' in a way that feels like criticism",
        "Starting big conversations, arguments, or anything that can wait",
        "Expecting her to perform or keep up — she needs permission to slow down",
      ],
    },
  },
};

const NEEDS = ["significance","certainty","variety","growth","contribution","love","connection"];
const NEED_COLORS = { significance:"#e74c3c",certainty:"#3498db",variety:"#f39c12",growth:"#27ae60",contribution:"#9b59b6",love:"#e91e8c",connection:"#1abc9c" };

const DAILY_TASKS = [
  { id:1,  task:"Send her a 'thinking of you' text before noon",           needs:["love","certainty"],                effort:"low",    neuro:["dopamine","serotonin"],            why:"Unprompted texts trigger dopamine. Knowing you think of her = serotonin security." },
  { id:2,  task:"Compliment something specific she did this week",         needs:["significance"],                   effort:"low",    neuro:["serotonin","oxytocin"],            why:"Specific praise = serotonin. Being truly seen = oxytocin release." },
  { id:3,  task:"Plan something for the two of you — don't reveal it yet", needs:["variety","connection"],           effort:"medium", neuro:["dopamine","oxytocin"],             why:"Anticipation = dopamine's strongest driver. Shared plans = oxytocin." },
  { id:4,  task:"Handle one household task she usually does, silently",    needs:["contribution","certainty"],       effort:"medium", neuro:["serotonin","dopamine"],            why:"Removing her stress = serotonin. The surprise = dopamine. No fanfare." },
  { id:5,  task:"Ask her one deep question tonight and just listen",       needs:["significance","growth","connection"],effort:"low", neuro:["oxytocin","serotonin"],            why:"Deep listening = oxytocin. Feeling understood = serotonin lift." },
  { id:6,  task:"Give a 20-second hug the moment you see her today",      needs:["love","connection"],               effort:"low",    neuro:["oxytocin","endorphins"],           why:"20+ second hugs clinically spike oxytocin and drop cortisol." },
  { id:7,  task:"Tell her out loud three specific things you appreciate",  needs:["significance","love"],             effort:"low",    neuro:["serotonin","oxytocin"],            why:"Verbal gratitude = powerful serotonin. Vulnerability from you = oxytocin." },
  { id:8,  task:"Cook or order her favorite meal with no prompting",       needs:["contribution","certainty","love"], effort:"medium", neuro:["serotonin","dopamine","oxytocin"], why:"Food she loves = serotonin + dopamine. Being cared for = oxytocin. Triple hit." },
  { id:9,  task:"Put phone away for a full hour of undivided attention",   needs:["significance","connection"],       effort:"medium", neuro:["oxytocin","serotonin"],            why:"Undivided attention = serotonin priority signal. Presence = oxytocin." },
  { id:10, task:"Plan a small surprise for her this week",                 needs:["variety","love"],                  effort:"high",   neuro:["dopamine","endorphins","oxytocin"],why:"Surprise = dopamine spike. Delight = endorphins. Being thought of = oxytocin." },
  { id:11, task:"Play her favorite music and dance with her",              needs:["love","variety","connection"],     effort:"low",    neuro:["endorphins","oxytocin","dopamine"], why:"Movement = endorphin flood. Physical synchrony = fastest oxytocin trigger." },
  { id:12, task:"Write a note and leave it somewhere she'll find it",      needs:["significance","love"],             effort:"low",    neuro:["dopamine","serotonin"],            why:"Hidden note = dopamine discovery. Written love = serotonin all day." },
];

const TEXT_SAMPLES = [
  { text:"Hey, I was just thinking about you and smiling. That's all. 😊",                needs:["love","connection"],          mood:"sweet",     neuro:["dopamine","serotonin"],            why:"Unprompted warmth = dopamine. Knowing she's on your mind = serotonin glow." },
  { text:"I noticed how hard you've been working. You're incredible and I see it.",       needs:["significance"],              mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Being witnessed = serotonin. Validation from her person = oxytocin." },
  { text:"I've got dinner handled tonight. Just relax when you get home.",                needs:["certainty","contribution"],  mood:"supportive", neuro:["serotonin","dopamine"],            why:"Removing uncertainty = serotonin. Coming home to that = dopamine." },
  { text:"I booked us something for Saturday. Pack light 😏",                            needs:["variety","connection"],      mood:"playful",    neuro:["dopamine","endorphins"],           why:"Mystery = peak dopamine. Playfulness triggers endorphins." },
  { text:"I've been thinking — what's one dream of yours we haven't talked about?",      needs:["growth","significance"],     mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Inviting her inner world = oxytocin. Being prioritized = serotonin." },
  { text:"You looked beautiful this morning and I forgot to say it. I'm saying it now.", needs:["love","significance"],       mood:"sweet",      neuro:["serotonin","dopamine"],            why:"Delayed genuine compliment = unexpected dopamine. Feeling seen = serotonin." },
  { text:"Tell me something about your day. I actually want to know.",                   needs:["connection","significance"], mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Invitation to be heard = oxytocin. Knowing you care = serotonin." },
  { text:"You don't have to carry everything alone. I'm here.",                          needs:["certainty","love"],          mood:"supportive", neuro:["oxytocin","serotonin"],            why:"Safety + support = oxytocin flood. Not being alone = serotonin stability." },
  { text:"I was talking to someone today and realized — I chose the right person.",      needs:["significance","love","certainty"],mood:"affirming",neuro:["serotonin","oxytocin","dopamine"],why:"Being chosen deliberately = serotonin + dopamine. Security = oxytocin. Triple hit." },
  { text:"No agenda. Just want to know — how are you, really?",                         needs:["significance","connection"], mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Genuine inquiry = oxytocin. Feeling safe to be honest = serotonin." },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCurrentPhase(d) {
  for (const [k,p] of Object.entries(CYCLE_PHASES)) if (p.days.includes(d)) return {key:k,...p};
  return {key:"menstrual",...CYCLE_PHASES.menstrual};
}
function getToday() { return new Date().toISOString().split("T")[0]; }
function getDayOfYear(date) { return Math.floor((date - new Date(date.getFullYear(),0,0)) / 864e5); }

// Pick today's text from the library — deterministic by date, filtered by phase needs
function getDailyTextFromLibrary(phaseNeeds, offset=0) {
  const base = getDayOfYear(new Date());
  // Prefer phase-matched texts
  const phaseMatched = EXTENDED_TEXTS.filter(t => (t.needs||[]).some(n => phaseNeeds.includes(n)));
  const pool = phaseMatched.length >= 5 ? phaseMatched : EXTENDED_TEXTS;
  const idx = (base + offset) % pool.length;
  return pool[idx];
}

// Pick today's activity from HOME_ACTIVITIES — deterministic by date
function getDailyActivityFromLibrary(phaseNeeds, offset=0) {
  const base = getDayOfYear(new Date());
  const phaseMatched = HOME_ACTIVITIES.filter(a => (a.needs||[]).some(n => phaseNeeds.includes(n)));
  const pool = phaseMatched.length >= 3 ? phaseMatched : HOME_ACTIVITIES;
  const idx = (base + offset) % pool.length;
  return pool[idx];
}
// Backend proxy — key lives on server, never in browser
const API_URL = typeof process !== "undefined" && process.env?.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "";
const APP_SECRET = typeof process !== "undefined" && process.env?.REACT_APP_APP_SECRET ? process.env.REACT_APP_APP_SECRET : "";

// NOTE: AI generation is intentionally disabled in this build.
// The previous implementation called the Anthropic API directly from the client,
// which would expose an API key. It will be re-enabled in a later phase via a
// secure Supabase Edge Function (server-side key, premium-gated) — see ai.service.js.
async function fetchAI(_prompt) {
  return "✨ AI suggestions are coming soon — this feature is being set up securely.";
}

// ─── Safe Storage (works in artifacts + browser) ─────────────────────────────
const _store = {};
function safeGet(key, def="") {
  try { return localStorage.getItem(key) ?? def; } catch(e) { return _store[key] ?? def; }
}
function safeGetJSON(key, def) {
  try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(def)); } catch(e) { return _store[key] ?? def; }
}
function copyText(text, onSuccess) {
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
function safeSet(key, val) {
  _store[key] = val;
  try { localStorage.setItem(key, val); } catch(e) {}
}
function getChineseZodiac(year) {
  if (!year) return null;
  const animals = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
  const idx = ((year - 1900) % 12 + 12) % 12;
  return CHINESE_ZODIAC.find(z => z.sign === animals[idx]) || CHINESE_ZODIAC[idx];
}
function getZodiacFromDate(month, day) {
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
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Daily Truths — one per day, rotates, sets mindset before action ──────────
const DAILY_TRUTHS = [
  "She doesn't need a perfect husband. She needs a present one.",
  "According to psychologists and women's surveys, she needs at least 48 minutes of uninterrupted connection with you every day. Not scrolling next to each other. Actually present. No phone.",
  "The version of you she fell in love with still exists. Go find him.",
  "Leadership in love isn't about control. It's about creating safety so deep she never has to be in survival mode.",
  "She's not difficult. She's deep. Learn the difference.",
  "Every day you don't pursue her, someone else becomes more attractive by comparison.",
  "She doesn't leave because she stopped loving you. She leaves because she stopped feeling chosen.",
  "Your calm is her anchor. Your presence is her home.",
  "She needs you to lead so she can relax. She can't be soft around a man she has to carry.",
  "The texts, the tasks, the activities — they're not chores. They're deposits in an account that takes years to build and one day to empty.",
  "She's watching what you do when you don't think she's watching.",
  "You can't give her security while you're building your life. You have to build your life in a way that makes her feel secure.",
  "A woman in her feminine energy is magnetic, soft, and fully alive. You create the conditions for that. Or you don't.",
  "She's not testing you to be difficult. She's testing you because she needs to know if you'll hold.",
  "The man she needs already exists. He's just buried under comfort, distraction, and routine.",
  "Consistency is the most romantic thing you can do. Show up the same way every day.",
  "She can tell the difference between a man who read a book about love and a man who actually loves her.",
  "Don't just be home. Be present. There's a version of loneliness that happens with another person in the room.",
  "She fell in love with who you were when you were trying. Keep trying.",
  "The goal isn't to fix her. The goal is to be someone she never needs to be fixed around.",
  "She needs to feel like your priority, not your project.",
  "A man who makes his wife feel safe, seen, and chosen every day is doing something most men never attempt.",
  "You chose her. Act like it. Every day.",
  "Her sensitivity isn't a problem. It's information. She's telling you what she needs without using words.",
  "The best thing you can do for your children is love their mother in a way she can feel.",
  "She's not asking for grand gestures. She's asking for consistent attention.",
  "When she's emotional, she doesn't need solutions. She needs presence. That's harder than it sounds.",
  "You can be right and alone, or humble and loved. Choose.",
  "She's not withholding from you. She's protecting herself. Give her something to move toward.",
  "The man she's most attracted to is the man who doesn't need her validation to feel like a man.",
  "Lead, protect, provide. Everything else is noise.",
  // ── Extended truths ──────────────────────────────────────────────────────
  "She doesn't need a perfect partner. She needs a present one.",
  "The version of her she's becoming deserves the version of you you're building.",
  "Lead means you go first. Not last. Not when it's convenient.",
  "She fell in love with the man who tried. Keep trying.",
  "Complacency is the slowest way to lose someone.",
  "Your emotional regulation is her sense of safety. Stay steady.",
  "She can tell if you're here for her or here for what she gives you.",
  "Appreciation that stays in your head does nothing. Say it out loud.",
  "The little things are the big things. She knows this. Now you do too.",
  "Her trust in you is either growing or eroding. There is no neutral.",
  "She needs to know you'd pick her again. Show her — don't say it.",
  "You can't lead her somewhere you haven't been willing to go yourself.",
  "The best thing you can do for your relationship is keep becoming better.",
  "She watches how you handle pressure. That's when she decides if she's safe.",
  "Romance doesn't die. It gets deprioritized. The cure is simple — reprioritize.",
  "The man who reads her cycle and never stops learning — she talks about him.",
  "What you tolerate in yourself, she adapts to. Raise your own standard.",
  "Her emotions aren't a problem to solve. They're an invitation to connect.",
  "Protection isn't just physical. Protect her time, her energy, her peace.",
  "A woman who feels genuinely chosen becomes more of herself. That's the goal.",
  "She doesn't want to be managed. She wants to be pursued.",
  "Making her laugh matters. Not because it's easy. Because it means you still see her.",
  "The goal isn't a perfect relationship. The goal is a real one.",
  "She's not asking for more — she's asking for different. Learn the difference.",
  "Your consistency is the most underrated thing you do. She measures it every day.",
  "The strongest men are soft with the right people. Be soft with her.",
  "Being chosen every day matters more than being chosen once.",
  "Her cycle isn't something to survive. It's a map. Learn to read it.",
  "A man with vision for his relationship is rare. She'll feel the safety of it.",
  "90 days of intention changes a relationship. So does 90 days of drift.",

];

// ─── Phase Scripts — what to say when you walk in the door ───────────────────
const PHASE_SCRIPTS = {
  menstrual: {
    headline: "What she needs to hear tonight",
    context: "Her body is in its hardest phase. Everything feels heavier. She needs to know you see it.",
    scripts: [
      { line: "You don't have to hold it together right now. I've got everything tonight.", why: "Gives her explicit permission to rest. Serotonin through felt safety." },
      { line: "I see that you're tired. You don't have to explain it. I'm just here.", why: "Validates without needing her to perform. Deep oxytocin through being truly seen." },
      { line: "I took care of [specific thing]. You don't need to think about it.", why: "Specific acts of service during menstrual = highest impact. Serotonin relief." },
      { line: "What do you need right now? I mean it — anything.", why: "Direct invitation to receive care. Oxytocin through being prioritized." },
    ],
    avoid: "Don't say 'are you on your period?' or 'you seem off.' Let her tell you when she's ready.",
  },
  follicular: {
    headline: "Match her rising energy tonight",
    context: "She's coming alive. Curious, optimistic, open. Match this energy or you'll miss the window.",
    scripts: [
      { line: "I want to take you somewhere this weekend. Clear Saturday — I've got us.", why: "Forward planning hits dopamine hard during follicular. She's open to novelty." },
      { line: "Tell me something you've been thinking about lately. I actually want to know.", why: "Intellectual engagement during her most curious phase. Deep oxytocin connection." },
      { line: "You seem really good right now. I love seeing you like this.", why: "Naming her energy back to her = serotonin. Being truly noticed = oxytocin." },
      { line: "Let's try something neither of us has done. What are you curious about?", why: "Novelty invitation during peak openness. Dopamine + shared excitement." },
    ],
    avoid: "Don't be passive or boring tonight. She's at her most open — don't waste it on Netflix and silence.",
  },
  ovulation: {
    headline: "Pursue her tonight — she needs to feel chosen",
    context: "She's at her peak. Magnetic, confident, deeply connected. She wants to feel desired, not assumed.",
    scripts: [
      { line: "You look incredible tonight. I keep thinking about you.", why: "Direct desire expressed = dopamine + serotonin. Being wanted by her person = peak hit." },
      { line: "I cleared tonight. Dress how you want to feel — I'm taking you out.", why: "Decision made for her + pursuit = serotonin relief + dopamine. She feels chosen." },
      { line: "I don't say this enough — you are someone. Being with you makes me feel like I won.", why: "Specific pride in her = deep serotonin significance. Triple hit with oxytocin." },
      { line: "I want to be close to you tonight. Not for any reason — I just want you near me.", why: "Non-transactional desire = oxytocin flood. Feeling wanted without agenda = serotonin." },
    ],
    avoid: "Don't take her for granted this week. She's at her most magnetic — and most aware of whether she's being treated like it.",
  },
  luteal: {
    headline: "Be her anchor tonight — she needs your calm",
    context: "Her nervous system is sensitive. Her threshold is lower. Your groundedness is the gift.",
    scripts: [
      { line: "You don't have to be strong right now. I've got us.", why: "Explicit permission to drop the armor = highest oxytocin trigger in luteal phase." },
      { line: "I handled everything tonight. You just have to show up and be.", why: "Removes mental load = serotonin. She didn't have to ask = oxytocin trust." },
      { line: "I'm not going anywhere. Whatever you're feeling, I'm right here.", why: "Commitment during her most vulnerable phase = deep serotonin security." },
      { line: "You're doing so much better than you think. I watch you and I'm proud.", why: "Validation when she doubts herself most = powerful serotonin + oxytocin." },
    ],
    avoid: "Don't get defensive if she's short with you. Her nervous system is flooded. Your job is to stay regulated, not react.",
  },
};

// ─── Pulling Away Diagnostic Questions ───────────────────────────────────────
const DIAGNOSTIC_QUESTIONS = [
  { id:1, q:"Has she been less affectionate or physically warm recently?", options:["Yes, noticeably","A little","No, same as usual"], weight:{0:3,1:1,2:0} },
  { id:2, q:"Is she handling more decisions and logistics alone without looping you in?", options:["Yes, she's gone quiet on planning","Sometimes","No, we decide things together"], weight:{0:3,1:1,2:0} },
  { id:3, q:"When you talk, does she seem distracted, short, or give one-word answers?", options:["Yes, often lately","Occasionally","No, she's still engaged"], weight:{0:3,1:1,2:0} },
  { id:4, q:"When did you last do something intentional just for her — no prompting?", options:["Can't remember","A few weeks ago","Recently, within the week"], weight:{0:3,1:1,2:0} },
  { id:5, q:"Has physical intimacy decreased or felt more transactional?", options:["Yes, significantly","A little","No change"], weight:{0:3,1:1,2:0} },
  { id:6, q:"Does she seem to be carrying the emotional weight of the home alone?", options:["Yes, I see it","Maybe, I'm not sure","No, we share it"], weight:{0:3,1:1,2:0} },
  { id:7, q:"Has she stopped sharing small details of her day with you?", options:["Yes, she's stopped","Less than she used to","No, she still tells me things"], weight:{0:3,1:1,2:0} },
];

// ─── 30-Day Challenge ─────────────────────────────────────────────────────────
const CHALLENGE_30 = [
  // Week 1 — Build the habit
  { day:1,  week:1, theme:"Start", task:"Send her one text today that has nothing to do with logistics.", tip:"Not 'what's for dinner.' Something real.", pillar:"provide" },
  { day:2,  week:1, theme:"Start", task:"When you get home, give her a real hug. 20 seconds. Don't let go first.", tip:"This is literally medicine. Oxytocin in 20 seconds.", pillar:"protect" },
  { day:3,  week:1, theme:"Start", task:"Handle one thing she normally handles. Do it before she notices.", tip:"Silent acts of service hit harder than announced ones.", pillar:"provide" },
  { day:4,  week:1, theme:"Start", task:"Compliment something specific — not general. Not 'you look nice.' Be exact.", tip:"'The way you handled that call today — I noticed. You're impressive.' That's the level.", pillar:"lead" },
  { day:5,  week:1, theme:"Start", task:"Ask her one real question tonight and don't offer any solutions.", tip:"Just listen. Reflect back what she said. That's it.", pillar:"protect" },
  { day:6,  week:1, theme:"Start", task:"Put the phone in another room for the full evening.", tip:"Full presence = most powerful oxytocin signal you can send.", pillar:"provide" },
  { day:7,  week:1, theme:"Start", task:"Review your week. Did she seem different? What did she respond to most?", tip:"Start noticing. This is where the personalized playbook begins.", pillar:"lead" },
  // Week 2 — Add depth
  { day:8,  week:2, theme:"Deepen", task:"Plan something for this weekend. Don't ask — just handle it.", tip:"Decision made for her = serotonin relief. Lead.", pillar:"lead" },
  { day:9,  week:2, theme:"Deepen", task:"Tell her something you love about her that she doesn't know you've noticed.", tip:"Specific + unexpected = dopamine. Being truly seen = oxytocin.", pillar:"protect" },
  { day:10, week:2, theme:"Deepen", task:"Do the 20-second hug again. Make it your daily non-negotiable.", tip:"Physical touch is the fastest oxytocin trigger. Don't skip it.", pillar:"protect" },
  { day:11, week:2, theme:"Deepen", task:"Cook or order her favorite meal with no prompting.", tip:"Food she loves + you handled it = triple chemical hit.", pillar:"provide" },
  { day:12, week:2, theme:"Deepen", task:"Use her nickname today — every time you address her.", tip:"Her nickname from you is a form of possession. She loves it.", pillar:"provide" },
  { day:13, week:2, theme:"Deepen", task:"Log today in the app. Rate how it went. Note her reaction.", tip:"Your log is becoming your personal playbook. Every entry matters.", pillar:"lead" },
  { day:14, week:2, theme:"Deepen", task:"Write her a note — one specific thing you love about who she is.", tip:"Handwritten if possible. Written love = serotonin she carries all day.", pillar:"provide" },
  // Week 3 — Use the tools
  { day:15, week:3, theme:"Elevate", task:"Run the 'Why She's Pulling Away' diagnostic in the Coach tab.", tip:"Be brutally honest. The more honest you are, the more accurate the coaching.", pillar:"lead" },
  { day:16, week:3, theme:"Elevate", task:"Do the phase-matched activity this week. Follow it exactly.", tip:"The science is built in. Trust the system.", pillar:"lead" },
  { day:17, week:3, theme:"Elevate", task:"Use the Guide for one real situation you've been avoiding.", tip:"Type in what's actually going on. Be specific. Get a real answer.", pillar:"lead" },
  { day:18, week:3, theme:"Elevate", task:"Say the phase script out loud to her tonight — the exact words.", tip:"Not paraphrased. The exact line. It's engineered to land.", pillar:"protect" },
  { day:19, week:3, theme:"Elevate", task:"Add three things to the 'She Said' section in her profile.", tip:"Things she mentioned, dreamed about, or complained about. Start the record.", pillar:"provide" },
  { day:20, week:3, theme:"Elevate", task:"Spend the full evening with no agenda. No activity. Just be with her.", tip:"Presence with no performance = deepest oxytocin state.", pillar:"protect" },
  { day:21, week:3, theme:"Elevate", task:"Review your log. What worked? What didn't? What's your pattern?", tip:"You're starting to understand what specifically works for YOUR wife.", pillar:"lead" },
  // Week 4 — Build the playbook
  { day:22, week:4, theme:"Master", task:"Review your log and identify one pattern about what works best with her.", tip:"Your log data is your playbook. The more you track, the more you learn.", pillar:"lead" },
  { day:23, week:4, theme:"Master", task:"Plan a date using the Date Ideas tab — phase-matched.", tip:"Let the app build the plan. Your job is to execute it.", pillar:"lead" },
  { day:24, week:4, theme:"Master", task:"Have the conversation you've been avoiding.", tip:"Use the coach first if you need help. Then do it.", pillar:"lead" },
  { day:25, week:4, theme:"Master", task:"Tell her what you've been working on. Not everything — just this: 'I've been trying to be better for you.'", tip:"Vulnerability from you = oxytocin she wasn't expecting.", pillar:"protect" },
  { day:26, week:4, theme:"Master", task:"Do something from her 'She Said' section — something she mentioned wanting.", tip:"This is the move most men never make. Watch her face.", pillar:"provide" },
  { day:27, week:4, theme:"Master", task:"Invest in yourself today — gym, grooming, something that makes you feel sharp.", tip:"Staying attractive is a pillar. Do it for you first. She feels it second.", pillar:"attractive" },
  { day:28, week:4, theme:"Master", task:"Write in the log: what changed in 28 days. Her. You. The dynamic.", tip:"This is your evidence. It's also your motivation.", pillar:"lead" },
  { day:29, week:4, theme:"Master", task:"Plan next month. What habit do you continue? What do you add?", tip:"The 30-day challenge isn't the destination. It's the launch pad.", pillar:"lead" },
  { day:30, week:4, theme:"Master", task:"Tell her — out loud — one thing that's different about how you feel about her after 30 days of intention.", tip:"This is the moment. Don't skip it. Don't text it. Say it.", pillar:"provide" },
];

const CHALLENGE_60 = [
  {day:31,week:5,theme:"Depth",      task:"Ask her what the best moment of the last month was for her.",tip:"She's been feeling the shift. This question tells her you're paying attention.",pillar:"protect"},
  {day:32,week:5,theme:"Depth",      task:"Write her a handwritten note — not a card. Your words, your handwriting.",tip:"A handwritten note in 2026 is rare. That rarity is the point.",pillar:"provide"},
  {day:33,week:5,theme:"Depth",      task:"Find out one thing she's been quietly stressed about. Don't fix it. Listen.",tip:"Most men jump to solutions. She needs to feel heard first.",pillar:"protect"},
  {day:34,week:5,theme:"Depth",      task:"Do something today she mentioned weeks ago that you said you would do.",tip:"Following through on small things tells her everything about who you are.",pillar:"provide"},
  {day:35,week:5,theme:"Depth",      task:"Tell her one specific way she makes you a better man.",tip:"She needs to know her impact on you goes beyond the relationship.",pillar:"lead"},
  {day:36,week:5,theme:"Depth",      task:"Initiate a conversation about her personal dreams — not your plans. Her dreams.",tip:"Most couples never have this conversation. Be the one who starts it.",pillar:"protect"},
  {day:37,week:5,theme:"Depth",      task:"Create a ritual just for the two of you — weekly, non-negotiable.",tip:"Rituals are relationship architecture. Build something that outlasts the season.",pillar:"lead"},
  {day:38,week:6,theme:"Attraction", task:"Upgrade one thing about your appearance this week. Make it visible.",tip:"She fell for a man who was trying. Don't let comfort make you invisible.",pillar:"attractive"},
  {day:39,week:6,theme:"Attraction", task:"Plan a date that requires effort — not comfort. Something bold.",tip:"Easy dates are forgettable. Effort communicates value.",pillar:"lead"},
  {day:40,week:6,theme:"Attraction", task:"Tell her she's beautiful — not in passing. Stop, look at her, say it.",tip:"Eye contact when you say it changes everything.",pillar:"protect"},
  {day:41,week:6,theme:"Attraction", task:"Do something physical together — gym, walk, hike, anything active.",tip:"Shared physical effort creates chemistry that couch time never will.",pillar:"attractive"},
  {day:42,week:6,theme:"Attraction", task:"Make her laugh today. Actually try. Don't wait for it to happen.",tip:"Laughter is one of the six things she needs daily. Lead it.",pillar:"lead"},
  {day:43,week:6,theme:"Attraction", task:"Wear something she likes — or buy something she'd notice.",tip:"Caring about how you look for her is a form of respect.",pillar:"attractive"},
  {day:44,week:6,theme:"Attraction", task:"Surprise her with something she didn't ask for and didn't expect.",tip:"The surprise isn't the gift. The thoughtfulness behind it is.",pillar:"provide"},
  {day:45,week:7,theme:"Service",    task:"Handle something at home she's been managing alone. All of it.",tip:"Silent leadership. No announcement. Just done.",pillar:"provide"},
  {day:46,week:7,theme:"Service",    task:"Cook or order her absolute favourite meal. Make it the only reason.",tip:"Not because it's her birthday. Just because she deserves it.",pillar:"provide"},
  {day:47,week:7,theme:"Service",    task:"Give her a full evening to herself — no input from you needed.",tip:"Gifting her time and space is one of the highest forms of service.",pillar:"provide"},
  {day:48,week:7,theme:"Service",    task:"Ask her what one thing you could do differently that would mean the most.",tip:"Direct data from the source. Use it.",pillar:"lead"},
  {day:49,week:7,theme:"Service",    task:"Take something off her plate she hasn't asked you to handle.",tip:"She's been managing things silently. Notice what they are.",pillar:"provide"},
  {day:50,week:7,theme:"Service",    task:"Send her a voice note instead of a text today.",tip:"The sound of your voice is more intimate than words on a screen.",pillar:"protect"},
  {day:51,week:7,theme:"Service",    task:"Book something — dinner, activity, weekend plan — without asking for input.",tip:"She's tired of making decisions. Just lead.",pillar:"lead"},
  {day:52,week:8,theme:"Legacy",     task:"Tell someone important to her — her friend, her family — one thing you love about her.",tip:"Public appreciation through people who matter to her echoes for weeks.",pillar:"protect"},
  {day:53,week:8,theme:"Legacy",     task:"Ask her: what do you want people to say about our relationship in 10 years?",tip:"This question creates shared vision. Couples with shared vision stay together.",pillar:"lead"},
  {day:54,week:8,theme:"Legacy",     task:"Start building something you'll both be proud of in a year. A goal, a habit, a ritual.",tip:"Great partnerships are built deliberately.",pillar:"lead"},
  {day:55,week:8,theme:"Legacy",     task:"Write down 3 things you've noticed about her that you've never said out loud.",tip:"Then say them.",pillar:"protect"},
  {day:56,week:8,theme:"Legacy",     task:"Review your She Said log. Act on one thing she mentioned more than 2 weeks ago.",tip:"She mentioned it once. You remembered weeks later. That's what makes men rare.",pillar:"provide"},
  {day:57,week:8,theme:"Legacy",     task:"Have the conversation you've both been avoiding. Use this week's diagnostic first.",tip:"Unspoken things don't shrink. They grow.",pillar:"lead"},
  {day:58,week:8,theme:"Legacy",     task:"Plan a trip or experience — something 3-6 months out — and tell her tonight.",tip:"Always have a next thing. She needs to know the adventure isn't over.",pillar:"lead"},
  {day:59,week:8,theme:"Legacy",     task:"Tell her what this month meant to you. Specifically. In detail.",tip:"60 days is a milestone. Acknowledge it out loud.",pillar:"protect"},
  {day:60,week:8,theme:"Legacy",     task:"Ask her: how have you felt this month compared to before?",tip:"The answer is the data. The question is the intimacy.",pillar:"lead"},
];

const CHALLENGE_90 = [
  {day:61,week:9,theme:"Mastery",    task:"Write down the partner you were on Day 1 vs who you are today. Read it.",tip:"This is evidence. You became someone different. Keep it.",pillar:"lead"},
  {day:62,week:9,theme:"Mastery",    task:"Tell her one way she's made you a better man. Be specific.",tip:"Most men never say this out loud. She needs to know she matters to your growth.",pillar:"protect"},
  {day:63,week:9,theme:"Mastery",    task:"Do something today your Day 1 self wouldn't have done. Without being asked.",tip:"That gap between Day 1 and today — that's the work.",pillar:"lead"},
  {day:64,week:9,theme:"Mastery",    task:"Create a shared ritual you'll both have in 10 years. A weekly thing, just yours.",tip:"Rituals are relationship architecture. Build something permanent.",pillar:"provide"},
  {day:65,week:9,theme:"Mastery",    task:"Plan a trip or experience 3-6 months out. Tell her tonight.",tip:"Always have a next thing. She needs to know the adventure isn't over.",pillar:"lead"},
  {day:66,week:9,theme:"Mastery",    task:"Ask her: what do you want people to say about us at our anniversary?",tip:"Heavy question. The best conversations start there.",pillar:"protect"},
  {day:67,week:9,theme:"Mastery",    task:"Write her a letter she'll read in 5 years. Seal it. Date it.",tip:"The act of writing it changes you. She'll treasure it forever.",pillar:"provide"},
  {day:68,week:10,theme:"Deep",      task:"Read your full log. What patterns do you see? What surprised you?",tip:"90 days of data. You now know things about her most men never learn.",pillar:"lead"},
  {day:69,week:10,theme:"Deep",      task:"Ask her what the last 90 days have felt like from her side.",tip:"Don't explain or defend. Just listen. This is the most valuable data you'll collect.",pillar:"protect"},
  {day:70,week:10,theme:"Deep",      task:"Invest in your appearance today — whatever that means to you.",tip:"She should still be attracted to you. That's part of the job.",pillar:"attractive"},
  {day:71,week:10,theme:"Deep",      task:"Handle something at home that's been ignored for weeks. Own it completely.",tip:"Maintenance is protection. She notices what you let slide.",pillar:"protect"},
  {day:72,week:10,theme:"Deep",      task:"Tell her three ways she's grown in the last year that you've noticed.",tip:"She works on herself constantly. Most partners don't notice. You do.",pillar:"protect"},
  {day:73,week:10,theme:"Deep",      task:"Go one full day with no complaints and no frustration expressed.",tip:"Emotional regulation is strength. She relaxes when you hold steady.",pillar:"lead"},
  {day:74,week:10,theme:"Deep",      task:"Do the Pulling Away diagnostic again. Compare to Day 1.",tip:"Growth is measurable. Measure it.",pillar:"lead"},
  {day:75,week:11,theme:"Excellence",task:"Have the conversation you've been avoiding for months.",tip:"Unspoken things create invisible walls. Take the wall down.",pillar:"lead"},
  {day:76,week:11,theme:"Excellence",task:"Ask her what her biggest fear is about your future together.",tip:"This is intimacy at its deepest. Sit with her in it.",pillar:"protect"},
  {day:77,week:11,theme:"Excellence",task:"Tell her your biggest fear. Be as vulnerable as you're asking her to be.",tip:"She can't trust your strength if she's never seen you be human.",pillar:"protect"},
  {day:78,week:11,theme:"Excellence",task:"Revisit her profile. Update anything that's changed. Add three new things.",tip:"She's not the same woman she was 90 days ago. Update your data.",pillar:"provide"},
  {day:79,week:11,theme:"Excellence",task:"Plan date night and tell her it's non-negotiable — this week.",tip:"Protecting time for her communicates she's a priority, not a preference.",pillar:"lead"},
  {day:80,week:11,theme:"Excellence",task:"Send a text that references something from your She Said log — something old.",tip:"She mentioned it once, weeks ago. You remembered. Watch her face.",pillar:"provide"},
  {day:81,week:11,theme:"Excellence",task:"Tell someone who matters to her something you love about her.",tip:"Public appreciation through someone she loves echoes for weeks.",pillar:"protect"},
  {day:82,week:12,theme:"Legacy",    task:"Write your personal code as a partner. 5 principles. Read them every morning.",tip:"Clarity on who you are prevents drift.",pillar:"lead"},
  {day:83,week:12,theme:"Legacy",    task:"Teach someone else one thing you've learned in 90 days.",tip:"Teaching cements learning. You might save someone else's relationship.",pillar:"lead"},
  {day:84,week:12,theme:"Legacy",    task:"Do something this week that scared you 90 days ago.",tip:"Growth is only real when it changes your behavior. Test yourself.",pillar:"lead"},
  {day:85,week:12,theme:"Legacy",    task:"Plan how you'll maintain this after Day 90. Design your daily non-negotiable.",tip:"Systems outlast motivation. Design the system now.",pillar:"lead"},
  {day:86,week:12,theme:"Legacy",    task:"Give her an evening that's completely about her. Her favorites, her pace.",tip:"Not a compromise. Fully, entirely, what she loves.",pillar:"provide"},
  {day:87,week:12,theme:"Legacy",    task:"Ask her: what's one thing I do that makes you feel most loved?",tip:"Direct data. Use it for the next 90 days.",pillar:"protect"},
  {day:88,week:12,theme:"Legacy",    task:"Write down your relationship goals for the next year. Share them with her.",tip:"A man with vision for his relationship is rare. She'll feel the safety of it.",pillar:"lead"},
  {day:89,week:12,theme:"Legacy",    task:"Do one thing today that costs you something — time, comfort, money, ego.",tip:"Love is sacrifice. The best version of it is chosen.",pillar:"provide"},
  {day:90,week:12,theme:"Legacy",    task:"Tell her — out loud, today — that you intend to keep becoming better for her. For the rest of your life.",tip:"90 days is not the destination. It's who you are now. This is just the beginning.",pillar:"lead"},
];

const CHALLENGE_MONTHLY = [
  {month:1, theme:"Foundation", mission:"Every week this month: do one thing that costs you something — time, comfort, money, or ego. No small acts only.",focus:"Lead",why:"Love is most visible when it costs something. She's watching."},
  {month:2, theme:"Presence",   mission:"48 minutes of uninterrupted presence — no exceptions, every day. Track it. At month end, calculate how many days you actually hit it.",focus:"Provide",why:"The 48-minute gap is the root of most distance. Close it for a full month."},
  {month:3, theme:"Know Her",   mission:"Learn something genuinely new about her every week. Ask the questions you've never asked. Update her profile with what you discover.",focus:"Protect",why:"She is still becoming. Most partners stopped being curious years ago."},
  {month:4, theme:"Attraction", mission:"Upgrade yourself in one visible way this month — fitness, grooming, skill, wardrobe. Something she can see.",focus:"Attractive",why:"She fell for a man who was growing. Don't let comfort make you invisible."},
  {month:5, theme:"Depth",      mission:"One real conversation per week that goes beyond the surface. Not logistics. Life, fear, desire, meaning.",focus:"Protect",why:"Most couples become roommates. Depth is the antidote."},
  {month:6, theme:"Service",    mission:"Handle something significant she's been carrying alone. Own it completely from start to finish without being asked.",focus:"Provide",why:"Silent service at this level is the highest form of love."},
  {month:7, theme:"Adventure",  mission:"Do something neither of you has done before. Doesn't have to be expensive. Has to be new.",focus:"Lead",why:"Novelty is oxygen for a long-term relationship. Be the one who brings it."},
  {month:8, theme:"Legacy",     mission:"Start something you'll both be proud of in 10 years — a ritual, a tradition, a goal.",focus:"Lead",why:"Great partnerships are built deliberately, not by accident."},
  {month:9, theme:"Repair",     mission:"Fix one thing between you that's been quietly broken. Apologize, forgive, address, resolve.",focus:"Lead",why:"Unresolved things don't stay the same size. They grow."},
  {month:10,theme:"Celebration",mission:"Celebrate her publicly once this month. In front of her people. Make her proud to be with you.",focus:"Provide",why:"Private love is good. Public pride is something different."},
  {month:11,theme:"Vision",     mission:"Write your shared vision for the next 3 years. A paragraph describing what your life looks like. Read it to her.",focus:"Lead",why:"Couples who share a vision stay together. Couples without one drift."},
  {month:12,theme:"Reflection", mission:"Review the full year. What grew? What slipped? What are you most proud of? Tell her one thing you're committing to next year.",focus:"Lead",why:"The men who improve year on year are the ones who measure year on year."},
];




const SEASONAL_THEMES = {
  0:  { name:"New Year", emoji:"🎆", vibe:"fresh starts and setting intentions together", accent:"#3498db" },
  1:  { name:"Valentine's", emoji:"💝", vibe:"romance, depth, and celebrating your love story", accent:"#e91e8c" },
  2:  { name:"Spring Renewal", emoji:"🌸", vibe:"new energy, growth, and blooming together", accent:"#27ae60" },
  3:  { name:"April Adventure", emoji:"🌦️", vibe:"spontaneity, fresh experiences, and playfulness", accent:"#f39c12" },
  4:  { name:"May Warmth", emoji:"🌻", vibe:"appreciation, warmth, and celebrating her", accent:"#e67e22" },
  5:  { name:"Summer Heat", emoji:"☀️", vibe:"passion, adventure, and outdoor connection", accent:"#e74c3c" },
  6:  { name:"Midsummer", emoji:"🌊", vibe:"freedom, joy, and spontaneous experiences", accent:"#2980b9" },
  7:  { name:"August Glow", emoji:"🌅", vibe:"savoring moments, presence, and deep connection", accent:"#f39c12" },
  8:  { name:"Fall Cozy", emoji:"🍂", vibe:"warmth, comfort, nesting, and deeper intimacy", accent:"#c0392b" },
  9:  { name:"October Mystery", emoji:"🎃", vibe:"playfulness, adventure, and surprise", accent:"#8e44ad" },
  10: { name:"Gratitude Season", emoji:"🍁", vibe:"appreciation, reflection, and warmth", accent:"#e67e22" },
  11: { name:"Winter Magic", emoji:"❄️", vibe:"coziness, romance, and creating memories", accent:"#3498db" },
};

// Extended task pool — 60 total so no repeats for 2 months
const EXTENDED_TASKS = [
  // Original 12
  { id:1,  task:"Send her a 'thinking of you' text before noon",           needs:["love","certainty"],                effort:"low",    neuro:["dopamine","serotonin"],            why:"Unprompted texts trigger dopamine. Knowing you think of her = serotonin security." },
  { id:2,  task:"Compliment something specific she did this week",         needs:["significance"],                   effort:"low",    neuro:["serotonin","oxytocin"],            why:"Specific praise = serotonin. Being truly seen = oxytocin release." },
  { id:3,  task:"Plan something for the two of you — don't reveal it yet", needs:["variety","connection"],           effort:"medium", neuro:["dopamine","oxytocin"],             why:"Anticipation = dopamine's strongest driver. Shared plans = oxytocin." },
  { id:4,  task:"Handle one household task she usually does, silently",    needs:["contribution","certainty"],       effort:"medium", neuro:["serotonin","dopamine"],            why:"Removing her stress = serotonin. The surprise = dopamine. No fanfare." },
  { id:5,  task:"Ask her one deep question tonight and just listen",       needs:["significance","growth","connection"],effort:"low", neuro:["oxytocin","serotonin"],            why:"Deep listening = oxytocin. Feeling understood = serotonin lift." },
  { id:6,  task:"Give a 20-second hug the moment you see her today",      needs:["love","connection"],               effort:"low",    neuro:["oxytocin","endorphins"],           why:"20+ second hugs clinically spike oxytocin and drop cortisol." },
  { id:7,  task:"Tell her out loud three specific things you appreciate",  needs:["significance","love"],             effort:"low",    neuro:["serotonin","oxytocin"],            why:"Verbal gratitude = powerful serotonin. Vulnerability from you = oxytocin." },
  { id:8,  task:"Cook or order her favorite meal with no prompting",       needs:["contribution","certainty","love"], effort:"medium", neuro:["serotonin","dopamine","oxytocin"], why:"Food she loves = serotonin + dopamine. Being cared for = oxytocin. Triple hit." },
  { id:9,  task:"Put phone away for a full hour of undivided attention",   needs:["significance","connection"],       effort:"medium", neuro:["oxytocin","serotonin"],            why:"Undivided attention = serotonin priority signal. Presence = oxytocin." },
  { id:10, task:"Plan a small surprise for her this week",                 needs:["variety","love"],                  effort:"high",   neuro:["dopamine","endorphins","oxytocin"],why:"Surprise = dopamine spike. Delight = endorphins. Being thought of = oxytocin." },
  { id:11, task:"Play her favorite music and dance with her",              needs:["love","variety","connection"],     effort:"low",    neuro:["endorphins","oxytocin","dopamine"], why:"Movement = endorphin flood. Physical synchrony = fastest oxytocin trigger." },
  { id:12, task:"Write a note and leave it somewhere she'll find it",      needs:["significance","love"],             effort:"low",    neuro:["dopamine","serotonin"],            why:"Hidden note = dopamine discovery. Written love = serotonin all day." },
  // Extended pool
  { id:13, task:"Make her coffee or tea exactly how she likes it, bring it to her",         needs:["love","certainty"],      effort:"low",    neuro:["serotonin","oxytocin"],            why:"Morning care routines = serotonin stability. Small attentiveness = oxytocin." },
  { id:14, task:"Research and book a restaurant she's never been to for next weekend",      needs:["variety","connection"],  effort:"medium", neuro:["dopamine","oxytocin"],             why:"Planning novelty = dopamine. Shared anticipation = oxytocin bonding." },
  { id:15, task:"Clean something in the house she's mentioned needing attention",           needs:["contribution","certainty"],effort:"medium",neuro:["serotonin"],                       why:"Noticing what she notices = serotonin signal. Stress reduction without being asked." },
  { id:16, task:"Buy her flowers with no occasion. Leave them at the door",                needs:["love","significance"],   effort:"low",    neuro:["dopamine","oxytocin"],             why:"Unexpected gifts = dopamine. No reason = bigger emotional hit." },
  { id:17, task:"Watch a show SHE wants without suggesting something different",            needs:["significance","certainty"],effort:"low",  neuro:["serotonin","oxytocin"],            why:"Pure deference = serotonin (she's prioritized). Undivided attention = oxytocin." },
  { id:18, task:"Send her a voice note instead of a text today",                           needs:["connection","love"],     effort:"low",    neuro:["oxytocin","dopamine"],             why:"Hearing your voice mid-day = unexpected oxytocin surge. Novelty = dopamine." },
  { id:19, task:"Draw her a bath tonight — candles, salts, no pressure",                   needs:["love","certainty"],      effort:"medium", neuro:["endorphins","oxytocin","serotonin"],why:"Warm water = endorphins. Thoughtfulness = oxytocin. Walk away = trust = serotonin." },
  { id:20, task:"Ask her: 'What's one thing I could do this week to make your life easier?'",needs:["significance","contribution"],effort:"low",neuro:["oxytocin","serotonin"],         why:"Directly inviting her needs = powerful oxytocin + serotonin combination." },
  { id:21, task:"Grocery shop and grab something she loves that wasn't on the list",       needs:["love","variety"],        effort:"low",    neuro:["dopamine","serotonin"],            why:"Thoughtful extras = dopamine. Removing her mental load = serotonin." },
  { id:22, task:"Give her a 10-minute shoulder massage with no agenda",                    needs:["love","certainty"],      effort:"low",    neuro:["oxytocin","endorphins"],           why:"Touch = oxytocin. Physical tension relief = endorphins. No expectation = trust." },
  { id:23, task:"Plan a 'staycation' night — hotel vibes at home",                        needs:["variety","connection"],  effort:"high",   neuro:["dopamine","oxytocin","endorphins"],why:"Novelty in familiar surroundings = dopamine. Shared joy = endorphins + oxytocin." },
  { id:24, task:"Text her something you love about her that she doesn't know you've noticed",needs:["significance"],       effort:"low",    neuro:["serotonin","oxytocin"],            why:"Being noticed in the small things = powerful serotonin. Specificity = deep oxytocin." },
  { id:25, task:"Let her sleep in — handle the morning solo, quietly",                     needs:["contribution","certainty"],effort:"medium",neuro:["serotonin","oxytocin"],            why:"Gift of rest = serotonin. Handling everything without being asked = oxytocin trust." },
  { id:26, task:"Read an article about something she's interested in and bring it up",     needs:["growth","significance"], effort:"low",    neuro:["serotonin","oxytocin"],            why:"Paying attention to her world = serotonin. Intellectual engagement = oxytocin connection." },
  { id:27, task:"Set up a picnic — inside or outside — for no reason",                    needs:["variety","love"],        effort:"medium", neuro:["dopamine","endorphins"],           why:"Whimsical effort = dopamine delight. Shared play = endorphin release." },
  { id:28, task:"Compliment her in front of someone else today",                           needs:["significance"],          effort:"low",    neuro:["serotonin","dopamine"],            why:"Public praise = serotonin amplified. Dopamine from the unexpected public recognition." },
  { id:29, task:"Light a candle, put on music, and just be present with her tonight",      needs:["connection","love"],     effort:"low",    neuro:["oxytocin","serotonin"],            why:"Intentional atmosphere = oxytocin readiness. Presence = serotonin security." },
  { id:30, task:"Handle bath time or bedtime routine solo if you have kids",               needs:["contribution"],          effort:"medium", neuro:["serotonin"],                       why:"Removing one of her invisible loads = pure serotonin relief." },
  { id:31, task:"Write her a list of 10 reasons you love her — leave it for her to find",  needs:["significance","love"],   effort:"medium", neuro:["dopamine","serotonin","oxytocin"], why:"Finding a thoughtful written list = dopamine discovery + deep serotonin + oxytocin." },
  { id:32, task:"Take a walk together with no phones",                                     needs:["connection","growth"],   effort:"low",    neuro:["endorphins","oxytocin"],           why:"Movement = endorphins. Side-by-side time = underrated oxytocin builder." },
  { id:33, task:"Order her favorite dessert or sweet and have it waiting",                 needs:["love","variety"],        effort:"low",    neuro:["dopamine","serotonin"],            why:"Sugar + surprise = dopamine. Being remembered specifically = serotonin." },
  { id:34, task:"Ask about her childhood — something you've never heard before",           needs:["growth","connection"],   effort:"low",    neuro:["oxytocin","serotonin"],            why:"Curiosity about her inner world = deep oxytocin. Feeling worth exploring = serotonin." },
  { id:35, task:"Get her something she mentioned weeks ago and forgot about",              needs:["significance"],          effort:"medium", neuro:["dopamine","serotonin","oxytocin"], why:"Remembering = strongest serotonin signal. Surprise = dopamine. Care = oxytocin." },
  { id:36, task:"Book a class or experience she can do with a friend — pay for it",        needs:["growth","love"],         effort:"high",   neuro:["dopamine","serotonin"],            why:"Supporting her joy outside the relationship = serotonin freedom. Gesture = dopamine." },
  { id:37, task:"Cook breakfast and bring it to her wherever she is",                     needs:["love","contribution"],   effort:"medium", neuro:["serotonin","oxytocin","dopamine"], why:"Breakfast in bed (or wherever) = triple hit — serotonin care, oxytocin love, dopamine surprise." },
  { id:38, task:"Tell her one thing you admire about how she handles life",                needs:["significance","growth"], effort:"low",    neuro:["serotonin","oxytocin"],            why:"Admiration = serotonin surge. Being seen as capable = oxytocin of deep recognition." },
  { id:39, task:"Go to bed at the same time as her — no excuses tonight",                 needs:["connection","certainty"],effort:"low",    neuro:["oxytocin","serotonin"],            why:"Shared bedtime = oxytocin through closeness. Choosing her time = serotonin signal." },
  { id:40, task:"Plan a weekend day trip — somewhere neither of you has been",            needs:["variety","connection"],  effort:"high",   neuro:["dopamine","endorphins","oxytocin"],why:"New place = dopamine novelty. Shared adventure = endorphins + oxytocin." },
  // Seasonal bonus tasks (41-60)
  { id:41, task:"Make hot chocolate or her winter drink and bring it while she relaxes",   needs:["love","certainty"],      effort:"low",    neuro:["serotonin","oxytocin"],            why:"Warm comfort = serotonin. Unsolicited care = oxytocin.", seasons:[11,0,1] },
  { id:42, task:"Plan a summer evening outside — blanket, drinks, stars",                 needs:["variety","connection"],  effort:"medium", neuro:["dopamine","endorphins","oxytocin"],why:"Outdoor novelty = dopamine. Relaxed shared joy = endorphins.", seasons:[5,6,7] },
  { id:43, task:"Buy her a pumpkin spice or fall treat she loves",                        needs:["love","variety"],        effort:"low",    neuro:["dopamine","serotonin"],            why:"Seasonal treats = dopamine novelty. Remembering her favorites = serotonin.", seasons:[8,9,10] },
  { id:44, task:"Plan a spring picnic or outdoor date",                                   needs:["variety","connection"],  effort:"medium", neuro:["dopamine","endorphins"],           why:"Spring energy + outdoor movement = endorphin boost. Novelty = dopamine.", seasons:[2,3,4] },
  { id:45, task:"Take her to see Christmas lights or a holiday event",                    needs:["variety","connection"],  effort:"medium", neuro:["dopamine","endorphins","oxytocin"],why:"Seasonal shared experience = dopamine. Joy and wonder = endorphins.", seasons:[11,0] },
  { id:46, task:"Write her a 'what I love about summer with you' note",                   needs:["significance","love"],   effort:"low",    neuro:["serotonin","oxytocin"],            why:"Seasonal specificity in love = deep serotonin. Written = lasting oxytocin.", seasons:[5,6,7] },
  { id:47, task:"Do something cozy together — board game, puzzle, movie marathon",        needs:["connection","certainty"],effort:"low",    neuro:["oxytocin","endorphins"],           why:"Shared laughter/play = endorphins. Cozy togetherness = oxytocin.", seasons:[11,0,1,8] },
  { id:48, task:"Take her to a farmer's market or seasonal event this weekend",           needs:["variety","connection"],  effort:"medium", neuro:["dopamine","endorphins"],           why:"New environment = dopamine. Shared exploration = endorphin bonding.", seasons:[4,5,8,9] },
  { id:49, task:"Start a new tradition together — something you can do every year",       needs:["certainty","growth"],    effort:"medium", neuro:["serotonin","oxytocin"],            why:"Creating rituals = deep serotonin (certainty). Shared identity = oxytocin.", seasons:[0,5,8,11] },
  { id:50, task:"Send her a Valentine's message that references a specific memory",       needs:["significance","love"],   effort:"low",    neuro:["serotonin","oxytocin","dopamine"], why:"Nostalgic specificity = powerful serotonin. Being remembered = oxytocin.", seasons:[1] },
];

// Extended text pool — 40 total across 4 months without repeats
const EXTENDED_TEXTS = [
  { id:1,  text:"Hey, I was just thinking about you and smiling. That's all. 😊",                needs:["love","connection"],          mood:"sweet",     neuro:["dopamine","serotonin"],            why:"Unprompted warmth = dopamine. Knowing she's on your mind = serotonin glow." },
  { id:2,  text:"I noticed how hard you've been working. You're incredible and I see it.",       needs:["significance"],              mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Being witnessed = serotonin. Validation from her person = oxytocin." },
  { id:3,  text:"I've got dinner handled tonight. Just relax when you get home.",                needs:["certainty","contribution"],  mood:"supportive", neuro:["serotonin","dopamine"],            why:"Removing uncertainty = serotonin. Coming home to that = dopamine." },
  { id:4,  text:"I booked us something for Saturday. Pack light 😏",                            needs:["variety","connection"],      mood:"playful",    neuro:["dopamine","endorphins"],           why:"Mystery = peak dopamine. Playfulness triggers endorphins." },
  { id:5,  text:"I've been thinking — what's one dream of yours we haven't talked about?",      needs:["growth","significance"],     mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Inviting her inner world = oxytocin. Being prioritized = serotonin." },
  { id:6,  text:"You looked beautiful this morning and I forgot to say it. I'm saying it now.", needs:["love","significance"],       mood:"sweet",      neuro:["serotonin","dopamine"],            why:"Delayed genuine compliment = unexpected dopamine. Feeling seen = serotonin." },
  { id:7,  text:"Tell me something about your day. I actually want to know.",                   needs:["connection","significance"], mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Invitation to be heard = oxytocin. Knowing you care = serotonin." },
  { id:8,  text:"You don't have to carry everything alone. I'm here.",                          needs:["certainty","love"],          mood:"supportive", neuro:["oxytocin","serotonin"],            why:"Safety + support = oxytocin flood. Not being alone = serotonin stability." },
  { id:9,  text:"I was talking to someone today and realized — I chose the right person.",      needs:["significance","love","certainty"],mood:"affirming",neuro:["serotonin","oxytocin","dopamine"],why:"Being chosen deliberately = serotonin + dopamine. Security = oxytocin. Triple hit." },
  { id:10, text:"No agenda. Just want to know — how are you, really?",                         needs:["significance","connection"], mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Genuine inquiry = oxytocin. Feeling safe to be honest = serotonin." },
  { id:11, text:"I cleared the whole evening. It's yours. Tell me what you want to do.",       needs:["significance","variety"],    mood:"playful",    neuro:["dopamine","serotonin"],            why:"Giving her full control = serotonin significance. Open evening = dopamine anticipation." },
  { id:12, text:"I keep thinking about [specific memory]. That was one of my favorite days.",   needs:["connection","love"],         mood:"sweet",      neuro:["oxytocin","serotonin"],            why:"Nostalgic specificity = deep oxytocin. Being remembered = lasting serotonin." },
  { id:13, text:"You handled that really well. I noticed and I respect you for it.",           needs:["significance","growth"],     mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Respect = serotonin. Being seen in a specific moment = oxytocin surge." },
  { id:14, text:"What's one thing on your mind right now? I want to hear it.",                 needs:["connection","significance"], mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Active invitation = oxytocin. Being worth asking = serotonin." },
  { id:15, text:"I'm making dinner tonight. Any requests?",                                    needs:["contribution","certainty"],  mood:"supportive", neuro:["serotonin","dopamine"],            why:"Taking over = serotonin relief. Small dopamine from the invitation itself." },
  { id:16, text:"Just wanted you to know I'm thinking about you. No reason. Just am.",         needs:["love","certainty"],          mood:"sweet",      neuro:["serotonin","dopamine"],            why:"Frequency of unprompted love = serotonin baseline. Slight novelty = dopamine." },
  { id:17, text:"You've been on my mind since this morning. That hasn't changed.",             needs:["love","significance"],       mood:"sweet",      neuro:["oxytocin","serotonin"],            why:"Sustained attention = oxytocin. Knowing she occupies your thoughts = serotonin." },
  { id:18, text:"What would the perfect weekend look like for you right now?",                 needs:["significance","variety"],    mood:"deep",       neuro:["dopamine","serotonin"],            why:"Invitation to dream = dopamine. Being asked what she actually wants = serotonin." },
  { id:19, text:"I'm proud of you. Not just for the big stuff — for how you show up every day.",needs:["significance","growth"],    mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Everyday recognition = deep serotonin. Pride from her person = oxytocin surge." },
  { id:20, text:"You make this house feel like home. I don't say that enough.",                needs:["significance","certainty"],  mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Acknowledging her invisible labor = serotonin. Feeling essential = oxytocin." },
  { id:21, text:"I love watching you laugh. Thought you should know.",                        needs:["love","connection"],         mood:"sweet",      neuro:["endorphins","oxytocin"],           why:"Being admired in joy = endorphin + oxytocin. Specificity = warmth." },
  { id:22, text:"What's something you've been wanting to try? Let's put it on the calendar.",  needs:["growth","variety"],          mood:"playful",    neuro:["dopamine","serotonin"],            why:"Committing to her growth = dopamine excitement. Being taken seriously = serotonin." },
  { id:23, text:"I was wrong about that. You were right. I see it now.",                      needs:["significance","certainty"],  mood:"deep",       neuro:["serotonin","oxytocin"],            why:"A genuine apology or concession = rare serotonin hit. Trust through honesty = oxytocin." },
  { id:24, text:"Tonight I'm putting the phone away. All yours.",                             needs:["significance","connection"],  mood:"supportive", neuro:["oxytocin","serotonin"],            why:"Full presence = strongest oxytocin signal. Choosing her = serotonin." },
  { id:25, text:"You looked at me the way you used to today. I noticed.",                     needs:["connection","love"],         mood:"sweet",      neuro:["dopamine","oxytocin"],             why:"Noticing intimacy in the mundane = dopamine. Saying it = oxytocin vulnerability." },
  { id:26, text:"I've got the kids tonight. Do whatever you want.",                           needs:["contribution","variety"],    mood:"supportive", neuro:["serotonin","dopamine"],            why:"Freedom gift = serotonin relief. Novelty of actual solo time = dopamine." },
  { id:27, text:"I love you more than I show. Working on that.",                              needs:["love","certainty"],          mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Vulnerability + commitment = oxytocin + serotonin. Rare honesty = powerful." },
  { id:28, text:"Name one place you've always wanted to go. We're making it happen this year.",needs:["growth","variety"],          mood:"playful",    neuro:["dopamine","oxytocin"],             why:"Future-building together = dopamine. Being taken seriously long-term = oxytocin." },
  { id:29, text:"I appreciate you more than I say. You carry a lot and it doesn't go unnoticed.",needs:["significance","contribution"],mood:"affirming",neuro:["serotonin","oxytocin"],          why:"Seeing invisible labor = deep serotonin. Verbal recognition = oxytocin." },
  { id:30, text:"Can we just talk tonight? No agenda, no screens. Just us.",                  needs:["connection","growth"],       mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Intentional connection request = oxytocin anticipation. Being chosen = serotonin." },
  // ── BATCH 2 — ids 31-60 ──────────────────────────────────────────────────
  { id:31, text:"I made a reservation for us Saturday. You just have to show up.",            needs:["certainty","variety"],       mood:"playful",    neuro:["dopamine","serotonin"],            why:"Decision made for her = serotonin relief. Anticipation of surprise = dopamine." },
  { id:32, text:"You've been carrying a lot lately. I see it and I'm here.",                  needs:["significance","certainty"],  mood:"supportive", neuro:["oxytocin","serotonin"],            why:"Being truly witnessed = serotonin. Emotional safety offered = oxytocin." },
  { id:33, text:"What do you need tonight? Whatever it is, that's what we're doing.",         needs:["significance","love"],       mood:"supportive", neuro:["serotonin","oxytocin"],            why:"Full deference = powerful serotonin. Her needs placed first = oxytocin." },
  { id:34, text:"I was just thinking about the night we [memory]. Still one of my favorites.",needs:["connection","love"],         mood:"sweet",      neuro:["oxytocin","serotonin"],            why:"Shared nostalgia = oxytocin. Being remembered specifically = serotonin." },
  { id:35, text:"You didn't have to, but you did. That's one of my favorite things about you.",needs:["significance"],            mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Specific admiration = serotonin. Being truly seen = deep oxytocin." },
  { id:36, text:"I'm proud to be with you. Not saying it enough — saying it now.",           needs:["significance","love"],       mood:"affirming",  neuro:["serotonin","dopamine"],            why:"Pride from partner = serotonin elevation. Unexpected timing = dopamine." },
  { id:37, text:"Can I take you somewhere this weekend? Just say yes.",                       needs:["variety","chosen"],          mood:"playful",    neuro:["dopamine","oxytocin"],             why:"Bold invitation = dopamine anticipation. Being pursued = oxytocin." },
  { id:38, text:"You make everything better. I hope you know that.",                          needs:["significance","love"],       mood:"sweet",      neuro:["serotonin","oxytocin"],            why:"Feeling essential to his world = serotonin + oxytocin compound hit." },
  { id:39, text:"I'm not going anywhere. Just wanted you to know that today.",               needs:["certainty","safe"],           mood:"supportive", neuro:["serotonin","oxytocin"],            why:"Explicit commitment = serotonin security. Unprompted reassurance = oxytocin." },
  { id:40, text:"What's one thing I could do this week that would mean the most to you?",    needs:["heard","significance"],      mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Directly asking her needs = oxytocin. Being prioritized = serotonin." },
  { id:41, text:"I love the sound of your laugh. Genuinely.",                                needs:["love","connection"],         mood:"sweet",      neuro:["endorphins","oxytocin"],           why:"Being admired in a moment of joy = endorphins + oxytocin." },
  { id:42, text:"You're doing better than you think. I watch you and I'm amazed.",           needs:["significance","growth"],     mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"External validation when she doubts herself = powerful serotonin boost." },
  { id:43, text:"I booked a sitter. Saturday is just for us.",                               needs:["variety","connection"],      mood:"playful",    neuro:["dopamine","oxytocin"],             why:"Planning for her = dopamine. Prioritizing the relationship = oxytocin." },
  { id:44, text:"I've been thinking about you all day. Still am.",                           needs:["love","chosen"],             mood:"sweet",      neuro:["dopamine","serotonin"],            why:"Sustained thought of her = serotonin significance. Expressed = dopamine." },
  { id:45, text:"Let me know when you're leaving work. Dinner will be ready.",               needs:["certainty","contribution"],  mood:"supportive", neuro:["serotonin","dopamine"],            why:"Concrete act of care = serotonin. Something to look forward to = dopamine." },
  { id:46, text:"You don't have to be strong right now. I've got us.",                       needs:["safe","certainty"],          mood:"supportive", neuro:["oxytocin","serotonin"],            why:"Permission to be vulnerable = oxytocin safety. Certainty of support = serotonin." },
  { id:47, text:"You looked incredible this morning. Still thinking about it.",              needs:["significance","love"],       mood:"sweet",      neuro:["dopamine","serotonin"],            why:"Delayed attraction note = unexpected dopamine. Being desired = serotonin." },
  { id:48, text:"I want to hear about your day — the whole thing, not the summary.",         needs:["heard","connection"],         mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Asking for depth = oxytocin intimacy. Being worth that time = serotonin." },
  { id:49, text:"We're going to figure this out. Together. I'm not worried.",                needs:["certainty","safe"],           mood:"supportive", neuro:["serotonin","oxytocin"],            why:"Calm leadership in uncertainty = serotonin relief. Togetherness = oxytocin." },
  { id:50, text:"I see you working so hard and saying nothing. I see it.",                   needs:["seen","significance"],       mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Witnessing silent effort = powerful serotonin. Being noticed = oxytocin." },
  { id:51, text:"The way you handled that today — I noticed. You're something else.",        needs:["significance","growth"],     mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Specific admiration for how she handles life = deep serotonin elevation." },
  { id:52, text:"Pick a restaurant tonight. Anywhere. I'm taking you out.",                  needs:["variety","chosen"],          mood:"playful",    neuro:["dopamine","serotonin"],            why:"Being chosen and treated = dopamine. Decision made for her = serotonin." },
  { id:53, text:"I want to know what you've been thinking about lately. Tell me.",           needs:["heard","growth"],            mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Active curiosity about her mind = oxytocin. Being worth exploring = serotonin." },
  { id:54, text:"I love who you are when you're relaxed. I want to give you more of that.", needs:["love","certainty"],           mood:"sweet",      neuro:["oxytocin","serotonin"],            why:"Wanting her ease = oxytocin. Intentional care = serotonin security." },
  { id:55, text:"You've made my life better. That doesn't get said enough.",                 needs:["significance","love"],       mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Quantified impact = serotonin. Feeling essential = oxytocin." },
  { id:56, text:"I've got the whole evening figured out. Trust me.",                         needs:["certainty","variety"],       mood:"playful",    neuro:["dopamine","serotonin"],            why:"Confident leadership = serotonin trust. Mystery = dopamine anticipation." },
  { id:57, text:"What's weighing on you most right now? I want to know.",                   needs:["heard","safe"],               mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Safe space to unload = oxytocin. Being asked directly = serotonin significance." },
  { id:58, text:"I don't tell you enough how much I respect you.",                           needs:["significance"],              mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Respect from her partner = one of the strongest serotonin triggers available." },
  { id:59, text:"I chose you on purpose. Still choosing you. Every day.",                    needs:["chosen","love"],             mood:"deep",       neuro:["oxytocin","serotonin","dopamine"], why:"Deliberate choice restated = triple hit — serotonin, oxytocin, dopamine." },
  { id:60, text:"Tonight is yours. I'll handle everything. Just be.",                        needs:["certainty","contribution"],  mood:"supportive", neuro:["serotonin","oxytocin"],            why:"Full service mode = serotonin relief. Being cared for completely = oxytocin." },
  // ── BATCH 3 — ids 61-90 ──────────────────────────────────────────────────
  { id:61, text:"I keep catching myself smiling thinking about you.",                        needs:["love","chosen"],             mood:"sweet",      neuro:["dopamine","serotonin"],            why:"Involuntary attraction expressed = dopamine. Knowing she's in his mind = serotonin." },
  { id:62, text:"I handled [chore] so you don't have to think about it.",                    needs:["contribution","certainty"],  mood:"supportive", neuro:["serotonin","dopamine"],            why:"Specific task removed = serotonin. Being cared for proactively = dopamine." },
  { id:63, text:"You never have to earn my attention. You already have it.",                 needs:["safe","certainty"],           mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Unconditional attention = deep oxytocin. Safety with no performance needed = serotonin." },
  { id:64, text:"I want to hear your voice. Can I call for 5 minutes?",                     needs:["connection","heard"],         mood:"sweet",      neuro:["oxytocin","dopamine"],             why:"Voice = intimacy cue = oxytocin. Unexpected call in the day = dopamine." },
  { id:65, text:"What's one thing you've been wanting to do that we haven't made time for?", needs:["heard","growth"],            mood:"deep",       neuro:["dopamine","serotonin"],            why:"Her desires made a priority = serotonin. Potential new experience = dopamine." },
  { id:66, text:"You carry the vibe of this home. I don't take that lightly.",              needs:["significance","contribution"],mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Recognizing invisible contribution = serotonin. Feeling essential = oxytocin." },
  { id:67, text:"I'm making tonight low-key and easy. You deserve that.",                   needs:["certainty","love"],           mood:"supportive", neuro:["serotonin","oxytocin"],            why:"Comfort without effort from her = serotonin. Being loved unconditionally = oxytocin." },
  { id:68, text:"The way you love [him/kids/family] — it's one of my favorite things about you.", needs:["significance","seen"], mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Being seen in how she loves others = deep serotonin and oxytocin." },
  { id:69, text:"I want you to sleep in this weekend. I've got the morning.",               needs:["contribution","certainty"],  mood:"supportive", neuro:["serotonin","dopamine"],            why:"Gift of rest = serotonin. Anticipation of it = dopamine all night." },
  { id:70, text:"I'm attracted to you in a way that doesn't go away. Just so you know.",   needs:["chosen","love"],             mood:"deep",       neuro:["dopamine","serotonin"],            why:"Sustained desire expressed = serotonin significance. Desire itself = dopamine." },
  { id:71, text:"I don't say it enough — thank you for everything you do.",                 needs:["seen","significance"],       mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Gratitude for invisible labor = serotonin. Being acknowledged = oxytocin." },
  { id:72, text:"I love watching you talk about things that matter to you.",                needs:["seen","connection"],          mood:"sweet",      neuro:["oxytocin","serotonin"],            why:"Being witnessed in passion = serotonin. Feeling interesting to him = oxytocin." },
  { id:73, text:"I'm not perfect but I'm committed to getting better for us.",             needs:["certainty","safe"],           mood:"deep",       neuro:["serotonin","oxytocin"],            why:"Humble commitment = serotonin security. Being with someone growing = oxytocin trust." },
  { id:74, text:"Your instincts are usually right. I should say that more.",               needs:["significance","heard"],       mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Validating her intuition = serotonin. Being trusted in her knowing = oxytocin." },
  { id:75, text:"I want to take you somewhere neither of us has been. When are you free?", needs:["variety","alive"],            mood:"playful",    neuro:["dopamine","endorphins"],           why:"Novelty invitation = dopamine. Shared adventure prospect = endorphins." },
  { id:76, text:"You deserve a full night off. I mean it — from everything.",              needs:["contribution","safe"],        mood:"supportive", neuro:["serotonin","oxytocin"],            why:"Permission to rest fully = serotonin relief. Being truly seen as tired = oxytocin." },
  { id:77, text:"I'm going to be more intentional with you. Starting today.",             needs:["certainty","chosen"],          mood:"deep",       neuro:["serotonin","dopamine"],            why:"Declared intention toward her = serotonin security. Future-looking = dopamine." },
  { id:78, text:"Do you feel loved today? I want to make sure.",                          needs:["heard","significance"],       mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Directly checking her emotional state = powerful oxytocin + serotonin." },
  { id:79, text:"I notice things about you that nobody else does. I like that.",          needs:["seen","connection"],           mood:"sweet",      neuro:["serotonin","oxytocin"],            why:"Being privately known = deep oxytocin. Uniqueness recognized = serotonin." },
  { id:80, text:"You're the person I want to tell things to first. Always.",             needs:["connection","chosen"],          mood:"sweet",      neuro:["oxytocin","serotonin"],            why:"Being his person = oxytocin. Being chosen as first = serotonin significance." },
  { id:81, text:"I'd choose the hard days with you over easy days without you.",         needs:["chosen","certainty"],           mood:"deep",       neuro:["serotonin","oxytocin","dopamine"], why:"Deliberate choice in difficulty = triple chemical hit. Rare and powerful." },
  { id:82, text:"Let's do something this weekend we've never done before. You pick.",   needs:["variety","heard"],              mood:"playful",    neuro:["dopamine","endorphins"],           why:"Novelty + her in control = dopamine + serotonin of being valued." },
  { id:83, text:"I'm grateful every day that you're mine.",                              needs:["love","certainty"],             mood:"sweet",      neuro:["serotonin","oxytocin"],            why:"Daily gratitude for her = serotonin. Possessive language she loves = oxytocin." },
  { id:84, text:"Tell me something you've been keeping to yourself.",                   needs:["heard","safe"],                 mood:"deep",       neuro:["oxytocin","serotonin"],            why:"Invitation to vulnerability = oxytocin safety. Being worth confiding in = serotonin." },
  { id:85, text:"I thought about calling just to hear your voice. So I am.",            needs:["connection","chosen"],          mood:"sweet",      neuro:["oxytocin","dopamine"],             why:"Acting on the impulse to connect = dopamine for her. Voice = oxytocin." },
  { id:86, text:"You inspire me more than you know.",                                   needs:["significance","growth"],        mood:"affirming",  neuro:["serotonin","dopamine"],            why:"Being someone's inspiration = serotonin elevation. Unexpected = dopamine." },
  { id:87, text:"I see how much effort you put in. It doesn't go unnoticed.",          needs:["seen","contribution"],           mood:"affirming",  neuro:["serotonin","oxytocin"],            why:"Effort witnessed = serotonin. Not having to ask to be seen = oxytocin trust." },
  { id:88, text:"I want to make you laugh today. Give me a chance tonight.",           needs:["alive","connection"],            mood:"playful",    neuro:["endorphins","dopamine"],           why:"Playful intent = dopamine anticipation. Laughter planned = endorphins ahead." },
  { id:89, text:"You have no idea how good it feels to come home to you.",             needs:["love","significance"],           mood:"sweet",      neuro:["serotonin","oxytocin"],            why:"Being someone's refuge = serotonin + oxytocin. Feeling chosen as home = deep." },
  { id:90, text:"I'm thinking about our future and smiling. That's because of you.",  needs:["certainty","chosen"],            mood:"deep",       neuro:["dopamine","serotonin"],            why:"Future with her = dopamine anticipation. Being the reason = serotonin significance." },
  // ── Q2 Texts (ids 101-200) ──────────────────────────────────────────────────
  { id:101, phase:"follicular", mood:"playful",   text:"Hey. I'm thinking about you. Not for any reason. Just wanted you to know.", chemicals:["oxytocin"] },
  { id:102, phase:"ovulation",  mood:"affirming",  text:"I don't say this enough — watching you be you makes me proud every single day.", chemicals:["serotonin","oxytocin"] },
  { id:103, phase:"luteal",     mood:"supportive", text:"You're doing more than you realize. I see it. I'm grateful for you.", chemicals:["serotonin"] },
  { id:104, phase:"menstrual",  mood:"sweet",      text:"No agenda. Just checking on you. What do you need today?", chemicals:["oxytocin"] },
  { id:105, phase:"follicular", mood:"deep",       text:"I've been thinking about something you said last week. You were right.", chemicals:["oxytocin","serotonin"] },
  { id:106, phase:"ovulation",  mood:"sweet",      text:"You looked incredible today. I keep thinking about it.", chemicals:["dopamine","oxytocin"] },
  { id:107, phase:"luteal",     mood:"supportive", text:"Tonight: you don't have to do anything. I've got it. All of it.", chemicals:["serotonin"] },
  { id:108, phase:"menstrual",  mood:"sweet",      text:"Bringing you something warm later. No reason needed.", chemicals:["oxytocin","serotonin"] },
  { id:109, phase:"follicular", mood:"affirming",  text:"The way you handled that? That's exactly why I'm with you.", chemicals:["serotonin","dopamine"] },
  { id:110, phase:"ovulation",  mood:"deep",       text:"I want to take you somewhere this weekend. Just us. I'll handle everything.", chemicals:["dopamine","oxytocin"] },
  { id:111, phase:"luteal",     mood:"supportive", text:"I noticed you've been carrying a lot. Thank you for not making it visible. I see it.", chemicals:["oxytocin","serotonin"] },
  { id:112, phase:"follicular", mood:"playful",    text:"Okay real question: what would make tonight actually good for you?", chemicals:["oxytocin"] },
  { id:113, phase:"ovulation",  mood:"affirming",  text:"You make hard things look easy. I want you to know I notice that.", chemicals:["serotonin"] },
  { id:114, phase:"luteal",     mood:"supportive", text:"Whatever you're feeling right now it's valid. You don't have to explain it to me.", chemicals:["oxytocin"] },
  { id:115, phase:"menstrual",  mood:"sweet",      text:"Rest. I'll handle the rest.", chemicals:["serotonin"] },
  { id:116, phase:"follicular", mood:"deep",       text:"What's something you've wanted to do but haven't told me yet?", chemicals:["dopamine","oxytocin"] },
  { id:117, phase:"ovulation",  mood:"sweet",      text:"You look like exactly the woman I'd choose all over again today.", chemicals:["serotonin","oxytocin"] },
  { id:118, phase:"luteal",     mood:"supportive", text:"I'm not going anywhere. I mean that.", chemicals:["serotonin","oxytocin"] },
  { id:119, phase:"follicular", mood:"affirming",  text:"I've been thinking about what you said about your dream. I think you should do it.", chemicals:["dopamine","serotonin"] },
  { id:120, phase:"ovulation",  mood:"deep",       text:"Tonight I just want to be close to you. No reason. I just miss you.", chemicals:["oxytocin","endorphins"] },
  { id:121, phase:"menstrual",  mood:"sweet",      text:"You don't have to perform today. Just be. I'm here.", chemicals:["oxytocin","serotonin"] },
  { id:122, phase:"follicular", mood:"playful",    text:"I have an idea for us this week. I'm not telling you what it is yet.", chemicals:["dopamine"] },
  { id:123, phase:"ovulation",  mood:"affirming",  text:"I am genuinely lucky. I mean that every single day.", chemicals:["serotonin","oxytocin"] },
  { id:124, phase:"luteal",     mood:"supportive", text:"I've got the house tonight. You just exist. That's your only job.", chemicals:["serotonin"] },
  { id:125, phase:"menstrual",  mood:"sweet",      text:"Thinking about you today. Not because of anything. Just because.", chemicals:["oxytocin"] },
  { id:126, phase:"follicular", mood:"deep",       text:"Tell me something that's been sitting in your head lately.", chemicals:["oxytocin","serotonin"] },
  { id:127, phase:"ovulation",  mood:"sweet",      text:"Has anyone told you today how good you look? Because you do.", chemicals:["dopamine","serotonin"] },
  { id:128, phase:"luteal",     mood:"supportive", text:"I'm on your side. Always. Even when it's messy.", chemicals:["oxytocin","serotonin"] },
  { id:129, phase:"follicular", mood:"affirming",  text:"You have this way of making everything feel more alive. I notice it.", chemicals:["serotonin","endorphins"] },
  { id:130, phase:"ovulation",  mood:"deep",       text:"I want to know what you actually want. Not what you think I want to hear.", chemicals:["oxytocin"] },
  { id:131, phase:"menstrual",  mood:"sweet",      text:"Zero expectations tonight. Just show me what you need.", chemicals:["oxytocin","serotonin"] },
  { id:132, phase:"follicular", mood:"playful",    text:"I'm taking you somewhere Saturday. Pack something nice.", chemicals:["dopamine"] },
  { id:133, phase:"ovulation",  mood:"affirming",  text:"You're the best decision I've ever made. That hasn't changed.", chemicals:["serotonin","oxytocin"] },
  { id:134, phase:"luteal",     mood:"supportive", text:"If it feels heavy right now that's okay. I'm not going anywhere.", chemicals:["oxytocin"] },
  { id:135, phase:"follicular", mood:"deep",       text:"What's something you've always wanted to try? I'm serious. Tell me.", chemicals:["dopamine","oxytocin"] },
  { id:136, phase:"ovulation",  mood:"sweet",      text:"I keep catching myself smiling thinking about you today.", chemicals:["dopamine","oxytocin"] },
  { id:137, phase:"luteal",     mood:"supportive", text:"You're stronger than you feel right now. I've been watching.", chemicals:["serotonin"] },
  { id:138, phase:"menstrual",  mood:"sweet",      text:"No plans tonight unless you want them. Just you and comfort.", chemicals:["serotonin","oxytocin"] },
  { id:139, phase:"follicular", mood:"affirming",  text:"Watching you grow this year has been one of the best things I've witnessed.", chemicals:["serotonin"] },
  { id:140, phase:"ovulation",  mood:"deep",       text:"I've been thinking about us. What we're building. I'm proud of what this is.", chemicals:["oxytocin","serotonin"] },
  { id:141, phase:"luteal",     mood:"supportive", text:"Dinner's handled. Evening is yours. Don't think about anything tonight.", chemicals:["serotonin","endorphins"] },
  { id:142, phase:"follicular", mood:"playful",    text:"Describe your perfect evening right now. I want details.", chemicals:["dopamine","oxytocin"] },
  { id:143, phase:"ovulation",  mood:"affirming",  text:"I see everything you do for us. All of it. You're not invisible.", chemicals:["serotonin","oxytocin"] },
  { id:144, phase:"menstrual",  mood:"sweet",      text:"I ordered your favourite food. No reason. Just wanted to.", chemicals:["oxytocin","serotonin"] },
  { id:145, phase:"follicular", mood:"deep",       text:"If you could change one thing about how we spend our time what would it be?", chemicals:["oxytocin"] },
  { id:146, phase:"ovulation",  mood:"sweet",      text:"The way you said that thing yesterday. I'm still thinking about it.", chemicals:["oxytocin","dopamine"] },
  { id:147, phase:"luteal",     mood:"supportive", text:"You're allowed to just feel it today. You don't owe anyone a good mood.", chemicals:["oxytocin"] },
  { id:148, phase:"follicular", mood:"affirming",  text:"You light up a room without trying. I hope you know that.", chemicals:["serotonin","endorphins"] },
  { id:149, phase:"ovulation",  mood:"deep",       text:"Tonight I just want to hear about your day. All of it.", chemicals:["oxytocin"] },
  { id:150, phase:"menstrual",  mood:"sweet",      text:"I've got a blanket your show and no opinions. See you tonight.", chemicals:["serotonin","oxytocin"] },
  { id:151, phase:"follicular", mood:"playful",    text:"I dare you to clear your evening. I have plans.", chemicals:["dopamine","oxytocin"] },
  { id:152, phase:"ovulation",  mood:"affirming",  text:"You are genuinely irresistible. That's a fact not a compliment.", chemicals:["dopamine","serotonin"] },
  { id:153, phase:"luteal",     mood:"supportive", text:"Nothing required from you tonight. I mean that completely.", chemicals:["serotonin"] },
  { id:154, phase:"menstrual",  mood:"sweet",      text:"I'm thinking about you. Hope you're being kind to yourself today.", chemicals:["oxytocin"] },
  { id:155, phase:"follicular", mood:"deep",       text:"What's one thing you haven't told me that you've been thinking about?", chemicals:["oxytocin"] },
  { id:156, phase:"ovulation",  mood:"sweet",      text:"The more time I spend with you the more I want to spend with you.", chemicals:["oxytocin","dopamine"] },
  { id:157, phase:"luteal",     mood:"supportive", text:"I handled the thing. Don't worry about it. Just exist tonight.", chemicals:["serotonin"] },
  { id:158, phase:"follicular", mood:"affirming",  text:"Your mind works in a way that constantly impresses me.", chemicals:["serotonin","oxytocin"] },
  { id:159, phase:"ovulation",  mood:"deep",       text:"I want to tell you something tonight. In person. When we're alone.", chemicals:["oxytocin","dopamine"] },
  { id:160, phase:"menstrual",  mood:"sweet",      text:"Hey. Just checking in. How's your body feeling today?", chemicals:["oxytocin"] },
  { id:161, phase:"follicular", mood:"playful",    text:"I'm planning something. All you have to do is say yes.", chemicals:["dopamine"] },
  { id:162, phase:"ovulation",  mood:"affirming",  text:"Every time I look at you I think yeah I chose right.", chemicals:["serotonin","oxytocin"] },
  { id:163, phase:"luteal",     mood:"supportive", text:"I see the effort you're putting in even when it's hard. Thank you.", chemicals:["serotonin","oxytocin"] },
  { id:164, phase:"menstrual",  mood:"sweet",      text:"No pressure tonight. We can just be in the same room and that's enough.", chemicals:["oxytocin","serotonin"] },
  { id:165, phase:"follicular", mood:"deep",       text:"If we could go anywhere this weekend where would you pick?", chemicals:["dopamine","oxytocin"] },
  { id:166, phase:"ovulation",  mood:"sweet",      text:"You've been glowing lately. I don't think you notice it but I do.", chemicals:["serotonin","dopamine"] },
  { id:167, phase:"luteal",     mood:"supportive", text:"Take the night off from being okay. You don't have to be.", chemicals:["oxytocin"] },
  { id:168, phase:"follicular", mood:"affirming",  text:"I brag about you to people. I hope you know that.", chemicals:["serotonin","oxytocin"] },
  { id:169, phase:"ovulation",  mood:"deep",       text:"What would make you feel most loved this week? Actually ask yourself.", chemicals:["oxytocin"] },
  { id:170, phase:"menstrual",  mood:"sweet",      text:"I'm making your favourite thing for dinner tonight. Don't ask why.", chemicals:["oxytocin","serotonin"] },
  { id:171, phase:"follicular", mood:"playful",    text:"Unpopular opinion: we need more adventure. I'm working on it.", chemicals:["dopamine","endorphins"] },
  { id:172, phase:"ovulation",  mood:"affirming",  text:"I choose you today. Same as yesterday. Same as tomorrow.", chemicals:["serotonin","oxytocin"] },
  { id:173, phase:"luteal",     mood:"supportive", text:"Tough week. You're handling it. I see you. I'm proud of you.", chemicals:["serotonin"] },
  { id:174, phase:"menstrual",  mood:"sweet",      text:"Is there anything you need that you haven't asked for?", chemicals:["oxytocin"] },
  { id:175, phase:"follicular", mood:"deep",       text:"I've been thinking about a future plan for us. I'll tell you tonight.", chemicals:["dopamine","oxytocin"] },
  { id:176, phase:"ovulation",  mood:"sweet",      text:"I just wanted to tell you you're beautiful. That's the whole text.", chemicals:["serotonin","oxytocin"] },
  { id:177, phase:"luteal",     mood:"supportive", text:"The world is loud right now. Come home. I'll keep it quiet here.", chemicals:["serotonin","oxytocin"] },
  { id:178, phase:"follicular", mood:"affirming",  text:"Your laugh is genuinely one of my favourite sounds. That's real.", chemicals:["endorphins","oxytocin"] },
  { id:179, phase:"ovulation",  mood:"deep",       text:"What's the last thing that genuinely excited you? Tell me everything.", chemicals:["dopamine","oxytocin"] },
  { id:180, phase:"menstrual",  mood:"sweet",      text:"I bought the thing you mentioned last week. It's waiting for you.", chemicals:["oxytocin","dopamine"] },
  { id:181, phase:"follicular", mood:"playful",    text:"I'm thinking about you in a way that has nothing to do with logistics.", chemicals:["dopamine","oxytocin"] },
  { id:182, phase:"ovulation",  mood:"affirming",  text:"You are a genuinely rare person. I don't tell you that enough.", chemicals:["serotonin"] },
  { id:183, phase:"luteal",     mood:"supportive", text:"I know this time of month is harder. I'm paying attention.", chemicals:["oxytocin","serotonin"] },
  { id:184, phase:"menstrual",  mood:"sweet",      text:"No expectations. No plans. Just warmth and quiet tonight.", chemicals:["serotonin","oxytocin"] },
  { id:185, phase:"follicular", mood:"deep",       text:"What do you actually want your life to look like in five years?", chemicals:["dopamine","oxytocin"] },
  { id:186, phase:"ovulation",  mood:"sweet",      text:"I noticed something about you today and I can't stop thinking about it.", chemicals:["dopamine","oxytocin"] },
  { id:187, phase:"luteal",     mood:"supportive", text:"You've been giving a lot lately. Let me give something back tonight.", chemicals:["oxytocin","serotonin"] },
  { id:188, phase:"follicular", mood:"affirming",  text:"The way you approach things your instincts are really something.", chemicals:["serotonin"] },
  { id:189, phase:"ovulation",  mood:"deep",       text:"I want to know what you love most about us right now.", chemicals:["oxytocin"] },
  { id:190, phase:"menstrual",  mood:"sweet",      text:"Hey. I love you. That's it. That's the whole text.", chemicals:["oxytocin","serotonin"] },
  { id:191, phase:"follicular", mood:"playful",    text:"Random question: if you could do anything tomorrow what would it be?", chemicals:["dopamine","oxytocin"] },
  { id:192, phase:"ovulation",  mood:"affirming",  text:"You have no idea how attractive you are. It's actually kind of unfair.", chemicals:["dopamine","serotonin"] },
  { id:193, phase:"luteal",     mood:"supportive", text:"I've got you. Whatever today is I've got you.", chemicals:["oxytocin","serotonin"] },
  { id:194, phase:"menstrual",  mood:"sweet",      text:"I cancelled our plans tonight. New plan: you rest. I handle everything.", chemicals:["serotonin"] },
  { id:195, phase:"follicular", mood:"deep",       text:"Tell me something no one else knows about you.", chemicals:["oxytocin"] },
  { id:196, phase:"ovulation",  mood:"sweet",      text:"I'm proud to walk next to you. I want you to know that.", chemicals:["serotonin","oxytocin"] },
  { id:197, phase:"luteal",     mood:"supportive", text:"Low energy tonight is completely fine. No pressure.", chemicals:["serotonin","endorphins"] },
  { id:198, phase:"follicular", mood:"affirming",  text:"You're building something real with your life. I see it. Keep going.", chemicals:["serotonin","dopamine"] },
  { id:199, phase:"ovulation",  mood:"deep",       text:"I want to take you on a proper date. This week. Non-negotiable.", chemicals:["dopamine","oxytocin"] },
  { id:200, phase:"menstrual",  mood:"sweet",      text:"Heating pad your show no talking required. I'm already setting it up.", chemicals:["oxytocin","serotonin"] },

];

// ─── Dedicated Date Ideas Pool (40 — separate from Home Activities) ───────────
const DATE_IDEAS = [
  { id:"d1",  emoji:"🕯️", title:"Candlelight Dinner at Home",         effort:"medium", duration:"2 hrs",    chems:["oxytocin","dopamine","serotonin"],    primaryChem:"oxytocin",   needs:["love","connection"],
    description:"Cook or order her favorite meal. Set the table properly — candles, music, no phones. Dress up a little. Make it a real date inside your own home.",
    howTo:"Pick her favorite meal or order from somewhere special. Set candles on the table, put on a playlist she loves, silence your phone. Sit across from her and actually talk — no TV.",
    scienceNote:"Physical atmosphere creation = dopamine anticipation. Shared meal = serotonin. Undivided attention = oxytocin. The effort you put in = deep serotonin significance." },
  { id:"d2",  emoji:"🌅", title:"Sunrise or Sunset Drive",             effort:"low",    duration:"45–60 min",chems:["serotonin","dopamine","oxytocin"],    primaryChem:"serotonin",  needs:["connection","variety"],
    description:"Pick her up, drive somewhere with a view, watch the sun rise or set together. No agenda. Just the two of you and the sky.",
    howTo:"Find a good spot 20–30 min away. Bring her coffee or a drink she loves. Just sit or stand together and watch. Let silence be comfortable. Talk or don't.",
    scienceNote:"Natural light = serotonin. Novelty of going somewhere new = dopamine. Side-by-side shared experience = one of the fastest oxytocin builders." },
  { id:"d3",  emoji:"🎭", title:"Try Something Neither of You Has Done",effort:"medium", duration:"2–3 hrs",  chems:["dopamine","endorphins","oxytocin"],   primaryChem:"dopamine",   needs:["variety","alive"],
    description:"Pottery class. Axe throwing. Cooking class. Escape room. Rock climbing. Anything completely new to both of you. The novelty itself is the date.",
    howTo:"Search your city for first-time experiences. Book it in advance. Don't tell her what it is — just tell her to be ready at a specific time. Shared nervousness = bonding.",
    scienceNote:"Completely new experiences = peak dopamine. Navigating novelty together = oxytocin. Shared laughter at being bad at something = endorphins." },
  { id:"d4",  emoji:"🛁", title:"Full Spa Night — You Run Everything",  effort:"medium", duration:"60–90 min",chems:["oxytocin","endorphins","serotonin"],   primaryChem:"oxytocin",   needs:["love","certainty"],
    description:"You set it all up. Run the bath with salts and candles. Give a massage. Have her favorite drink ready. She does absolutely nothing. You provide everything.",
    howTo:"Set it up before she knows. Dim the lights, run the bath, light candles. Knock and say 'it's ready.' Give a real 15-min massage after. No agenda. Pure service.",
    scienceNote:"Being fully cared for with no agenda = highest oxytocin spike. Warm water = endorphins. Your effort behind it = serotonin through feeling chosen and prioritized." },
  { id:"d5",  emoji:"⭐", title:"Stargazing Date",                      effort:"low",    duration:"60–90 min",chems:["oxytocin","serotonin","dopamine"],    primaryChem:"oxytocin",   needs:["connection","growth"],
    description:"Drive somewhere dark, lay out blankets, look at the stars. Talk about big things — dreams, fears, the future. Or say nothing. Just be under the same sky.",
    howTo:"Find a dark spot outside the city. Bring blankets, warm drinks, maybe snacks. Download a star map app. Lay back and just be together without distraction.",
    scienceNote:"Physical closeness under open sky = oxytocin. Big conversations about life = serotonin meaning. The scale of what you're looking at naturally opens people up emotionally." },
  { id:"d6",  emoji:"🎶", title:"Live Music Night",                    effort:"medium", duration:"3 hrs",    chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["variety","alive"],
    description:"Find live music — a band, a jazz bar, a concert, a busker-heavy street. Shared music = shared emotional experience = one of the deepest bonding tools available.",
    howTo:"Search for live music in your area this week. Book tickets or just show up. Find something in her genre. Dance with her. Make it a real night out.",
    scienceNote:"Live music triggers endorphins through shared rhythm and emotion. Dancing together = oxytocin synchrony. The novelty of a night out = dopamine." },
  { id:"d7",  emoji:"📸", title:"Couples Photo Walk",                  effort:"low",    duration:"60–90 min",chems:["dopamine","serotonin","oxytocin"],    primaryChem:"dopamine",   needs:["connection","alive"],
    description:"Walk somewhere beautiful — a neighborhood, a park, a market. Take photos of each other and together. Capture this moment of your life. Look at them together after.",
    howTo:"Pick a photogenic spot. Use both your phones. Take real portraits — not just selfies. Move around, try different light. Look at them together over dinner or drinks after.",
    scienceNote:"Creating something together = dopamine. Shared attention to beauty = serotonin. Seeing each other through a lens = oxytocin through intentional observation." },
  { id:"d8",  emoji:"🧺", title:"Picnic — Anywhere",                   effort:"medium", duration:"2 hrs",    chems:["serotonin","oxytocin","endorphins"],  primaryChem:"serotonin",  needs:["connection","variety"],
    description:"Pack a real picnic — her favorite foods, a blanket, something to drink. Go somewhere beautiful. No restaurant, no bill, no schedule. Just the two of you outside.",
    howTo:"Pack food she loves. Find a good spot — park, rooftop, beach, wherever. Lay out a proper blanket. No phones for the first 30 minutes. Just be there.",
    scienceNote:"Nature + sunlight = serotonin reset. Sharing food outdoors = oxytocin. No agenda = endorphin release through genuine relaxation. Simple and devastatingly effective." },
  { id:"d9",  emoji:"🍷", title:"Wine or Cocktail Tasting at Home",   effort:"low",    duration:"60–90 min",chems:["serotonin","dopamine","endorphins"],   primaryChem:"serotonin",  needs:["variety","connection"],
    description:"Pick 4–6 bottles or make 3–4 cocktail recipes neither of you has tried. Taste, compare, discuss. Make it a game. Score them. Laugh at the bad ones.",
    howTo:"Get a variety of wines or cocktail ingredients. Print simple tasting notes. Set up glasses properly. Score each one. Make it playful — no wine expertise required.",
    scienceNote:"Novelty in a familiar setting = dopamine. Shared humor and play = endorphins. The ritual of tasting together = serotonin calm. Laughter at bad ones = endorphin spike." },
  { id:"d10", emoji:"🎬", title:"Movie Marathon with Her Picks",       effort:"low",    duration:"3–4 hrs",  chems:["serotonin","oxytocin","endorphins"],  primaryChem:"serotonin",  needs:["certainty","connection"],
    description:"She picks every movie. No negotiations. You set up the perfect cozy environment — blankets, her favorite snacks, her drink. You're fully present. No phone.",
    howTo:"Let her choose before you start. Get the setup right — blankets, snacks, her favorite drink. Put the phone in another room. React out loud. Stay engaged.",
    scienceNote:"Being chosen for — she picks, you serve = serotonin significance. Shared laughter and emotion = endorphins. Physical closeness on the couch = oxytocin." },
  { id:"d11", emoji:"🎨", title:"Paint and Sip Night",                effort:"medium", duration:"2 hrs",    chems:["endorphins","serotonin","dopamine"],  primaryChem:"endorphins", needs:["variety","alive"],
    description:"Get basic paints and canvas. Find a tutorial on YouTube. Follow along together. The goal is NOT to be good — the goal is to laugh at your results and drink wine.",
    howTo:"Grab supplies from a craft store. Find a 45-min beginner tutorial. Set up at the kitchen table. Score each other's results. Frame them afterward.",
    scienceNote:"Creative play = endorphins through enjoyment. Laughing at imperfection = endorphin spike. Completing something together = dopamine. Displaying it = lasting serotonin." },
  { id:"d12", emoji:"🥾", title:"Hike to a View",                     effort:"medium", duration:"3–4 hrs",  chems:["endorphins","serotonin","dopamine"],  primaryChem:"endorphins", needs:["growth","alive"],
    description:"Find a trail with a payoff view. Hike there together. The physical effort creates shared endorphins, and reaching the top together creates dopamine through shared achievement.",
    howTo:"Find a trail with a clear summit or viewpoint. Pack snacks and water. Go early for better light. Take photos at the top. Talk on the way back.",
    scienceNote:"Physical exertion = endorphins in 20 min. Natural light and greenery = serotonin reset. Shared goal and arrival = dopamine. Talking while walking = oxytocin through side-by-side." },
  { id:"d13", emoji:"🛍️", title:"Surprise Shopping Day — Her Choices Only", effort:"medium", duration:"3 hrs",chems:["dopamine","serotonin","oxytocin"],primaryChem:"dopamine", needs:["significance","variety"],
    description:"Take her shopping with no agenda or budget conversation. She tries on and picks whatever catches her eye. You're just there to say she looks incredible and carry the bags.",
    howTo:"Pick a shopping area she loves. No rushing, no budget discussions out loud. Let her browse fully. When she tries things on, be genuine. Buy something she loves.",
    scienceNote:"Being chosen for and indulged = serotonin significance. Novelty of items = dopamine. Your attention entirely on her = oxytocin. Feeling celebrated = all four." },
  { id:"d14", emoji:"🏊", title:"Pool or Beach Day",                   effort:"low",    duration:"half day", chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["variety","alive"],
    description:"Go to water. Beach, pool, lake — whatever's accessible. Water + movement + sunshine = nature's endorphin cocktail. Physical closeness in water = oxytocin.",
    howTo:"Pack properly — towels, sunscreen, her favorite drinks and snacks. Get in the water with her. Don't just sit on your phone. Be present and playful.",
    scienceNote:"Water immersion releases endorphins. Sunlight = serotonin. Physical proximity in water = oxytocin. Playfulness and movement together = all four chemicals firing." },
  { id:"d15", emoji:"🌿", title:"Farmer's Market and Brunch",         effort:"low",    duration:"2–3 hrs",  chems:["serotonin","dopamine","oxytocin"],    primaryChem:"serotonin",  needs:["connection","variety"],
    description:"Walk through a farmer's market together. Buy fresh things. Cook brunch together after or eat out nearby. The exploration + shared meal = powerful low-effort date.",
    howTo:"Find your local farmer's market. Get there early for the best stuff. Walk every stall, try samples, buy things you're both curious about. Cook together or eat somewhere close.",
    scienceNote:"Exploration of novelty = dopamine. Shared decisions about food = serotonin teamwork. Cooking or eating together = oxytocin bonding through ritual." },
  { id:"d16", emoji:"🎳", title:"Bowling or Mini Golf Night",          effort:"low",    duration:"2 hrs",    chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["variety","alive"],
    description:"Friendly competition in a fun setting. The game gives you both something to play with while you're actually playing with each other. High laughter = high endorphins.",
    howTo:"Just show up. Make it competitive — loser buys dessert or picks the next date. Root for her, trash talk playfully, celebrate every good shot. Keep it fun.",
    scienceNote:"Competition = sustained dopamine reward loop. Shared laughter = endorphins. Physical proximity and playfulness = oxytocin. Stakes make it more fun." },
  { id:"d17", emoji:"🌃", title:"City Night Walk",                    effort:"low",    duration:"60–90 min",chems:["serotonin","oxytocin","dopamine"],    primaryChem:"serotonin",  needs:["connection","variety"],
    description:"Walk your city at night — lights, streets, neighborhoods. No destination required. Just move together, talk, explore. Side-by-side walking = underrated bonding.",
    howTo:"Pick an area neither of you spends much time in. Walk, stop for drinks or dessert, keep walking. Let the conversation go wherever. No rushing.",
    scienceNote:"Walking side-by-side reduces social defensiveness and increases openness = deeper conversation and oxytocin. Novelty of new streets = dopamine. Shared pace = serotonin." },
  { id:"d18", emoji:"🎤", title:"Karaoke Night Out",                  effort:"low",    duration:"2–3 hrs",  chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["alive","variety"],
    description:"Go out for karaoke. Sing together, sing separately, cheer each other on. The vulnerability of performing for each other = oxytocin. The laughter = endorphins.",
    howTo:"Find a karaoke bar or book a private room. Each pick songs in advance. Cheer her on like she's the best singer alive regardless of the reality. Do duets.",
    scienceNote:"Shared vulnerability = oxytocin. Performance and laughter = endorphins. Novelty = dopamine. Watching each other be silly = one of the fastest connection tools." },
  { id:"d19", emoji:"🍦", title:"Ice Cream and Drive-Around Night",   effort:"low",    duration:"60 min",   chems:["serotonin","dopamine","endorphins"],  primaryChem:"serotonin",  needs:["connection","certainty"],
    description:"Drive around with ice cream and no destination. Old neighborhoods, new ones, places you used to go. Talking or not talking. Just existing together in motion.",
    howTo:"Pick her up her favorite ice cream flavor without asking — you already know. Drive with no plan. Let her play DJ. Talk about whatever comes up.",
    scienceNote:"Sugar = serotonin + mild dopamine. Motion together = relaxation and openness. No agenda = serotonin through lack of pressure. Small acts of knowing her = oxytocin." },
  { id:"d20", emoji:"🧘", title:"Couples Yoga or Stretch Class",      effort:"low",    duration:"60 min",   chems:["serotonin","endorphins","oxytocin"],  primaryChem:"serotonin",  needs:["growth","connection"],
    description:"Take a class or use a YouTube video together. Assisted stretching = intentional touch = oxytocin. Doing it together = shared vulnerability = deeper connection.",
    howTo:"Find a beginner couples yoga video or class nearby. Go with zero ego — it's not about performance. Help each other into poses. Laugh when it's awkward.",
    scienceNote:"Light movement = endorphins. Assisted touch = oxytocin. Shared breath and pace = serotonin regulation. Shared humor when it's hard = endorphin bonus." },
  { id:"d21", emoji:"🎡", title:"Day Trip Somewhere New",             effort:"medium", duration:"full day",  chems:["dopamine","endorphins","oxytocin"],   primaryChem:"dopamine",   needs:["variety","alive"],
    description:"Pick a town, city, or destination 1–2 hours away. Go for the day with no fixed plan. New environments together = peak dopamine + sustained oxytocin bonding.",
    howTo:"Pick somewhere neither of you knows well. Drive with a playlist she loves. Explore on arrival — food, streets, shops. Come home tired and happy.",
    scienceNote:"Novel environment = sustained dopamine throughout the day. Shared exploration = oxytocin. Physical movement and new sights = endorphins and serotonin through awe." },
  { id:"d22", emoji:"🏡", title:"Backyard or Balcony Dinner Under Stars",effort:"medium",duration:"2 hrs",   chems:["serotonin","oxytocin","dopamine"],    primaryChem:"serotonin",  needs:["certainty","love"],
    description:"Set up dinner outside. String lights, candles, her favorite food. The outdoor element transforms an ordinary meal into something she'll remember.",
    howTo:"Set up outside before she knows. String lights if you have them, candles, a proper table. Have her drink ready when she comes out. Watch her face.",
    scienceNote:"Natural air + lights + effort = serotonin elevation. The surprise of finding it set up = dopamine. Being thought of and prepared for = oxytocin." },
  { id:"d23", emoji:"🎠", title:"Amusement Park or Theme Park",       effort:"high",   duration:"full day",  chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["alive","variety"],
    description:"Rides, games, food, laughter, adrenaline. Amusement parks are endorphin machines. The adrenaline of rides = physical bonding. Shared excitement = peak connection.",
    howTo:"Just go. Buy the tickets in advance. Let her pick first rides. Win her something. Eat the terrible food. Stay until she's tired.",
    scienceNote:"Adrenaline from rides = endorphins + dopamine. Shared excitement = oxytocin through emotional synchrony. The childlike joy = serotonin through nostalgia and play." },
  { id:"d24", emoji:"🍜", title:"New Restaurant Challenge",           effort:"low",    duration:"2 hrs",    chems:["dopamine","serotonin","oxytocin"],    primaryChem:"dopamine",   needs:["variety","connection"],
    description:"Every month, try a restaurant representing a cuisine neither of you has tried before. Ethiopian, Georgian, Peruvian — explore the world through food together.",
    howTo:"Research a cuisine you've never had. Find the best local spot. Order adventurously — no playing it safe. Try everything. Rate each dish together.",
    scienceNote:"Novel food = dopamine through surprise. Shared adventure with low stakes = oxytocin. Exploring together = serotonin through shared identity as a curious couple." },
  { id:"d25", emoji:"🎪", title:"Local Event or Festival",            effort:"low",    duration:"2–4 hrs",  chems:["dopamine","endorphins","serotonin"],  primaryChem:"dopamine",   needs:["variety","alive"],
    description:"Check local event listings — food festival, art fair, market, seasonal event. Showing up to something happening in your city = novelty + community = dopamine.",
    howTo:"Search for local events this weekend. Pick something neither of you would normally think to attend. Go with an open mind. Let it be whatever it is.",
    scienceNote:"Community events = serotonin through belonging. Novelty of the specific event = dopamine. Shared experience of something happening around you = oxytocin." },
  { id:"d26", emoji:"🏋️", title:"Active Date — Try Her Workout",     effort:"medium", duration:"60–90 min",chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["growth","alive"],
    description:"Ask her to show you her workout or join her class. Showing up in her world = oxytocin. Shared physical effort = endorphins. You being willing to try = serotonin significance.",
    howTo:"Ask in advance. Show up without complaining. Try your best. Let her lead. Celebrate her strength. Do it with humor when it's hard.",
    scienceNote:"Shared physical exertion = endorphins. Being in her world on her terms = oxytocin. The vulnerability of trying something she's good at = serotonin through respect." },
  { id:"d27", emoji:"🎲", title:"Game Bar or Barcade Night",          effort:"low",    duration:"2–3 hrs",  chems:["endorphins","dopamine","oxytocin"],   primaryChem:"endorphins", needs:["alive","variety"],
    description:"Bars with board games, ping pong, shuffleboard, arcade games. Competitive play with drinks = sustained endorphins and dopamine all night. High connection, low pressure.",
    howTo:"Find a game bar near you. Pick 3–4 games to compete on. Set stakes for the loser. Let the games create natural conversation and laughter.",
    scienceNote:"Competition = dopamine reward loop. Laughter = endorphins. Physical play = oxytocin through touch and proximity. Novelty of each game = sustained dopamine." },
  { id:"d28", emoji:"📖", title:"Bookstore Date",                     effort:"low",    duration:"2 hrs",    chems:["serotonin","dopamine","oxytocin"],    primaryChem:"serotonin",  needs:["growth","connection"],
    description:"Wander a bookstore together. Each pick a book for the other — something you think they'd love. Get coffee. Sit and flip through what you found. Simple and surprisingly intimate.",
    howTo:"Go with no list. Wander every section. Pick a book you'd genuinely give her. Exchange and explain why. Get coffee in the bookstore cafe if there is one.",
    scienceNote:"Intellectual curiosity shared = serotonin and oxytocin. The vulnerability of picking something personal = oxytocin. Exploring together slowly = serotonin calm." },
  { id:"d29", emoji:"🚤", title:"Boat Trip or Water Activity",        effort:"high",   duration:"half day",  chems:["endorphins","dopamine","serotonin"],  primaryChem:"endorphins", needs:["alive","variety"],
    description:"Rent a kayak, paddleboard, boat, or take a ferry. Water + movement + novelty = endorphin and dopamine combination. Getting on the water together = memorable.",
    howTo:"Research rentals near you. Book in advance. Pack snacks and sunscreen. Let her choose the pace. Stay present — no phone.",
    scienceNote:"Water + physical movement = endorphins. Novelty of being on water = dopamine. Side-by-side physical effort = oxytocin through shared experience." },
  { id:"d30", emoji:"🍕", title:"Make Pizza Together Night",          effort:"low",    duration:"90 min",   chems:["serotonin","endorphins","oxytocin"],  primaryChem:"serotonin",  needs:["connection","alive"],
    description:"Make pizza from scratch — dough, sauce, toppings. Compete on whose is better. Eat it together. Cooking something from nothing = teamwork = oxytocin.",
    howTo:"Buy dough or make it. Set up a toppings bar. Each build their own. Rate them. Have drinks while cooking. Make a mess and laugh about it.",
    scienceNote:"Creating food together = oxytocin through teamwork. Laughter at the mess = endorphins. The meal at the end = serotonin satisfaction through shared accomplishment." },
  { id:"d31", emoji:"🌄", title:"Camping Night — Even the Backyard",  effort:"medium", duration:"overnight", chems:["serotonin","oxytocin","endorphins"],  primaryChem:"serotonin",  needs:["connection","certainty"],
    description:"Camp out — park, campground, or even the backyard. Stars, fire, no screens, just the two of you. Simplicity and presence = the deepest version of connection.",
    howTo:"Get a tent and sleeping bags. Make a fire if possible. No phones after dark. Talk about everything. Look at stars. Fall asleep together under the sky.",
    scienceNote:"Removing modern distractions = serotonin regulation. Physical closeness in new environment = oxytocin. Fire watching = natural endorphin and serotonin state." },
  { id:"d32", emoji:"🎻", title:"Classical Music or Jazz Night",      effort:"low",    duration:"2 hrs",    chems:["serotonin","oxytocin","endorphins"],  primaryChem:"serotonin",  needs:["growth","connection"],
    description:"Find a live classical or jazz performance. Sit close. Let the music move you both. Shared emotional experience through live music = one of the deepest connection tools.",
    howTo:"Search for local orchestras, jazz clubs, or chamber concerts. Dress up slightly. Sit close. Let yourself react emotionally. Hold her hand.",
    scienceNote:"Live music = endorphins and serotonin. Shared emotional response = oxytocin synchrony. Dressing up = serotonin through self-presentation and being seen." },
  { id:"d33", emoji:"🧁", title:"Bake Something Together",            effort:"low",    duration:"60–90 min",chems:["serotonin","endorphins","oxytocin"],  primaryChem:"serotonin",  needs:["connection","alive"],
    description:"Bake something from scratch — cookies, cake, bread, whatever. The process is the point: side-by-side, flour everywhere, tasting along the way, laughing at results.",
    howTo:"Pick a recipe slightly challenging. Divide the tasks. Let her take the lead if she wants. Taste test constantly. Eat it warm together when done.",
    scienceNote:"Creating something together = oxytocin through teamwork. The warmth of baking = serotonin. Tasting = mild dopamine hits. Laughter at imperfection = endorphins." },
  { id:"d34", emoji:"🎯", title:"Arcade or Laser Tag",               effort:"low",    duration:"2 hrs",    chems:["dopamine","endorphins","oxytocin"],   primaryChem:"dopamine",   needs:["alive","variety"],
    description:"Be fully childlike for a few hours. Arcades, laser tag, mini bowling — whatever lets you play like you're 12. Shared play = one of the fastest oxytocin builders.",
    howTo:"Just go and be ridiculous. Compete at everything. Win her something from the claw machine. Let yourself be bad at games and laugh about it.",
    scienceNote:"Play = endorphins. Competition = dopamine. Shared silliness = oxytocin through vulnerability. Being childlike together = serotonin through joy." },
  { id:"d35", emoji:"🌺", title:"Garden or Arboretum Walk",           effort:"low",    duration:"90 min",   chems:["serotonin","oxytocin","dopamine"],    primaryChem:"serotonin",  needs:["connection","growth"],
    description:"Walk through a botanical garden or beautiful park together. Slow, intentional, no destination. Beauty + slow pace + physical closeness = deep serotonin and oxytocin.",
    howTo:"Find a botanical garden, Japanese garden, or beautiful park. Walk slowly. Take photos. Sit somewhere beautiful and just be together. No rushing.",
    scienceNote:"Nature and beauty = serotonin elevation. Slow walking pace = reduced cortisol. Side-by-side in natural settings = one of the most underrated oxytocin triggers." },
  { id:"d36", emoji:"🎰", title:"Casino Night (or Home Version)",     effort:"low",    duration:"2–3 hrs",  chems:["dopamine","endorphins","oxytocin"],   primaryChem:"dopamine",   needs:["variety","alive"],
    description:"Go to a casino for a couple of hours with a set budget, or set up cards and poker chips at home with a bottle of wine. Stakes + games + drinks = sustained dopamine.",
    howTo:"Set a budget ($50 together) and stick to it. Play together not separately. Celebrate every small win loudly. Cash out when you're ahead or at budget.",
    scienceNote:"Near-wins and small wins = sustained dopamine loop. Shared excitement = oxytocin. Laughter at losses = endorphins. The ritual of the game = serotonin." },
  { id:"d37", emoji:"✈️", title:"Overnight Trip — Anywhere",          effort:"high",   duration:"overnight", chems:["dopamine","oxytocin","endorphins"],   primaryChem:"dopamine",   needs:["variety","alive"],
    description:"Book one night somewhere neither of you has been. Doesn't need to be far or expensive. The novelty of waking up somewhere new together = peak dopamine and oxytocin.",
    howTo:"Book a hotel or Airbnb 1–3 hrs away. Don't make a massive itinerary. Wander when you get there. Eat well. Come back the next day recharged.",
    scienceNote:"New environment = sustained dopamine throughout. Waking up together somewhere new = oxytocin. Shared adventure = endorphins. Even 24 hrs away resets everything." },
  { id:"d38", emoji:"🎆", title:"Fireworks or Night Event",           effort:"low",    duration:"2–3 hrs",  chems:["dopamine","endorphins","oxytocin"],   primaryChem:"dopamine",   needs:["alive","connection"],
    description:"Any night event with spectacle — fireworks, light shows, festivals, outdoor cinema. Shared awe = one of the most powerful connection experiences available.",
    howTo:"Research seasonal night events. Bring a blanket and her favorite snacks. Stand or sit close. Let the spectacle fill you both. React out loud.",
    scienceNote:"Shared awe = oxytocin and serotonin simultaneously. The spectacle = dopamine. Physical closeness during it = oxytocin amplified. This experience bonds people fast." },
  { id:"d39", emoji:"🍣", title:"Omakase or Chef's Table Experience", effort:"high",   duration:"2–3 hrs",  chems:["dopamine","serotonin","oxytocin"],    primaryChem:"dopamine",   needs:["significance","variety"],
    description:"Book a high-end tasting menu or omakase experience. The courses, the presentation, the conversation it generates — it's a two-hour dopamine machine wrapped in luxury.",
    howTo:"Book in advance — often weeks ahead. Dress up. Tell her to clear her evening. Don't tell her where until you arrive. Order the full experience.",
    scienceNote:"Anticipation of each course = dopamine rhythm. Quality experience = serotonin significance. Being treated = oxytocin through feeling chosen and worth the investment." },
  { id:"d40", emoji:"🌊", title:"Sunrise Walk on the Beach or Lake",  effort:"low",    duration:"60–90 min",chems:["serotonin","oxytocin","endorphins"],  primaryChem:"serotonin",  needs:["connection","alive"],
    description:"Wake up early. Get to water before the sun rises. Watch it together. The intentionality of making this happen for her = oxytocin. The sunrise itself = serotonin.",
    howTo:"Set the alarm together the night before. Bring coffee in a flask. Get there slightly early. Stand or sit at the water's edge. Watch it happen. Say very little.",
    scienceNote:"Early morning cortisol + natural light = serotonin that lasts all day. The deliberate effort to share this = oxytocin. Shared silence at something beautiful = deep bonding." },
  // ── Batch 2 (d41-d100) ───────────────────────────────────────────────────────
  { id:"d41", emoji:"🎨", title:"Painting Class for Two", effort:"Low", duration:"2-3 hrs", cost:"$$$",
    description:"Book a local paint-and-sip or art studio. You don't need talent. The laughter at each other's attempts is the actual date.",
    chems:["endorphins","oxytocin"] },
  { id:"d42", emoji:"🧗", title:"Indoor Rock Climbing", effort:"Medium", duration:"2 hrs", cost:"$$",
    description:"Book an intro session at a climbing gym. Spotting each other, cheering each other on, and conquering something physical together is powerfully bonding.",
    chems:["endorphins","dopamine"] },
  { id:"d43", emoji:"🚲", title:"Sunrise Bike Ride", effort:"Medium", duration:"1-2 hrs", cost:"$",
    description:"Early alarm, bikes, coffee in a thermos. Watch the city wake up together. The shared effort and quiet makes it more intimate than it sounds.",
    chems:["endorphins","serotonin"] },
  { id:"d44", emoji:"🎭", title:"Improv or Comedy Show", effort:"Low", duration:"2 hrs", cost:"$$",
    description:"Book tickets to a live improv or stand-up show. Laughing together at the same moment is one of the most bonding experiences couples can have.",
    chems:["endorphins","oxytocin"] },
  { id:"d45", emoji:"🍜", title:"Eat at a Restaurant She's Mentioned Once", effort:"Low", duration:"2 hrs", cost:"$$",
    description:"She mentioned a place weeks ago. You remembered. You booked it. She doesn't know until you pull up. That memory of hers you held — that's the gift.",
    chems:["oxytocin","serotonin"] },
  { id:"d46", emoji:"🌊", title:"Kayaking or Paddle Boarding", effort:"Medium", duration:"2-3 hrs", cost:"$$",
    description:"Rent kayaks or boards at a local lake or coast. Physical challenge, fresh air, side by side. Take breaks to float and talk.",
    chems:["endorphins","serotonin"] },
  { id:"d47", emoji:"🏛️", title:"Museum After Hours Event", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Many museums host evening events with drinks and special access. Check your local listings. Wandering and discovering together is genuinely romantic.",
    chems:["dopamine","oxytocin"] },
  { id:"d48", emoji:"🎸", title:"Live Music at a Small Venue", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"A small bar or venue with live music. Not a stadium — intimate. Dancing optional but encouraged. The energy of live performance is contagious.",
    chems:["endorphins","dopamine"] },
  { id:"d49", emoji:"🧘", title:"Couples Yoga Class", effort:"Medium", duration:"1 hr", cost:"$$",
    description:"A yoga class specifically for couples builds trust, physical connection, and requires communication. More fun than it sounds, especially if neither of you are flexible.",
    chems:["oxytocin","serotonin"] },
  { id:"d50", emoji:"🏄", title:"Surf Lesson Together", effort:"High", duration:"2-3 hrs", cost:"$$$",
    description:"Book a beginner surf lesson. Falling down, helping each other up, celebrating tiny wins together. Shared struggle at the same level is incredibly bonding.",
    chems:["endorphins","oxytocin"] },
  { id:"d51", emoji:"🌺", title:"Botanical Garden Visit", effort:"Low", duration:"2 hrs", cost:"$",
    description:"Walk a botanical garden with no agenda. Slow down, notice things, take photos, find a bench and just sit. Beauty together restores something.",
    chems:["serotonin","oxytocin"] },
  { id:"d52", emoji:"🎪", title:"Local Festival or Street Fair", effort:"Low", duration:"3 hrs", cost:"$",
    description:"Wander a local festival with no plan. Try random food, watch street performers, buy something small and silly. Spontaneity within structure.",
    chems:["dopamine","endorphins"] },
  { id:"d53", emoji:"🚁", title:"Helicopter Tour", effort:"Low", duration:"30-60 min", cost:"$$$$",
    description:"If budget allows, a helicopter tour of your city or a scenic area is a memory that lasts years. The novelty and the view create a natural conversation.",
    chems:["dopamine","endorphins"] },
  { id:"d54", emoji:"🎳", title:"Bowling and Terrible Pizza", effort:"Low", duration:"2 hrs", cost:"$",
    description:"Old school bowling alley. Bad shoes. Score competitively. Eat the pizza without irony. The deliberately unserious date is sometimes the best one.",
    chems:["endorphins","oxytocin"] },
  { id:"d55", emoji:"🌋", title:"Hot Springs Day Trip", effort:"Medium", duration:"4-6 hrs", cost:"$$",
    description:"If you're near any natural hot springs, a day trip there is one of the most relaxing and intimate experiences you can share. Book ahead.",
    chems:["serotonin","oxytocin"] },
  { id:"d56", emoji:"📷", title:"Photography Date", effort:"Low", duration:"2-3 hrs", cost:"$",
    description:"Walk a neighbourhood with one goal: each of you takes 20 photos of what catches your eye. Look at them together after. It's a window into how she sees the world.",
    chems:["dopamine","oxytocin"] },
  { id:"d57", emoji:"🎠", title:"Amusement Park Day", effort:"Medium", duration:"6+ hrs", cost:"$$$",
    description:"A full amusement park day — rides, games, terrible food, and real laughter. Matching the energy of child-like fun together resets a relationship.",
    chems:["endorphins","dopamine"] },
  { id:"d58", emoji:"⛵", title:"Sunset Sailing", effort:"Low", duration:"2-3 hrs", cost:"$$$",
    description:"Book a sunset sailing charter or rent a small boat. There is something about open water at golden hour that creates conversation naturally.",
    chems:["serotonin","oxytocin"] },
  { id:"d59", emoji:"🎡", title:"State or County Fair", effort:"Low", duration:"3-4 hrs", cost:"$$",
    description:"Deep-fried everything, carnival games, animals, and rides. The deliberate silliness of it all is the point. Hold her hand on the Ferris wheel.",
    chems:["endorphins","dopamine"] },
  { id:"d60", emoji:"🏕️", title:"One Night Camping", effort:"High", duration:"Overnight", cost:"$$",
    description:"One night in a tent or cabin within driving distance. Disconnecting together — no signal, no scrolling — puts you fully present with each other.",
    chems:["serotonin","oxytocin"] },
  { id:"d61", emoji:"🌮", title:"Taco Crawl", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Plan a route hitting 3-4 different taco spots. Judge each one. Build a tier list. Walk between if possible. The shared mission plus good food is a great combo.",
    chems:["dopamine","endorphins"] },
  { id:"d62", emoji:"🎯", title:"Axe Throwing", effort:"Low", duration:"1-2 hrs", cost:"$$",
    description:"Book a lane at an axe throwing bar. Compete, cheer each other on, feel absurdly capable. The shared accomplishment and slight danger creates real energy.",
    chems:["endorphins","dopamine"] },
  { id:"d63", emoji:"🎭", title:"Escape Room", effort:"Low", duration:"1 hr", cost:"$$",
    description:"Work together under pressure with a shared goal. Escape rooms reveal how you communicate and problem-solve as a team. Book a hard one.",
    chems:["dopamine","oxytocin"] },
  { id:"d64", emoji:"🌅", title:"Coastal Drive with No Destination", effort:"Low", duration:"2-4 hrs", cost:"$",
    description:"Drive along a coast or scenic road with no fixed destination. Stop when something looks interesting. Windows down, music on, nowhere to be.",
    chems:["serotonin","dopamine"] },
  { id:"d65", emoji:"🎻", title:"Symphony or Orchestra Night", effort:"Low", duration:"2-3 hrs", cost:"$$$",
    description:"Dress up, go somewhere beautiful, listen to something extraordinary. The shared aesthetic experience and the dressing-up ritual both deepen connection.",
    chems:["serotonin","oxytocin"] },
  { id:"d66", emoji:"🍷", title:"Winery or Vineyard Visit", effort:"Low", duration:"3-4 hrs", cost:"$$$",
    description:"Book a winery tasting and tour. Beautiful setting, good wine, and the slow pace that makes real conversation happen.",
    chems:["serotonin","oxytocin"] },
  { id:"d67", emoji:"🎲", title:"Board Game Cafe Night", effort:"Low", duration:"2-3 hrs", cost:"$",
    description:"A cafe where you can play hundreds of board games over drinks. Competitive enough to be exciting, casual enough to be easy. Great for any phase.",
    chems:["endorphins","dopamine"] },
  { id:"d68", emoji:"🌃", title:"City Rooftop Bar at Sunset", effort:"Low", duration:"2 hrs", cost:"$$",
    description:"Find the best rooftop bar in your city. Arrive before sunset. Watch the city change colour. One drink each. No rush.",
    chems:["serotonin","dopamine"] },
  { id:"d69", emoji:"🎨", title:"Pottery Class", effort:"Medium", duration:"2-3 hrs", cost:"$$$",
    description:"A beginners pottery class is tactile, creative, and usually hilarious. Ghost reference optional. The physical focus and shared struggle builds closeness.",
    chems:["oxytocin","endorphins"] },
  { id:"d70", emoji:"🏇", title:"Horse Riding", effort:"Medium", duration:"2-3 hrs", cost:"$$$",
    description:"Book a trail ride for two. If neither of you ride, the shared beginner experience is half the fun. Being outside and slightly out of your comfort zone together is bonding.",
    chems:["endorphins","serotonin"] },
  { id:"d71", emoji:"🌙", title:"Midnight Dessert Run", effort:"Low", duration:"1-2 hrs", cost:"$",
    description:"Late at night, leave spontaneously to get dessert. The slight rule-breaking of it, the unexpected-ness, and the sugar all hit the same dopamine button.",
    chems:["dopamine","endorphins"] },
  { id:"d72", emoji:"🎾", title:"Tennis or Pickleball Lesson", effort:"Medium", duration:"1-2 hrs", cost:"$$",
    description:"Book a beginner lesson together. Learning a new skill side by side creates vulnerability and togetherness that familiar activities can't. Competitive but fun.",
    chems:["endorphins","oxytocin"] },
  { id:"d73", emoji:"🌿", title:"Foraging Walk", effort:"Medium", duration:"2-3 hrs", cost:"$",
    description:"Find a guided foraging walk in your area. Learning about plants, tasting things from the earth, and walking together in nature is quietly extraordinary.",
    chems:["serotonin","dopamine"] },
  { id:"d74", emoji:"🎬", title:"Film Festival Screening", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Check your city's film festival listings. Pick something neither of you would normally watch. Discuss it after over drinks. Intellectual bonding through shared experience.",
    chems:["dopamine","oxytocin"] },
  { id:"d75", emoji:"🧁", title:"Bakery Tour", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Visit 3-4 bakeries in your city. Get one thing at each. Rank them. Argue about the rankings. The mission gives you shared language for the whole day.",
    chems:["dopamine","endorphins"] },
  { id:"d76", emoji:"🚣", title:"Rowboat or Canoe Rental", effort:"Medium", duration:"1-2 hrs", cost:"$",
    description:"Rent a rowboat on a local lake or river. Peaceful, physical, side by side. The slowness of it forces conversation. Take turns rowing.",
    chems:["serotonin","oxytocin"] },
  { id:"d77", emoji:"🌊", title:"Beach Bonfire Night", effort:"Medium", duration:"3-4 hrs", cost:"$",
    description:"Build or find a bonfire on a beach at night. Fire, water, stars. Bring food to cook, something warm to drink, and no agenda.",
    chems:["serotonin","oxytocin"] },
  { id:"d78", emoji:"🏔️", title:"Mountain or Hill Summit", effort:"High", duration:"4-6 hrs", cost:"$",
    description:"Find a local summit that takes 2-3 hours to climb. The shared effort, the conversation on the way up, and the view at the top all matter. Pack a good lunch.",
    chems:["endorphins","serotonin"] },
  { id:"d79", emoji:"🎠", title:"Vintage Shopping Date", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Spend an afternoon in vintage and thrift shops. Find ridiculous things. Try them on. Let her style you. Buy each other one thing under $10.",
    chems:["dopamine","endorphins"] },
  { id:"d80", emoji:"🌺", title:"Flower Market Morning", effort:"Low", duration:"1-2 hrs", cost:"$",
    description:"Visit a local flower market early in the morning. Buy her flowers she picks herself. Walk, drink coffee, carry the blooms home. Simple and deeply effective.",
    chems:["serotonin","oxytocin"] },
  { id:"d81", emoji:"🎡", title:"Travelling Carnival", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"When a travelling fair or carnival comes to your area go immediately. Ferris wheel, games, bad food. The ephemeral nature of it creates urgency and fun.",
    chems:["endorphins","dopamine"] },
  { id:"d82", emoji:"🍣", title:"Omakase Sushi Experience", effort:"Low", duration:"2-3 hrs", cost:"$$$$",
    description:"Book an omakase — chef's choice sushi tasting. Sit at the bar. Watch the craft. The shared novelty of not knowing what comes next is its own conversation.",
    chems:["dopamine","oxytocin"] },
  { id:"d83", emoji:"🌲", title:"Forest Bathing", effort:"Low", duration:"2-3 hrs", cost:"$",
    description:"Slow walk through a forest with no destination and no phones. The Japanese practice of Shinrin-yoku. Walk slowly. Notice things. Talk about what you see.",
    chems:["serotonin","oxytocin"] },
  { id:"d84", emoji:"🛳️", title:"Ferry Ride to Nowhere Special", effort:"Low", duration:"2-4 hrs", cost:"$",
    description:"Take a ferry or water taxi to a destination you can walk back from or explore. The water crossing itself becomes the memory.",
    chems:["serotonin","dopamine"] },
  { id:"d85", emoji:"🎪", title:"Circus or Acrobatics Show", effort:"Low", duration:"2 hrs", cost:"$$",
    description:"Book tickets to a Cirque-style or acrobatics performance. Being genuinely awed by human capability together is unexpectedly connecting.",
    chems:["endorphins","dopamine"] },
  { id:"d86", emoji:"🧆", title:"Cook a Cuisine Neither of You Know", effort:"Medium", duration:"2-3 hrs", cost:"$$",
    description:"Pick a country. Go to an ethnic grocery store. Buy ingredients for a dish you've never made. Cook it together using a recipe. Eat whatever happens.",
    chems:["dopamine","endorphins"] },
  { id:"d87", emoji:"🌃", title:"Night Photography Walk", effort:"Low", duration:"2-3 hrs", cost:"$",
    description:"Take cameras or phones out at night and photograph your city in the dark. The shared focus and the empty streets creates a completely different world.",
    chems:["dopamine","serotonin"] },
  { id:"d88", emoji:"🎰", title:"Casino Night — Set a Limit", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Set a fixed limit — say $50 each. Play games together, not separately. Cheer together. Leave when it's gone. The stakes and the shared risk is the experience.",
    chems:["dopamine","endorphins"] },
  { id:"d89", emoji:"🌿", title:"Tea Ceremony or Tasting", effort:"Low", duration:"1-2 hrs", cost:"$",
    description:"Find a tea house that does a ceremony or tasting. The deliberate slowness and ceremony of it forces presence in a way few activities do.",
    chems:["serotonin","oxytocin"] },
  { id:"d90", emoji:"🎶", title:"Concert in the Park", effort:"Low", duration:"2-3 hrs", cost:"$",
    description:"Many cities have free outdoor concerts in summer. Blanket, snacks, music, and no pressure. The effortlessness of it is the point.",
    chems:["serotonin","endorphins"] },
  { id:"d91", emoji:"🛺", title:"Rickshaw or Pedicab Tour", effort:"Low", duration:"1 hr", cost:"$$",
    description:"Book a pedicab or rickshaw tour of an interesting neighbourhood. Slightly ridiculous, very local, and the mild silliness relaxes both of you.",
    chems:["endorphins","dopamine"] },
  { id:"d92", emoji:"🐠", title:"Aquarium After Dark", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Many aquariums do evening events with fewer crowds. The dim light, the tanks, and the quiet creates an unexpectedly romantic atmosphere.",
    chems:["serotonin","oxytocin"] },
  { id:"d93", emoji:"🎤", title:"Open Mic Night", effort:"Low", duration:"2 hrs", cost:"$",
    description:"Attend an open mic — not to perform, to watch. Cheer on strangers. Judge the bad ones silently. The shared whispered commentary becomes its own intimacy.",
    chems:["endorphins","oxytocin"] },
  { id:"d94", emoji:"🏊", title:"Private Pool or Hot Tub Rental", effort:"Low", duration:"2-3 hrs", cost:"$$",
    description:"Apps like Swimply let you rent private pools or hot tubs by the hour. No crowds, just you two. The privacy and the water create easy intimacy.",
    chems:["serotonin","oxytocin"] },
  { id:"d95", emoji:"🎠", title:"Go-Kart Racing", effort:"Low", duration:"1-2 hrs", cost:"$$",
    description:"Race each other. Be slightly competitive. Give each other a hard time about who won. The physical fun and the friendly competition is always good.",
    chems:["endorphins","dopamine"] },
  { id:"d96", emoji:"🌾", title:"Farm or Orchard Visit", effort:"Low", duration:"2-3 hrs", cost:"$",
    description:"Pick-your-own fruit, farm animals, fresh produce. Grounded, simple, unhurried. The physical connection to something real and natural is quietly restoring.",
    chems:["serotonin","endorphins"] },
  { id:"d97", emoji:"🏖️", title:"Sunrise Beach Run and Breakfast", effort:"High", duration:"2-3 hrs", cost:"$",
    description:"Early alarm, run on the beach together, watch the sun come up, find the best breakfast spot after. The shared effort plus the reward makes a full experience.",
    chems:["endorphins","serotonin"] },
  { id:"d98", emoji:"🎭", title:"Murder Mystery Dinner", effort:"Low", duration:"3-4 hrs", cost:"$$$",
    description:"Book a murder mystery dinner event. You get assigned characters, eat, and solve a mystery together. Surprisingly fun even when you don't normally go for this.",
    chems:["dopamine","endorphins"] },
  { id:"d99", emoji:"🛸", title:"Planetarium Night Show", effort:"Low", duration:"1-2 hrs", cost:"$",
    description:"A laser show or astronomy presentation at a local planetarium. Lying back in the dark looking up at the universe together has a specific intimacy.",
    chems:["serotonin","oxytocin"] },
  { id:"d100", emoji:"🌅", title:"Watch a Storm Roll In", effort:"Low", duration:"1-2 hrs", cost:"$",
    description:"When a storm is coming, find a covered spot with a view and watch it arrive. The drama of nature, the shared witness, and the warmth beside each other is memorable.",
    chems:["serotonin","oxytocin"] },

];

// Seen · Heard · Chosen · Safe · Alive mapping for texts (by id)
const TEXT_SHC = {
  1:["chosen","alive"],    2:["seen"],              3:["safe","chosen"],
  4:["chosen","alive"],    5:["heard","seen"],       6:["seen"],
  7:["heard"],             8:["safe","heard"],       9:["chosen"],
  10:["heard"],            11:["chosen","alive"],    12:["seen","chosen"],
  13:["seen"],             14:["heard"],             15:["safe","chosen"],
  16:["chosen"],           17:["chosen","seen"],     18:["heard","alive"],
  19:["seen"],             20:["seen","chosen"],     21:["seen","alive"],
  22:["heard","chosen"],   23:["heard","safe"],      24:["chosen"],
  25:["seen","alive"],     26:["safe","chosen"],     27:["chosen","safe"],
  28:["heard","chosen","alive"], 29:["seen"],        30:["chosen","heard"],
  31:["chosen","safe"],    32:["seen","heard"],      33:["heard","safe"],
  34:["seen","chosen"],    35:["seen"],              36:["chosen"],
  37:["chosen","alive"],   38:["chosen"],            39:["safe","chosen"],
  40:["heard"],            41:["seen","alive"],      42:["seen"],
  43:["chosen","alive"],   44:["chosen"],            45:["safe","chosen"],
  46:["safe"],             47:["seen","chosen"],     48:["heard"],
  49:["safe","chosen"],    50:["seen"],              51:["seen"],
  52:["chosen","alive"],   53:["heard"],             54:["safe","chosen"],
  55:["chosen","seen"],    56:["chosen","safe"],     57:["heard","safe"],
  58:["seen"],             59:["chosen"],            60:["safe","chosen"],
  61:["chosen"],           62:["safe","chosen"],     63:["safe"],
  64:["heard","chosen"],   65:["heard","alive"],     66:["seen"],
  67:["safe","chosen"],    68:["seen"],              69:["safe","chosen"],
  70:["chosen"],           71:["seen"],              72:["seen","alive"],
  73:["safe","chosen"],    74:["heard","seen"],      75:["alive","chosen"],
  76:["safe","chosen"],    77:["chosen"],            78:["heard"],
  79:["seen","chosen"],    80:["chosen"],            81:["chosen"],
  82:["heard","alive"],    83:["chosen"],            84:["heard","safe"],
  85:["chosen","heard"],   86:["seen"],              87:["seen"],
  88:["alive","heard"],    89:["chosen","seen"],     90:["chosen","alive"],
};

// Seen · Heard · Chosen · Safe · Alive mapping for tasks (by id)
const TASK_SHC = {
  1:["chosen"],            2:["seen"],              3:["chosen","alive"],
  4:["safe","chosen"],     5:["heard"],             6:["chosen"],
  7:["seen"],              8:["safe","chosen"],     9:["seen","chosen"],
  10:["chosen","alive"],   11:["chosen","alive"],   12:["seen"],
  13:["safe","chosen"],    14:["chosen"],           15:["heard","seen"],
  16:["seen"],             17:["heard"],            18:["chosen"],
  19:["safe","chosen"],    20:["heard","seen"],     21:["chosen","alive"],
  22:["heard"],            23:["seen"],             24:["seen","chosen"],
  25:["heard"],            26:["safe","chosen"],    27:["seen"],
  28:["seen","chosen","alive"], 29:["heard"],       30:["chosen","heard"],
  31:["seen","chosen"],    32:["chosen","alive"],   33:["chosen"],
  34:["heard"],            35:["seen"],             36:["chosen","alive"],
  37:["safe","chosen"],    38:["seen"],             39:["safe","chosen"],
  40:["chosen","alive"],
};
function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}`;
}
// ─── Seasonal Campaigns ───────────────────────────────────────────────────────
const SEASONAL_CAMPAIGNS = {
  valentines:{id:"valentines",emoji:"❤️",color:"#e91e8c",title:"Valentine's Day is Coming",
    urgencyFn:(d)=>d<=3?"🚨 3 days":d<=7?"⚠️ One week":d<=14?"📅 Two weeks":"💕 Plan ahead",
    stages:[
      {daysLeft:30,headline:"30 days out — don't wait until Feb 13",body:"Most men leave it to the last minute. You're 30 days out. That's an advantage.",actions:["Book the restaurant now — good ones fill up 3-4 weeks out","Look at her profile favorites — what does she actually love?","Text her today with something unrelated to Valentine's Day"]},
      {daysLeft:7,headline:"One week — personalize everything",body:"The difference between good and great is the details.",actions:["Get her actual favourite flower — not just roses if that's not her thing","Plan what you'll say — don't wing the words","Book a babysitter now if you need one"]},
      {daysLeft:1,headline:"Tomorrow is Valentine's Day",body:"You've prepared. Now just show up fully present.",actions:["Write her a handwritten note — even 3 lines land harder than any gift","No phone tonight","Make her feel like the most chosen woman alive"]},
    ]},
  christmas:{id:"christmas",emoji:"🎄",color:"#27ae60",title:"Holiday Survival Guide",
    urgencyFn:(d)=>d<=3?"🚨 Final days":d<=7?"⚠️ This week":d<=14?"🎄 Two weeks":"🎄 Getting close",
    stages:[
      {daysLeft:30,headline:"December is the relationship stress test",body:"She's managing the entire holiday operation. Be her safe harbour.",actions:["Ask her what she wants Christmas to actually look like this year","Take ownership of one full thing — gifts, food, or travel","Give her one evening this week with zero responsibilities"]},
      {daysLeft:7,headline:"Christmas week — protect her energy",body:"Your job is to be a calming, leading presence.",actions:["Make Christmas morning feel special","Her family time matters — don't make her feel guilty","One moment alone with her each day — just the two of you"]},
      {daysLeft:1,headline:"Tomorrow is Christmas",body:"Forget everything except one thing: make her feel celebrated.",actions:["Tell her what Christmas with her means to you","End the night with just the two of you","That moment is the one she'll remember"]},
    ]},
  newyear:{id:"newyear",emoji:"🥂",color:"#f1c40f",title:"New Year — Relationship Reset",
    urgencyFn:(d)=>d<=1?"🥂 Tonight!":d<=3?"✨ This week":"✨ Coming soon",
    stages:[
      {daysLeft:14,headline:"New Year is a relationship reset opportunity",body:"Make relationship resolutions — with her, in front of her.",actions:["Ask: 'What did you love most about us this year?'","Ask: 'What do you want more of from me next year?'","Tell her one thing you're committing to as her partner"]},
      {daysLeft:0,headline:"Tonight — start the year right",body:"The first conversation of the new year sets the tone.",actions:["Tell her one thing you love about the year you had together","Make a toast to her specifically","Be fully present at midnight"]},
    ]},
  mothersday:{id:"mothersday",emoji:"🌸",color:"#9b59b6",title:"Mother's Day — Make Her Feel It",
    urgencyFn:(d)=>d<=1?"🌸 Tomorrow!":d<=3?"⚠️ This weekend":d<=7?"📅 One week":"🌸 Plan ahead",
    stages:[
      {daysLeft:21,headline:"Don't let Mother's Day be 'from the kids'",body:"She's your partner. She deserves to hear it from YOU.",actions:["Plan something that shows you see her as a woman, not just a mother","Think about what she actually wants — rest, celebration, or quality time?","Write her a note about what watching her has done to you"]},
      {daysLeft:1,headline:"Mother's Day is tomorrow",body:"Remind her she's also a woman you're deeply attracted to and proud of.",actions:["Start the day with intention — not logistics","Tell her what she means to you as her partner","Ask her at the end: did she feel celebrated?"]},
    ]},
  halloween:{id:"halloween",emoji:"🎃",color:"#e67e22",title:"Halloween — Make It Fun For Her",
    urgencyFn:(d)=>d<=1?"🎃 Tonight!":d<=3?"🎃 This weekend":d<=7?"📅 One week":"🎃 Plan ahead",
    stages:[
      {daysLeft:21,headline:"Halloween is in 3 weeks — she's already thinking about it",body:"Women plan Halloween. If she's into it, she's been thinking about costumes for weeks. Get involved before she does everything herself.",actions:["Ask her what she wants to do — party, trick-or-treat, stay home?","Suggest a couples costume if she'd love that","Plan the evening around what makes her light up, not what's easiest"]},
      {daysLeft:7,headline:"One week to Halloween",body:"If you're doing something, it needs to be locked in now.",actions:["Costumes sorted? Order anything that needs to arrive","Make a plan for the evening — don't leave it to chance","Get the things she loves: her favourite candy, decorations, whatever excites her"]},
      {daysLeft:1,headline:"Halloween is tomorrow",body:"Make it fun. Be present. Let her enjoy it fully.",actions:["Match her energy — if she's excited, be excited","Take photos together","Make it a memory, not just a date on the calendar"]},
    ]},
};

function getActiveCampaign(anniversaryDate) {
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

function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 864e5 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}
function getCurrentMonth() { return new Date().getMonth(); }
function getSeasonalTheme() { return SEASONAL_THEMES[getCurrentMonth()]; }

// ─── Home Activities Library ──────────────────────────────────────────────────
// Every activity targets specific brain chemicals with explained mechanisms
const HOME_ACTIVITIES = [
  // ── DOPAMINE DOMINANT ─────────────────────────────────────────────────────
  {
    id:"h1", emoji:"🎲", title:"Couples Game Night with Stakes",
    primaryChem:"dopamine", chems:["dopamine","endorphins"],
    effort:"low", duration:"60–90 min",
    category:"play",
    description:"Pick a board game, card game, or trivia. Add a fun wager — winner picks the next date, gets a massage, or chooses the movie. The friendly competition + stakes = dopamine on repeat.",
    howTo:"Clear the table, pour drinks, set a prize. Play 3 rounds. Keep score. Make it a little dramatic.",
    scienceNote:"Dopamine fires on every near-win and every point scored. Competition creates a sustained reward loop that keeps both of you locked in and energized. Laughter = endorphins.",
    needs:["variety","connection"],
    reminderTitle:"Set up a game night tonight",
    reminderBody:"Pick a board game or trivia, add a fun wager, pour drinks. The competition fires dopamine all night.",
  },
  {
    id:"h2", emoji:"🍳", title:"Blind Recipe Challenge",
    primaryChem:"dopamine", chems:["dopamine","endorphins","oxytocin"],
    effort:"medium", duration:"45–60 min",
    category:"food",
    description:"Each of you picks a mystery ingredient from the fridge. You both have to cook something using it. Judge each other's dish. The novelty, challenge, and reveal = pure dopamine.",
    howTo:"Set a 30-min timer. Each person works with their surprise ingredient. Plate it properly. Judge with scoring: taste, creativity, presentation.",
    scienceNote:"Novel challenges activate the prefrontal cortex and trigger dopamine in the anticipation phase. Cooking together = physical co-operation = oxytocin. Shared laughter at results = endorphins.",
    needs:["variety","growth","connection"],
    reminderTitle:"Do the blind recipe challenge tonight",
    reminderBody:"Each grab a surprise ingredient from the fridge and cook something. Judge each other. Pure dopamine.",
  },
  {
    id:"h3", emoji:"🎬", title:"Movie Roulette — Blind Pick",
    primaryChem:"dopamine", chems:["dopamine","endorphins","serotonin"],
    effort:"low", duration:"2–3 hrs",
    category:"cozy",
    description:"Each of you secretly picks a movie the other hasn't seen. Alternate whose pick gets watched. No vetoing. The unknown = dopamine. Sharing your world = connection.",
    howTo:"Write picks on paper, fold them, draw randomly. Set up the couch properly — blankets, snacks, drinks. No phones.",
    scienceNote:"The mystery of not knowing what you'll watch triggers dopamine through anticipation. Shared emotional reactions to the film release oxytocin and endorphins. Comfort setup = serotonin.",
    needs:["variety","connection","certainty"],
    reminderTitle:"Movie roulette tonight — blind pick",
    reminderBody:"Each secretly pick a film the other hasn't seen. Draw randomly. No vetoing. Dopamine through mystery.",
  },
  {
    id:"h4", emoji:"🧩", title:"Big Puzzle + Good Music",
    primaryChem:"dopamine", chems:["dopamine","serotonin","oxytocin"],
    effort:"low", duration:"60–120 min",
    category:"cozy",
    description:"Pull out a 500–1000 piece puzzle. Put on a playlist you both love. Work on it together with no agenda. Small wins as pieces click = dopamine micro-hits on repeat.",
    howTo:"Set up on the dining table. Separate edge pieces. Put on a feel-good playlist. Have drinks nearby. Work side by side.",
    scienceNote:"Each solved section = small dopamine reward hit. The repetitive, satisfying nature = serotonin calm. Working toward a shared goal = oxytocin bonding. Side-by-side presence = deep connection.",
    needs:["certainty","connection","growth"],
    reminderTitle:"Break out a puzzle tonight",
    reminderBody:"Big puzzle, good music, drinks. Side-by-side working = dopamine micro-hits + deep serotonin calm.",
  },
  // ── OXYTOCIN DOMINANT ─────────────────────────────────────────────────────
  {
    id:"h5", emoji:"💆", title:"Full Spa Night — You Do Everything",
    primaryChem:"oxytocin", chems:["oxytocin","endorphins","serotonin"],
    effort:"medium", duration:"60–90 min",
    category:"romance",
    description:"You set up the full spa experience. Draw a bath, light candles, give a 15-min back massage, have her favorite drink ready. She does nothing. This is one of the highest-oxytocin evenings possible.",
    howTo:"Prep everything before she knows. Dim lights. Run the bath. Set up massage oils. Queue relaxing music. Lead her in, hand her a drink, and just take care of her.",
    scienceNote:"Physical touch = oxytocin surge in both partners. Warm water = endorphin release. Being fully cared for with no agenda = serotonin through safety. Your effort = deep oxytocin trust.",
    needs:["love","certainty","contribution"],
    reminderTitle:"Set up a full spa night for her",
    reminderBody:"Bath, candles, massage, her favorite drink — you do everything. Highest oxytocin evening possible.",
  },
  {
    id:"h6", emoji:"💃", title:"Kitchen Dancing — No Reason",
    primaryChem:"oxytocin", chems:["oxytocin","endorphins","dopamine"],
    effort:"low", duration:"15–30 min",
    category:"romance",
    description:"Put on songs you both love and just dance in the kitchen or living room. Slow songs, upbeat songs, whatever. Physical synchrony is the fastest oxytocin trigger known.",
    howTo:"Queue a playlist of 8–10 songs spanning slow and fast. Grab her hand, say 'dance with me.' No choreography needed.",
    scienceNote:"Moving in physical synchrony (mirroring each other's rhythm) is scientifically the single fastest oxytocin release mechanism. Music adds dopamine. Shared joy = endorphins. Simple and devastatingly effective.",
    needs:["love","connection","variety"],
    reminderTitle:"Dance with her in the kitchen tonight",
    reminderBody:"Slow + upbeat songs, grab her hand, no reason needed. Physical synchrony = fastest oxytocin trigger known.",
  },
  {
    id:"h7", emoji:"🛋️", title:"The 36 Questions",
    primaryChem:"oxytocin", chems:["oxytocin","serotonin"],
    effort:"low", duration:"60–90 min",
    category:"deep",
    description:"The famous Arthur Aron study — 36 questions designed to progressively deepen intimacy between two people. Even couples who know each other deeply rediscover each other.",
    howTo:"Google 'Arthur Aron 36 questions.' Get comfortable — couch, low light, no phones. Take turns. Answer honestly. Go slow. Don't rush the silence.",
    scienceNote:"The questions are designed to create mutual vulnerability in escalating doses. Vulnerability = oxytocin. Being truly known = deep serotonin. Studies show this reliably increases closeness in under 90 minutes.",
    needs:["connection","growth","significance"],
    reminderTitle:"Do the 36 Questions tonight",
    reminderBody:"Google 'Arthur Aron 36 questions.' Low light, no phones, take turns. Scientifically proven to deepen intimacy.",
  },
  {
    id:"h8", emoji:"📸", title:"Memory Lane Photo Night",
    primaryChem:"oxytocin", chems:["oxytocin","serotonin","endorphins"],
    effort:"low", duration:"45–60 min",
    category:"deep",
    description:"Go through old photos together — phones, social media, printed albums if you have them. Reminisce. Tell the stories. Laugh at the old ones. This is nostalgia + connection in one.",
    howTo:"Pull up each other's phones or a shared album. Sit close. Go chronologically or randomly. Talk about what you remember from each moment.",
    scienceNote:"Shared nostalgia activates oxytocin through reliving bonding memories. Laughter at old photos = endorphins. The feeling of being 'our story' = powerful serotonin identity and security.",
    needs:["connection","love","certainty"],
    reminderTitle:"Go through old photos together tonight",
    reminderBody:"Pull up old photos, sit close, relive memories. Shared nostalgia = oxytocin + serotonin. No phones for anything else.",
  },
  {
    id:"h9", emoji:"✍️", title:"Write Letters to Each Other",
    primaryChem:"oxytocin", chems:["oxytocin","serotonin","dopamine"],
    effort:"medium", duration:"30–45 min",
    category:"deep",
    description:"Sit in the same room. Each of you writes the other a handwritten letter — what you love about them, a favorite memory, what you're grateful for. Then exchange and read silently.",
    howTo:"Set a 20-min writing timer. No talking during writing. Exchange letters. Read privately. Then talk about what you felt reading it.",
    scienceNote:"Handwriting activates deeper emotional processing than typing. Written love = sustained serotonin. The anticipation of their letter = dopamine. Reading it together = oxytocin intimacy. Often surprisingly emotional.",
    needs:["significance","love","growth"],
    reminderTitle:"Write each other letters tonight",
    reminderBody:"Same room, handwritten, 20 min each. Exchange and read. Often surprisingly emotional — oxytocin runs deep.",
  },
  // ── SEROTONIN DOMINANT ────────────────────────────────────────────────────
  {
    id:"h10", emoji:"🍽️", title:"Cook a Real Meal Together",
    primaryChem:"serotonin", chems:["serotonin","oxytocin","dopamine","endorphins"],
    effort:"medium", duration:"60–90 min",
    category:"food",
    description:"Find a recipe neither of you has made. Shop for it together or use what you have. Cook it from scratch side by side. The teamwork, the smell, the shared meal = every brain chemical firing.",
    howTo:"Pick something with multiple steps so you can divide the work. Put on music. Pour wine or drinks while cooking. Set the table properly — like it's a date.",
    scienceNote:"Cooking from scratch together = teamwork = oxytocin. The smell of food = serotonin elevation. Novelty of the recipe = dopamine. Shared laughter when things go wrong = endorphins. Eating together = all four sustained.",
    needs:["connection","growth","contribution"],
    reminderTitle:"Cook a real meal together tonight",
    reminderBody:"New recipe, from scratch, side by side. Music, drinks, set the table like a date. Every brain chemical fires.",
  },
  {
    id:"h11", emoji:"🧘", title:"Stretch or Yoga Together",
    primaryChem:"serotonin", chems:["serotonin","endorphins","oxytocin"],
    effort:"low", duration:"20–30 min",
    category:"wellness",
    description:"Find a beginner couples yoga or stretching video and do it together. Movement = endorphins. Helping each other into poses = touch = oxytocin. Calm focus = serotonin reset.",
    howTo:"Clear floor space. Find a 20-min YouTube couples yoga video. Go slow. Laugh when it's awkward. Help each other with poses.",
    scienceNote:"Light movement = endorphin release even without cardio. Assisted stretching = intentional touch = oxytocin. The calm focus required = serotonin regulation. Shared accomplishment of finishing = dopamine.",
    needs:["growth","connection","love"],
    reminderTitle:"Do couples yoga or stretching together",
    reminderBody:"Find a 20-min YouTube couples yoga. Move together, help each other. Endorphins + oxytocin from the touch.",
  },
  {
    id:"h12", emoji:"📚", title:"Read to Each Other",
    primaryChem:"serotonin", chems:["serotonin","oxytocin"],
    effort:"low", duration:"30–60 min",
    category:"cozy",
    description:"Take turns reading a book, a short story, or even interesting articles out loud to each other. The voice, the closeness, the shared imagination = calm serotonin + oxytocin.",
    howTo:"Pick something you're both curious about — fiction, a short story collection, a book on a shared interest. Read in sections, take turns. Stay close physically.",
    scienceNote:"Being read to activates the same neural pathways as being told a story by a trusted person = oxytocin. Shared imaginative experience = serotonin calm and connection. Voice = one of the strongest intimacy cues.",
    needs:["growth","connection","certainty"],
    reminderTitle:"Read to each other tonight",
    reminderBody:"Take turns reading aloud — fiction, short stories, anything. Voice + closeness = oxytocin + serotonin calm.",
  },
  {
    id:"h13", emoji:"🌙", title:"Nighttime Gratitude Ritual",
    primaryChem:"serotonin", chems:["serotonin","oxytocin"],
    effort:"low", duration:"10–15 min",
    category:"wellness",
    description:"Before bed, each of you shares three things: one thing grateful for in general, one thing grateful for about the other person specifically, and one thing you're looking forward to tomorrow.",
    howTo:"Make it the last thing before lights out. Keep phones away. Take turns. Be specific — generic answers don't hit the same.",
    scienceNote:"Expressing gratitude = serotonin release in both speaker and recipient. Receiving specific appreciation = oxytocin. Future-looking ('looking forward to') = mild dopamine anticipation. One of the most powerful nightly rituals in relationship science.",
    needs:["significance","certainty","connection"],
    reminderTitle:"Do the gratitude ritual before bed",
    reminderBody:"3 each: something grateful for, something grateful about them specifically, one thing tomorrow. Serotonin + oxytocin every night.",
  },
  {
    id:"h14", emoji:"🌿", title:"Create Something Together",
    primaryChem:"serotonin", chems:["serotonin","dopamine","endorphins"],
    effort:"medium", duration:"60–90 min",
    category:"creative",
    description:"Make something physical together — a candle, painted something, a potted plant arrangement, a photo album, a vision board, a DIY project. Making things = deep satisfaction.",
    howTo:"Pick one simple project. Get the materials. Work on it together. Display it somewhere in your home when done so it becomes a shared symbol.",
    scienceNote:"Creating something tangible = serotonin through completion and mastery. The process of making = dopamine micro-rewards. Shared creative expression = endorphins from engagement. Having it in the home = lasting serotonin reminder.",
    needs:["growth","contribution","connection"],
    reminderTitle:"Make something together tonight",
    reminderBody:"Candle, painting, plant, vision board — make one physical thing together. Completion = serotonin. Display it after.",
  },
  // ── ENDORPHIN DOMINANT ────────────────────────────────────────────────────
  {
    id:"h15", emoji:"😂", title:"Comedy Night — Stand-Up Marathon",
    primaryChem:"endorphins", chems:["endorphins","dopamine","oxytocin"],
    effort:"low", duration:"60–90 min",
    category:"play",
    description:"Queue up 2–3 of your favorite stand-up specials or funny movies. Laugh as hard as possible. Sustained laughter is one of the highest endorphin-release activities two people can do together.",
    howTo:"Each pick one special. Make a comfort setup — couch, blankets, snacks. React out loud. Share what's funniest. Don't scroll your phone.",
    scienceNote:"10+ seconds of genuine laughter = endorphin release equal to light exercise. Shared laughter = oxytocin bonding. Novel comedy = dopamine. One of the simplest and most underrated tools in relationships.",
    needs:["variety","connection","love"],
    reminderTitle:"Comedy night — stand-up specials",
    reminderBody:"2–3 specials, comfort setup, no phones. 10 sec of real laughter = endorphins equal to light exercise.",
  },
  {
    id:"h16", emoji:"🕺", title:"Living Room Dance Party",
    primaryChem:"endorphins", chems:["endorphins","oxytocin","dopamine"],
    effort:"low", duration:"20–40 min",
    category:"play",
    description:"Crank up a playlist of songs from different eras — some throwbacks, some current. Dance badly, dance well, dance silly. The physical movement + shared joy is one of the most powerful chemical combinations.",
    howTo:"Clear the living room. Make a playlist of 15 songs spanning multiple decades and genres. No phones. Try to get each other to laugh.",
    scienceNote:"Physical movement = endorphins in 8–10 minutes. Moving together = oxytocin through synchrony. Novelty of each new song = micro-dopamine. The silliness and joy = endorphins stacked on endorphins.",
    needs:["variety","love","connection"],
    reminderTitle:"Living room dance party tonight",
    reminderBody:"Clear space, 15-song playlist across decades, no phones. Physical movement = endorphins. Together = oxytocin.",
  },
  {
    id:"h17", emoji:"🎤", title:"Home Karaoke Night",
    primaryChem:"endorphins", chems:["endorphins","dopamine","oxytocin"],
    effort:"low", duration:"60 min",
    category:"play",
    description:"Pull up a karaoke YouTube channel or app. Take turns performing songs dramatically. The worse the singing, the better the endorphin release from laughter.",
    howTo:"Search 'karaoke YouTube' or use an app. Each pick 3–5 songs. Score each other on drama and commitment, not pitch.",
    scienceNote:"Performance + laughter = sustained endorphin release. Watching your partner be vulnerable and silly = oxytocin. The game structure = dopamine through anticipation of each new song choice.",
    needs:["variety","connection","love"],
    reminderTitle:"Home karaoke night",
    reminderBody:"YouTube karaoke, take turns, score on drama not pitch. Laughter = endorphins. Shared silliness = deep oxytocin.",
  },
  {
    id:"h18", emoji:"🎨", title:"Paint Together — Bob Ross Style",
    primaryChem:"endorphins", chems:["endorphins","serotonin","dopamine"],
    effort:"medium", duration:"60–90 min",
    category:"creative",
    description:"Get basic acrylic paints and canvas. Find a 'paint night' tutorial on YouTube. Follow along together. The laughter at your results + the shared focus = endorphins + serotonin.",
    howTo:"Grab supplies from a craft store or order online. Find a beginner tutorial. Don't aim for perfect — aim for funny. Frame the results.",
    scienceNote:"Creative focus = serotonin flow state. The absurdity of comparing your painting to the tutorial = endorphins through laughter. Completing something = dopamine. Displaying it together = sustained serotonin.",
    needs:["variety","growth","connection"],
    reminderTitle:"Paint night at home",
    reminderBody:"Acrylics, canvas, YouTube tutorial. Don't try to be good — try to be funny. Laughter + creation = best combo.",
  },
  // ── ALL-FOUR ACTIVITIES ────────────────────────────────────────────────────
  {
    id:"h19", emoji:"🌅", title:"Morning Ritual Together — No Phones",
    primaryChem:"serotonin", chems:["serotonin","oxytocin","dopamine","endorphins"],
    effort:"low", duration:"30–45 min",
    category:"wellness",
    description:"Wake up 30 minutes earlier than normal. Make coffee or tea together, sit outside or by a window, no phones. Just the two of you in quiet connection at the start of the day.",
    howTo:"Set the alarm 30 min earlier. One person makes the drinks. Find a comfortable spot. No agenda — just be present. Let the conversation happen naturally.",
    scienceNote:"Morning cortisol + shared quiet = serotonin regulation for the whole day. Physical closeness = oxytocin. The novelty of changed routine = dopamine. Laughter in morning = endorphins all day. The most underrated daily ritual.",
    needs:["certainty","connection","love"],
    reminderTitle:"Morning ritual — no phones, just you two",
    reminderBody:"30 min early, make drinks together, sit in quiet connection. Sets serotonin for the whole day.",
  },
  {
    id:"h20", emoji:"🌟", title:"Future Planning Night",
    primaryChem:"dopamine", chems:["dopamine","serotonin","oxytocin"],
    effort:"low", duration:"45–60 min",
    category:"deep",
    description:"Sit together and dream out loud. Talk about what you want your life to look like in 1, 3, and 5 years. Travel, career, home, family, adventures. Build a shared vision together.",
    howTo:"Get a notebook. Write a header for each timeframe. Each share your dreams, no filtering. Look for overlap. Circle the ones you both want and commit to one immediately.",
    scienceNote:"Planning a desired future = sustained dopamine from anticipation. Shared vision = serotonin security. Building a life together actively = deep oxytocin. Committing to something concrete = dopamine lock-in.",
    needs:["growth","certainty","connection","significance"],
    reminderTitle:"Future planning night",
    reminderBody:"1, 3, and 5 year visions out loud together. Shared dreams = dopamine + serotonin. Commit to one thing tonight.",
  },
  // ── Batch 2 (h21-h60) ────────────────────────────────────────────────────────
  { id:"h21", emoji:"🧖", title:"At-Home Spa Night", phase:"menstrual", primaryChem:"oxytocin",
    howTo:"Run a bath with salts or bubbles. Dim lights, candles, put on her favourite playlist. Bring her a drink. Sit near her or give her space — ask which she wants.",
    whatToSay:"I set something up for you. You don't have to do anything. Just go." },
  { id:"h22", emoji:"📸", title:"Go Through Old Photos Together", phase:"follicular", primaryChem:"oxytocin",
    howTo:"Pull up photos from early in your relationship or a great trip. No phones for anything else. Just you two scrolling and remembering out loud.",
    whatToSay:"I want to show you something. Come sit with me for a bit." },
  { id:"h23", emoji:"🎨", title:"Create Something Together", phase:"follicular", primaryChem:"endorphins",
    howTo:"Paint, draw, build something, or do a puzzle. The activity doesn't matter — the creating together does. Laugh at the results.",
    whatToSay:"Let's make something tonight. I don't care what. Just something." },
  { id:"h24", emoji:"💃", title:"Kitchen Dance Party", phase:"ovulation", primaryChem:"endorphins",
    howTo:"Put on her favourite upbeat playlist while making dinner. Start dancing. Be ridiculous. Pull her in. It will feel stupid for exactly 4 seconds then feel great.",
    whatToSay:"Don't look at me like that. Dance with me." },
  { id:"h25", emoji:"📖", title:"Read to Each Other", phase:"luteal", primaryChem:"oxytocin",
    howTo:"Find a book or article she's interested in or that you both enjoy. Take turns reading out loud. Even 20 minutes creates surprising intimacy.",
    whatToSay:"I want to read something with you tonight. I'll start." },
  { id:"h26", emoji:"🌙", title:"Night Walk Without Phones", phase:"ovulation", primaryChem:"oxytocin",
    howTo:"After dinner, leave phones at home. Walk your neighbourhood for 20-30 minutes with no destination. Just talk or enjoy the quiet together.",
    whatToSay:"Walk with me. No phones. Just 20 minutes." },
  { id:"h27", emoji:"🎭", title:"Act Out Favourite Movie Scenes", phase:"follicular", primaryChem:"endorphins",
    howTo:"Pick a movie you both love and dramatically act out your favourite scene. Go completely over the top. The sillier the better.",
    whatToSay:"Okay I need you to be very serious about this very stupid thing I want to do." },
  { id:"h28", emoji:"🛋️", title:"Blanket Fort Movie Night", phase:"luteal", primaryChem:"oxytocin",
    howTo:"Build a fort with blankets and pillows before she gets home or gets comfortable. Snacks inside, her movie choice, phones out. No agenda.",
    whatToSay:"I built something. You're going to think I'm crazy. Come see." },
  { id:"h29", emoji:"🌿", title:"Tend to Something Together", phase:"follicular", primaryChem:"serotonin",
    howTo:"Water plants, do a small garden task, or tend to something around the house together. Low-key, productive, peaceful. More connecting than it sounds.",
    whatToSay:"Come do this thing with me. It'll take 10 minutes and I just want company." },
  { id:"h30", emoji:"🎯", title:"Teach Each Other Something", phase:"follicular", primaryChem:"dopamine",
    howTo:"Each of you teaches the other something you know that they don't — a skill, a fact, a trick, anything. No stakes, pure curiosity.",
    whatToSay:"I'm going to teach you something tonight. And then you have to teach me something back." },
  { id:"h31", emoji:"🌅", title:"Watch the Sunrise Together", phase:"follicular", primaryChem:"serotonin",
    howTo:"Set an alarm. Make coffee. Go outside or sit by a window. Watch it together in silence or softly talking. Rare moments that become memories.",
    whatToSay:"I know it's early. Trust me. Bring a blanket." },
  { id:"h32", emoji:"🍽️", title:"Recreate Your First Meal Together", phase:"ovulation", primaryChem:"oxytocin",
    howTo:"Cook or order the meal from your first date or a meaningful early memory. Set the table nicely. Tell the story of that night.",
    whatToSay:"I want to take you back somewhere. Do you remember what we ate on our first date?" },
  { id:"h33", emoji:"🎲", title:"Invent Your Own Game", phase:"follicular", primaryChem:"endorphins",
    howTo:"Make up a game with whatever you have — cards, dice, a ball, questions. Write the rules together. Play it badly. Laugh.",
    whatToSay:"We're inventing a game tonight. I have no idea what it is yet." },
  { id:"h34", emoji:"📝", title:"Write Each Other Letters", phase:"luteal", primaryChem:"oxytocin",
    howTo:"Sit in the same room. Both write a letter to the other — what you appreciate, what you love, what you want them to know. Exchange and read in silence.",
    whatToSay:"I want to do something a little different tonight. Are you in?" },
  { id:"h35", emoji:"🎤", title:"Living Room Karaoke", phase:"ovulation", primaryChem:"endorphins",
    howTo:"YouTube karaoke, phone, or just singing along to music. Take turns, duet, judge each other dramatically. No talent required or desired.",
    whatToSay:"I need you to know that what's about to happen is completely serious." },
  { id:"h36", emoji:"🍫", title:"Chocolate and Wine Tasting", phase:"ovulation", primaryChem:"dopamine",
    howTo:"Get 3-4 different chocolates and a bottle of wine. Taste them like you know what you're doing. Rate them. Disagree. Enjoy being fancy and ridiculous about it.",
    whatToSay:"I'm setting up a very sophisticated tasting experience. It's also just chocolate." },
  { id:"h37", emoji:"🌌", title:"Backyard Stargazing", phase:"follicular", primaryChem:"oxytocin",
    howTo:"Lay outside on blankets after dark. Download a star-tracking app. Find constellations together. Make up your own names for them if you can't find real ones.",
    whatToSay:"Meet me outside in 10 minutes. Bring something warm." },
  { id:"h38", emoji:"🎪", title:"Home Talent Show", phase:"follicular", primaryChem:"endorphins",
    howTo:"Each of you performs your best hidden talent — or your worst. Can be anything: magic trick, impression, party piece. Judge each other with fake seriousness.",
    whatToSay:"We're doing something tonight and I need you to commit to it fully." },
  { id:"h39", emoji:"🛁", title:"Bath Time Reading Club", phase:"luteal", primaryChem:"serotonin",
    howTo:"She baths, you sit nearby and read to her from a book or interesting article. No agenda, no distractions. Just presence and warmth.",
    whatToSay:"I'll read to you tonight. Just go get in the bath." },
  { id:"h40", emoji:"🎧", title:"Curate the Perfect Playlist Together", phase:"follicular", primaryChem:"oxytocin",
    howTo:"Build a playlist for a specific moment — your relationship, a road trip, a dinner party. Each person adds 5 songs and has to explain why they chose them.",
    whatToSay:"I want to make something with you. It involves music and mild arguing about song choices." },
  { id:"h41", emoji:"🍳", title:"Breakfast in Bed on a Weekday", phase:"luteal", primaryChem:"serotonin",
    howTo:"Wake up 15 minutes early. Make something simple — toast, eggs, coffee. Bring it to her in bed. No occasion needed. The randomness is the point.",
    whatToSay:"Don't get up yet." },
  { id:"h42", emoji:"🌺", title:"Rearrange One Room Together", phase:"follicular", primaryChem:"endorphins",
    howTo:"Pick a room and rearrange it. Move furniture, try different layouts. The physical doing together plus the creative decision-making creates real connection.",
    whatToSay:"I want to change something about this room. Come tell me what you think." },
  { id:"h43", emoji:"🎬", title:"Director's Commentary Rewatch", phase:"luteal", primaryChem:"endorphins",
    howTo:"Rewatch a favourite movie but do your own commentary — pointing out things you notice, acting like critics, quoting lines before they happen.",
    whatToSay:"We're rewatching something tonight but better this time." },
  { id:"h44", emoji:"🧩", title:"1000-Piece Puzzle Night", phase:"luteal", primaryChem:"serotonin",
    howTo:"Start a big puzzle. Talk while you work. No pressure to finish. Let it become a multi-night thing. Peaceful, side-by-side presence.",
    whatToSay:"I got something for us. It's either going to be relaxing or deeply frustrating. Probably both." },
  { id:"h45", emoji:"🍕", title:"Make the Messiest Meal You Can", phase:"follicular", primaryChem:"endorphins",
    howTo:"Pick a recipe that requires real hands-on work — pasta from scratch, dumplings, pizza dough. Make a mess. Laugh at the chaos. Eat what you made.",
    whatToSay:"We're cooking something tonight that will absolutely destroy this kitchen." },
  { id:"h46", emoji:"💌", title:"Text Her Something from Another Room", phase:"ovulation", primaryChem:"dopamine",
    howTo:"Sit in a different room and text her something she's not expecting — flirty, sweet, or funny. The unexpectedness of getting a real text while home is oddly effective.",
    whatToSay:"(Just send the text. Don't announce it.)" },
  { id:"h47", emoji:"🌊", title:"ASMR/Rain Sounds Wind-Down", phase:"menstrual", primaryChem:"serotonin",
    howTo:"Put on rain, fireplace, or ASMR sounds. Dim everything. Lie together or near each other. No talking required. Just breathe and decompress together.",
    whatToSay:"Come lie down with me. We're doing nothing on purpose." },
  { id:"h48", emoji:"🗺️", title:"Plan a Trip You'll Actually Take", phase:"follicular", primaryChem:"dopamine",
    howTo:"Open maps, pick somewhere neither of you have been. Research it together — food, things to do, where to stay. Book one thing to make it real.",
    whatToSay:"Pick somewhere we've never been. I want to start planning something real." },
  { id:"h49", emoji:"🎨", title:"Blind Drawing Challenge", phase:"follicular", primaryChem:"endorphins",
    howTo:"One person describes an image, the other draws it without seeing. Compare the results. Then switch. The gap between what was described and drawn is always hilarious.",
    whatToSay:"I need you to draw something for me. You're not allowed to look at it first." },
  { id:"h50", emoji:"🕯️", title:"Dinner by Candlelight at Home", phase:"ovulation", primaryChem:"oxytocin",
    howTo:"Set the table with candles, nice dishes, whatever you have. Cook or order her favourite. No phones on the table. It doesn't need to be fancy — it needs to be intentional.",
    whatToSay:"Dinner is at 7. Dress however you want. I'm handling everything." },
  { id:"h51", emoji:"📚", title:"Book Swap Night", phase:"luteal", primaryChem:"oxytocin",
    howTo:"Each of you picks one book the other has to read. Explain why you chose it. Set a date to discuss it. Creates ongoing conversation for weeks.",
    whatToSay:"I want you to read something that matters to me. And I'll read something of yours." },
  { id:"h52", emoji:"🧁", title:"Bake Something Absurd", phase:"follicular", primaryChem:"endorphins",
    howTo:"Find the most complicated recipe you can find and attempt it together. The goal isn't success. The goal is the collaboration, the chaos, and eating whatever happens.",
    whatToSay:"We're attempting something in the kitchen tonight. I'm not telling you what it is until we start." },
  { id:"h53", emoji:"💬", title:"36 Questions at Home", phase:"luteal", primaryChem:"oxytocin",
    howTo:"Google 'Arthur Aron 36 questions.' Sit across from each other with drinks. Answer them honestly. Go slowly. Do not rush the last question.",
    whatToSay:"I found something I want us to do. It's going to get real. You in?" },
  { id:"h54", emoji:"🌙", title:"Late Night Porch Sitting", phase:"ovulation", primaryChem:"serotonin",
    howTo:"After everything is done, sit outside together. Drinks optional. No agenda. Just the night air and whatever conversation comes. Some of the best talks happen here.",
    whatToSay:"Come sit outside with me. Bring whatever you're drinking." },
  { id:"h55", emoji:"🎹", title:"Music Memory Share", phase:"luteal", primaryChem:"oxytocin",
    howTo:"Each of you plays 3-5 songs that mean something to you from different periods of your life. Explain what each one is tied to. Listen without looking at your phone.",
    whatToSay:"I want to show you something about who I was. You have to do the same after." },
  { id:"h56", emoji:"🏋️", title:"Work Out Together", phase:"follicular", primaryChem:"endorphins",
    howTo:"Do a workout at home together — HIIT video, yoga, stretching, weights. Spot each other, compete slightly, encourage each other. Physical effort creates real energy.",
    whatToSay:"We're working out together tonight. I'll find something. You just have to show up." },
  { id:"h57", emoji:"🌹", title:"Recreate Your First Date at Home", phase:"ovulation", primaryChem:"oxytocin",
    howTo:"Think about what made your first date special and recreate the feeling at home. Same music, similar food, the same kind of energy. Tell her what you remember from that night.",
    whatToSay:"I want to take you somewhere tonight. We're not leaving the house." },
  { id:"h58", emoji:"🧠", title:"Teach Her Something You Know Really Well", phase:"follicular", primaryChem:"serotonin",
    howTo:"Pick something you actually know well and teach it to her like a real lesson. Not condescending — genuinely sharing something you love. Enthusiasm is the key ingredient.",
    whatToSay:"I want to show you something I actually know how to do." },
  { id:"h59", emoji:"🌟", title:"Gratitude Round Robin", phase:"luteal", primaryChem:"serotonin",
    howTo:"Take turns: one person says something they're grateful for about the other. Back and forth for 10 minutes. Specific details only. No vague statements.",
    whatToSay:"I want to do something a little vulnerable with you tonight. Five minutes. You'll thank me." },
  { id:"h60", emoji:"🎁", title:"Surprise Gift Under $10", phase:"ovulation", primaryChem:"dopamine",
    howTo:"Get her something small, specific, and thoughtful — something she mentioned once or something that made you think of her. The price is irrelevant. The specificity is everything.",
    whatToSay:"I got you something. It's not a big deal. Except it kind of is." },

];

// Map home activities as daily tasks (id offset to avoid collision)
const HOME_ACTIVITY_TASKS = HOME_ACTIVITIES.map(a => ({
  id: 100 + parseInt(a.id.replace("h","")),
  task: `Tonight's home activity: ${a.title}`,
  fullActivity: a,
  needs: a.needs,
  effort: a.effort === "low" ? "low" : a.effort === "medium" ? "medium" : "high",
  neuro: a.chems,
  why: a.scienceNote,
  isHomeActivity: true,
}));

// Home activity reminders for REMINDER_LIBRARY injection
const HOME_ACTIVITY_REMINDERS = HOME_ACTIVITIES.map((a,i) => ({
  id: `ha${i+1}`,
  category: "home",
  icon: a.emoji,
  title: a.reminderTitle,
  body: a.reminderBody,
  neuro: a.chems,
  phases: ["all"],
  defaultTime: "17:30",
  defaultDays: i % 2 === 0 ? ["FR","SA"] : ["WE","SU"],
  why: a.scienceNote,
}));

// Merged reminder library — always call this, never reference HOME_ACTIVITY_REMINDERS directly in render
const ALL_REMINDERS = () => [...REMINDER_LIBRARY, ...HOME_ACTIVITY_REMINDERS];

function getVarietyTask(usedTaskIds, phaseNeeds) {
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

function getVarietyTexts(usedTextIds) {
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
function NeedBadge({need}) {
  return <span style={{background:NEED_COLORS[need]+"22",color:NEED_COLORS[need],border:`1px solid ${NEED_COLORS[need]}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{need}</span>;
}
function NeuroBadge({chem,showLabel=false}) {
  const n=NEURO[chem];
  return <span style={{background:n.color+"20",color:n.color,border:`1px solid ${n.color}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{n.emoji}{showLabel?` ${n.label}`:""}</span>;
}
function PremiumGate({onUpgrade, feature="This feature"}) {
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

function SHCBadge({type}) {
  if(!type||!SHC[type]) return null;
  const s=SHC[type];
  return <span style={{background:s.color+"20",color:s.color,border:`1px solid ${s.color}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{s.emoji} {s.label}</span>;
}
function SHCRow({types}) {
  if(!types||types.length===0) return null;
  return (
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
      {types.map(t=><SHCBadge key={t} type={t}/>)}
    </div>
  );
}
function LPPBadge({type}) {
  if(!type||!LPP[type]) return null;
  const p=LPP[type];
  return <span style={{background:p.color+"20",color:p.color,border:`1px solid ${p.color}40`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>{p.emoji} {p.label}</span>;
}
function NeuroPanel({chems,why,taskId}) {
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
function PhaseCard({phase, showNeeds=false}) {
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
function ReminderCard({reminder,active,scheduleData,onToggle,onScheduleChange,phaseKey}) {
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

function Toast({toasts,onDismiss}) {
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
  const isPreviewMode = !API_URL;
  const isPremium = subTier === "premium" || isPreviewMode;

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
    // Restore auth session from storage
    const stored = safeGet("authUser","");
    if (stored&&!authUser) { try { setAuthUser(JSON.parse(stored)); } catch(e) {} }
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
      // Preview mode — skip auth, go straight in
      setAuthUser({ id:"preview", email:authEmail||"preview@betterpartner.app", name:"Preview" });
      safeSet("authUser", JSON.stringify({ id:"preview", email:authEmail||"preview@betterpartner.app", name:"Preview" }));
      setSubscribed(true); safeSet("subscribed","1");
      return;
    }
    if (!authEmail||!authPassword) { setAuthError("Please enter your email and password."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method:"POST", headers:{"Content-Type":"application/json","x-app-secret":APP_SECRET},
        body: JSON.stringify({ email:authEmail, password:authPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error||"Login failed. Check your email and password."); setAuthLoading(false); return; }
      setAuthUser({ id:data.userId, email:authEmail, name:data.name });
      safeSet("authToken", data.token);
      safeSet("authUser", JSON.stringify({ id:data.userId, email:authEmail, name:data.name }));
      if (data.subscribed) { setSubscribed(true); safeSet("subscribed","1"); }
    } catch(e) { setAuthError("Connection error. Please try again."); }
    setAuthLoading(false);
  };

  const handleSignup = async () => {
    if (isPreviewMode) {
      // Preview mode — skip auth
      setAuthUser({ id:"preview", email:authEmail||"preview@betterpartner.app", name:authName||"Preview" });
      safeSet("authUser", JSON.stringify({ id:"preview", email:authEmail, name:authName||"Preview" }));
      setSubscribed(true); safeSet("subscribed","1");
      return;
    }
    if (!authName) { setAuthError("Please enter your first name."); return; }
    if (!authEmail||!authEmail.includes("@")) { setAuthError("Please enter a valid email address."); return; }
    if (!authPassword||authPassword.length<8) { setAuthError("Password must be at least 8 characters."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method:"POST", headers:{"Content-Type":"application/json","x-app-secret":APP_SECRET},
        body: JSON.stringify({ email:authEmail, password:authPassword, name:authName }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error||"Signup failed. Try a different email."); setAuthLoading(false); return; }
      setAuthUser({ id:data.userId, email:authEmail, name:authName });
      safeSet("authToken", data.token);
      safeSet("authUser", JSON.stringify({ id:data.userId, email:authEmail, name:authName }));
    } catch(e) { setAuthError("Connection error. Please try again."); }
    setAuthLoading(false);
  };

  const handleForgot = async () => {
    if (isPreviewMode) { setAuthError("Reset link sent — check your inbox."); return; }
    if (!authEmail) { setAuthError("Enter your email address first."); return; }
    setAuthLoading(true); setAuthError("");
    try {
      await fetch(`${API_URL}/api/auth/forgot`, {
        method:"POST", headers:{"Content-Type":"application/json","x-app-secret":APP_SECRET},
        body: JSON.stringify({ email:authEmail }),
      });
      setAuthError("Reset link sent — check your inbox.");
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
                      '✓ Better Partner — $21.99/month'
                    </div>
                  </div>
                  <button onClick={()=>{
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
    <div style={{minHeight:"100vh",background:"#0d0d0d",color:"#f0ece4",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:90}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>

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
        </div>
      )}

      {/* ── ONBOARDING (after auth + subscription) ─────────────── */}
      {authUser&&subscribed&&(!onboarded||replayGuide)&&(()=>{
        const ONBOARDING_SLIDES = [
          {
            id:"welcome", emoji:"💍", color:"#c0392b",
            title:"Welcome to Better Partner.",
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
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#111",borderTop:"1px solid #2a2a2a",display:"flex",zIndex:100}}>
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
