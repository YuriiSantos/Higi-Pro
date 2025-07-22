package br.hmbm.scan.projetoscanner2.repository;

import br.hmbm.scan.projetoscanner2.entity.TasyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TasyUserRepository extends JpaRepository<TasyUser, Long> {

    // Novo método que busca o primeiro usuário pelo nome, que é funcionário e tem o código de cargo 146, ignorando case
    TasyUser findFirstByNmPessoaIgnoreCaseAndIeFuncionarioAndCdCargo(
            String nmPessoa,
            String ieFuncionario,
            Integer cdCargo
    );
}
