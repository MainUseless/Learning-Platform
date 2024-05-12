package main

import (
	"log"
	"os"
	"regexp"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email	string `json:"email"`
	Password	string `json:"password"`
	Name string `json:"name"`
	Role string `json:"role"`
	Bio string `json:"bio"`
	Affiliation string `json:"affiliation"`
	YearsOfExperience string `json:"years_of_experience"`
}

func SignIn(ctx *fiber.Ctx) error {
	var data map[string]string
	err := ctx.BodyParser(&data)
	if err != nil {
		log.Println(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "error in parsing data",
		})
	}

	if data["email"] == "" || data["password"] == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing fields2"})
	}


	id,name,password,role,bio,affiliation,yearsOfExperience := GetUser(data["email"])

	if id == -1 {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Account not found"})
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(data["password"]))

	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Incorrect Email or password"})
	}

	claims := jwt.MapClaims{
		"id":    id,
		"name":  name,
		"role":  role,
		"email": data["email"],
		"bio": bio,
		"affiliation": affiliation,
		"years_of_experience": yearsOfExperience,
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
	
	var data map[string]string
	if err := ctx.BodyParser(&data)
	err != nil {
		log.Println(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "error in parsing data",
		})
	}

	if data["email"] == "" || data["password"] == "" || data["role"] == "" || data["name"] == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing fields2"})
	}

	isMatch, _ := regexp.MatchString("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$", data["email"])

	if !isMatch {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid email"})
	}
	
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data["password"]), bcrypt.DefaultCost)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Error in hashing password",
		})
	}

	data["password"] = string(hashedPassword)
	
	if(yearsOfExperience=="")
		yearsOfExperience = "0"

	yearsOfExperience, err := strconv.Atoi(data["years_of_experience"])
    if err != nil {
        return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid years of experience",
		})

    }

	// for key, value := range data {
	// 	fmt.Println("Key:", key, "Value:", value)
	//   }

	id := InsertUser(data["name"],data["email"],data["password"],data["role"],data["bio"],data["affiliation"],yearsOfExperience)
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