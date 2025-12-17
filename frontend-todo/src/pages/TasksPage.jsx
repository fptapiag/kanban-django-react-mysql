import { TasksList } from "../components/TasksList";

export function TasksPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold">Tablero de Tareas</h1>
        <p className="text-zinc-500">Arrastra las tareas para cambiar su estado</p>
      </header>
      <div className="flex-grow overflow-hidden">
      <TasksList />
      </div>
    </div>
  );
}