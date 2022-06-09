<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="registe"
      :items-per-page="15"
      class="elevation-1 pa-2 ma-2"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            >Usuarios</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn 
          @click="abrirModal()" 
           color="light-blue lighten-2"  
          class="mb-2 black--text">
            Nuevo Registro
          </v-btn>
          <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline font-weight-black blue--text">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="cat">  
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6" >
                        <v-text-field
                          color=" primary lighten-1 white--text"
                          v-model="editedItem.nombre"
                          label="Nombre"
                       
                        ></v-text-field>
                      </v-col>

                      
                        <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          color=" primary lighten-1 white--text"
                          v-model="editedItem.email"
                          label="Email"
                          
                        ></v-text-field>
                      </v-col>
                        <v-col cols="12" sm="6" md="6">
                        <v-select
                          color=" primary lighten-1 white--text"
                          v-model="editedItem.rol"
                          label="Rol"
                          :items="tipoRol"
                        ></v-select>
                      </v-col>
                        <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          color=" primary lighten-1 white--text"
                          v-model="editedItem.password"
                          type="password"
                          label="Password"
                          
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="light-blue lighten-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="light-blue lighten-1" text @click="guardar()"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" width="550px">
            <v-card color="light-blue lighten-1">
              <v-card-title class="white--text text-h5">{{
                dialogText
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="light-blue lighten-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >

              </v-card-actions>
            </v-card>
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
  </div>
</template>
<script>

import axios from "axios";
export default {
  data: () => ({
    //variable id, estado me capturan el valor para poder trabajar con ellas
    id: "",
    estado: null,
    //variable b para alternar entre guardar y editar
    b: null,
    error: "",
    dialog: false,
    password:"",
    encabezado: [],
    tipoRol:["admin", "vendedor", "almacenista"],
    dialogDelete: false,
    dialogText: "",
    headers: [
      { text: "Estado", value: "estado", },
      {text: "Nombre", value: "nombre"},
      {text: "Email", value: "email"},
      {text: "Rol", value: "rol"},
      {text: "Opciones", value: "actions", sortable: false},
    ],
    registe: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      email: "",
      rol:"",
      password:"",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Editar Registro";
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
    this.traerLogin();
   
  },

  methods: {

     activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal.fire({
        text: "¿Esta seguro , quiere desactivar este Usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Desactivar!",
        confirmButtonColor: "#4FC3F7",
        cancelButtonText: "Cancelar!",
        cancelButtonColor: "#E57373",
        reverseButtons: true,

      }).then((result)=>{
        if(result.isConfirmed){
     
        axios
          .put(`register/desactivar/${this.id}`, {
          
            estado: 0,
          }
          )
          .then((response) => {
            console.log(response);
            this.traerLogin();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Desactivaste este Usuario! ",
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
        text: "¿Esta seguro de activar este Usuario?",
        icon: "warning",
        showCancelButton: true,
         confirmButtonText: "Activar!",
        confirmButtonColor: "#4FC3F7",
        cancelButtonText: "Cancelar!",
        cancelButtonColor: "#E57373",
        reverseButtons: true,
         }).then((result)=>{

           if(result.isConfirmed){
          axios
           .put(`register/activar/${this.id}`, {
            estado: 1,
          })
          .then((response) => {
            console.log(response);
            this.traerLogin();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Activaste este usuario! ",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          })
          .catch((error) => {
            console.log(error.response);
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


    abrirModal() {
      this.dialog = true;
      this.b = 1;
      
    },
    
    traerLogin() { 
      axios
        .get("register")
        .then((response) => {
         this.registe=response.data.login
          console.log(response.data.login);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    editItem(item) {
      this.b = 2;
      this.editedIndex = this.registe.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.id = item._id;
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
        this.editedItem = Object.assign({});
        this.editedIndex = -1;
      });
    },

    guardar() {
    
      if (this.b === 1) {
          axios
            .post("register", {
              nombre: this.editedItem.nombre,
              rol: this.editedItem.rol,
              password: this.editedItem.password,
              email: this.editedItem.email,
              estado: 1,
            })
            .then((response) => {
              console.log(response);
              this.traer();
              this.close();
            })
            .catch((error) => {
              console.log(error.response.data.errors[0].msg);


              
            });
        
      }
      if (this.b === 2) {
       
          axios
            .put("register/" + this.id, {
              nombre: this.editedItem.nombre,
              rol: this.editedItem.rol,
              password: this.editedItem.password,
              email: this.editedItem.email,
              
            })
            .then((response) => {
              console.log(response);
              this.traer();
              this.close();

              
            })
            .catch((error) => {
              console.log(error);
             
            });
        }
      
     
    },
  },
};
</script>
<style scoped>
</style>