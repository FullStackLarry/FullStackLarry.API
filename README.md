# AUTHORIZATION

## Log In

## POST /v1/auth/login<br />

### Request Body:<br />

{
"email": "email@domain.com",
"password": "password"
}<br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{
"token": "authorization token"
}<br />

#### Failure Status code(s): 400, 401, 500<br />

{
"error": "error message"
}<br />

## Register

## POST /v1/auth/register<br />

### Request Body:<br />

{
"email": "email@domain.com",
"firstName": "first name",
"lastName": "last name",
"password": "password"
}<br />

### Response Body:<br />

#### Success Status code(s): 201<br />

\<No Content\><br />

#### Failure Status code(s): 200, 400, 500<br />

{
"error": "error message"
}<br />

## Send Validation Email

## POST /v1/auth/sendemail<br />

### Request Body:<br />

{
"email": "email@domain.com",
}<br />

### Response Body:<br />

#### Success Status code(s): 204<br />

\<No Content\><br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Validate Email

## POST /v1/auth/validateemail<br />

### Request Body:<br />

{
"email": "email@domain.com",
"code": "validation code",
}<br />

### Response Body:<br />

#### Success Status code(s): 204<br />

\<No Content\><br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

<hr />

# USERS

## Get Avatar URL List

## GET /v1/users/avatars/list<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

\<No Content\><br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{
"avatarList": ["avatar urls"]<br />
}<br />

#### Failure Status code(s): \<None Defined\><br />

## Get User Info

## GET /v1/users<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

\<No Content\><br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{
"\_id": "id",
"email": "email",
"firstName": "first name",
"lastName": "last name",
"avatarUrl": "avatar url"
}<br />

#### Failure Status code(s): 500<br />

{
"error": "error message"
}<br />

## Get User Info By Id

## GET /v1/users/:userId<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

\<No Content\><br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{
"\_id": "id",
"email": "email",
"firstName": "first name",
"lastName": "last name",
"avatarUrl": "avatar url"
}<br />

#### Failure Status code(s): 500<br />

{
"error": "error message"
}<br />

## Update User

## PUT /v1/users<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

{
"firstName": "first name",
"lastName": "last name",
"avatarUrl": "avatar url"
}<br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{
"email": "email",
"firstName": "first name",
"lastName": "last name",
"avatarUrl": "avatar url",
"assignees": [assignee list],
"tasks": [task list]
}<br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

<hr />

# TASK MANAGER

## Get Assignees

## GET /v1/TM/assignees<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

\<No Content\><br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{
[assignees]
}<br />

#### Failure Status code(s): 500<br />

{
"error": "error message"
}<br />

## Add Assignee

## POST /v1/TM/assignees<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

{
"email": "email@domain.com",
}<br />

### Response Body:<br />

#### Success Status code(s): 201<br />

\<No Content\><br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Get Tasks For Assignee

## GET /v1/TM/tasks/:assigneeId<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

\<No Content\><br />

### Response Body:<br />

#### Success Status code(s): 200<br />

[tasks array]<br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Add Task

## POST /v1/TM/tasks<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

{
"assignedTo": "user id",
"name": "task name",
"description": "task description"
"status": "task status",
"assignedDate": "assigned date",
"startedDate": "started date",
"completedDate": "completed date"
}<br />

### Response Body:<br />

#### Success Status code(s): 201<br />

\<No Content\><br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Update Task

## PUT /v1/TM/tasks<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

{
"\_id": "task id",
"assignedTo": "user id",
"name": "task name",
"description": "task description"
"status": "task status",
"assignedDate": "assigned date",
"startedDate": "started date",
"completedDate": "completed date"
}<br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{ updated task object }<br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Get Task Notes For Task

## GET /v1/TM/tasknotes/:taskid<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

\<No Content\><br />

### Response Body:<br />

#### Success Status code(s): 200<br />

[task notes array]<br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Add Task Note

## POST /v1/TM/tasknotes<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

{
"taskId": "task id",
"note": "task note",
"enteredDate": "entered date"
}<br />

### Response Body:<br />

#### Success Status code(s): 201<br />

\<No Content\><br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

## Update Task Note

## PUT /v1/TM/tasknotes<br />

### Request Headers:<br />

authorization: Bearer \<Authorization Token\>

### Request Body:<br />

{
"\_id": "task note id",
"taskId": "task id",
"note": "task note",
"enteredDate": "entered date"
}<br />

### Response Body:<br />

#### Success Status code(s): 200<br />

{ updated task note }<br />

#### Failure Status code(s): 400, 500<br />

{
"error": "error message"
}<br />

<hr />
