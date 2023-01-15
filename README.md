# Lipa API
This is a REST API for the scan-to-pay App.

## Why?
The API processes requests from the client app to enable online payments after scanning a QR Code.

## How it works
The API is built on the M-Pesa API and Postgres database using Prisma ORM. It operates on the following principles:
* The client sends a POST request to the appropriate server endpoint.
* The request body is destructured and authenticated using Auth0.
* The request data is passed to M-Pesa function.
* M-Pesa API validates token and sends push payment request to the client.
* After client enters M-Pesa PIN and confirms payment, a callback is sent to the server containing payment details.
* Payment details are then formatted and stored in a Postgres database using Prisma.
* Client is notified by M-Pesa that the payment was successful.
* Merchant is notified via SMS that the payment was received.

## Languages/frameworks
* JavaScript
* NodeJS(Express)
* Prisma ORM
* GraphQL
* Postgres
* Auth0
