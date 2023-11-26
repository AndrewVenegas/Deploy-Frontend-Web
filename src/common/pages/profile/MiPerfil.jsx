import UserWelcome from "../../../profile antiguo/UserWelcome";
import LogoutButton from "./Logout.jsx";
import React, {useContext, useState, useEffect} from "react";
import { AuthContext } from "../../../auth/AuthContext";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import './Miperfil.css';
import API_URL from "../../config.js";

// Hacer esta ruta protegida!
export default function MiPerfil() {
  const { token } = useContext(AuthContext);
  const {isPasajero, setIsPasajero} = useContext(AuthContext);
  const navigate = useNavigate();

  // Verificar si hay un token

  // Obtener el ID del usuario del payload del token
  const [pasajero, setPasajero] = useState({});
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const userId = tokenPayload.sub;
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    // Decodificar el token para obtener el ID del usuario
  
    // Realizar la solicitud HTTP para obtener la información del pasajero
    axios.get(`${API_URL}/pasajeros/${userId}`)
      .then((response) => {
        // Verificar si el componente aún está montado antes de actualizar el estado
        if (response.data) {
          
          setPasajero(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  
    // No es necesario devolver una función de limpieza vacía aquí
  }, []);

  const handleclickedit = () => {
    navigate("/editar-perfil");
  }
  const handleclickchofer = () => {
    navigate("/solicitud-chofer");
  }

  const handleClickVerAutos = () => {
    navigate("/mis-autos");
  }

  const handleEliminarCuenta = async() => { 
    let huboerror = false;
    try { const response = await axios.delete(`${API_URL}/pasajeros/${userId}`)}
    catch(error){
    console.log(error)
    huboerror = true;
    }

    if (!huboerror){
      navigate("/");
      logout();
    }
  }

  return (
    <>

    <div class="container mt-5">
    
    <div class="row d-flex justify-content-center">
        
        <div class="col-md-7">
            
            <div class="card p-3 py-4">
                
                <div class="text-center">
                    <div className="card-avatar mx-auto"></div>
                </div>
                
                <div class="text-center mt-3">
                    <h5 class="mt-2 mb-0">{pasajero.nombre}</h5>
                    <span>{pasajero.email}</span>
                    
                    <div class="px-4 mt-1">
                        <p class="fonts">Número de contacto: {pasajero.telefono} </p>
                    
                    </div>
                    
                    <ul class="social-list">
                        <li><i class="fa fa-facebook"></i></li>
                        <li><i class="fa fa-dribbble"></i></li>
                        <li><i class="fa fa-instagram"></i></li>
                        <li><i class="fa fa-linkedin"></i></li>
                        <li><i class="fa fa-google"></i></li>
                    </ul>
                    
                    <div class="buttons">
                        
                        <button className="btn btn-outline-primary px-4" onClick={handleclickedit}>Editar perfil</button>
                        {!isPasajero && !pasajero.es_conductor && <button className="btn btn-outline-primary px-4 ms-3" onClick = {handleclickchofer}>Convertirme en chofer </button>}
                        {isPasajero && <button className="btn btn-outline-primary px-4 ms-3" onClick={handleClickVerAutos}>Ver mis autos</button>}

                    </div>
                  
                    
                    
                </div>
                
               
                
                
            </div>
            
        </div>
        
    </div>
    <LogoutButton /> 
    <button onClick={handleEliminarCuenta} className="btn btn-dark" style={{ marginTop: '10px' , marginLeft: '10px'}}>
                Eliminar cuenta
    </button>

    
</div>
      
    </>

  )
}