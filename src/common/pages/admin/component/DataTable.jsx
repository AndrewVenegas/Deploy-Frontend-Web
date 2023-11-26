
import React, {useContext, useState, useEffect} from "react";
import { AuthContext } from "../../../../auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import './DataTable.css';
import API_URL from "../../../config.js";



const DataTable = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const {token, setToken} = useContext(AuthContext);
    const [tableData, setTableData] = useState([]);

    const orderByStatus = (data) => {
      const order = { Pendiente: 1, Aceptado: 2, Rechazado: 3 };
    
      return data.sort((a, b) => {
        if (order[a.estado] < order[b.estado]) {
          return -1;
        } else if (order[a.estado] > order[b.estado]) {
          return 1;
        } else {
          return 0;
        }
      });
    };
    
    const config_get = {
        'method': 'get',
        'url': `${API_URL}/solicitud_chofer/all`,
        'headers': {
            'Authorization': `Bearer ${token}`
        }
      };

    
      const columns = [
        { field: 'id', headerName: 'ID', align: 'center', headerAlign: 'center'},
        { field: 'id_pasajero', headerName: 'N° PASAJERO', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'estado', headerName: 'ESTADO' , width: 150 },
        { field: 'rut', headerName: 'RUT', width: 150 },
        {
          field: 'actions',
          headerName: 'ACCIONES',
          width: 200,
          renderCell: (params) => {
            const { estado } = params.row;
            if (estado === 'Pendiente') {
              return (
                <div className="action">
                  <button
                    className="btn btn-outline-primary px-1"
                    onClick={() => handleAcceptClick(params.row.id, params.row.id_pasajero)}
                  >
                    Aceptar
                  </button>
      
                  <span style={{ margin: '0 5px' }}></span>
      
                  <button
                    className="btn btn-outline-danger px-1"
                    onClick={() => handleRejectClick(params.row.id, params.row.id_pasajero)}
                  >
                    Rechazar
                  </button>
                </div>
              );
            }
            // Si el estado no es 'Pendiente', no se renderizan los botones
            return null;
          },
        },
        { field: 'comentario', headerName: 'COMENTARIO', width: 600 },
      ];
    

        // HACEMOS MANEJO DE RECHAZO
        const handleRejectClick = (id, id_pasajero) => {

          const config_put = {
              'method': 'put',
              'url': `${API_URL}/solicitud_chofer/${id}`,
              'headers': {
                  'Authorization': `Bearer ${token}`
                  },
              'data': 
                  {
                      'estado': 'Rechazado'
                  },
            };
          
            const config_put_pasajero = {
              'method': 'put',
              'url': `${API_URL}/pasajeros/${id_pasajero}`,
              'headers': {
                  'Authorization': `Bearer ${token}`
                  },
              'data': 
                  {
                      'es_conductor': false
                  },
            };
      
            axios(config_put)
            .then((response) => {
              // console.log(response.data);
              console.log(`Solicitud con ID ${id} rechazada`);
        
              // Primera solicitud PUT exitosa, ahora actualizamos es_conductor del pasajero
              axios(config_put_pasajero)
                .then((response) => {
                  // console.log(response.data);
                  console.log(`Pasajero con ID ${id_pasajero} actualizado a pasajero`);
        
                  // Volvemos a cargar los datos en la tabla después de aceptar la solicitud
                  axios(config_get)
                    .then((response) => {
                      if (response.data) {
                        const sortedData = orderByStatus(response.data);
                        setTableData(sortedData);
                      }
                    })
                    .catch((error) => {
                      console.error('Hubo un error al obtener los datos:', error);
                      // Manejar el error si es necesario
                    });
                })
                .catch((error) => {
                  console.error('Hubo un error al obtener los datos:', error);
                  // Manejar el error si es necesario
                });
            })
            .catch((error) => {
              console.error(`Hubo un error al aceptar la solicitud con ID ${id}:`, error);
              // Manejar el error si es necesario
            });
        };


    // MANEJAMOS EL ACEPTAR
    const handleAcceptClick = (id, id_pasajero) => {

        const config_put = {
            'method': 'put',
            'url': `${API_URL}/solicitud_chofer/${id}`,
            'headers': {
                'Authorization': `Bearer ${token}`
                },
            'data': 
                {
                    'estado': 'Aceptado'
                },
          };
        
          const config_put_pasajero = {
            'method': 'put',
            'url': `${API_URL}/pasajeros/${id_pasajero}`,
            'headers': {
                'Authorization': `Bearer ${token}`
                },
            'data': 
                {
                    'es_conductor': true
                },
          };

          axios(config_put)
          .then((response) => {
            // console.log(response.data);
            console.log(`Solicitud con ID ${id} aceptada`);
      
            // Primera solicitud PUT exitosa, ahora actualizamos es_conductor del pasajero
            axios(config_put_pasajero)
              .then((response) => {
                // console.log(response.data);
                console.log(`Pasajero con ID ${id_pasajero} actualizado a conductor`);
      
                // Volvemos a cargar los datos en la tabla después de aceptar la solicitud
                axios(config_get)
                  .then((response) => {
                    if (response.data) {
                      const sortedData = orderByStatus(response.data);
                      setTableData(sortedData);
                    }
                  })
                  .catch((error) => {
                    console.error('Hubo un error al obtener los datos:', error);
                    // Manejar el error si es necesario
                  });
              })
              .catch((error) => {
                console.error('Hubo un error al obtener los datos:', error);
                // Manejar el error si es necesario
              });
          })
          .catch((error) => {
            console.error(`Hubo un error al aceptar la solicitud con ID ${id}:`, error);
            // Manejar el error si es necesario
          });
      };
        

// CARGAMOS LOS DATOS EN LA TABLA
    useEffect(() => {
        axios(config_get)
          .then((response) => {
            // Verificar si el componente aún está montado antes de actualizar el estado
            if (response.data) {
              // console.log(response.data);
              const sortedData = orderByStatus(response.data);
              setTableData(sortedData);
            }
          })
          .catch((error) => {
            console.error("Hubo un error al obtener los datos:", error);
            // Manejar el error si es necesario
          });
      }, []); 

    return (
        <div style={{height:600, width: '100%'}}>
            {/* <h2>DataTable</h2> */}
            <DataGrid 
            rows={tableData} 
            columns={columns} 
            pageSize={10}
            // checkboxSelection
             />
            
        </div>
    )
}

export default DataTable;
