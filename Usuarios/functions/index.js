const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const auth = admin.auth();

exports.agregarAdministrador = functions.https.onCall((data, context) => {

     if(context.auth.token.admin !== true){
        return {error: 'Permisos Insuficientes'}
   } 

   return auth.getUserByEmail(data.email)
   .then(user => {
       return auth.setCustomUserClaims(user.uid, {admin: true})
   })
   .then(() => {
       return {message: 'Se ha creado el Administrador'}
   })
   .catch(error => error)
})

exports.eliminarAdministrador = functions.https.onCall((data, context) => {

    if(context.auth.token.admin !== true){
        return {error: 'Solo Admin puede modificar'}
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, {admin: false})
        })
        .then(() => {
            return {message: 'Se ha eliminado el Administrador'}
        })
        .catch(error => error)
})
exports.agregarPropietario = functions.https.onCall((data, context) => {

    if(context.auth.token.admin !== true){
        return {error: 'Solo Admin puede modificar'}
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, {propietario: true})
        })
        .then(() => {
            return {message: 'Permisos Actualizados'}
        })
        .catch(error => error)
})

exports.agregarAvanzado = functions.https.onCall((data, context) => {

    if(context.auth.token.admin !== true){
        return {error: 'Solo Admin puede modificar'}
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, {avanzado: true})
        })
        .then(() => {
            return {message: 'Permisos Actualizados'}
        })
        .catch(error => error)
})

exports.eliminarAvanzado = functions.https.onCall((data, context) => {

    if(context.auth.token.admin !== true){
        return {error: 'Solo Admin puede modificar'}
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, {avanzado: false})
        })
        .then(() => {
            return {message: 'Permisos Actualizados'}
        })
        .catch(error => error)
})





exports.agregarUsuario = functions.https.onCall((data, context) => {

    if(context.auth.token.admin !== true){
        return {error: 'Solo Admin puede modificar'}
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, {usuario: true})
        })
        .then(() => {
            return {message: 'Permisos Actualizados'}
        })
        .catch(error => error)
})

exports.eliminarUsuario = functions.https.onCall((data, context) => {

    if(context.auth.token.admin !== true){
        return {error: 'Solo Admin puede modificar'}
    }

    return auth.getUserByEmail(data.email)
        .then(user => {
            return auth.setCustomUserClaims(user.uid, {usuario: false})
        })
        .then(() => {
            return {message: 'Permisos Actualizados'}
        })
        .catch(error => error)
})