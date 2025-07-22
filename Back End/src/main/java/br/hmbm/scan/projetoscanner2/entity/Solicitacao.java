package br.hmbm.scan.projetoscanner2.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "HMMD_API_HIGIENE_V")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "nrSequencia")
public class Solicitacao {

    @Id
    @Column(name = "nr_sequencia")
    private Long nrSequencia;

    @Column(name = "dt_atualizacao_nrec")
    private String dtAtualizacao;

    @Column(name = "ie_prioridade")
    private String prioridade;

    private String leito;

    @Column(name = "NR_SEQ_UNIDADE")
    private Long cdLeito;

    private String setor;

    @Column(name = "cd_setor")
    private Long cdSetor;

    @Column(name = "dt_inicio")
    private String dtInicio;

    @Column(name = "ds_status")
    private String dsStatus;

    @Column(name = "dt_fim")
    private String dtFim;

    private String executor;
}
