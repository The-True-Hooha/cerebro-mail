package routes

import (
	"net/http"
)

func RegisterAuthRoutes(router *http.ServeMux) {
	router.HandleFunc("/auth/login", handleLogin)
	router.HandleFunc("/auth/register", handleRegister)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"message": "Login successful"}`))
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"message": "Registration successful"}`))
}