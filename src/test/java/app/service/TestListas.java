/**
 * 
 */
package app.service;

import app.service.impl.ListasServiceImpl;
import static org.junit.Assert.assertNotNull;

import org.junit.Before;
import org.junit.Test;

/**
 * @author facundo91
 *
 */
public class TestListas {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testListasService() throws Exception {
		ListasServiceImpl listasService = new ListasServiceImpl();
		assertNotNull(listasService);
	}

}
