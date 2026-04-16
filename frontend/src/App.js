import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianView from "./pages/TechnicianView";
import OAuthSuccess from "./pages/OAuthSuccess";
import UserDashboard from "./pages/UserDashboard";


import TicketCreate from "./pages/tickets/TicketCreate";
import TicketList from "./pages/tickets/TicketList";
import TicketDetails from "./pages/tickets/TicketDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/technician" element={<TechnicianView />} />


        <Route path="/tickets/new" element={<TicketCreate />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;