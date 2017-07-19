package main

import (
	"html/template"
	"net/http"

	"github.com/fatih/color"
)

// Page is a representation of a page
type Page struct {
	Body []byte
}

// PORT is the port you want the server to run on
const PORT string = "8080"

// Handle requests to '/' and serve index.html
func homeHandler(w http.ResponseWriter, r *http.Request) {
	p := &Page{}
	t, _ := template.ParseFiles("./dist/index.html")
	t.Execute(w, p)
}

func main() {
	// Make the dist folder statically available through the server
	http.Handle("/dist/", http.StripPrefix("/dist/", http.FileServer(http.Dir("./dist"))))

	http.HandleFunc("/", homeHandler)

	// Listen on the port specified
	color.Green("=> Server listening on http://localhost:" + PORT)
	http.ListenAndServe(":"+PORT, nil)
}
