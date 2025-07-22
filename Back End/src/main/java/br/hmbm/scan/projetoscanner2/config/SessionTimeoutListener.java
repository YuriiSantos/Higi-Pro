package br.hmbm.scan.projetoscanner2.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@Configuration
public class SessionTimeoutListener implements HttpSessionListener {

    private static final Logger logger = LoggerFactory.getLogger(SessionTimeoutListener.class);

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        logger.info("Sessão criada: ID=" + se.getSession().getId());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        logger.info("Sessão destruída: ID=" + se.getSession().getId());
    }
}
