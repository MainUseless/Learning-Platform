package main

import (
	"os"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Post("/signup", SignUp)

	app.Post("/signin", SignIn)

	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(os.Getenv("JWT_SECRET"))},
	}))

	app.Get("/auth", Auth)
	app.Get("/users", GetAccounts)
	app.Put("/users", UpdateAccount)
	app.Get("/user", GetAccount)
}