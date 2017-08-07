package app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author Facundo
 */
@Controller
@RequestMapping("/")
public class MainController {

    @GetMapping
    public String mainTemplate() {
        return "index";
    }

}
