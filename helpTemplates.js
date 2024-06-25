module.exports = {
  initHelp: `Usage: myapp init <option>

Options:
  --help      displays help for the init command
  --mk        creates all the app folders
  --cat       creates the config file with default settings and the help files
  --all       creates all the folders and files`,

  configHelp: `Usage: myapp config <option>

Options:
  --help      displays help for the config command
  --show      show the contents of the config file
  --reset     reset back to default the config file
  --set <option> <value> set a specific attribute of the config file`,

  tokenHelp: `Usage: myapp token <option>

Options:
  --help      displays help for the token command
  --count     provide a count of all the tokens
  --new <username>  add a new token
  --upd p  <username> <phone> updates a JSON entry with new phone number
  --upd e <username> <email> updates a JSON entry with new email number
  --search u <username>  gets a token for a given username
  --search e <email> gets a token for a given email
  --search p <phone> gets a token for a given phone number`,
};
