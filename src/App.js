import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import Home from './components/Home';
import SideNav from './components/SideNav';
import Header from './components/Header';
import Footer from './components/Footer';
import Pms105a from './components/10/Pms105a';
import Pms101a from './components/10/Pms101a';
import Pms102a from './components/10/Pms102a';
import Pms103a from './components/10/Pms103a';
import Pms104r from './components/10/Pms104r';
import Login from './components/Login';
import Pms201a from './components/20/Pms201a';
import Pms202r from './components/20/Pms202r';
import Pms203a from './components/20/Pms203a';
import Pms205a from './components/20/Pms205a';
import Pms207r from './components/20/Pms207r';
import Pms206a from './components/20/Pms206a';
import Pms208r from './components/20/Pms208r';

const useMinHeight = () => {
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    const updateMinHeight = () => {
      const windowHeight = window.innerHeight;
      setMinHeight(windowHeight - 120);
    };
    
    updateMinHeight();
    window.addEventListener('resize', updateMinHeight);
    
    return () => window.removeEventListener('resize', updateMinHeight);
  }, []);

  return minHeight;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PrivateRoutes />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

const PrivateRoutes = () => {
  const { authInfo } = useContext(UserContext);
  const { auth } = authInfo;
  const minHeight = useMinHeight();

  console.debug(auth);

  return auth ? (
    <>
      <Header />
      <SideNav />
      <main style={{ minHeight: `${minHeight}px` }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Pms101a" element={<Pms101a />} />
          <Route path="/Pms102a" element={<Pms102a />} />
          <Route path="/Pms103a" element={<Pms103a />} />
          <Route path="/Pms104r" element={<Pms104r />} />
          <Route path="/Pms105a" element={<Pms105a />} />
          <Route path="/Pms201a" element={<Pms201a />} />
          <Route path="/Pms202r" element={<Pms202r />} />
          <Route path="/Pms203a" element={<Pms203a />} />
          <Route path="/Pms205a" element={<Pms205a />} />
          <Route path="/Pms206r" element={<Pms206a />} />
          <Route path="/Pms207r" element={<Pms207r />} />
          <Route path="/Pms208r" element={<Pms208r />} />
        </Routes>
      </main>
      <footer className="main-footer">
        <Footer />
      </footer>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
