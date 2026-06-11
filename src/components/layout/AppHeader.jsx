import { useAppState } from '../../state/AppStateProvider.jsx';

export default function AppHeader() {
  const {
    anniversaryDate,
    loveLanguage,
    setOnboardSlide,
    setReplayGuide,
    wifeNickname,
  } = useAppState();

  return (
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
  );
}
