package app.controller.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import app.domain.Actor;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/person")
public class ActorRestController {

    @GetMapping(value = "/{id}", produces = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public Actor busquedaActorJson(@RequestHeader String Token, @PathVariable String id)
            throws Exception {
        return new Actor(id);
    }
}
