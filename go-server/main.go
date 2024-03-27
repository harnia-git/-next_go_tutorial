package main

import (
    "encoding/json"
    "log"
    "net/http"
)

type Message struct {
    Text string `json:"text"`
}

func main() {
    http.HandleFunc("/api/data", dataHandler)
    log.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func dataHandler(w http.ResponseWriter, r *http.Request) {
    // シンプルなCORS設定: 本番環境ではもっと厳格に設定するべきです
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Content-Type", "application/json")
    message := Message{Text: "Hello from Go Backend!"}
    json.NewEncoder(w).Encode(message)
}
