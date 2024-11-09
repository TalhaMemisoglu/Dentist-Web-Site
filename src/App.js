import './App.scss';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Services from './pages/Services';
import Contactus from './pages/Contact/Contactus';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Patients from './pages/Patients/Patients';
import Choose from './pages/Choose/Choose';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/singleservice" element={<Services />} />
      <Route path="/contact" element={<Contactus />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/patients" element={<Patients/>} />
      <Route path="/choose" element={<Choose/>} />
    </Routes>
  );
}

export default App;
