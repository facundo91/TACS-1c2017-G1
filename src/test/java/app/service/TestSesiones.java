/**
 * 
 */
package app.service;

import app.service.impl.SesionesServiceImpl;
import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestSesiones {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testGestionadorSesiones() throws Exception {
		SesionesServiceImpl sersionesService = new SesionesServiceImpl();
		assertNotNull(sersionesService);
	}

}
