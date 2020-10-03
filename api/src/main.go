package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"reflect"
	"strconv" // typecast "size" int as string
	"strings"
	// Import the Elasticsearch library packages
	"github.com/elastic/go-elasticsearch"
)

func constructQuery(q string, size int) *strings.Reader {
	// Build a query string from string passed to function
	var query = `{"query": {`
	// Concatenate query string with string passed to method call
	query = query + q
	// Use the strconv.Itoa() method to convert int to string
	query = query + `}, "size": ` + strconv.Itoa(size) + `}`
	fmt.Println("\nquery:", query)
	// Check for JSON errors
	isValid := json.Valid([]byte(query)) // returns bool
	// Default query is "{}" if JSON is invalid
	if isValid {
		fmt.Println("constructQuery() valid JSON:", isValid)
	} else {
		fmt.Println("constructQuery() ERROR: query string not valid:", query)
		fmt.Println("Using default match_all query")
		query = "{}"
	}
	// Build a new string from JSON query
	var b strings.Builder
	b.WriteString(query)
	// Instantiate a *strings.Reader object from string
	read := strings.NewReader(b.String())
	// Return a *strings.Reader object
	return read
}

// func searchOfClient(client *elasticsearch.Client, ctx *context.emptyCtx, index string, read *strings.Reader, trackTotalHits boolean) *esapi.Response {
// 	res, err := client.Search(
// 		client.Search.WithContext(ctx),
// 		client.Search.WithIndex(index),
// 		client.Search.WithBody(read),
// 		client.Search.WithTrackTotalHits(true),
// 	)

// 	// Check for any errors returned by API call to Elasticsearch
// 	if err != nil {
// 		log.Fatalf("Elasticsearch Search() API ERROR:", err)
		
// 	} else {// If no errors are returned, parse esapi.Response object
// 		fmt.Println("res TYPE:", reflect.TypeOf(res))

// 		// Close the result body when the function call is complete
// 		defer res.Body.Close()

// 		fmt.Println("res.body", res.Body)
// 		// Decode the JSON response and using a pointer
// 		if err := json.NewDecoder(res.Body).Decode(&mapResp); err == nil {
// 			fmt.Println(`&mapResp:`, &mapResp, "\n")
// 			fmt.Println(`mapResp["hits"]:`, mapResp["hits"])
// 		}
// 	}
// }

func main() {

	// Allow for custom formatting of log output
	log.SetFlags(0)

	// Create a context object for the API calls
	ctx := context.Background()

	// Instantiate an Elasticsearch configuration
	cfg := elasticsearch.Config{
		Addresses: []string{
			"https://elasticsearch-saps.saude.gov.br/",
		},
		Username: "user-public-notificacoes",
		Password: "Za4qNXdyQNSa9YaA",
	}
	// "https://elasticsearch-saps.saude.gov.br/desc-notificacoes-esusve-*/_search?pretty",


	// Instantiate a new Elasticsearch client object instance
	client, err := elasticsearch.NewClient(cfg)
	
	// Check for connection errors to the Elasticsearch cluster
	if err != nil {
		fmt.Println("Elasticsearch connection error:", err)
	}

	// Create a new query string for the Elasticsearch method call
	var query =`
		"bool": {
			"must": [
				{
				"term": { 
					"resultadoTeste": "Negativo" 
					} 
				},	ERRADO PARA FAZER A API BUSCAR DADOS	 
				{
					"range": {		
						"dataNotificacao": {
							"time_zone": "-03:00",
							"gte": "2020-03-01T00:00:00",
							"lte": "now"
						} 	
					}
				}
			]
		}
	`
	// "bool": {
	// 	"must": {
	// 		"term": { "resultadoTeste": "Negativo" } 
	// 	}
	// },

	
	// Pass the query string to the function and have it return a Reader object
	read := constructQuery(query, 10)

	// Example of an invalid JSON string
	//read = constructQuery("{bad json", 2)

	fmt.Println("read:", read)

	var buf bytes.Buffer

	// Attempt to encode the JSON query and look for errors
	if err := json.NewEncoder(&buf).Encode(read); err != nil {
		log.Fatalf("json.NewEncoder() ERROR:", err)		
	} else { // Query is a valid JSON object
		fmt.Println("json.NewEncoder encoded query:", read, "\n")

		// Pass the JSON query to the Golang client's Search() method		
		// fmt.Println(reflect.TypeOf(res))
		// searchOfClient(client, ctx, "desc-notificacoes-esusve-ac", read, true)

		res, err := client.Search(
			client.Search.WithContext(ctx),
			client.Search.WithIndex("desc-notificacoes-esusve-ac"),
			client.Search.WithBody(read),
			client.Search.WithTrackTotalHits(true),
		)
	
		// Check for any errors returned by API call to Elasticsearch
		if err != nil {
			log.Fatalf("Elasticsearch Search() API ERROR:", err)
			
		} else {// If no errors are returned, parse esapi.Response object
			fmt.Println("res TYPE:", reflect.TypeOf(res))
	
			// Close the result body when the function call is complete
			defer res.Body.Close()
	
			fmt.Println("res.body", res.Body)
			
			// Instantiate a map interface object for storing returned documents
			var mapResp map[string]interface{}

			type Message struct {
				hits      json.RawMessage
			} 
			var m Message

			// Decode the JSON response and using a pointer
			if err := json.NewDecoder(res.Body).Decode(&mapResp); err == nil {
				fmt.Println(`&mapResp:`, &mapResp)
				fmt.Println(`mapResp["hits"]:`, mapResp["hits"])
				
				// if err := json.Unmarshal([]byte(res.Body), &m); err != nil {
				// 	log.Fatal(err)
				// }
				// fmt.Println(m)
				// for index, item := range mapResp["hits"] {
				// 	fmt.Println(item)
				// }
			}
		}		
	}

	// router.HandleFunc("/contato/{id}", getFiltredFata).Methods("POST")

	// func getFiltredFata(w http.ResponseWriter, r *http.Request) {}
}