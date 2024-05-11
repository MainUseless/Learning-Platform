package main

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/mattn/go-sqlite3"
)

func checkEnv(){

	if os.Getenv("JWT_SECRET") == "" {
		os.Setenv("JWT_SERRET", "secret")
	}

}

func main() {

	checkEnv()
	Connect()
	defer DB.Close()
	// Fiber instance
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: strings.Join([]string{
			fiber.MethodGet,
			fiber.MethodPost,
			fiber.MethodHead,
			fiber.MethodPut,
			fiber.MethodDelete,
			fiber.MethodPatch,
		}, ","),
	}))
	app.Use(logger.New())

	SetupRoutes(app)

	// for _, route := range app.GetRoutes() {
	// 	fmt.Printf("%s %s\n", route.Method, route.Path)
	// }

	// start server
	app.Listen(":8081")
}
