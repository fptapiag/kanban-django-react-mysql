import { useEffect, useState } from "react"; // Añadimos useState
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createTask, deleteTask, updateTask, getTask } from "../api/tasks.api";

export function TaskFormPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm(); 
  const navigate = useNavigate();
  const params = useParams();
  
  // Nuevo estado para saber si la tarea está bloqueada
  const [isCompleted, setIsCompleted] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (params.id) {
        await updateTask(params.id, data);
        toast.success("Tarea actualizada");
      } else {
        await createTask(data);
        toast.success("Tarea guardada");
      }
      navigate("/tasks");
    } catch (error) {
      toast.error("Error al procesar la tarea");
    }
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const { data } = await getTask(params.id);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('status', data.status);
        
        // Si la tarea viene de MySQL como COMPLETADA, bloqueamos el formulario
        if (data.status === "COMPLETADA") {
          setIsCompleted(true);
        }
      }
    }
    loadTask();
  }, [params.id, setValue]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <button 
        onClick={() => navigate("/tasks")}
        className="text-zinc-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
      >
        <span>←</span> Volver al tablero
      </button>

      <h2 className="text-3xl font-bold mb-5 text-white">
        {params.id ? (isCompleted ? "Tarea Finalizada (Solo Lectura)" : "Editar Tarea") : "Nueva Tarea"}
      </h2>
      
      <form onSubmit={onSubmit} className={`bg-zinc-800 p-8 rounded-xl shadow-2xl border ${isCompleted ? 'border-green-900' : 'border-zinc-700'}`}>
        <label className="text-zinc-400 text-sm">Título de la tarea</label>
        <input 
          type="text" 
          disabled={isCompleted} // BLOQUEADO SI ESTÁ COMPLETADA
          {...register("title", { required: true })} 
          className={`bg-zinc-700 p-3 rounded-lg block w-full mb-4 text-white outline-none ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'}`} 
        />
        
        <label className="text-zinc-400 text-sm">Descripción</label>
        <textarea 
          rows="3"
          disabled={isCompleted} // BLOQUEADO SI ESTÁ COMPLETADA
          {...register("description")} 
          className={`bg-zinc-700 p-3 rounded-lg block w-full mb-4 text-white outline-none ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'}`}
        ></textarea>

        <label className="text-zinc-400 text-sm">Estado actual</label>
        <select 
          disabled={isCompleted} // BLOQUEADO SI ESTÁ COMPLETADA
          {...register("status")} 
          className={`bg-zinc-700 p-3 rounded-lg block w-full mb-6 text-white outline-none ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="PROCESO">En Proceso</option>
          <option value="COMPLETADA">Completada</option>
        </select>

        {/* Solo mostramos el botón de guardar si NO está completada */}
        {!isCompleted ? (
          <button className="bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg block w-full font-bold text-white transition-colors">
            {params.id ? "Actualizar Tarea" : "Guardar Tarea"}
          </button>
        ) : (
          <div className="bg-green-900/30 border border-green-500 text-green-500 p-3 rounded-lg text-center font-bold">
            Esta tarea ha sido completada y no se puede modificar.
          </div>
        )}
      </form>

      {/* Permitimos eliminarla incluso si está completada, por si el usuario quiere limpiar su tablero */}
      {params.id && (
        <div className="flex justify-end mt-4">
          <button 
            onClick={async () => {
              if (window.confirm("¿Eliminar permanentemente?")) {
                await deleteTask(params.id);
                toast.success("Tarea eliminada");
                navigate("/tasks");
              }
            }}
            className="text-red-500 hover:text-red-400 text-sm font-bold underline"
          >
            Eliminar tarea
          </button>
        </div>
      )}
    </div>
  );
}