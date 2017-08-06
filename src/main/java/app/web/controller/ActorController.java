package app.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import app.model.odb.Actor;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/person")
public class ActorController {

    @GetMapping(value = "/{id}", produces = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public Actor busquedaActorJson(@RequestHeader String Token, @PathVariable String id)
            throws Exception {
        return new Actor(id);
    }
}
