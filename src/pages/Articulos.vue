<template>
  <v-data-table
    :headers="headers"
    :items="articulos"
    sort-by="calories"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <!-- <v-btn @click="crearPdf()" color="#29B6F6">
          <v-icon> mdi-printer-settings </v-icon>
        </v-btn> -->
        <hr />
        <v-toolbar-title>Articulos</v-toolbar-title>
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
        <v-btn
          color="light-blue lighten-2"
          @click="abrirModal()"
          dark
          class="mb-2"
        >
          Nuevo Articulo
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template> </template>
          <v-card>
            <v-card-title>
              <span color="light-blue lighten-2" class="text-h5">{{
                formTitle
              }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="editedItem.codigo"
                      label="Codigo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-select
                      v-model="editedItem.categoria"
                      :items="itemCategorias"
                      label="Categoria"
                      required
                      @change="ver()"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="editedItem.stock"
                      type="Number"
                      label="Stock"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="editedItem.impuesto"
                      type="Number"
                      label="Impuesto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="editedItem.precioVenta"
                      label="Precio Venta"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="editedItem.descripcion"
                      label="Descripcion"
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
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon class="mr-2" @click="editItem(item)">
        mdi-window-maximize
      </v-icon>
      <!-- <v-icon @click="deleteItem(item)"> mdi-delete </v-icon> -->
      <v-icon @click="activ(item)">
        {{ item.estado === 1 ? "mdi-cancel " : "mdi-check" }}
      </v-icon>
    </template>

    <template v-slot:[`item.estado`]="{ item }">
      <span v-bind:class="[item.estado === 1 ? 'primary--text ' : 'red--text']">
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
    search: "",
    nombre: "",
    codigo: "",
    categorias: "",
    stock: "",
    precioVenta: "",
    descripcion: "",
    impuesto: "",
    abrir: false,
    id: "",
    estado: null,
    b: null, // el estado de guardar y editar
    itemCategorias: [],
    nombreCategorias: [],
    encabezadoFactura: [],
    select: [],
    headers: [
      { text: "Codigo", value: "codigo" },
      { text: "Nombre", value: "nombre" },
      { text: "Categoria", value: "categoria.nombre" },
      { text: "Stock", value: "stock" },
      { text: "Precio Venta", value: "precioVenta" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Impuesto", value: "impuesto" },
      { text: "Estado", value: "estado" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    articulos: [],
    editedIndex: -1,
    editedItem: {
      codigo: "",
      nombre: "",
      categoria: "",
      stock: "",
      precioVenta: "",
      descripcion: "",
      impuesto: "",
      fecha: "",
      estado: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Articulo" : "Editar articulo";
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
    this.traerArticulos();
    this.traerCategorias();
  },

  methods: {
    abrirModal() {
      this.dialog = true;
      this.b = 1;
    },
    ver() {
      this.categoria = this.itemCategorias;
      console.log(this.itemCategorias);
    },

    activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal
          .fire({
            title: "¿esta seguro, quiere desactivar este articulo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Desactivar!",
            confirmButtonColor: "#4FC3F7",
            cancelButtonText: "Cancelar!",
            cancelButtonColor: "#E57373",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              let header = { headers: { "x-token": this.$store.state.token } };
              axios
                .put(
                  `articulo/desactivar/${this.id}`,
                  {
                    estado: 0,
                  },
                  header
                )
                .then((response) => {
                  console.log(response);

                  this.traerArticulos();
                  this.traerCategorias();
                  this.$swal.fire({
                    posicion: "center",
                    text: "¡ Desactivaste este articulo¡",
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
          });
      } else if (this.estado === 0) {
        this.$swal.fire({
            text: "¿estas seguro de activar este Articulo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Activar!",
            confirmButtonColor: "#4FC3F7",
            cancelButtonText: "Cancelar!",
            cancelButtonColor: "#E57373",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              let header = { headers: { "x-token": this.$store.state.token } };
              axios
                .put(
                  `articulo/activar/${this.id}`,
                  {
                    estado: 1,
                  },
                  header
                )
                .then((response) => {
                  console.log(response);
                  this.traerArticulos();
                  this.traerCategorias();
                  this.$swal.fire({
                    posicion: "center",
                    text: "!Activaste este articulo¡",
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
          });
      }
    },
    traerArticulos() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("articulo", header)
        .then((response) => {
          this.articulos = response.data.articulo;
          console.log(response);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    traerCategorias() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("categoria", header)
        .then((response) => {
          //this.nombreCategorias = response.data.categoria;

          console.log(response.data.categoria);
          response.data.categoria.map((x) => {
            this.itemCategorias.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch((error) => {
          console.log(error.response);
          console.log(this.itemCategoria);
        });
    },

   /*  crearPdf() {
      let columnas = [
        { title: "Nombre", dataKey: "nombre" },
        { title: "Codigo", dataKey: "codigo" },
        { title: "Categoria", dataKey:"categoria" },
        { title: "stock", dataKey: "stock" },
        { title: "Precio Venta", datakey:"precioVenta" },
      ];
      let filas = [];
      this.articulos.forEach(function (x) {
        filas.push({
          nombre: x.nombre,
          codigo: x.codigo,
          categoria: x.categoria,
          stock: x.stock,
          precioVenta: x.precioVenta,
        });
      });
      const doc = new jsPDF("p", "pt");
      doc.autoTable(columnas, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Lista de datos", 40, 30);
        },
      });
      doc.save("articulos.pdf");
    }, */

    editItem(item) {
      this.dialog = true;
      this.b = 2;
      this.id = item._id;
      console.log(this.b);
      this.editedItem.codigo = item.codigo;
      this.editedItem.nombre = item.nombre;
      this.editedItem.categoria = item.categoria._id;
      this.editedItem.stock = item.stock;
      this.editedItem.precioVenta = item.precioVenta;
      this.editedItem.descripcion = item.descripcion;
      this.editedItem.impuesto = item.impuesto;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
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
    guardar() {
      console.log("hola" + this.b);
      let header = { headers: { "x-token": this.$store.state.token } };
      if (this.b === 1) {
        axios
          .post(
            "articulo",
            {
              codigo: this.editedItem.codigo,
              nombre: this.editedItem.nombre,
              categoria: this.editedItem.categoria,
              descripcion: this.editedItem.descripcion,
              impuesto: this.editedItem.impuesto,
              stock: this.editedItem.stock,
              precioVenta: this.editedItem.precioVenta,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.traerArticulos();
            this.traerCategorias();
            this.dialog = false;
            this.$swal.fire({
              position: "center",
              icon: "success",
              text: "!El articulo se guardo exitosamente¡",
              textColor: "#4FC3F7",
              showConfirmButton: false,
              timer: 1500,
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

            //se puede agregar directamente el error o asigarnlo a una variable para mejor legibildiad
          });
      } else if (this.b === 2) {
        let header = { headers: { "x-token": this.$store.state.token } };
        axios
          .put(
            "articulo/" + this.id,
            {
              codigo: this.editedItem.codigo,
              nombre: this.editedItem.nombre,
              categoria: this.editedItem.categoria,
              impuesto: this.editedItem.impuesto,
              descripcion: this.editedItem.descripcion,
              stock: this.editedItem.stock,
              precioVenta: this.editedItem.precioVenta,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.$swal.fire({
              position: "center",
              icon: "success",
              text: "!El articulo se edito exitosamente¡",
              textColor: "#4FC3F7",
              showConfirmButton: false,
              timer: 1500,
            });
            this.traerArticulos();
            this.close();
          })
          .catch((error) => {
            console.log(error.response.data);
            this.$swal.fire({
              position: "center",
              icon: "warning",
              text: `${error.response.data.errors.msg}`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    },
  },
};
</script>
