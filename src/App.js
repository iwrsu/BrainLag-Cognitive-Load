import React from 'react';
import {BrowserRouter as Router, Route,  Routes} from "react-router-dom";
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Loaddashboard from './components/Load_dashboard';
import MentalBalance from './components/MentalBalance';
import TrackDaily from './components/TrackDaily';
import Charts from './components/Charts';
import Recommendations from './components/Recommendations';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/LoginPage' element={<LoginPage/>}/>
        <Route path='/RegistrationPage' element={<RegistrationPage/>}/>
        <Route path="/Loaddashboard" element={<Loaddashboard/>}/>
        <Route path="/MentalBalance" element={<MentalBalance/>}/>
        <Route path="/TrackDaily" element={<TrackDaily/>}/>
        <Route path="/Charts" element={<Charts/>}/>
        <Route path="/Recommendations" element={<Recommendations/>}/>
      </Routes>
    </Router>
  );
}

export default App;
