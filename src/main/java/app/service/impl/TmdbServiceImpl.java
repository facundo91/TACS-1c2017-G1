package app.service.impl;

import app.service.TmdbService;
import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class TmdbServiceImpl implements TmdbService {

    private final String apiUrl = "https://api.themoviedb.org/3/";

    private String getApiUrl() {
        return apiUrl;
    }

    /**
     * @param resource
     * @param query
     * @param pedir
     * @return
     * @throws IOException
     * @throws ClientProtocolException
     */
    private JSONObject makeRequest(String resource, String query, String pedir)
            throws IOException, ClientProtocolException {
        HttpGet httpGet = new HttpGet(pedir);
        CloseableHttpResponse response1 = HttpClients.createDefault().execute(httpGet);
        System.out.println("PEDIDO: " + pedir);
        System.out.println("RESPUESTA: " + response1);
        return getJsonObject(resource, query, response1);
    }

    @Override
    public JSONObject getResource(String resource, String query, String page) throws JSONException, IOException {
        String pedir = getApiUrl() + resource + getApiKey() + "&query=" + query;
        if (page != null) {
            pedir += "&page=" + page;
        }
        return makeRequest(resource, query, pedir);
    }

    @Override
    public JSONObject getResource2(String resource, String query) throws JSONException, IOException {
        String pedir = getApiUrl() + resource + "/" + query + getApiKey();
        return makeRequest(resource, query, pedir);
    }

    /**
     * @return @throws IOException
     */
    private String getApiKey() {
        return "?&api_key=" + "6d1dfc1d31cde5e582b40131826b32c9";
    }

    private JSONObject getJsonObject(String resource, String query, CloseableHttpResponse response1)
            throws IOException {
        try {
            HttpEntity entity1 = response1.getEntity();
            String response2 = EntityUtils.toString(entity1);
            JSONObject respuesta = new JSONObject(response2);
            EntityUtils.consume(entity1);
            return respuesta;
        } finally {
            response1.close();
        }
    }

}
