import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="flex justify-between items-center py-5 px-8 bg-zinc-900 border-b border-zinc-800">
      <Link to="/tasks">
        <h1 className="text-3xl font-extrabold text-indigo-500 tracking-tight hover:text-indigo-400 transition-colors">
          Task App
        </h1>
      </Link>
      
      <Link 
        to="/tasks-create" 
        className="bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
      >
        + Crear Tarea
      </Link>
    </nav>
  );
}