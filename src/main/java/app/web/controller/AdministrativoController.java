package app.web.controller;

import app.model.odb.Movie;
import app.model.odb.User;
import app.service.AdministrativoService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/admin/user")
public class AdministrativoController {

    @Autowired
    private AdministrativoService adminService;

    @GetMapping(value = "/{id}", produces = "application/json")
    public User datosUsuario(@RequestHeader String token, @PathVariable String id) throws JSONException, IOException {
        return adminService.validarAdmin(token).obtenerUsuario(id);
    }

    @GetMapping(value = "/{idLista1}/{idLista2}/", produces = "application/json")
    public List<Movie> listaUsuarios(@RequestHeader String token, @PathVariable String idLista1,
            @PathVariable String idLista2)
            throws JSONException, IOException {
        List<Movie> interseccion = adminService.validarAdmin(token).obtenerInterseccionListas(idLista1, idLista2);
        return interseccion;
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<User> listadoUsuarios(@RequestHeader String token) throws JSONException, IOException {
        return adminService.validarAdmin(token).obtenerUsuarios();
    }
}
