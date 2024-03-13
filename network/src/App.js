import './App.css';
import PrayerMap from './components/graph';
import IndividualPrayerForm from './AddPersonForm.tsx';
import OrgPrayerForm from './AddOrgForm.tsx';
import { Header } from './Header';

function App() {
  console.log("script started")
  return (
    <div className="App">
      <Header />
      <PrayerMap />
    </div>
  );
}

export default App;
