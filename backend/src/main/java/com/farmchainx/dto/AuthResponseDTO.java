package com.farmchainx.dto;

import com.farmchainx.model.User;

public class AuthResponseDTO {
    private String token;
    private String type;
    private Long id;
    private String name;
    private String email;
    private User.Role role;

    public AuthResponseDTO() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AuthResponseDTO dto = new AuthResponseDTO();
        public Builder token(String v) { dto.token = v; return this; }
        public Builder type(String v) { dto.type = v; return this; }
        public Builder id(Long v) { dto.id = v; return this; }
        public Builder name(String v) { dto.name = v; return this; }
        public Builder email(String v) { dto.email = v; return this; }
        public Builder role(User.Role v) { dto.role = v; return this; }
        public AuthResponseDTO build() { return dto; }
    }

    public String getToken() { return token; }
    public String getType() { return type; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public User.Role getRole() { return role; }
    public void setToken(String token) { this.token = token; }
    public void setType(String type) { this.type = type; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(User.Role role) { this.role = role; }
}