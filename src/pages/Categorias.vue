<template>
  <v-data-table
    :headers="headers"
    :items="categorias"
    sort-by="calories"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          <h4>Categorias</h4>
          </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            class="pa-md-4 mx-lg-auto"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>

        <v-btn color="#4FC3F7"
        class="black--text"
         @click="abrirModal()" 
         dark>
          Nuevo registro
        </v-btn>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title >
              <span class="text--light-blue lighten-2" color="light-blue lighten-2">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="nombre del producto"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.descripcion"
                      label="Descripcion"
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="light-blue lighten-2" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="light-blue lighten-2" text @click="guardar()">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card> </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-window-maximize</v-icon>
      <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
      <v-icon @click="activ(item)" >
        {{ item.estado === 1 ? "mdi-cancel " : "mdi-check" }}
        
      </v-icon>
    </template>

   <template v-slot:[`item.estado`]="{ item }">
      <span
        v-bind:class="[item.estado === 1 ? 'primary--text ' : 'red--text']"
      >
        {{ item.estado === 1 ? "Activo" : "Inactivo" }}</span
      >
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    estado: "",
    db: null, // el estado de guardar y editar
    id: "",
    search: "",
    nombre: "",
    error:null,
    /* nombreRules: [
      (v) => !!v || "El nombre es requerido",
      //v) => v.lenght <= 10 || "El nombre no puede ser mayor a 10 caracteres",
    ],
    descripcion: "",
    descripcionRules: [
      (v) => !!v || "La descripcion es requerido",
      //(v) => (v && v.trim() >= 6) || "Minimo 6 caracteres",
    ], */

    headers: [
      { text: "Actions", value: "actions", sortable: false },
      { text: "Nombre", value: "nombre" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Estado", value: "estado" },
    ],
    categorias: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      descripcion: "",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar producto";
    },

  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    //this.initialize();
    this.traer();
  },

  methods: {
    abrirModal() {
      this.dialog = true;
      this.db = 1;
    },

    activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal.fire({
        text: "¿Esta seguro , quiere desactivar esta categoria?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Desactivar!",
        confirmButtonColor: "#4FC3F7",
        cancelButtonText: "Cancelar!",
        cancelButtonColor: "#E57373",
        reverseButtons: true,

      }).then((result)=>{
        if(result.isConfirmed){
           let header ={headers:{"x-token":this.$store.state.token}}
        axios
          .put(`categoria/desactivar/${this.id}`, {
          
            estado: 0,
          },
          header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Desactivaste esta categoria! ",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
            
          })
          .catch((error) => {
            console.log(error);
          });

        }

      })
       
      } else if(this.estado===0){
         this.$swal.fire({
        text: "¿Esta seguro de activar esta categoria?",
        icon: "warning",
        showCancelButton: true,
         confirmButtonText: "Activar!",
        confirmButtonColor: "#4FC3F7",
        cancelButtonText: "Cancelar!",
        cancelButtonColor: "#E57373",
        reverseButtons: true,
         }).then((result)=>{

           if(result.isConfirmed){
          let header ={headers:{"x-token":this.$store.state.token}}
          axios
           .put(`categoria/activar/${this.id}`, {
            estado: 1,
          }, header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Activaste esta categoria! ",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
                    position: "center",
                    icon: "warning",
                    text: `${error.response.data.errors[0].msg}`,
                    showConfirmButton: false,
                    timer: 1500,
                  });
          });

           }

         })
       
      }
    },

    traer() {
     
     let header ={headers:{"x-token":this.$store.state.token}}
      axios
        .get("categoria", header)
        .then((response) => {
          this.categorias = response.data.categoria;
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    editItem(item) {
      this.dialog = true;
      this.db = 2;
      this.id = item._id;
      console.log(this.db);
      this.editedItem.nombre = item.nombre;
      this.editedItem.descripcion = item.descripcion;
    },
    guardar() {
      console.log("hola " + this.db);
      let header ={headers:{"x-token": this.$store.state.token}};
      if (this.db === 1 ) {
        axios
          .post("categoria", {
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion,
            estado: 1,
          },
          header
         )
          .then((response) => {
            console.log(response);
            this.traer();
            this.dialog = false;
            this.$swal.fire({
              position: "center",
              icon: "success",
              text: "La categoria se ha guardado con exito",
              textColor: "#4FC3F7",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
           console.log(error.response.data.errors[0].msg)
            this.$swal({
              position: "center",
              icon: "warning",
              text: `${error.response.data.errors[0].msg}`,
              textColor:"#E57373",
              showConfirmButton: false,
              timer: 1500,
            })
          });
      } else if (this.db === 2) {
        let header ={headers:{"x-token":this.$store.state.token}}
        axios
          .put("categoria/" + this.id, {
            nombre: this.editedItem.nombre,
            descripcion: this.editedItem.descripcion,
          },
          header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.dialog = false;
             this.$swal.fire({
              position: "center",
              icon: "success",
              text: "!La categoria se edito exitosamente!",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            console.log(error);
             this.$swal.fire({
              position: "center",
              icon: "warning",
              text: `${error.response.data.errors[0].msg}`,
              textColor:"#E57373",
              showConfirmButton: false,
              timer: 1500,
            })
            
          });
      }
    },


    deleteItemConfirm() {
      this.categorias.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    
  },
};
</script>