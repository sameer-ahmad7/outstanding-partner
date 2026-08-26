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
    dismissToast,
    emailVerified,
    handleForgot,
    handleLogin,
    authIntent, setAuthIntent,
    paywallOpen, setPaywallOpen,
    hasAccount,
    handleSocialLogin,
    socialAuthAvailable,
    handleSignup,
    handleResendVerification,
    handleCheckVerification,
    handleResetPassword,
    pendingVerifyEmail,
    passwordRecovery,
    isPreviewMode,
    onboardSlide,
    onboarded,
    replayGuide,
    setAuthEmail,
    setAuthError,
    setAuthName,
    setAuthPassword,
    setAuthScreen,
    setAuthUser,
    setLegalView,
    setOnboardSlide,
    setOnboarded,
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

  // effectiveAuthScreen forces the verify/reset screen regardless of the last-used auth tab.
  // WS3: auth is no longer a wall in front of the app. It appears when the user asks for it
  // (authIntent), when a password-recovery deep link is in flight, or when someone has signed up
  // but not yet verified — that last case still needs resolving before their account works.
  const showAuth = passwordRecovery || authIntent || (!!authUser && !emailVerified);
  const effectiveAuthScreen = passwordRecovery
    ? "reset"
    : (authUser && !emailVerified ? "verify" : authScreen);

  return (
    <div className="op-app-frame" style={{minHeight:"100vh",background:"#0d0d0d",color:"#f0ece4",fontFamily:"'DM Sans','Helvetica Neue',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:"calc(90px + env(safe-area-inset-bottom))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        /* On wider screens (desktop web, tablets) present the mobile-first app as a
           centered phone-width column instead of stretching full width.
           NB: do NOT put a transform on this element. A transform makes it the containing
           block for its position:fixed descendants, so the auth/paywall overlays resolved
           inset:0 against the FRAME (which grows with content — 4400px on the profile tab)
           instead of the viewport. The overlay then centred its contents thousands of pixels
           down the page and appeared blank until you scrolled. The overlays constrain their
           own content width instead. Phones/native (<520px) never hit this. */
        @media (min-width:520px){
          html,body{background:#050505;}
          .op-app-frame{box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 24px 80px rgba(0,0,0,.55);}
        }
      `}</style>

      <LegalOverlay />

      {showAuth&&(
        <AuthScreen
          authScreen={effectiveAuthScreen} setAuthScreen={setAuthScreen}
          authEmail={authEmail} setAuthEmail={setAuthEmail}
          authPassword={authPassword} setAuthPassword={setAuthPassword}
          authName={authName} setAuthName={setAuthName}
          authError={authError} setAuthError={setAuthError} authLoading={authLoading}
          handleLogin={handleLogin} handleSignup={handleSignup} handleForgot={handleForgot}
          handleSocialLogin={handleSocialLogin} socialAuthAvailable={socialAuthAvailable}
          handleResendVerification={handleResendVerification} handleResetPassword={handleResetPassword}
          handleCheckVerification={handleCheckVerification}
          pendingVerifyEmail={pendingVerifyEmail}
          isPreviewMode={isPreviewMode} setLegalView={setLegalView}
          onClose={authIntent ? () => setAuthIntent(false) : null}
        />
      )}

      {!showAuth&&!subscriptionReady&&hasAccount&&(
        <div style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:32,height:32,border:"3px solid #2a2a2a",borderTopColor:"#c0392b",borderRadius:"50%",animation:"opSpin 0.8s linear infinite"}}/>
          <style>{`@keyframes opSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {!showAuth&&subscriptionReady&&!subscribed&&paywallOpen&&(
        <Paywall
          subscription={subscription}
          isPreviewMode={isPreviewMode}
          subMsg={subMsg} setSubMsg={setSubMsg}
          setSubscribed={setSubscribed}
          onClose={() => setPaywallOpen(false)}
          setAuthUser={setAuthUser} setLegalView={setLegalView}
        />
      )}

      {!showAuth&&(!onboarded||replayGuide)&&(
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
