const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      plant: null,
      current_plant: null,
      seccion: [],

      token: "",

      permiso: false,
      usuario: "",

      busqueda: [],
      message: null,
      user_plants: [],
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

      logout: () => {
        sessionStorage.removeItem("token");
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
            setStore({ user_plants: result });
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

      getPlantById: (id) => {
        fetch(process.env.BACKEND_URL + `/api/plants/${id}`)
          .then((resp) => resp.json())
          .then((data) => setStore({ plant: data }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
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

      addPlant: (info_plant_id, alias) => {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          info_plant_id: info_plant_id,
          alias: alias,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(process.env.BACKEND_URL + "/api/plant/save", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          })
          .catch((error) => console.log("error", error));
      },
    },
  };
};

export default getState;
