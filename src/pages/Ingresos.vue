<template>
  <div>
    <!--mi tabla principal-->
    <v-data-table
      :headers="headers"
      :search="search"
      :items="ingreso"
      :items-per-page="20"
      class="elevation-1 pa-2 ma-2"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>INGRESO </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- <v-col>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              class="pa-md-4 mx-lg-auto"
            ></v-text-field>
          </v-col> -->
          <v-spacer></v-spacer>
          <!-- 
            modal nueva factura -->
          <v-btn
            color="#4FC3F7"
            dark
            class="pt-0 my-0"
            @click="nuevaFactura()"
            v-if="$store.state.rol == 'admin'"
          >
            Nuevo Ingreso
          </v-btn>
          <v-dialog persistent v-model="dialog" max-width="75%">
            <v-card>
              <v-card-title>
                <span class="headline font-weight-black blue--text">{{
                  formTitle
                }}</span>
                <v-divider class="mx-4" inset vertical></v-divider>
               <!--  <v-btn v-if="btnPDF === true" @click="alerta()">
                  <v-icon color="#29B6F6">mdi-printer </v-icon></v-btn
                > -->

                <v-spacer></v-spacer>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" :disabled="isDisabled">
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.tipoComprobante"
                          label="Tipo comprobante"
                          :items="itemtipoComprobante"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.serieComprobante"
                          label="Serie comprobante"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.numComprobante"
                          label="Numero comprobante"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.proveedor"
                          :items="itemProveedor"
                          label="Proveedor"
                          @change="ver()"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.impuesto"
                          label="Impuesto"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>

                  <v-btn
                    color="#29B6F6"
                    class="white--text"
                    v-if="btnAgregar === true"
                    @click="modalAgregar()"
                  >
                    Agregar Productos 
                  </v-btn>

                  <v-card-title>
                    <span class="text-h5">{{ titulo }}</span>
                    <v-spacer></v-spacer>
                  </v-card-title>

                  <v-spacer></v-spacer>

                  <!-- modal agregar productos a factura -->

                  <v-dialog
                    transition="dialog-top-transition"
                    width="70%"
                    persistent
                    v-model="btnModal"
                    style="min-height: 100vh"
                  >
                    <template v-slot:default="dialog">
                      <v-card>
                        <v-toolbar color="#29B6F6" dark
                          >Agregar productos</v-toolbar
                        >
                        <!-- tabla que muestra los productos que puedo agregar -->
                        <v-data-table
                          :headers="encabezado"
                          :items="articulos"
                          :items-per-page="10"
                          class="elevation-0"
                        >
                          <!-- EL BOTON DE SUMAR -->
                          <template v-slot:[`item.action`]="{ item }">
                            <v-icon 
                            v-if="item.estado==1"
                              small
                              class="mr-2"
                              @click="seleccionarArticulo(item)"
                            >
                              mdi-plus-circle
                            </v-icon>
                          </template>
                          <template v-slot:[`item.estado`]="{ item }">
                            <span
                              v-bind:class="[
                                item.estado === 1
                                  ? 'primary--text '
                                  : 'red--text',
                              ]"
                            >
                              {{ item.estado === 1 ? "Activo" : "Inactivo" }}
                            </span>
                          </template>
                        </v-data-table>

                        <v-card-actions class="justify-end">
                          <v-btn text @click="dialog.value = false"
                            >Close</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>

                  <!-- tabla de detalle de nueva factura -->
                  <v-card>
                    <v-card-title>
                      <v-toolbar
                        color="#29B6F6"
                        class="white--text"
                        flat
                        dense
                        width="100%"
                        elevation="10"
                        shaped
                        ><p
                          :class="{
                            'caption font-weight-black mx-auto mt-3':
                              $vuetify.breakpoint.xs,
                            'mx-auto mt-3 font-weight-medium':
                              $vuetify.breakpoint.smAndUp,
                          }"
                        >
                          Lista de Productos

                          <!-- class="mx-auto mt-3 font-weight-medium" -->
                        </p></v-toolbar
                      >
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="
                          show
                            ? encabezadoDescripcion
                            : encabezadoDescripcionSin
                        "
                        :items="detalles"
                        :items-per-page="15"
                        max-width="90%"
                        class="elevation-0 pt-0 my-2"
                        persistent
                      >
                        <template
                          v-if="textCantidad === true"
                          v-slot:[`item.cantidad`]="{ item }"
                        >
                          <v-text-field
                            type="number"
                            v-model="item.cantidad"
                            @change="onChange(item)"
                          >
                          </v-text-field>

                             </template>


                        <template v-slot:[`item.subtotal`]="{ item }">
                          {{ item.precio * item.cantidad }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }"
                          ><div v-show="textAcciones">
                            <v-icon
                              v-show="textAcciones"
                              @click="eliminarDetalles(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </div>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-container>
                 <v-container mt-12>
                    <h4>Total Parcial : {{totalParcial }}</h4>
                    <h4>Total Impuesto: {{impuestoTotal }}</h4>
                    <h4>Total: {{ subTotal}}</h4>
         
          </v-container>
              </v-card-text>

              <v-card-actions>
                <!--- AGREGAR PRODUCTOS--->
                <v-btn
                  color="#29B6F6"
                  v-if="btnCancelar == true"
                  text
                  @click="close"
                >
                  {{ btc }}
                </v-btn>

                <v-btn
                  color="#29B6F6"
                  text
                  v-if="btnGuardar == true"
                  @click="guardar()"
                >
                  Guardar </v-btn
                ><!--este es el boton de guardar factura-->
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="editItem(item)"> mdi-window-maximize </v-icon>
       <!--<v-icon @click="deleteItem(item)"> mdi-delete </v-icon>-->
         <!-- <v-icon  @click="crearPDF()">mdi-printer</v-icon> -->
        <v-icon @click="activ(item)">
          {{ item.estado === 1 ? "mdi-cancel " : "mdi-check" }}
        </v-icon>
      </template>

      <template v-slot:[`item.estado`]="{ item }">
        <span
          v-bind:class="[item.estado === 1 ? 'primary--text ' : 'red--text']"
        >
          {{ item.estado === 1 ? "Activo" : "Inactivo" }}
        </span>
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
    dialog: false,
    btnModal: false,
    show: false,
    id: "",
    search: "",
    estado:0,
    usuario:[],
    subt: 0,
    total: 0,
    fecha: Date,
    descuento:0,
    impuesto:0,
    cantidad:0,
    textCantidad: true,
    textAcciones: true,
    textDescuento: true,
    btnPDF: true,
    titulo: "",
    btnAgregar: true,
    btnCancelar: true,
    btnGuardar: true,
    btc: "CANCELAR",
    isDisabled: false,
    itemProveedor: [],

    articulos: [],
    proveedor: [],
    detalles: [],  // aca se alamacenas los articulo seleccionados
    itemtipoComprobante:[
      "Nota Debito",
      "Factura",
      "Nota Credito",
    ],

    

    dialogDelete: false,
    dialogText: "",
    encabezadoDescripcion: [  // ESTOS SON LOS HEADERS DE AGREGAR A LA TABLA 
      { text: "Nombre", value: "nombre" },
      { text: "Precio", value: "precio" },
      { text: "Cantidad", value: "cantidad", align: "center" },
      { text: "Subtotal", value: "subtotal" },
      { text: "Acciones", value: "acciones" },
    ],
    encabezadoDescripcionSin: [
      { text: "Nombre", value: "nombre" },
      { text: "Precio", value: "precio" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Subtotal", value: "subtotal" },
    ],
    productosDescripcion: [],
    productosAgregar: [],
    encabezadoAgregar: [
      { text: "Nombre", value: "nombre" },
      { text: "Precio", value: "precio" },
      { text: "Acciones", value: "acciones" },
    ],

    encabezado: [
      { text: "Estado", value: "estado" },
      { text: "Codigo", value: "codigo"},
      { text: "Nombre", value: "nombre" },
      { text: "Precio Venta", value: "precioVenta" },
      { text: "Stock", value: "stock" },
      { text: "Categoria", value: "categoria.nombre" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Actions", value: "action", sortable: false },
    ],

    headers: [
      { text: "Estado", value: "estado" },
      { text: "Usuario", value: "usuario.nombre" },
      { text: "Proveedor", value: "proveedor.nombre" },
      { text: "Tipo Comprobante", value: "tipoComprobante" },
      { text: "Serie comprobante", value: "serieComprobante" },
      { text: "Numero comprobante", value: "numComprobante" },
      { text: "Fecha", value: "fecha" },
      { text: "Impuesto", value: "impuesto" },
      { text: "Total", value: "total" },
      { text: "Opciones", value: "actions", sortable: false },
    ],
    ingreso: [],
    editedIndex: -1,
    editedItem:{
      usuario:"",
      proveedor:"",
      tipoComprobante:"",
      serieComprobante:"",
      numComprobante:"",
      impuesto:0,
      estado:"",
      total:0,
      detalles:"",
    },
  }),

  computed: {
    subTotal() {
      this.detalles.map((detalle) => (this.subt += detalle.subtotal));
      return this.subt;
    },
     impuestoTotal(){
      console.log(this.subt)
      console.log(this.impuesto)
      this.subt * (Number(this.impuesto)/100);
     return this.subt
    },
     totalParcial(){
      console.log(this.subt)
      console.log(this.impuesto)
      return Math.round(this.subt - this.impuesto)
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo ingreso" : "Visualización";
    },
    

  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.traer();
    this.traerProveedor();
    this.traerArticulos();
  },

  methods: {
    ver() {
      console.log(this.editedItem.proveedor);
    },
      crearPDF() {
      const columns = [
        { title: "Usuario", dataKey: "usuario" },
        { title: "Proveedor", dataKey: "proveedor" },
        { title: "Tipo Comprobante", dataKey: "tipoComprobante" },
        { title: "Serie Comprobante", dataKey: "serieComprobante" },
        { title: "Numero Comprobante", dataKey: "numComprobante" },
        { title: "Fecha", dataKey: "fecha" },
        { title: "Total", dataKey: "total" },
      ];
     

      const filas = [];
      this.ingreso.forEach(function (x) {
        filas.push({
          usuario: x.usuario.nombre,
          proveedor: x.proveedor.nombre,
          tipoComprobante: x.tipoComprobante,
          serieComprobante: x.serieComprobante,
          numComprobante: x.numComprobante,
          fecha:x.fecha,
          total:x.total
        });
      });
      const doc = new jsPDF("p", "pt");
      doc.autoTable(columns, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Lista de ingresos", 40, 30);
        },
      });
      doc.save("ingresos.pdf");
    },

    guardar() {
      let header = { headers: { "x-token": this.$store.state.token } };
      this.total=this.subtotal
      console.log(this.$store.state.nombre);
      axios
        .post(
          "ingreso",
          {
            usuario: this.$store.state.id,
            proveedor: this.editedItem.proveedor,
            tipoComprobante: this.editedItem.tipoComprobante,
            serieComprobante: this.editedItem.serieComprobante,
            numComprobante: this.editedItem.numComprobante,
            impuesto: this.editedItem.impuesto,
            total:this.total,
            estado: 1,
            detalles:this.detalles,
            subt: 0

          },
          header
        )
        .then((response) => {
          console.log(response);
          console.log(this.editedItem.proveedor);
          this.nuevaFactura=[]
          this.traer();
          this.close()
          this.$swal.fire({
            position: "center",
            icon: "success",
            text: "Su ingreso de ha guardado exitosamente",
            showConfirmButton: false,
            timer: 2000,
          }); 
        })
        .catch((error) => {
          console.log(error);
           this.$swal({
            position: "center",
            icon: "info",
            text: `${error.response.data.errors[0].msg}`,
            showConfirmButton: false,
            timer: 1500,
          }); 
        });
    },

    onChange(item) {
      item.subtotal = (item.precio * item.cantidad);
      this.subt = 0;
    },


    eliminarProducto(item) {
      this.id = item._id;
    },

    seleccionarArticulo(item) {
      console.log(item.nombre);
      let indice = this.detalles.findIndex((detalle) => detalle.nombre === item.nombre
      );
      if (this.detalles.length === 0) {
        this.detalles.push({
          id: item._id,
          nombre: item.nombre,
          precio: item.precioVenta,
          cantidad: 0,
          subtotal: 0,
        });
      } else if (indice === 1) {
        this.detalles.push({
          id: item._id,
          nombre: item.nombre,
          precio: item.precioVenta,
           cantidad: 0,
          subtotal: 0,
        });
      } else {
        this.$swal({
          position: "center",
          icon: "success",
          title: "Ya seleccionaste este producto",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal.fire({
        text: "¿Esta seguro , quiere desactivar esta Ingreso?",
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
          .put(`ingreso/desactivar/${this.id}`, {
          
            estado: 0,
          },
          header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Desactivaste este Ingreso! ",
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
          title: "¿Esta seguro de activar este Ingreso?",
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
           .put(`ingreso/activar/${this.id}`, {
            estado: 1,
          }, header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            posicion:"center",
            text: "¡ Activaste este Ingreso! ",
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
       
      }

     
    },
    eliminarDetalles(item) {
      //buscar id para comparar y reemplazar
      let index = this.detalles.findIndex((x) => x.id == item.id);
      this.detalles.splice(index, 1);
      //let conteo = this.productosDescripcion.reduce((x, y) => x += y.subtotal, 0)
      this.subt = 0;
      // console.log(conteo);
      // console.log(index);
    },

    editItem(item) {
      this.detalles=[],
      this.dialog = true;
      this.show = false;
      this.btc = "SALIR";
      this.btnPDF = true;
      this.btnAgregar = false;
      this.btnCancelar = true;
      this.btnGuardar = false;
      this.textCantidad = false;
      this.textAcciones = false;
      this.isDisabled = true;
      this.editedItem.usuario = item.usuario;
      this.editedItem.proveedor= item.proveedor._id;
      this.editedItem.tipoComprobante = item.tipoComprobante;
      this.editedItem.serieComprobante = item.serieComprobante;
      this.editedItem.numComprobante = item.numComprobante;
      this.editedItem.impuesto = item.impuesto;
      this.editedItem.total = item.total;
      this.fecha= item.fecha;
      this.estado = item.estado;

      item.detalles.map((detalle) => {
        this.detalles.push({
          id: detalle._id,
          nombre: detalle.nombre,
          precio: detalle.precio,
          cantidad: detalle.cantidad,
          subtotal: detalle.cantidad * detalle.precio,
        });
      });
    },

    traerProveedor() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("proveedor", header)
        .then((response) => {
          console.log(response.data.proveedor);
          response.data.proveedor.map((x) => {
            this.itemProveedor.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch((error) => {
          console.log(error.response);
        });
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
          console.log(error);
        });
    },
    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("ingreso", header)
        .then((response) => {
          console.log(response);
          this.ingreso = response.data.ingreso;
          this.traerProveedor();
          this.traerArticulos();
          console.log(this.ingreso);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mostrar() {
      console.log(this.cantidad);
      console.log(this.detalles);
    },
    modalAgregar() { 
      this.btnModal = true;
    },
    nuevaFactura() {
      this.traerProveedor(),
      this.traerArticulos(), 
      this.show = true;
      this.textCantidad = true;
      this.textAcciones = true;
      this.dialog = true;
      this.btnPDF = false;
      this.isDisabled = false;
      this.btc = "CANCELAR";
      this.btnGuardar = true;
      this.btnCancelar = true;
      this.btnAgregar = true;
    },

    deleteItem(item) {
      this.id = item._id;
      this.dialogDelete = true;
      this.$swal({
        title: "¿Estas Seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete!",
        cancelButtonText: "Cancel!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          let header = { headers: { "x-token": this.$store.state.token } };
          axios
            .delete(`ingreso/${this.id}`, header)
            .then((response) => {
              console.log(response);
              this.traerArticulos();
              this.traerProveedor(), this.traer();
            })
            .catch((error) => {
              console.log(error);
            });
          this.$swal.fire({
            text: "¡ El producto se ha eliminado exitosamente! ",
            icon: "success",
            timer: 1000,
          });
        }
      });
    },
 
    deleteItemConfirm(item) {
      this.ingreso.splice(this.editedIndex, 1);
      this.editedIndex = this.ingreso.indexOf(item);
      this.editedItem = Object.assign({}, item);

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.isDisabled = false;
      this.tipoComprobante = "";
      this.serieComprobante = "";
      this.numComprobante = "";
      this.impuesto = 0;
      this.total = 0;
      this.subt = 0;
      this.estado = "";
      this.detalles = [];
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({});
        this.editedIndex = -1;
      });
    },
  },
};
</script>
<style scoped>
#modalProductos {
  margin-right: 900px;
}
</style>