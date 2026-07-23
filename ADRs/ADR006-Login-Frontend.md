# ADR006 - Login Frontend

## Status
Proposed

## Context
Made the login form for our project. It is simple and intuitive, with an email and password field.

## Decision
The form contains a simple layout, a welcome message, a login button, an email and password field. The form also provides simple validations such as:
- error message in case there is no email provided
- error message in case there is no password provided
- error message in case either of them is wrong, but does not offer information regarding which one is wrong, such that potential hackers do not get any information regarding the credentials in order to guess said credentials.

## Consequences
- **Pros**: easy to use, intuitive, simple code
- **Cons**: simple design, not very attractive

## Date
23.07.2026