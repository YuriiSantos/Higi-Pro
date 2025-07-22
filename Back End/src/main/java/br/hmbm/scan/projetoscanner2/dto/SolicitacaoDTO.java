package br.hmbm.scan.projetoscanner2.dto;


import br.hmbm.scan.projetoscanner2.entity.Solicitacao;

public record SolicitacaoDTO(
        Long nrSequencia,
        String dtAtualizacao,
        String prioridade,
        String executor,
        String leito,
        Long cdLeito,
        String setor,
        String dtInicio,
        String dtFim,
        String dsStatus
) {
    public static SolicitacaoDTO fromEntity(Solicitacao chamada) {
        return new SolicitacaoDTO(
                chamada.getNrSequencia(),
                chamada.getDtAtualizacao(),
                chamada.getPrioridade(),
                chamada.getExecutor(),
                chamada.getLeito(),
                chamada.getCdLeito(),
                chamada.getSetor(),
                chamada.getDtInicio(),
                chamada.getDtFim(),
                chamada.getDsStatus()
        );
    }
}
