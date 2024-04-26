import './App.css';
import IndividualPrayerForm from './AddPersonForm.tsx';
import OrgPrayerForm from './AddOrgForm.tsx';
import { Header } from './Header';
import AddLinkForm from './AddLinkForm.tsx';
import ViewListForm from './listForm.tsx';

function App() {
  console.log("script started")
  return (
    <div className="App"
    onContextMenu={(e) => {
      e.preventDefault(); // prevent the default behaviour when right clicked
    }}>
      <Header />
      <IndividualPrayerForm />
      <OrgPrayerForm />
      <AddLinkForm />
      <ViewListForm />
    </div>
  );
}

export default App;