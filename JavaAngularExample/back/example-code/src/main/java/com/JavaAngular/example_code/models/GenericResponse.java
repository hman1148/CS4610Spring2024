package com.JavaAngular.example_code.models;

public class GenericResponse<T> {

    private T item;
    private String message;
    private boolean success;

    public GenericResponse(T item, String message, boolean success) {
        this.item = item;
        this.message = message;
        this.success = success;
    }

    public T getItem() {
        return item;
    }

    public void setItem(T item) {
        this.item = item;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
