// CSS
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle'; // This fixed the issue with dropdowns?
// Packages
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Pages
import Home from './pages/home';
import UsersPage from './pages/UsersPage';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/users" element={<UsersPage />} />
    </Routes>
  );
}

export default App;
