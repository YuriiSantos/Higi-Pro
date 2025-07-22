package br.hmbm.scan.projetoscanner2.service;

import br.hmbm.scan.projetoscanner2.entity.Solicitacao;
import br.hmbm.scan.projetoscanner2.repository.SoliciViewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class SoliciLimpezaService {

    private static final Logger logger = LoggerFactory.getLogger(SoliciLimpezaService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SoliciViewRepository soliciViewRepository;

    @Transactional
    public void iniciarLimpeza(Long nrSequencia, Long cdLeito, HttpServletRequest request) {
        // Recupera o cdPessoa da sessão
        Long cdPessoa = (Long) request.getSession().getAttribute("cdPessoa");
        logger.info("cdPessoa recuperado da sessão: " + cdPessoa);

        // Verifica se a solicitação existe
        Optional<Solicitacao> solicitacao = soliciViewRepository.findByNrSequenciaAndCdLeito(nrSequencia, cdLeito);
        if (solicitacao.isPresent()) {
            // Atualiza a tabela com o cd_pessoa_fisica autenticado como executor
            jdbcTemplate.update(
                    "UPDATE sl_unid_atend SET DT_INICIO = SYSDATE, DT_APROVACAO = SYSDATE, IE_STATUS_SERV = 'EE', CD_EXECUTOR = ?, CD_EXECUTOR_INIC_SERV = ? WHERE nr_sequencia = ? AND NR_SEQ_UNIDADE = ?",
                    cdPessoa, cdPessoa, nrSequencia, cdLeito
            );
        } else {
            throw new IllegalArgumentException("Dados não coerentes, não é possível iniciar a limpeza");
        }
    }

    @Transactional
    public void finalizarLimpeza(Long nrSequencia, HttpServletRequest request) {
        // Recupera o cdPessoa da sessão
        Long cdPessoa = (Long) request.getSession().getAttribute("cdPessoa");
        logger.info("cdPessoa recuperado da sessão: " + cdPessoa);

        // Verifica se a solicitação existe
        Optional<Solicitacao> solicitacao = soliciViewRepository.findByNrSequencia(nrSequencia);
        if (solicitacao.isPresent()) {
            // Atualiza a tabela com o cd_pessoa_fisica autenticado como executor do fim da limpeza
            jdbcTemplate.update(
                    "UPDATE sl_unid_atend SET IE_STATUS_SERV = 'E', DT_SAIDA_REAL = SYSDATE, DT_FIM = SYSDATE, CD_EXECUTOR_FIM_SERV = ? WHERE nr_sequencia = ?",
                    cdPessoa, nrSequencia
            );
        } else {
            throw new IllegalArgumentException("Dados não coerentes, não é possível finalizar a limpeza");
        }
    }
}
