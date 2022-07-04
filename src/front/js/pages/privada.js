import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { CardColeccion } from "../component/cardColeccion";
import "../../styles/home.css";
import { HomeMediaPage } from "../component/homeMediaPage";
import { Header } from "../component/header";
import { Link } from "react-router-dom";
import useScript from "react-script-hook";

export const Privada = () => {
  const { store, actions } = useContext(Context);

  const [shouldRefresh, setShouldRefresh] = useState(false);

  const [load, setLoad] = useState(false);

  useScript({
    src: "https://accounts.google.com/gsi/client",
    onload: () => console.log("GSI loaded!"),
  });

  useScript({
    src: "https://apis.google.com/js/api.js",
    onload: () => console.log("GAPI loaded!"),
  });

  useScript({
    src: "https://apis.google.com/js/platform.js",
    onload: () => console.log("Platform loaded!"),
  });

  useScript({
    src: "https://apis.google.com/js/client.js",
    onload: () => console.log("Client loaded!"),
  });

  useEffect(() => {
    setTimeout(() => {
      actions.privado();
      actions.getPlantsUser();
      setLoad(true);
    }, 3000);
  }, []);

  useEffect(() => {
    actions.getPlantsUser();
  }, [shouldRefresh]);

  const callbackDelete = () => {
    setShouldRefresh(!shouldRefresh);
  };

  const calculateDays = (plant) => {
    let summerMonths = [4, 5, 6, 7, 8, 9];

    let date = new Date();
    let mesActual = date.getMonth() + 1;
    let periodo;
    if (summerMonths.includes(mesActual)) {
      periodo = plant.info_plant.periodo_verano;
    } else {
      periodo = plant.info_plant.periodo_invierno;
    }

    let registro = new Date(plant.fecha_registro);
    let diasRestantes = Math.abs(registro - date);
    let dias = Math.round(diasRestantes / (1000 * 3600 * 24));
    return periodo - (dias % periodo);
  };

  return (
    <div style={{ minHeight: "800px" }}>
      <div className="container d-flex mb-xs-1 mb-5 mt-4 ">
        <div className="row d-flex justify-content-center">
          {store.permiso ? (
            <>
              <h1>{`Mis plantas`}</h1>
              {store.user_plants.length === 0 ? (
                <Link to={"/"}>Haz click para agregar una planta</Link>
              ) : (
                <></>
              )}
              {store.user_plants.map((plant, index) => {
                let dias_por_regar = calculateDays(plant);

                return (
                  <CardColeccion
                    name={plant.info_plant.nombre_comun}
                    alias={plant.alias}
                    id={plant.info_plant.id}
                    plant_id={plant.id}
                    i={index}
                    img={plant.info_plant.imagen}
                    dias_por_regar={dias_por_regar}
                    callback={callbackDelete}
                  />
                );
              })}
            </>
          ) : load ? (
            "404 la página no existe"
          ) : (
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
