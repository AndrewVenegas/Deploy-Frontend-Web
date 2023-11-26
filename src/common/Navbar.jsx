import { Link, useMatch, useResolvedPath , useNavigate} from "react-router-dom"
import { AuthContext } from "../auth/AuthContext"
import React, { useContext, useState, useEffect }  from "react";

export default function Navbar() {
    const {token, setToken} = useContext(AuthContext);
    const {isLoged, setIsLoged} = useContext(AuthContext);
    
    // const { token } = useContext(AuthContext);
    
    const {isAdmin, setIsAdmin} = useContext(AuthContext);
    const {isPasajero, setIsPasajero} = useContext(AuthContext); 
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    const toggleButton = () => {
        if (isPasajero) {
            if (currentPath === "/CheckChofer"){
                navigate("/pagina-principal-pasajero");
        }
        } else {
            if (currentPath=== "/pagina-principal-pasajero"){
            navigate("/CheckChofer");
        }
        }
    };

    const handleSwitchChange = () => {
        setIsPasajero(!isPasajero);
        toggleButton();
    };

    useEffect( () => {
        // El token se recupera como un string...

        if(token === "null" || token === null) {
            console.log("no tienes un token")
            setToken(null);
            setIsLoged(false);

        } else if (typeof token !== "undefined") {
            console.log(`Revisando token: ${token}`);
            console.log(token === null)
            const tokenPayload = JSON.parse(atob(token.split(".")[1]));
            
            console.log("Tienes un token");
            console.log(`Tu token es: ${token}`)
            const scopes = tokenPayload.scope;
            console.log(`tus scopes son: ${scopes}`);
        
            // Verificamos los scopes del token y establecemos las banderas correspondientes
            setIsLoged(true);
        
            if (scopes.includes("pasajero")) {
              setIsPasajero(true);
            } else {
              setIsPasajero(false);
            }
        
            if (scopes.includes("admin")) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
    }, []);

    return (
    <nav className="nav">
        {/* Aqui generaremos todos los menús */}
        {/* Los links o customlinks son los menús */}
        {/* <Link to="/" className="site-title"><img src="logo.png" /></Link> */}
        <Link to="/" className="site-title">TurnosUC</Link>
        <ul>
            {/* <CustomLink to="/path_que_mostrará">Nombre_visible_en_navbar</CustomLink> */}
            { token ? (
                !isPasajero ? (
                <CustomLink to="/pagina-principal-pasajero">Turnos</CustomLink>
                ) : ( 
                <CustomLink to="/CheckChofer">Turnos</CustomLink> )
            ) : (
                <span></span>
            )}
            
            <CustomLink to="/instrucciones">Instrucciones</CustomLink>
            <CustomLink to="/notificaciones">Notificaciones</CustomLink>

            {token ? (
                    <CustomLink to="/perfil">Mi Perfil</CustomLink>
                    
                ) : (
                    <CustomLink to="/login">Iniciar Sesión</CustomLink>
                )}
            {token && (
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={isPasajero}
                        onChange={handleSwitchChange}
                    />
                    <span className="slider"></span>
                </label>
            )}
        </ul>
        
    </nav>
    )
}

// La siguiente función es para ver si un link está activo o no (un menu)
function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true})
    return (
        <li className={isActive ? "active" : ""}>
            <Link to= {to} {...props}>
                {children}
            </Link>
        </li>
    )
}