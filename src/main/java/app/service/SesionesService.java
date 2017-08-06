/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import app.model.odb.Credencial;
import app.model.odb.Sesion;
import app.model.odb.User;

/**
 *
 * @author Facundo
 */
public interface SesionesService {

    void actualizarPass(User user);

    void desloguearUsuario(String token);

    Sesion loguearUsuario(Credencial credencial);

    User obtenerUsuarioPorToken(String token);

    void validarSesionActiva(Sesion sesion);
    
}
