import { AuthContext } from "../../../auth/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useState, useEffect} from "react";
import axios from "axios";
import './Viaje.css';
import API_URL from "../../config";

export default function Viaje() {

    const { token } = useContext(AuthContext);
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userId = tokenPayload.sub;
    const { isPasajero } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [msg, setMsg] = useState();
    const [viajeEscogido, setViajeEscogido] = useState();
    const [fechaLegible, setFechaLegible] = useState("");


    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect(() => {
        console.log(isPasajero)
        console.log("get axios")
        axios.get(`${API_URL}/viajes/${id}`, config)
        .then( (response) => {
            if (response.data) {
                setViajeEscogido(response.data);
                const fecha = new Date(response.data.horario_salida);
                const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
                setFechaLegible(fecha.toLocaleDateString('es-ES', opciones));
            }
        } ).catch((error) => {
            console.log("error en el getviaje")
            console.log(error.data);
            setMsg("Debes ser pasajero para ver turnos")
            console.log(error);
        })
    }, [id]);



    // const handleClickInscribirme = () => {
    //     navigate("/pagina-principal-pasajero");
    // }

    const handleClickVolver = () => {
        navigate(`/pagina-principal-pasajero`);
    }

    return (
        <div>
            {!isPasajero && viajeEscogido && (
            <div>
            <div class="container mt-5">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-7">
                        <div class="card p-3 py-4">
                            <div class="text-center">
                                <div className="card-avatar mx-auto"></div>
                            </div>
                            <div class="text-center mt-3">
                                <h5 class="mt-2 mb-0">Viaje a {viajeEscogido.destino}</h5>
                                <div class="px-4 mt-1">
                                    <p class="fonts">Desde {viajeEscogido.origen} </p>
                                    <p class="fonts">Cupos disponibles: {viajeEscogido.vacantes_disponibles} </p>
                                    <p class="fonts">Hora de salida: {fechaLegible} </p>
                                </div>
                                <div class="buttons">
                                    <button class="btn btn-outline-primary px-4" >Inscribirme</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={ handleClickVolver } className="btn btn-dark" style={{ marginTop: '10px' , marginLeft: '10px'}}>
                Volver
            </button> 
            </div>
            )}
        </div>
    )

}