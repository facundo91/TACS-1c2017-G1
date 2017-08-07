package app.service.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.service.BusquedasService;
import app.service.TmdbService;

@Service
public class BusquedasServiceImpl implements BusquedasService {

    @Autowired
    private SesionesServiceImpl sesionesService;

    @Autowired
    private TmdbService tmdbService;

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
    @Override
    public JSONObject buscarPeliculaPorNombreJson(String query, String token, String page) throws Exception {
        sesionesService.obtenerUsuarioPorToken(token);
        return tmdbService.getResource("search/movie", query, page);
    }

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
    @Override
    public JSONObject buscarActorPorNombreJson(String query, String token, String page) throws Exception {
        sesionesService.obtenerUsuarioPorToken(token);
        return tmdbService.getResource("search/person", query, page);
    }

    @Override
    public JSONObject buscarPorNombre(String query, String token, String page) throws Exception {
        sesionesService.obtenerUsuarioPorToken(token);
        return tmdbService.getResource("search/multi", query, page);
    }

}
