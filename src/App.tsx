import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import TodoDetails from './components/TodoDetails';
import TodoList from './components/TodoList';
import './App.css'

const App: React.FC = () => {
  return (
    <div className='app-container'>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><TodoList /></MainLayout>} />
          <Route path="/todo/:id" element={<TodoDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
