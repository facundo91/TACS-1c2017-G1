/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import java.io.IOException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

/**
 *
 * @author Facundo
 */
@Service
public interface TmdbService {

    JSONObject getResource(String resource, String query, String page) throws JSONException, IOException;

    JSONObject getResource2(String resource, String query) throws JSONException, IOException;
    
}
