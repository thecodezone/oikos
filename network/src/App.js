import './App.css';
import PrayerMap from './components/graph';
import IndividualPrayerForm from './AddPersonForm.tsx';
import OrgPrayerForm from './AddOrgForm.tsx';
import { Header } from './Header';
import AddLinkForm from './AddLinkForm.tsx';

function App() {
  console.log("script started")
  return (
    <div className="App"
    onContextMenu={(e) => {
      e.preventDefault(); // prevent the default behaviour when right clicked
      console.log("Right Click");
    }}>
      <Header />
      <IndividualPrayerForm />
      <OrgPrayerForm />
      <AddLinkForm />
      <PrayerMap />
    </div>
  );
}

export default App;
