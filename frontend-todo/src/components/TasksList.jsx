import { useEffect, useState } from "react";
import { getAllTasks, updateTask } from "../api/tasks.api";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti"; // Importamos el confeti

export function TasksList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const res = await getAllTasks();
    setTasks(res.data);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // --- REGLA DE NEGOCIO: Bloqueo de Completadas ---
    if (source.droppableId === "COMPLETADA") {
      toast.error("Las tareas completadas ya no pueden moverse.");
      return;
    }

    const taskToUpdate = tasks.find(t => t.id.toString() === draggableId);
    const newStatus = destination.droppableId;

    // --- EFECTO: Celebración si pasa a Completada ---
    if (newStatus === "COMPLETADA") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#ffffff']
      });
      toast.success("¡Excelente trabajo! Tarea finalizada.");
    }

    // Actualización optimista
    const updatedTasks = tasks.map(t => 
      t.id.toString() === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await updateTask(draggableId, { ...taskToUpdate, status: newStatus });
    } catch (error) {
      toast.error("Error al guardar en MySQL");
      fetchTasks();
    }
  };

  const columns = [
    { id: "PENDIENTE", title: "Pendientes", color: "border-t-red-500" },
    { id: "PROCESO", title: "En Proceso", color: "border-t-yellow-500" },
    { id: "COMPLETADA", title: "Completadas", color: "border-t-green-500" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex gap-6 h-full w-full overflow-x-auto pb-4">
      {columns.map((column) => (
        <div 
          key={column.id} 
          className={`flex-none w-80 md:w-1/3 bg-zinc-900/50 rounded-xl p-4 border-t-4 ${column.color} flex flex-col h-full`}
        >
          {/* Título fijo */}
          <h2 className="text-lg font-bold text-zinc-300 mb-4 flex justify-between shrink-0">
            {column.title}
            <span className="bg-zinc-800 px-2 py-0.5 rounded text-sm font-mono">
              {tasks.filter(t => t.status === column.id).length}
            </span>
          </h2>

          {/* ESTA ES LA ZONA CON SCROLL INDIVIDUAL */}
          <Droppable droppableId={column.id}>
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="flex-grow overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar"
                style={{ minHeight: "100px" }} // Asegura que siempre haya espacio para soltar
              >
                {tasks
                  .filter((t) => t.status === column.id)
                  .map((task, index) => (
                    <Draggable 
                      key={task.id.toString()} 
                      draggableId={task.id.toString()} 
                      index={index}
                      isDragDisabled={task.status === "COMPLETADA"}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          className="bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700 mb-3 hover:border-indigo-500"
                        >
                          <h3 className="font-bold text-sm text-white">{task.title}</h3>
                          <p className="text-zinc-500 text-xs mt-2">{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  </DragDropContext>
  );
}