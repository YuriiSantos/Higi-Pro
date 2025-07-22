package br.hmbm.scan.projetoscanner2.service;

import br.hmbm.scan.projetoscanner2.entity.TasyUser;
import br.hmbm.scan.projetoscanner2.repository.TasyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TasyUserService {

    @Autowired
    private TasyUserRepository tasyUserRepository;

    public TasyUser validarUsuarioNoTasy(String fullName) {
        // que também é um funcionário (ie_funcionario = 'S') e tem o código de cargo 146 (cd_cargo = 146)
        return tasyUserRepository.findFirstByNmPessoaIgnoreCaseAndIeFuncionarioAndCdCargo(fullName, "S", 146);
    }
}
