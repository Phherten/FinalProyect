const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      urlRecuperar: "",
      plant: null,
      current_plant: null,
      seccion: [],
      modal: {
        estado: false,
        nombre: "",
        id: 0,
      },

      user_plants: [],

      token: "",

      permiso: false,
      usuario: "",

      busqueda: [],
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      setModal: (estado, nombre, id) => {
        setStore({
          modal: { estado: estado, nombre: nombre, id: id },
        });
      },

      resetBusqueda: () => {
        setStore({ busqueda: [] });
      },
      adduser: (username, second_name, email, password) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          username: username,
          second_name: second_name,
          email: email,
          password: password,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/registro", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      },

      loguser: (email, password) => {
        const store = getStore();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          email: email,
          password: password,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/login", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result.token);
            setStore({ token: result.token });
            sessionStorage.setItem("token", result.token);
          })
          .then(() => console.log(store.token))
          // .then((data) => console.log(data))
          // .then((data) => setStore({ token: data }))
          // .then(console.log(store.token))
          .catch((error) => console.log("error", error));
      },

      sendTelegram: () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          msg: "Ore riega el Poto de Maca",
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(
          process.env.BACKEND_URL + "/api/notificacion_telegram",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      },

      logout: () => {
        sessionStorage.removeItem("token");
      },

      reset: (mail) => {
        fetch(process.env.BACKEND_URL + "/api/recuperar/" + mail)
          .then((response) => response.text())
          .then((result) => {
            localStorage.setItem("recuperar", result);
          })
          .catch((error) => console.log("error", error));
      },
      resetPass: (pass) => {
        const localToken = JSON.parse(localStorage.getItem("recuperar"));
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localToken.token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          password: pass,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/changePassword/", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      },

      privado: () => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/privada", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setStore({ permiso: result.permiso });
            setStore({ usuario: result.email });
          })
          .catch((error) => console.log("error", error));
      },

      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: (seccion) => {
        // fetching data from the backend
        fetch(process.env.BACKEND_URL + "/api/" + seccion)
          .then((resp) => resp.json())
          .then((data) => setStore({ seccion: data }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
      },

      addPlantUser: (planta, alias) => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          info_plant_id: planta,
          alias: alias,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/plant/save/", requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      },

      getPlantById: (id) => {
        fetch(process.env.BACKEND_URL + `/api/plants/${id}`)
          .then((resp) => resp.json())
          .then((data) => setStore({ plant: data }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
      },

      deletePlantById: (id) => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          plant_id: id,
        });

        var requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          body: raw,
        };

        fetch(process.env.BACKEND_URL + `/api/plant/delete`, requestOptions)
          .then((resp) => resp.text())
          .catch((error) => console.log("Error", error));
      },

      getInfoPlantByNombreParcial: (nombre_parcial) => {
        fetch(
          process.env.BACKEND_URL +
            `/api/search?nombre_parcial=${nombre_parcial}`
        )
          .then((response) => response.json())
          .then((result) => setStore({ busqueda: result }))
          .catch((error) => console.log("error", error));
      },

      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },

      getPlantsUser: () => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/user_plants", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setStore({ user_plants: result });
          })
          .catch((error) => console.log("error", error));
      },

      updatePlantAlias: (alias, plant_id) => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          plant_id: plant_id,
          alias: alias,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/plant/edit/", requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      },
    },
  };
};

export default getState;
