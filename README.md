# Daba finance Senior Backend Engineer Test

This is the code base for the senior backend engineer test. The aim is to build a graphql apis for a payments system.

## Installation

-   clone repo.
-   Run `npm install` to install packages.
-   Run `npm run dev` to start project

## Features

-   Users can create account.
-   Users can Log into their account.
-   Users can check account details.
-   Users can check balance.
-   Users can check their transactions history.
-   Users can transfer to other users

## Tech Stack

-   **TypeScript** as the programming language.
-   **Apollo graphql + NodeJS** on the backend.
-   **[MongoDB](https://www.mongodb.com/)** for Database storage.
-   **[Kafka](https://www.confluent.io/)** for messaging.

## Challenges, Implementation, and optimization

#### How to accesss secure endpoints

Operations like getting account details, balance, transactions history, making transafer are all secure operations that need the user to be authenticated before performing them. I implemented an access token feature with JWTs to handle this. When a user logs in or creates an account, a JWT accessToken is generated for them that can be used to make requests to the secure endpoints. The accessToken contains the userId as payload and should be sent in the authorization header when making requests.

#### How to make transfer

The transfer operation is a very delicate one that involves three separate operations that must all succeed or fail together. The sender needs to be debited, the recipient needs to be credited, and the transaction needs to be recorded. I made use of mongodb transactions to handle this. If one operation fails then they all fail and everything is rolled back. After all operations succeed then the transaction is commited.

#### A transfer loophole

There is a potential loophole when making transfers. A sender can supply his email address and want to make transfer to himself. This is a very dangerous loophole that could potentially allow users to keep increasing their account balanace. So to block this loophole, before a transfer is made we check if the recipient is the same as the sender then disallow it.

## Future work

-   Documentation of the APIs and what expected request and response looks like
-   Write unit and integration tests.
-   Implement a kafka consumer
