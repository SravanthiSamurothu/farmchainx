package com.farmchainx.dto;

import com.farmchainx.model.User;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;

    public UserDTO() {}

    public UserDTO(User u) {
        this.id    = u.getId();
        this.name  = u.getName();
        this.email = u.getEmail();
        this.role  = u.getRole().name();
    }

    public Long getId()      { return id; }
    public String getName()  { return name; }
    public String getEmail() { return email; }
    public String getRole()  { return role; }

    public void setId(Long id)       { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}