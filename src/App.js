import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LaunchScreen from './LaunchScreen';
import SpecialtySelector from './SpecialtySelector';
import ServiceSelector from './ServiceSelector';
import ReferralForm from './ReferralForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/specialty" element={<SpecialtySelector />} />
        <Route path="/service" element={<ServiceSelector />} />
        <Route path="/form/:type/:target" element={<ReferralForm />} />
      </Routes>
    </Router>
  );
}



export default App;
