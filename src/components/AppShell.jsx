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
    emailVerified,
    handleForgot,
    handleLogin,
    handleSignup,
    handleResendVerification,
    handleResetPassword,
    pendingVerifyEmail,
    passwordRecovery,
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
    subscriptionReady,
    subscription,
    toasts,
    wifeNickname,
  } = scope;

  // Auth surface shows when there's no user, the email isn't verified yet (hard gate),
  // or a password-recovery deep link is in progress. effectiveAuthScreen forces the
  // verify/reset screen regardless of the last-used auth tab.
  const showAuth = passwordRecovery || !authUser || !emailVerified;
  const effectiveAuthScreen = passwordRecovery
    ? "reset"
    : (authUser && !emailVerified ? "verify" : authScreen);

  return (
    <div style={{minHeight:"100vh",background:"#0d0d0d",color:"#f0ece4",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:"calc(90px + env(safe-area-inset-bottom))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <LegalOverlay />

      {showAuth&&(
        <AuthScreen
          authScreen={effectiveAuthScreen} setAuthScreen={setAuthScreen}
          authEmail={authEmail} setAuthEmail={setAuthEmail}
          authPassword={authPassword} setAuthPassword={setAuthPassword}
          authName={authName} setAuthName={setAuthName}
          authError={authError} setAuthError={setAuthError} authLoading={authLoading}
          handleLogin={handleLogin} handleSignup={handleSignup} handleForgot={handleForgot}
          handleResendVerification={handleResendVerification} handleResetPassword={handleResetPassword}
          pendingVerifyEmail={pendingVerifyEmail}
          isPreviewMode={isPreviewMode} setLegalView={setLegalView}
        />
      )}

      {!showAuth&&!subscriptionReady&&(
        <div style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:32,height:32,border:"3px solid #2a2a2a",borderTopColor:"#c0392b",borderRadius:"50%",animation:"opSpin 0.8s linear infinite"}}/>
          <style>{`@keyframes opSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {!showAuth&&subscriptionReady&&!subscribed&&(
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

      {!showAuth&&subscribed&&(!onboarded||replayGuide)&&(
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
