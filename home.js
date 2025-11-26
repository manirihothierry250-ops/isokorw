// This is a full React + Firebase project skeleton for Isoko with improved interface styling using Tailwind CSS and image support.

/* ===========================
   File: src/firebase.js
=========================== */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


/* ===========================
   File: src/App.js
=========================== */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Dashboard from './components/dashboard/Dashboard';
import './index.css'; // Tailwind CSS import

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


/* ===========================
   File: src/components/auth/SignUp.jsx
=========================== */
import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        phone,
        role
      });

      alert('User created successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input className="w-full p-3 border rounded-md" type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="w-full p-3 border rounded-md" type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full p-3 border rounded-md" type='text' placeholder='Phone' value={phone} onChange={e => setPhone(e.target.value)} required />
          <input className="w-full p-3 border rounded-md" type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
          <select className="w-full p-3 border rounded-md" value={role} onChange={e => setRole(e.target.value)}>
            <option value='buyer'>Buyer</option>
            <option value='seller'>Seller</option>
          </select>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded-md" type='submit'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;


/* ===========================
   File: src/components/auth/SignIn.jsx
=========================== */
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input className="w-full p-3 border rounded-md" type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full p-3 border rounded-md" type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded-md" type='submit'>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;


/* ===========================
   File: src/components/dashboard/Dashboard.jsx
=========================== */
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  if (role === 'seller') return <SellerDashboard />;
  if (role === 'buyer') return <BuyerDashboard />;
  if (role === 'admin') return <AdminDashboard />;

  return <div className="text-center mt-20 text-gray-700">Loading Dashboard...</div>;
};

export default Dashboard;
