package com.kivuims.proxyservice.identity.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String profileImage;
    private String role;
    private String companyId;
    private String storeId;
    private Boolean emailVerified;
    private Boolean passwordChangeRequired;

    public User() {
    }

    public User(String id, String firstName, String lastName, String email, String phone,
            String profileImage, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.profileImage = profileImage;
        this.role = role;
    }
}
