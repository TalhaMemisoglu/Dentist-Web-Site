import './App.scss';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Services from './pages/Services';
import Contactus from './pages/Contact/Contactus';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/singleservice" element={<Services />} />
      <Route path="/contact" element={<Contactus />} />
    </Routes>
  );
}

export default App;
