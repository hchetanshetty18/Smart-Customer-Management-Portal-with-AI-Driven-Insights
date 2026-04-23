import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import AskAI from './pages/AskAI';
import Insights from './pages/Insights';
import Tickets from './pages/Tickets';
import Devices from './pages/Devices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="devices" element={<Devices />} />
          <Route path="insights" element={<Insights />} />
          <Route path="ask-ai" element={<AskAI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
