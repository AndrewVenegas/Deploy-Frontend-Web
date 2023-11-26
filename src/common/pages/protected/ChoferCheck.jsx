// Este componente chequea que el usuario sea realmente un pasajero
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../auth/AuthContext.jsx";
import CreateTurno from "../chofer main page/CreateTurno.jsx";
import API_URL from "../../config.js";

function ChoferCheck(){
    const {token} = useContext(AuthContext);
    const [msg, setMsg] = useState("");
    const [eschofer, setEschofer] = useState(false);


    const config = {
        'method': 'get',
        'url': `${API_URL}/pagina-chofer-protegida/pagina-principal-chofer`,
        'headers': {
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect (() => {
        axios(config)
        .then((response) => {
            console.log("Enviaste un token bueno y estás logeado");
            console.log(response);
            console.log("El mensaje es: " + response.data.message)
            setMsg(response.data.message);
            setEschofer(true);
        })
        .catch((error) => {
            console.log("Hubo un error, no estás logeado o el token expiró");
            console.log(error);
            setMsg("Error de acceso, debes ser chofer para acceder a esta página");
            console.log(error.message);
        })
    }, [])
    return (<>
        <h1>{msg}</h1>
        {eschofer && (
                 <CreateTurno /> 
            )}
        </>
    )
}    

export default ChoferCheck;