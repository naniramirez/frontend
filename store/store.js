import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
     
    state:{
        token:"",
        email:"",
        password:"",
        nombre:"",
        id:"",
        rol:""
    },

    mutations:{
        setToken(state,value){
            state.token = value;
        },
        setRol(state,value){
            state.rol = value;
        },
        setNombre(state,value){
            state.nombre = value;

        },
        setEmail(state,value){
            state.email = value;
        },
        setPassword(state,value){
            state.password = value;
        },
        setId(state, value) {
            state.id = value;
    },
},
    actions:{
        setToken(context,value){
            context.commit("setToken",value);
        },
        setRol(context,value){
            context.commit("setRol",value);
        },
        setNombre(context, value){
            context.commit("setNombre", value);

        },
        setEmail(context,value){
            context.commit("setEmail",value);
        },
        setPassword(context,value){
            context.commit("setPassword",value);
        },
        setId(context, value){
            context.commit("setId", value);
        }
    }

   
})