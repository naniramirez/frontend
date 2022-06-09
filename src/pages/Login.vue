<template>
  <v-app class="mt-16 ma-3 pa-16">
    <v-container>
      <v-row justify="center" aling="center">
        <v-col cols="12" sm="10">
          <v-card class="elevation-6 mt-16 ma-auto" 
           width="550px">
            <v-toolbar dark color="light-blue lighten-2">
              <v-toolbar-title class="white--text">Acceso al sistema</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="formulario">
                <v-text-field
                  id="email"
                  prepend-icon="mdi-account"
                  required
                  name="email"
                  label="usuario@gmail.com"
                  type="email"
                  v-model="email"
                ></v-text-field>
                <v-text-field
                  id="password"
                  prepend-icon="mdi-lock"
                  required
                  name="password"
                  label="Password"
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                   @click:append="show1 = !show1"
                ></v-text-field>
                 <v-row justify="center" aling="center">
                    <v-btn pt-6
                    color="light-blue lighten-2"
                    class="hidden-xs-only"
                    @click="login()"
                    >
                    Ingresar
                    </v-btn>
                    </v-row>
                    <v-row justify="center" aling="center">
                    <v-btn pt-6
                    color="light-blue lighten-2"
                    class="hidden-sm-and-up"
                    @click="login()"
                    >
                    Ingresar
                    </v-btn>
                    </v-row>
                    
                    <v-row justify="center">
      
                  </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
  
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    valid: true,
    b: null,
    show1: false,
    error: "",
    email: "",
    password: "",
    usuario: "",
  }),

  methods: {
    login() {
      axios
        .post("/login/login", {
          email: this.email,
          password: this.password,
          usuario: this.nombre,
        })
        .then((response) => {
          console.log(response);

          this.$swal.fire({
            position: "center",
            icon: "success",
            text: "¡ Bienvenido! " + response.data.login.nombre,
            showConfirmButton: false,
            timer: 1500,
          });

          this.$store.dispatch("setEmail", response.data.login.email); // lllamamos las acciones  con dispatch
          this.$store.dispatch("setPassword", response.data.login.password);
          this.$store.dispatch("setId", response.data.login._id);
          this.$store.dispatch("setNombre", response.data.login.nombre);
          this.$store.dispatch("setToken", response.data.token);
          this.$store.dispatch("setRol", response.data.login.rol);
          this.$router.replace({ path: "/home" });
          console.log(this.$store.state.id);
        })
        .catch((error) => {
          console.log(error.response);
          this.$swal({
            position: "center",
            icon: "warning",
            text: `${error.response.data.msg}`,
            textcolor: "#4FC3F7",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    reset() {
      this.$refs.formulario.reset();
    },
    resetValidation() {
      this.$refs.formulario.resetValidation();
    },
  },
};
</script>

<style scoped></style>
