# OwnLocal Business API

## Purpose

Provides a JSON REST API to access business information.

# Getting Started

## Prerequisites

* Node 6.x or above
* sqlite3

## Installation

`npm install`

## Creating the Database

After dependencies are installed:

1. Add unzipped CSV into `./resources` and name file `engineering_project_businesses.csv`
1. Run `node src/install/index.js`. This will create a sqlite3 database file in
   `db/data.sqlite3`

## Running the Application

`npm run app`

## Running Tests

`npm test`

# API Documentation

## Get business by ID
 `GET /businesses/{id}`

Responses:

* `200 OK`
  ```json
   {
       "id": 1,
       "uuid": "2859d6e0-1cb9-4fe9-bc00-97823a9fa4cb",
       "name": "Business name",
       "address": "1 Street",
       "address2" "Suite 2",
       "city": "Austin",
       "state": "TX",
       "zip": "78704",
       "country": "US",
       "phone": "5551112323",
       "website": "http://example.com",
       "created_at": "2012-12-10 16:17:58"
   }
   ```

* `404 Not Found`
