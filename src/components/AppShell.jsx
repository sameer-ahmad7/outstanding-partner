import { useAppState } from '../state/AppStateProvider.jsx';
import AuthScreen from './auth/AuthScreen.jsx';
import Paywall from './paywall/Paywall.jsx';
import Onboarding from './onboarding/Onboarding.jsx';
import { Toast } from './primitives.jsx';
import ActiveTab from './tabs/ActiveTab.jsx';
import AppHeader from './layout/AppHeader.jsx';
import BottomNav from './layout/BottomNav.jsx';
import LegalOverlay from './layout/LegalOverlay.jsx';

export default function AppShell() {
  const scope = useAppState();
  const {
    authEmail,
    authError,
    authLoading,
    authName,
    authPassword,
    authScreen,
    authUser,
    codeInput,
    dismissToast,
    handleForgot,
    handleLogin,
    handleSignup,
    isPreviewMode,
    onboardSlide,
    onboarded,
    redeeming,
    replayGuide,
    selectedPlan,
    setAuthEmail,
    setAuthError,
    setAuthName,
    setAuthPassword,
    setAuthScreen,
    setAuthUser,
    setCodeInput,
    setLegalView,
    setLifetimeAccess,
    setOnboardSlide,
    setOnboarded,
    setRedeeming,
    setReplayGuide,
    setSelectedPlan,
    setSubMsg,
    setSubscribed,
    setTab,
    subMsg,
    subscribed,
    subscription,
    toasts,
    wifeNickname,
  } = scope;

  return (
    <div style={{minHeight:"100vh",background:"#0d0d0d",color:"#f0ece4",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:"calc(90px + env(safe-area-inset-bottom))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <LegalOverlay />

      {!authUser&&(
        <AuthScreen
          authScreen={authScreen} setAuthScreen={setAuthScreen}
          authEmail={authEmail} setAuthEmail={setAuthEmail}
          authPassword={authPassword} setAuthPassword={setAuthPassword}
          authName={authName} setAuthName={setAuthName}
          authError={authError} setAuthError={setAuthError} authLoading={authLoading}
          handleLogin={handleLogin} handleSignup={handleSignup} handleForgot={handleForgot}
          isPreviewMode={isPreviewMode} setLegalView={setLegalView}
        />
      )}

      {authUser&&!subscribed&&(
        <Paywall
          subscription={subscription}
          isPreviewMode={isPreviewMode}
          selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}
          subMsg={subMsg} setSubMsg={setSubMsg}
          codeInput={codeInput} setCodeInput={setCodeInput}
          redeeming={redeeming} setRedeeming={setRedeeming}
          setSubscribed={setSubscribed} setLifetimeAccess={setLifetimeAccess}
          setAuthUser={setAuthUser} setLegalView={setLegalView}
        />
      )}

      {authUser&&subscribed&&(!onboarded||replayGuide)&&(
        <Onboarding
          onboardSlide={onboardSlide} setOnboardSlide={setOnboardSlide}
          onboarded={onboarded} setOnboarded={setOnboarded}
          replayGuide={replayGuide} setReplayGuide={setReplayGuide}
          setTab={setTab} wifeNickname={wifeNickname}
        />
      )}

      <Toast toasts={toasts} onDismiss={dismissToast}/>
      <AppHeader />

      <div style={{padding:"20px 20px 0"}}>
        <ActiveTab />
      </div>

      <BottomNav />
    </div>
  );
}
