/**
 * 
 */
package app.service;

import app.service.impl.BusquedasServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.assertNotNull;

/**
 * @author facundo91
 *
 */
public class TestBusquedas {
	Logger logger = LoggerFactory.getLogger(TestBusquedas.class);

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testBusquedasService() throws Exception {
		assertNotNull(BusquedasServiceImpl.class);
	}

//	@Test()
//	public void testBuscarPorNombre() throws Exception {
//		BusquedasServiceImpl bs = new BusquedasServiceImpl();
//		bs.buscarPorNombre("Chaplin", "1234", null).get("statusCode");
//	}

}
