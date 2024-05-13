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

	_, err := DB.Exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL , email TEXT NOT NULL UNIQUE,password TEXT NOT NULL, role TEXT NOT NULL, bio TEXT, affiliation TEXT, years_of_experience INTEGER, is_locked BOOLEAN DEFAULT FALSE)")
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
	user := GetUser(email)
	if user.Id != -1 {
		return user.Id
	}
	user.Name = name
	user.Email = email
	user.Password = password
	user.Role = role
	return InsertUser(user)
}

func InsertUser(user User) int {

	row, err := DB.Exec("INSERT INTO users (name ,email, password, role, bio, affiliation, years_of_experience) VALUES (?, ?, ?, ?, ?, ?, ?)", user.Name, user.Email, user.Password, user.Role, user.Bio, user.Affiliation, user.YearsOfExperience)

	if err != nil {
		return -1
	}

	ID,err := row.LastInsertId()
	
	if err != nil{
		return -1
	}
	
	return int(ID)
}

func GetUser(email string) User {
	var user User
	err := DB.QueryRow("SELECT id, name, email, role, bio, affiliation, years_of_experience FROM users WHERE email = ?", email).Scan(&user.Id, &user.Name, &user.Email, &user.Role, &user.Bio, &user.Affiliation, &user.YearsOfExperience)
	if err != nil {
		return User{-1,"","","","","","",-1,false}
	}
	return user 
}

func GetPassword(email string) string {
	var password string
	err := DB.QueryRow("SELECT password FROM users WHERE email = ?", email).Scan(&password)
	if err != nil {
		return ""
	}
	return password
}

func GetUsers() []User {
	rows, err := DB.Query("SELECT id, name, email, role, bio, affiliation, years_of_experience FROM users")
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	users := []User{}

	for rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Name, &user.Email, &user.Role, &user.Bio, &user.Affiliation, &user.YearsOfExperience)
		if err != nil {
			panic(err)
		}
		users = append(users, user)
	}
	return users
}

func UpdateUser(user User) bool {
	query := "UPDATE users SET name = ?, email = ?, role = ?, bio = ?, affiliation = ?, years_of_experience = ? "
	if user.Password != "" {
		query += ", password = "+user.Password
	}
	_, err := DB.Exec(query+" WHERE id = ?", user.Name, user.Email, user.Role, user.Bio, user.Affiliation, user.YearsOfExperience, user.Id)
	return err == nil
}