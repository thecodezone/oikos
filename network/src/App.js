import React, { useState, useRef, useEffect} from 'react';
// import axios from 'axios'
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
  console.log("script started");
  const mapRef = useRef();

  const handleWheel = (event) => {
    const map = mapRef.current;

    if (event.ctrlKey) {
      event.preventDefault(); // Prevent default scroll behavior
      const zoomAmount = event.deltaY > 0 ? -1 : 1; // Determine zoom direction
      map.leafletElement.zoomIn(zoomAmount); // Zoom in or out
    } else {
      // Allow normal scrolling
      return;
    }
  };

//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Fetch data from the Node.js server
//     axios.get('/api/message')
//         .then(response => {
//             setMessage(response.data.message);
//         })
//         .catch(error => {
//             console.error('There was an error!', error);
//         });
// }, []);

  return (
    <div
      className="App"
      onContextMenu={(e) => {
        e.preventDefault(); // Prevent the default behavior when right-clicked
      }}
      onWheel={handleWheel} // Ensure this function is defined
      center={[51.505, -0.09]} // Set initial center
      zoom={13} // Set initial zoom
      ref={mapRef} // Attach the ref to the MapContainer
    >
      
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