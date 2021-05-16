# SMS-API
SMS API with Authentication

!!!! MAKE SURE YOU HAVE ALL THE NODE MODULES INSTALLED
### Node Modules Installation
1. Install NPM packages
   ```sh
   npm install
   ```

### Redis Server Setup (Local Server)
1. Setup the Redis Server locally for caching
2. Install redis-server
   ```sh
   sudo apt-get install redis-server
   ```
3. Enable Redis Server Service
   ```sh
   sudo systemctl enable redis-server.service
   ```
4. Start the Redis Server
   ```sh
   sudo service redis-server start
   ```
### You are ready to Go
### Clone the Repo and Start
   ```sh
   git clone https://github.com/YSAnirudh/SMS-API.git
   cd SMS-API
   npm install
   npm start
   ```
   
1. Node Server runs on PORT = process.env.PRODUCT_PORT<br>
2. Wait for mongoose to connect<br>
3. Issue requests - <br>
        &nbsp;Both these API calls need Authentication Headers (Basic). With username and password. <br>
        &nbsp;So, for this you need to create an entry in the User database. Look at POST /users/auth/create for more info.<br>
        &nbsp;POST /inbound/sms - Inbound SMS {from:"", to:"", text:""}, if there is a STOP request.<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Caches the from and to<br><br>
        &nbsp;POST /outbound/sms - Outbound SMS {from:"", to:"", text:""}, if from and to are from cached data<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Give the appropriate error that it has been BLOCKED.<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;API Call with same 'from' can make atmost 50 requests / 1 hour<br>
        &nbsp;!! NOT USED FOR ASSIGNMENT !! -<br>
        &nbsp;&nbsp;&nbsp;THERE IS ONE HARD CODED USER, "Hello" with password "MyHello". Apart from this feel free to create as many users.<br>
        &nbsp;POST /users/auth/create - To create a new User, giving their username and password, <br>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password is encrypted with 'bycrypt' <br>
        &nbsp;GET /users/auth/get - To get the existing users<br>
4. All Responses have correct HTTP Status codes and Correct json responses.<br>
