package br.hmbm.scan.projetoscanner2.service;


import oracle.jdbc.OracleConnection;
import oracle.jdbc.OracleStatement;
import oracle.jdbc.dcn.DatabaseChangeEvent;
import oracle.jdbc.dcn.DatabaseChangeListener;
import oracle.jdbc.dcn.DatabaseChangeRegistration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.*;
@Service
public class OracleChangeNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(OracleChangeNotificationService.class);

    @Autowired
    private DataSource dataSource;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Serviço de envio de mensagens WebSocket

    private final ExecutorService executorService = Executors.newFixedThreadPool(20);

    // Pool de conexões
    private static final int MAX_CONNECTIONS = 15;
    private final Semaphore connectionSemaphore = new Semaphore(MAX_CONNECTIONS);

    @PostConstruct
    public void registerChangeNotification() throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            OracleConnection oracleConnection = conn.unwrap(OracleConnection.class);

            Properties prop = new Properties();
            prop.setProperty(OracleConnection.DCN_NOTIFY_ROWIDS, "true");

            DatabaseChangeRegistration dcr = oracleConnection.registerDatabaseChangeNotification(prop);

            dcr.addListener(new DatabaseChangeListener() {
                @Override
                public void onDatabaseChangeNotification(DatabaseChangeEvent event) {
                    logger.info("Notificação recebida - Thread ID: {}, Thread Name: {}",
                            Thread.currentThread().getId(),
                            Thread.currentThread().getName());

                    // Submeter a tarefa diretamente para o pool de threads
                    executorService.submit(() -> processNotification(event));
                }
            });

            try (OracleStatement stmt = (OracleStatement) oracleConnection.createStatement()) {
                // Especificar a tabela que deve ser monitorada
                String sql = "SELECT * FROM sl_unid_atend WHERE ROWNUM = 1";
                stmt.setDatabaseChangeRegistration(dcr);
                stmt.executeQuery(sql);
            }
        } catch (SQLException e) {
            logger.error("Erro ao registrar a notificação de mudança no banco de dados", e);
            throw e;
        }
    }

    private void processNotification(DatabaseChangeEvent event) {
        logger.info("Iniciando processamento na Thread ID: {}, Thread Name: {}",
                Thread.currentThread().getId(),
                Thread.currentThread().getName());

        try {
            // Adquirir permissão para usar uma conexão
            connectionSemaphore.acquire();

            String tableName = event.getTableChangeDescription()[0].getTableName();
            logger.info("Mudança detectada na tabela");

            // Enviar notificação via WebSocket
            messagingTemplate.convertAndSend("/topic/changes", "Mudança detectada na tabela ");

        } catch (Exception e) {
            logger.error("Erro ao processar notificação de mudança no banco de dados", e);
        } finally {
            // Liberar permissão de conexão
            connectionSemaphore.release();
            logger.info("Finalizando processamento na Thread ID: {}, Thread Name: {}",
                    Thread.currentThread().getId(),
                    Thread.currentThread().getName());
        }
    }

    @PreDestroy
    public void shutdown() {
        logger.info("Encerrando o pool de threads...");
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            logger.error("Erro ao encerrar o pool de threads", e);
            executorService.shutdownNow();
        }
    }
}
