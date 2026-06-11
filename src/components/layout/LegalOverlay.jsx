import { useAppState } from '../../state/AppStateProvider.jsx';
import SupportScreen from '../legal/SupportScreen.jsx';
import PrivacyPolicyScreen from '../legal/PrivacyPolicyScreen.jsx';

export default function LegalOverlay() {
  const { legalView, setLegalView } = useAppState();

  return (
    <>
      {legalView==="support"&&<SupportScreen onClose={()=>setLegalView(null)}/>}
      {legalView==="privacy"&&<PrivacyPolicyScreen onClose={()=>setLegalView(null)}/>}
    </>
  );
}
