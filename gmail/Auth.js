const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const Filter = require('./Filter');

class Auth{
    constructor(credentials, callback){
        this.credentials = credentials;
        this.callback = callback;
        this.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose','https://www.googleapis.com/auth/gmail.send','https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/calendar.events','https://www.googleapis.com/auth/calendar'];
            // The file token.json stores the user's access and refresh tokens, and is
            // created automatically when the authorization flow completes for the first
            // time.
        this.TOKEN_PATH = 'token.json';
        this.authorize(this.credentials, this.callback);
    }
    // If modifying these scopes, delete token.json.

    // Load client secrets from a local file.

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err, token) => {
            if(err){
                return this.getNewToken(oAuth2Client, callback);
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */

    getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', this.TOKEN_PATH);
            });
            callback(oAuth2Client);
            });
        });
    }


}

function getAuth(auth){
    /*var Drive = require('./../drive/Drive');
    var dem1 = new Drive(auth,'share','Webathon Projects',null,'jaiparakh.10@gmail.com');
    
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        //q: "mimeType='application/vnd.google-apps.folder'",
        q: "('jaiparakh.kota.10@gmail.com' in owners) and (mimeType='application/vnd.google-apps.folder') and (name='Sem-6') and (starred=true)"
    }).then(res => console.log(res.data.files));*/
    /*const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });*/

    /*var Drive = require('./../drive/Drive');
    const dem = new Drive(auth,'download');*/

    var Che = require('./check');
    
    var che = new Che(auth);
    
    console.log("Yooo");
    che.checkForCollegeMails().then(data => {
        //var fg = new Filter(data);
        //fg.filter_content();
        //console.log(data[0]);
        //fs.writeFileSync('data.json',JSON.stringify(data));
        //console.log(data)
    });
    /*che.getMail('170d30b403941e9e').then(d => {
        console.log(d);
    })*/
/*
    var Calendar = require('./../calendar/Calendar');
    var cal = new Calendar(auth);
    cal.addEvent("rrrrr","Lets see if this works",'2020-03-16T11:00:00','2020-03-18T11:00:00')*/
}
fs.readFile('credentials.json', (err, content) => {
    if(err){
        return console.log('Error loading client secret file:', err);
    }

    // Authorize the client with credentials, then call the Gmail API.
    var auth = new Auth(JSON.parse(content), getAuth);
});