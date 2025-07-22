package br.hmbm.scan.projetoscanner2.controller;

import br.hmbm.scan.projetoscanner2.dto.SolicitacaoDTO;
import br.hmbm.scan.projetoscanner2.service.SoliciLimpezaService;
import br.hmbm.scan.projetoscanner2.service.SolicitacaoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SoliciController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @Autowired
    private SoliciLimpezaService soliciLimpezaService;

    @GetMapping("/buscar-leitos")
    public Page<SolicitacaoDTO> buscarLeitos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        // Chama o método de serviço para buscar leitos paginados sem data fim
        return solicitacaoService.buscarLeitosSemDataFimPaginados(page, size);
    }

    @PutMapping("/iniciar/{nrSequencia}/{cdLeito}")
    public ResponseEntity<String> iniciarLimpeza(@PathVariable Long nrSequencia, @PathVariable Long cdLeito, HttpServletRequest request) {
        try {
            // Passa o HttpServletRequest para o serviço para obter o cd_pessoa_fisica da sessão
            soliciLimpezaService.iniciarLimpeza(nrSequencia, cdLeito, request);
            return ResponseEntity.ok("Limpeza iniciada com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/finalizar/{nrSequencia}")
    public ResponseEntity<String> finalizarLimpeza(@PathVariable Long nrSequencia, HttpServletRequest request) {
        try {
            // Passa o HttpServletRequest para o serviço para obter o cd_pessoa_fisica da sessão
            soliciLimpezaService.finalizarLimpeza(nrSequencia, request);
            return ResponseEntity.ok("Limpeza finalizada com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
