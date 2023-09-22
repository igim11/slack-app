import './App.css';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import Login from './Login/Login';
import Register from './Login/Register';
import LandingPage from './LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(() => {
    const storedHeaders = sessionStorage.getItem("user-headers");
    if (storedHeaders !== null) {
      const parsedHeaders = JSON.parse(storedHeaders);
      return parsedHeaders.uid || "";
    }
    return "";
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user-headers") {
        const newValue = event.newValue;
        if (newValue !== null) {
          const parsedHeaders = JSON.parse(newValue);
          setUser(parsedHeaders.uid || "");
        } else {
          setUser("");
        }
      }
    };

    // Listen for changes in session storage
    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  
  return (
    <div className="App">
      <Router>
        {!user? (
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        ) : (
        <>
          <Header />
          <div className='app_body'>
            <Sidebar />
              <Routes>
                {/* LandingPage is displayed after login */}
                <Route path="/" element={<LandingPage />} />

                {/* Chat is displayed when navigating to a specific room */}
                <Route path="/:roomType/:roomId" element={<Chat />} />
              </Routes>
          </div>
        </>
        )}
      </Router>
    </div>
  );
}

export default App;