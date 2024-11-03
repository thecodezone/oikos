import './css/App.css';
import IndividualPrayerForm from './pages/AddPersonForm.tsx';
import OrgPrayerForm from './pages/AddOrgForm.tsx';
import { Header } from './js/Header';
import AddLinkForm from './pages/AddLinkForm.tsx';
import ViewListForm from './pages/listForm.tsx';
import EditNodeForm from './pages/EditNodeForm.tsx';
import EditLinkForm from './pages/EditLinkForm.tsx';
import CustomNodeForm from './pages/CustomNode.tsx';

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
      <CustomNodeForm />
    </div>
  );
}

export default App;