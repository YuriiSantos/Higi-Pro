package br.hmbm.scan.projetoscanner2.security;

import br.hmbm.scan.projetoscanner2.config.WebSocketEventListener;
import br.hmbm.scan.projetoscanner2.entity.TasyUser;
import br.hmbm.scan.projetoscanner2.service.TasyUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.servlet.http.HttpServletResponse;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private TasyUserService tasyUserService;

    @Autowired
    private WebSocketEventListener webSocketEventListener;

    @Value("${spring.security.active-directory.domain}")
    private String ldapDomain;

    @Value("${spring.security.active-directory.url}")
    private String ldapUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/logout").permitAll()
                        .requestMatchers("/home").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .successHandler(authenticationSuccessHandler())
                        .failureHandler(authenticationFailureHandler())
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler(logoutSuccessHandler())
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll())
                .httpBasic(withDefaults())
                .sessionManagement(session -> session
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(false));

        return http.build();
    }

    @Bean
    public ActiveDirectoryLdapAuthenticationProvider activeDirectoryLdapAuthenticationProvider() {
        ActiveDirectoryLdapAuthenticationProvider provider =
                new ActiveDirectoryLdapAuthenticationProvider(ldapDomain,ldapUrl);
        provider.setUseAuthenticationRequestCredentials(true);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            logger.info("Usuário autenticado com sucesso no AD: " + authentication.getName());

            try {
                String fullName = null;

                if (authentication.getPrincipal() instanceof org.springframework.security.ldap.userdetails.LdapUserDetails) {
                    org.springframework.security.ldap.userdetails.LdapUserDetails ldapUserDetails =
                            (org.springframework.security.ldap.userdetails.LdapUserDetails) authentication.getPrincipal();

                    String dn = ldapUserDetails.getDn();
                    if (dn != null && dn.startsWith("CN=")) {
                        fullName = dn.split(",")[0].substring(3);  // Extrai o nome após "CN="
                    }
                }

                // Normalização do nome para minúsculas
                if (fullName != null) {
                    fullName = fullName.toLowerCase();
                }

                // Validação do usuário no Tasy
                TasyUser usuario = tasyUserService.validarUsuarioNoTasy(fullName);

                if (usuario != null) {
                    logger.info("Usuário validado com sucesso no Tasy: " + usuario.getNmPessoa());

                    // Armazena o TasyUser na sessão
                    request.getSession().setAttribute("usuarioLogado", usuario);
                    // Armazena o código da pessoa (cdPessoa)
                    request.getSession().setAttribute("cdPessoa", usuario.getCdPessoa());

                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().write("{\"status\":\"success\"}");
                    response.setContentType("application/json");
                } else {
                    logger.warn("Usuário não encontrado no Tasy: " + fullName);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Usuário não encontrado no Tasy");
                }
            } catch (Exception e) {
                logger.error("Erro durante a validação do usuário no Tasy: ", e);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro interno do servidor");
            }
        };
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            logger.warn("Falha na autenticação: " + exception.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication Failed");
        };
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> {
            if (authentication != null) {
                String username = authentication.getName();
                webSocketEventListener.disconnectUser(username);  // Desconecta o WebSocket do usuário
                logger.info("Logout bem-sucedido para o usuário: " + username);
            }
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("{\"status\":\"logout\"}");
            response.setContentType("application/json");
        };
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("https://higipro.hmbm.org.br");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
