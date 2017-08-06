/**
 * 
 */
package app.service;

import app.service.impl.AdministrativoServiceImpl;
import static org.junit.Assert.assertNotNull;
import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestAdministrativo {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}
	

	@Test
	public void testAdministrativoService() throws Exception {
		AdministrativoServiceImpl administrativoService = new AdministrativoServiceImpl();
		assertNotNull(administrativoService);
	}

}
