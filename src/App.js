
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminPanel from './page/admin/page/AdminPanel';
import ClientPanel from './ClientPanel ';


const App = () => {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ClientPanel />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
