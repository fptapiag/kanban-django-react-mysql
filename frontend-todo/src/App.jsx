import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TasksPage } from './pages/TasksPage';
import { TaskFormPage } from './pages/TaskFormPage';
import { Navigation } from './components/Navigation';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
        <Navigation />
        {/* Este contenedor (container) centra el contenido y le da margen */}
        <main className="flex-grow p-6 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks-create" element={<TaskFormPage />} />
            <Route path="/tasks/:id" element={<TaskFormPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;