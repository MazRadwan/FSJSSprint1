# MyApp Documentation

## Overview

MyApp is a Node.js application that provides various functionalities through a command-line interface (CLI) and an Express server. The app supports initializing directories and files, managing configuration settings, handling tokens, and logging events.

## Commands

### Initialization Commands

The initialization commands help create the necessary directory and file structure for the application.

## init

### Initialize the application by creating folders and files.

**Usage:**

`myapp init <option>`

**Options:**

```
--help: Displays help for the init command.
--mk: Creates all the app folders.
--cat: Creates the config file with default settings and the help files.
--all: Creates all the folders and files.
```

**Example**
To create all necessary folders and files, run:

`myapp init --all`

## Configuration Commands

The configuration commands manage the application's configuration settings.

### config

Manage the configuration file.

**Usage:**

`myapp config <option>`

**Options:**

```
--help: Displays help for the config command.
--show: Shows the contents of the config file.
--reset: Resets the config file to default settings.
--set <key> <value>: Sets a specific attribute of the config file.
```

**Example**
To reset the configuration file to its default settings, run:

`myapp config --reset`

## Token Commands

The token commands manage user tokens, including creating new tokens, updating existing ones, and searching for tokens.

### token

Manage user tokens.

**Usage:**

`myapp token <option>`

**Options:**

```
--help: Displays help for the token command.
--count: Provides a count of all the tokens.
--new <username>: Adds a new token for the specified username.
--upd p <username> <phone>: Updates a JSON entry with a new phone number.
--upd e <username> <email>: Updates a JSON entry with a new email.
--search u <username>: Gets a token for a given username.
--search e <email>: Gets a token for a given email.
--search p <phone>: Gets a token for a given phone number.
```

**Example**
To create a new token for the user "john_doe", run:

`myapp token --new john_doe`

## Log Events

The application logs various events to files organized by date. Log entries include a timestamp, log level, message, and a unique identifier (UUID).

### Log Levels

- INFO: Informational messages about application operations.
- WARN: Warnings about potential issues.
- ERROR: Error messages indicating failed operations.

**Example:**
When a new token is created, the following log entry is made:

`20240619 12:34:56 INFO New token created for user: john_doe 123e4567-e89b-12d3-a456-426614174000`

## Help Files

Help files provide detailed usage instructions for the different commands. These files are generated in the help directory.

### Generating Help Files

Help files are automatically created when running the init command with the appropriate options.

**Example**
To generate all help files, run:

`myapp init --cat`

**Usage Examples**
Initializing the Application

`myapp init --all`

This command initializes the application by creating all necessary folders and files.

**Viewing the Configuration**

`myapp config --show`

This command displays the current configuration settings.

**Creating a New Token**

`myapp token --new john_doe`

This command creates a new token for the user "john_doe".

**Searching for a Token by Username**

`myapp token --search u john_doe`

This command searches for tokens associated with the username "john_doe".

## Express Server

The application includes an Express server that handles various routes and serves static files. The server logs page access and handles errors gracefully.

### Running the Server

The server listens on the port specified by the PORT environment variable or defaults to port 3000.

**Routes:**

```
/home: Renders the home page.
/token: Handles token-related requests.
/count: Displays the token count.
```

**Error Handling**
The server logs errors and renders appropriate error pages for 404 and 500 status codes.

**Logging**
Logging is handled through an event emitter. Logs are saved in a structured directory format, with separate log files for events and errors.

**Example Log Entry:**
`20240619 12:34:56 INFO New token created for user: john_doe 123e4567-e89b-12d3-a456-426614174000`

This entry logs the creation of a new token for the user "john_doe".

## Conclusion

MyApp provides a robust framework for initializing an application, managing configurations, handling tokens, and logging events. The included help files and logging system ensure that the application is easy to use and maintain.
