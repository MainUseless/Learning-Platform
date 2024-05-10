package main

import (
	"database/sql"

	"golang.org/x/crypto/bcrypt"
)


var DB *sql.DB

func Connect(){
	var err error
	DB, err = sql.Open("sqlite3", "./mydatabase.db")
	if err != nil {
		panic(err)
	}
	
	InitUsers()
}

func InitUsers(){
	// Create a table

	_, err := DB.Exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL , email TEXT NOT NULL UNIQUE,password TEXT NOT NULL, role TEXT NOT NULL)")
	if err != nil {
		panic(err)
	}

	// Hash a password
	AdminPassword :="Admin"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(AdminPassword), bcrypt.DefaultCost)

	if err != nil {
		panic(err)
	}
	
	InsertUserIfNotExist("Admin","Admin", string(hashedPassword), "Admin")
}

func InsertUserIfNotExist(name string,email string, password string, role string) int {
	id,_,_,_ := GetUser(email)
	if id != -1 {
		return id
	}
	return InsertUser(name,email, password, role)
}

func InsertUser(name string, email string, password string, role string) int {

	row, err := DB.Exec("INSERT INTO users (name ,email, password, role) VALUES (?, ?, ?, ?)", name, email, password, role)

	if err != nil {
		return -1
	}

	ID,err := row.LastInsertId()
	
	if err != nil{
		return -1
	}
	
	return int(ID)
}

func GetUser(email string) (int, string, string, string) {
	var id int
	var password string
	var role string
	var name string
	err := DB.QueryRow("SELECT id, name, password, role FROM users WHERE email = ?", email).Scan(&id, &name, &password, &role)
	if err != nil {
		// panic(err)
		return -1, "", "",""
	}
	return id, name, password, role
}