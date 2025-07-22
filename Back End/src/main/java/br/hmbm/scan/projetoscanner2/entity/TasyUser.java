package br.hmbm.scan.projetoscanner2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pessoa_fisica")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "cdPessoa")
public class TasyUser {

    @Id
    @Column(name = "cd_pessoa_fisica")
    private Long cdPessoa;

    @Column(name = "nm_pessoa_fisica")
    private String nmPessoa;

    @Column(name = "ie_funcionario")
    private String ieFuncionario;

    @Column(name = "cd_cargo")
    private Integer cdCargo;
}
