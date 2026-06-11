import { useAppState } from '../../state/AppStateProvider.jsx';
import ActivitiesTab from './ActivitiesTab.jsx';
import GuideTab from './GuideTab.jsx';
import LogTab from './LogTab.jsx';
import ProfileTab from './ProfileTab.jsx';
import RemindersTab from './RemindersTab.jsx';
import TextsTab from './TextsTab.jsx';
import TodayTab from './TodayTab.jsx';

export default function ActiveTab() {
  const { tab } = useAppState();

  if (tab === 'today') return <TodayTab />;
  if (tab === 'texts') return <TextsTab />;
  if (tab === 'reminders') return <RemindersTab />;
  if (tab === 'profile') return <ProfileTab />;
  if (tab === 'log') return <LogTab />;
  if (tab === 'home') return <ActivitiesTab />;
  if (tab === 'coach') return <GuideTab />;
  return <TodayTab />;
}
