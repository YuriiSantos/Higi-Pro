package br.hmbm.scan.projetoscanner2.service;

import br.hmbm.scan.projetoscanner2.dto.SolicitacaoDTO;
import br.hmbm.scan.projetoscanner2.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    public Page<SolicitacaoDTO> buscarLeitosSemDataFimPaginados(int page, int size) {
        return solicitacaoRepository.findByDtFimIsNull(PageRequest.of(page, size))
                .map(SolicitacaoDTO::fromEntity);
    }
}
