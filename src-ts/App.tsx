import React from 'react';
import { Route, Routes } from 'react-router';
console.log('#app.tsx');

import Home from './client/home';
//import About from './client/about';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  );
}
//<Route path="/about" element={<About />} />      

export default App;
