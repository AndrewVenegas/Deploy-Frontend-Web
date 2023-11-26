import './EditVehiclePage.css';
import React, {useContext, useState, useEffect} from "react";
import { AuthContext } from "../../../../auth/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom"
import API_URL from '../../../config';

export default function EditVehiclePage() {

    const { token } = useContext(AuthContext);
    const [msg, setMsg] = useState("");
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userId = tokenPayload.sub;
    const {isPasajero} = useContext(AuthContext); 
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputName, setInputName] = useState("");
    const [inputColor, setInputColor] = useState("");
    const [autoActualizado, setAutoActualizado] = useState("");


    const handleClickPut = async (event) => {
        event.preventDefault();
        
        const infoAuto = {    
            nombre: inputName, 
            color: inputColor
        };
        try {
            const response = await axios.put(`${API_URL}/vehiculos/${id}`, 
            infoAuto, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            console.log(response);
            setMsg(` ${inputName} actualizado.`);
            setAutoActualizado(true);
            
        } catch(error){
            console.log(error)
            console.log('hubo un error')
            setMsg("Hubo un error al actualizar el auto.");
        }}

    return (
        <div>
            <div className="sign up template d-flex justify-content-center align-items-center vh-100">
                <div className="form_container p-5 rounded shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                    <form onSubmit={handleClickPut}>  
                        {!autoActualizado &&              
                        <div>
                            <h3 className="text-center">Editar auto</h3>
                            <div className="mb-2">
                                <label htmlFor = "nombre">Alias</label>
                                <input 
                                type= 'nombre' 
                                className="form-control"
                                value={inputName}
                                onChange={(event) => setInputName(event.target.value)}
                                required/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor = "nombre">Color</label>
                                <input 
                                type= 'nombre' 
                                className="form-control"
                                value={inputColor}
                                onChange={(event) => setInputColor(event.target.value)}
                                required/>
                            </div>
                            <div className="d-grid">
                                <div class="buttons">
                                    <button className="btn btn-outline-primary px-4">Actualizar datos</button>
                                </div>
                            </div>
                        </div>}
                    <div> 
                        {msg && <h2 className="errormsj">{msg}</h2>}
                    </div>
                    <div></div>
                    {autoActualizado && <div class="buttons">
                    <Link to="/mis-autos/"  className="btn btn-outline-primary px-4">Mis autos</Link> </div>}
                    </form>
                </div>
            </div>
        </div>
    )
}