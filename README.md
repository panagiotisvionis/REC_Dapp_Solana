This repository contains a decentralized application (dApp) for managing Renewable Energy Certificates (RECs) on the Solana blockchain. Follow the instructions below to set up and run the application.

Prerequisites

Node.js: Ensure you have Node.js installed on your system. You can download it from here.

Anchor CLI: Install Anchor CLI to interact with Solana programs.
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked

Solana CLI: Install Solana CLI to manage Solana accounts and deployments.
-c "$(curl -sSfL https://release.solana.com/stable/install)"

Setup Instructions

Step 1: Clone the Repository
git clone https://github.com/panagiotisvionis/REC_Dapp_Solana.git
cd REC_Dapp_Solana


Step 2: Install Dependencies
npm install


Step 3: Configure the Environment
Create a .env file in the root directory and add your Solana network configuration:
CLUSTER_URL=https://api.devnet.solana.com
WALLET_PATH=/path/to/your/wallet/keypair.json


Step 4: Build the Program
Compile the Solana program using Anchor:
anchor build


Step 5: Deploy the Program
Deploy the program to the Solana devnet:
anchor deploy


Step 6: Run the Application
Execute the script to interact with the deployed smart contract:
node client.js


Contributing
Feel free to submit issues, fork the repository, and send pull requests.


License
This project is licensed under the MIT License. See the LICENSE file for details.
