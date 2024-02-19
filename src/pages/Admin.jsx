import { useContext } from 'react';
import CrearPartido from '../components/CrearPartido';
import { AuthContext } from "../context/AuthContext";
import ActualizarPartido from '../components/ActualizarPartido';
import "../App.css"

const Admin = () => {
     // Asumiendo que tienes lógica para determinar qué formulario mostrar o si ambos están disponibles
     return (
          <div>
               <h1>Página de Administración</h1>
               {/* Puedes decidir aquí si mostrar ambos o basado en alguna lógica específica */}
               <CrearPartido />
               {/* <ActualizarPartido /> */}
          </div>
     );
};

export default Admin;
