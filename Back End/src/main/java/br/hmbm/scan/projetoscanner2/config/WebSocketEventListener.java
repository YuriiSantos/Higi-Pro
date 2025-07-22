package br.hmbm.scan.projetoscanner2.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ConcurrentHashMap<String, String> userSessionMap = new ConcurrentHashMap<>(); // Mapeia usuários para sessões WebSocket

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        Principal user = headers.getUser();
        if (user != null) {
            String sessionId = headers.getSessionId();
            userSessionMap.put(user.getName(), sessionId);
            logger.info("WebSocket conectado para o usuário: " + user.getName() + ", sessão ID: " + sessionId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String user = getUserBySessionId(sessionId);
        if (user != null) {
            userSessionMap.remove(user);
            logger.info("Sessão WebSocket desconectada: " + sessionId + " para o usuário: " + user);
        }
    }

    public void disconnectUser(String username) {
        String sessionId = userSessionMap.get(username);
        if (sessionId != null) {
            messagingTemplate.convertAndSendToUser(username, "/topic/disconnect", "Desconectando");
            userSessionMap.remove(username);
            logger.info("Usuário desconectado: " + username + ", sessão ID: " + sessionId);
        }
    }

    public String getUserBySessionId(String sessionId) {
        for (String user : userSessionMap.keySet()) {
            if (userSessionMap.get(user).equals(sessionId)) {
                return user;
            }
        }
        return null;
    }

    public String getSessionIdForUser(String username) {
        return userSessionMap.get(username);
    }
}
