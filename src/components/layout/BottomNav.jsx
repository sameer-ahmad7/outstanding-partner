import { useAppState } from '../../state/AppStateProvider.jsx';

export default function BottomNav() {
  const {
    activeCount,
    cycleStartDate,
    setTab,
    tab,
    tabs,
    wifeBirthYear,
    wifeName,
  } = useAppState();

  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#111",borderTop:"1px solid #2a2a2a",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
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
  );
}
