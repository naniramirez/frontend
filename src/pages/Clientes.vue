<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="15"
      class="elevation-1 mb-12"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
          color="#4FC3F7"
             >Clientes
            </v-toolbar-title
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-icon  @click="crearPDF()" color="#29B6F6">mdi-printer</v-icon>
          <v-spacer></v-spacer>
          <v-btn @click="abrirModal()"
           color="light-blue lighten-2" 
           dark 
           class="mb-2 black--text">
            <h4>Nuevo Cliente</h4>
            
          </v-btn>
          <v-dialog v-model="dialog" max-width="900px" persistent>
            <v-card>
              <v-card-title>
                <span >
                  <h4 class="headline font-weight-black blue--text">{{ formTitle }}</h4></span>
              </v-card-title>

              <v-card-text>
                <v-form ref="cat">
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.tipoPersona"
                          label="Tipo Persona"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          color="primary white--text"
                          v-model="editedItem.tipoDocumento"
                          label="Tipo Documento"
                          :items="tiposDeDocumentos"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.numDocumento"
                          label="Numero de Documento"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.direccion"
                          label="Direccion"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.telefono"
                          label="Telefono"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          color="primary white--text"
                          v-model="editedItem.email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="light-blue lighten-1" text @click="close"> Cancelar </v-btn>
                <v-btn color="light-blue lighten-1" text @click="Guardar"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="520px">
            <v-card color="primary">
              <v-card-title class="white--text text-h5">{{
                dialogText
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
               

                <v-spacer></v-spacer>
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
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
export default {
  data: () => ({
    
    id: "",
    estado: null,
    //variable b para alternar entre guardar y editar
    b: null,
    error: "",
    dialog: false,
    encabezado: [],
    tiposDeDocumentos:[
      "Cédula de Ciudadanía",
      "Cédula extranjera",
      "Pasaporte",
    ],
    rules: [
      (value) => !!value || "Requerido",
      (value) => (value && value.trim().length >= 1) || "Minimo 1 caracteres",
    ],
    dialogDelete: false,
    dialogText: "",
    headers: [
      {text: "Estado", value: "estado"},
      {text: "Nombre", align: "start", sortable: false, value: "nombre"},
      {text: "Tipo Persona", value: "tipoPersona",},
      {text: "Tipo Documento",value: "tipoDocumento"},
      {text: "Número de Documento", value: "numDocumento"},
      {text: "Direccion", value: "direccion",},
      {text: "Telefono", value: "telefono"},
      {text: "Email", value: "email",},
      {text: "Opciones", value: "actions",sortable: false,},
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      tipoPersona: "",
      tipoDocumento: "",
      numDocumento: "",
      email: "",
      direccion: "",
      telefono: "",
      estado: "",
    },
    defaultItem: {
      nombre: "",
      tipoPersona: "",
      tipoDocumento: "",
      numDocumento: "",
      email: "",
      direccion: "",
      telefono: "",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Editar Cliente";
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
    this.traer();
  },

  methods: {
    abrirModal() {
      this.dialog = true;
      this.b = 1;
      console.log(this.b);
    },
    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };

      axios
        .get("cliente", header)
        .then((response) => {
          this.desserts = response.data.cliente;
          console.log(response.data.cliente);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    crearPDF() {
      const columns = [
        { title: "Estado", dataKey: "estado" },
        { title: "Nombre", dataKey: "nombre" },
        { title: "Tipo Persona", dataKey: "tipoPersona" },
        { title: "Tipo Documento", dataKey: "tipoDocumento" },
        { title: "Numero documento", dataKey: "numDocumento" },
        { title: "Email", dataKey: "email" },
        { title: "Direccion", dataKey: "direccion" },
        { title: "Telefono", dataKey: "telefono" },
      ];
    

      const filas = [];
      this.desserts.forEach(function (x) {
        filas.push({
          nombre: x.nombre,
          tipoPersona: x.tipoPersona,
          tipoDocumento: x.tipoDocumento,
          numDocumento: x.numDocumento,
          email: x.email,
          direccion: x.direccion,
          telefono: x.telefono,
          estado: x.estado,
        });
      });
      const doc = new jsPDF("p", "pt");
      doc.autoTable(columns, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Lista de clientes", 40, 30);
        },
      });
      doc.save("cliente.pdf");
    },

    editItem(item) {
      this.b = 2;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.id = item._id;
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
          .put(`cliente/desactivar/${this.id}`, {
          
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
            timer: 2000,
          });
            
          })
          .catch((error) => {
            console.log(error);
          });

        }

      })
       
      } else if(this.estado===0){
         this.$swal.fire({
          title: "¿Esta seguro de activar esta Cliente?",
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
           .put(`cliente/activar/${this.id}`, {
            estado: 1,
          }, header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Activaste este Cliente! ",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          })
          .catch((error) => {
            console.log(error);
          });

           }

         })
       
      }
    },

    close() {
      this.dialog = false;
      this.$refs.cat.resetValidation();
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

    Guardar() {
      let header = { headers: { "x-token": this.$store.state.token } };

      if (this.b === 1) {
        axios
          .post(
            "cliente",
            {
              nombre: this.editedItem.nombre,
              tipoPersona: this.editedItem.tipoPersona,
              tipoDocumento: this.editedItem.tipoDocumento,
              numDocumento: this.editedItem.numDocumento,
              telefono: this.editedItem.telefono,
              email: this.editedItem.email,
              direccion: this.editedItem.direccion,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.$swal.fire({
              position: "center",
              icon: "success",
              text: "El cliente ha sido registrado con exito",
              textColor: "#4FC3F7",
              showConfirmButton: false,
              timer: 1500,
            });
            this.traer();
            this.close();
          })
          .catch((error) => {
            console.log(error.response.data.errors[0].msg);
            this.$swal({
              position: "center",
              icon: "warning",
              text: `${error.response.data.errors[0].msg}`,
              textColor:"#E57373",
              showConfirmButton: false,
              timer: 1500,
            })
      
          });
      }
      if (this.b === 2) {
        axios
          .put(
            "cliente/" + this.id,
            {
              nombre: this.editedItem.nombre,
              tipoPersona: this.editedItem.tipoPersona,
              tipoDocumento: this.editedItem.tipoDocumento,
              numDocumento: this.editedItem.numDocumento,
              telefono: this.editedItem.telefono,
              email: this.editedItem.email,
              direccion: this.editedItem.direccion,
            },
            header
          )
          .then((response) => {
            console.log(response);
              this.$swal.fire({
              position: "center",
              icon: "success",
              text: "!Su registro ah sido editado exitosamente!",
              showConfirmButton: false,
              timer: 2000,
            });
            this.traer();
            this.close();
          })
          .catch((error) => {
            console.log(error);
              this.$swal.fire({
              position: "center",
              icon: "warning",
              text: `${error.response.data.errors[0].msg}`,
               textcolor:"#4FC3F7",
              showConfirmButton: false,
              timer: 1000,
            });
            

            
          });
      }
    },
  },
};
</script>
<style scoped>
</style>