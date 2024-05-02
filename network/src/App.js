import './App.css';
import IndividualPrayerForm from './AddPersonForm.tsx';
import OrgPrayerForm from './AddOrgForm.tsx';
import { Header } from './Header';
import AddLinkForm from './AddLinkForm.tsx';
import ViewListForm from './listForm.tsx';
import EditNodeForm from './EditNodeForm.tsx';
import EditLinkForm from './EditLinkForm.tsx';

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
      <EditNodeForm/>
      <EditLinkForm/>
      <ViewListForm />
    </div>
  );
}

export default App;