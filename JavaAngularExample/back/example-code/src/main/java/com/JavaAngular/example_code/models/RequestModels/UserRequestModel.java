package com.JavaAngular.example_code.models.RequestModels;

public class UserRequestModel {

    private String name;
    private String email;
    private int age;

    public UserRequestModel(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public int getAge() {
        return age;
    }

    public boolean userHasNullProperties() {
        return this.name == null || this.email == null || this.age == 0;
    }
}
