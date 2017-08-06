/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import org.json.JSONObject;

/**
 *
 * @author Facundo
 */
public interface BusquedasService {

    /*
    public List<Actor> buscarActorPorNombre(String query) throws Exception {
    JSONArray resultJsonArray = buscarActorPorNombreJson(query).getJSONArray("results");
    List<Actor> resultList = new ArrayList<Actor>();
    for (int i = 0; i < resultJsonArray.length(); i++) {
    Actor actor = new Actor();
    actor.setInfo(resultJsonArray.getJSONObject(i));
    resultList.add(actor);
    }
    return resultList;
    }
     */
    JSONObject buscarActorPorNombreJson(String query, String token, String page) throws Exception;

    /*
    public static MovieList buscarPeliculaPorNombre(String query) throws Exception {
    JSONArray resultJsonArray = buscarPeliculaPorNombreJson(query).getJSONArray("results");
    MovieList resultList = new MovieList();
    resultList.setName("Resultados de buscar " + query);
    for (int i = 0; i < resultJsonArray.length(); i++) {
    resultList.addMovie(new Movie(resultJsonArray.getJSONObject(i)));
    }
    return resultList;
    }
     */
    JSONObject buscarPeliculaPorNombreJson(String query, String token, String page) throws Exception;

    JSONObject buscarPorNombre(String query, String token, String page) throws Exception;
    
}
