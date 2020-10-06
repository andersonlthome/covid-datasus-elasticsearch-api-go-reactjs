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
	"github.com/gorilla/mux"
	"net/http"
	"github.com/rs/cors"
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


type Response struct {
	Positive struct {
		DataNotificacao []string `json:"dataNotificacao"`
	}
	Negative struct {
		DataNotificacao []string `json:"dataNotificacao"`
	}
} 

func getDataSUS(readQuery *strings.Reader) map[string]interface{}{
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

	// Instantiate a new Elasticsearch client object instance
	client, err := elasticsearch.NewClient(cfg)
	
	// Check for connection errors to the Elasticsearch cluster
	if err != nil {
		fmt.Println("Elasticsearch connection error:", err)
	}

	// VOLTANDO VAZIO
	// "bool": {
	// 	"must": [
	// 		{
	// 		"term": { 
	// 			"resultadoTeste": "Negativo" 
	// 			} 
	// 		},	 
	// 		{
	// 			"range": {		
	// 				"dataNotificacao": {
	// 					"time_zone": "-03:00",
	// 					"gte": "2020-03-01T00:00:00",
	// 					"lte": "now"
	// 				} 	
	// 			}
	// 		}
	// 	]
	// }

	

	fmt.Println("readQuery:", readQuery)

	var buf bytes.Buffer

	// Attempt to encode the JSON query and look for errors
	if err := json.NewEncoder(&buf).Encode(readQuery); err != nil {
		log.Fatalf("json.NewEncoder() ERROR:", err)
		return nil		
	} else { // Query is a valid JSON object
		fmt.Println("json.NewEncoder encoded query:", readQuery, "\n")

		// Pass the JSON query to the Golang client's Search() method		
		
		res, err := client.Search(
			client.Search.WithContext(ctx),
			client.Search.WithIndex("desc-notificacoes-esusve-ac"),
			client.Search.WithBody(readQuery),
			client.Search.WithTrackTotalHits(true),
		)
	
		// Check for any errors returned by API call to Elasticsearch
		if err != nil {
			log.Fatalf("Elasticsearch Search() API ERROR:", err)
			return nil
			
		} else {// If no errors are returned, parse esapi.Response object
			fmt.Println("res TYPE:", reflect.TypeOf(res))
	
			// Close the result body when the function call is complete
			defer res.Body.Close()	
	
			// Instantiate a map interface object for storing returned documents
			var mapResp map[string]interface{}

			fmt.Println("typeOf res.body:", reflect.TypeOf(res.Body))

			// Decode the JSON response and using a pointer
			if err := json.NewDecoder(res.Body).Decode(&mapResp); err == nil {
				// fmt.Println(`&mapResp:`, &mapResp)
				// fmt.Println(`mapResp["hits"]:`, mapResp["hits"].(map[string]interface{})["hits"])
				fmt.Println("typeOf mapResp:", reflect.TypeOf(mapResp))
				return mapResp

				
			}
		}
	}
	return nil
}

func getFiltredFata(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	fmt.Println("params", params)

	// Create a new query string for the Elasticsearch method call
	var query =`
		"bool": {
			"must": [				
				{
					"range": {		
						"dataNotificacao": {
							"time_zone": "-03:00",
							"gte": "`+params["initDate"]+`",
							"lte": "`+params["finDate"]+`"
						} 
					}
				}
			]
		}
	`		
	// Pass the query string to the function and have it return a Reader object
	readQuery := constructQuery(query, 100)

	var dataSUS = getDataSUS(readQuery)
	
	var response Response
	
	for _, p := range dataSUS["hits"].(map[string]interface{})["hits"].([]interface{}) {	
		
		person := p.(map[string]interface{}) 
		detail := person["_source"].(map[string]interface{})

		if detail["resultadoTeste"] == "Positivo" {
			fmt.Println("positivo", detail["dataNotificacao"])
			response.Positive.DataNotificacao = append(response.Positive.DataNotificacao, detail["dataNotificacao"].(string))
		}
		if detail["resultadoTeste"] == "Negativo" {
			fmt.Println("negativo", detail["dataNotificacao"])
			response.Negative.DataNotificacao = append(response.Negative.DataNotificacao, detail["dataNotificacao"].(string))
		}
	}
	
	json.NewEncoder(w).Encode(response)	
}



func main() {
	router := mux.NewRouter()

	router.HandleFunc("/getFiltredFata/{initDate}/{finDate}", getFiltredFata).Methods("GET") ///{initDate}/{finDate}

	c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"},
        AllowCredentials: true,
	})
	
	handler := c.Handler(router)

	log.Fatal(http.ListenAndServe(":8000", handler))
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
