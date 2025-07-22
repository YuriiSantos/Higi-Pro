package br.hmbm.scan.projetoscanner2.repository;

import br.hmbm.scan.projetoscanner2.entity.Solicitacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    // Método para buscar todas as chamadas onde dtFim é nulo, com paginação
    Page<Solicitacao> findByDtFimIsNull(Pageable pageable);
}
