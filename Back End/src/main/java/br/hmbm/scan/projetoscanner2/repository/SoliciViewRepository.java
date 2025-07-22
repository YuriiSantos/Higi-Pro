package br.hmbm.scan.projetoscanner2.repository;

import br.hmbm.scan.projetoscanner2.entity.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SoliciViewRepository  extends JpaRepository<Solicitacao, Long> {

    Optional<Solicitacao> findByNrSequenciaAndCdLeito(Long nrSequencia, Long cdLeito);

    Optional<Solicitacao> findByNrSequencia (Long nrSequencia);
}
