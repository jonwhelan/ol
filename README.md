# OwnLocal Business API

## Purpose

Provides a JSON REST API to access business information.

# Getting Started

## Prerequisites

* Node 6.x or above
* sqlite3

## Installation

`npm install`

## Creating database

After dependencies are installed:

1. Add unzipped CSV into `./resources` and name file `engineering_project_businesses.csv`
1. Run `node src/install/index.js`. This will create a sqlite3 database file in
   `db/data.sqlite3`
