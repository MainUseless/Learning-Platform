package main

import (
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id int `json:"id"`
	Email	string `json:"email"`
	Password	string `json:"password"`
	Name string `json:"name"`
	Role string `json:"role"`
	Bio string `json:"bio"`
	Affiliation string `json:"affiliation"`
	YearsOfExperience int `json:"years_of_experience"`
	IsLocked bool `json:"is_locked"`
}

func SignIn(ctx *fiber.Ctx) error {
	var data map[string]string
	err := ctx.BodyParser(&data)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "error in parsing data",
		})
	}

	if data["email"] == "" || data["password"] == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing fields2"})
	}


	user := GetUser(data["email"])
	password := GetPassword(data["email"])
	if user.Id == -1 || password == "" {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Account not found"})
	}

	if(user.IsLocked){
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Account is locked"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(data["password"]))

	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Incorrect Email or password"})
	}

	claims := jwt.MapClaims{
		"id":    user.Id,
		"name":  user.Name,
		"role":  user.Role,
		"email": user.Email,
		"bio": user.Bio,
		"affiliation": user.Affiliation,
		"years_of_experience": user.YearsOfExperience,
		// "exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Error in signing token"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": signedToken,
	})
}


func SignUp(ctx *fiber.Ctx) error {
	
	var user User
	if err := ctx.BodyParser(&user)
	err != nil {
		log.Println(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "error in parsing data",
		})
	}

	if user.Email == "" || user.Password == "" || user.Name == "" || user.Role == "" || user.Bio == "" || user.Affiliation == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing fields2"})
	}

	isMatch, _ := regexp.MatchString("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$", user.Email)

	if !isMatch {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid email"})
	}
	
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error in hashing password",
		})
	}

	user.Password = string(hashedPassword)

	// for key, value := range data {
	// 	fmt.Println("Key:", key, "Value:", value)
	//   }

	id := InsertUser(user)
	if id == -1 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Account already exists or error in creating account",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON("Account created")

}

func Auth(ctx *fiber.Ctx) error{
	return ctx.Status(fiber.StatusOK).JSON("Authenticated")
}

func GetAccounts(ctx *fiber.Ctx) error {
	claims := ctx.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	role := claims["role"].(string)

	if strings.ToUpper(role) != "ADMIN" {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	users := GetUsers()
	return ctx.Status(fiber.StatusOK).JSON(users)
}

func UpdateAccount(ctx *fiber.Ctx) error{
	claims := ctx.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	role := claims["role"].(string)

	if strings.ToUpper(role) != "ADMIN" {
		return ctx.SendStatus(fiber.StatusUnauthorized)
	}

	var user User
	if err := ctx.BodyParser(&user); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error in parsing data",
			"message": err.Error(),
		})
	}

	if user.Email == "" || user.Name == "" || user.Role == "" || user.Bio == "" || user.Affiliation == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing fields2"})
	}

	isMatch, _ := regexp.MatchString("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$", user.Email)

	if !isMatch {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid email"})
	}

	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Error in hashing password",
			})
		}

		user.Password = string(hashedPassword)
	}
	
	updated := UpdateUser(user)
	if !updated {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error in updating account",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON("Account updated")

}

func GetAccount(ctx *fiber.Ctx) error {
	id := ctx.Query("id")

	if id == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing email"})
	}

	user := GetUserById(id)

	if strings.ToLower(user.Role) == "admin" {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	if user.Id == -1 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Account not found"})
	}

	return ctx.Status(fiber.StatusOK).JSON(user)
}