# AlgoVerify

AlgoVerify is a Discord verification system (bot + website) for Algorand projects on [algoverify.me](https://www.algoverify.me).

## Table of Contents

- [AlgoVerify](#algoverify)
  - [Table of Contents](#table-of-contents)
  - [Used Technologies](#used-technologies)
  - [How to use AlgoVerify](#how-to-use-algoverify)
  - [API](#api)
  - [Create your own AlgoVerify bot](#create-your-own-algoverify-bot)
    - [Prerequisites](#prerequisites)
      - [Step 1: Obtain a VPS](#step-1-obtain-a-vps)
      - [Step 2: Configuring the VPS](#step-2-configuring-the-vps)
      - [Step 3: Clone the repository](#step-3-clone-the-repository)
      - [Step 4: Set domain records](#step-4-set-domain-records)
      - [Step 5: Install Docker](#step-5-install-docker)
      - [Step 6: Edit the config file](#step-6-edit-the-config-file)
      - [Step 7: Run the bot](#step-7-run-the-bot)
      - [Step 8: Go to your bot's admin panel to add your projects](#step-8-go-to-your-bots-admin-panel-to-add-your-projects)
    - [For Advanced Users](#for-advanced-users)
  - [Contributing](#contributing)
  - [License](#license)

## Used Technologies

- Frontend: <a href="https://reactjs.org/" target="_blank"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a> <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
- Backend: <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a> <a href="https://expressjs.com/" target="_blank"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" /></a>
- Database: <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
- Discord Bot: <a href="https://discord.js.org/" target="_blank"><img src="https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js" /></a>
- Other: <a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a> <a href="https://caddyserver.com/" target="_blank"><img src="https://img.shields.io/badge/Caddy-00ADD8?style=for-the-badge&logo=caddy&logoColor=white" alt="Caddy" /></a>

## How to use AlgoVerify

1. **For Users**
    If you are a user, you can use AlgoVerify to verify yourself for Algorand projects. You can find the list of projects [here](https://www.algoverify.me/collections).
2. **For Project Owners**
    If you are a project owner, you can use AlgoVerify to verify your users. You can find the apply form [here](https://algoverify.me/apply). It's free to use. You can also host your own AlgoVerify bot. You can find the instructions below.
3. **For Developers**
    If you are a developer, you can contribute to AlgoVerify. You can also use AlgoVerify's API to get data about projects and users. You can find the documentation [here](https://algoverify.me/api-docs).

## API

You can use our API to get data about projects and users. You can find the documentation [here](https://algoverify.me/api-docs).

## Create your own AlgoVerify bot

This guide will walk you through the process of obtaining a VPS, configuring it to meet the required specifications, and installing AlgoVerify bot on it. Follow these step-by-step instructions to ensure a smooth setup.

### Prerequisites

- A cloud hosting account (e.g. [DigitalOcean](https://m.do.co/), [Azure]( https://azure.microsoft.com/), [AWS](https://aws.amazon.com/), [Google Cloud](https://cloud.google.com/), etc.)
- A domain name (e.g. `algoverify.me`)
- A Discord bot (see [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot))
- Discord oauth2 client id. (see [here](https://discordjs.guide/oauth2/#oauth2-setup)). You don't need to generate a OAuth2 URL, you can use the one in the config file. You need to get your client id and set up a redirect URL for your domain.

#### Step 1: Obtain a VPS

Choose a cloud provider and create an account.

We recommend selecting a VPS with at least `1 CPU and 2GB RAM`. Ensure that the operating system is Ubuntu (at least 20.04). You can follow the guides below to create a VPS on your preferred cloud provider:

- If you are using DigitalOcean, you can follow [this guide](https://www.digitalocean.com/docs/droplets/how-to/create/).
- If you are using Azure, you can follow [this guide](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal).
- If you are using AWS, you can follow [this guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html).
- If you are using Google Cloud, you can follow [this guide](https://cloud.google.com/compute/docs/quickstart-linux).

#### Step 2: Configuring the VPS

Access your VPS control panel and navigate to the security settings. Open ports 80 and 443 to allow web traffic. This is crucial for the bot to function properly.

- If you are using DigitalOcean, you can follow [this guide](https://www.digitalocean.com/docs/networking/firewalls/how-to/configure-rules/).
- If you are using Azure, you can follow [this guide](https://docs.microsoft.com/en-us/azure/virtual-network/tutorial-filter-network-traffic).
- If you are using AWS, you can follow [this guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html).
- If you are using Google Cloud, you can follow [this guide](https://cloud.google.com/vpc/docs/using-firewalls).

#### Step 3: Clone the repository

Connect to your VPS via SSH. In the terminal, run the following commands to clone the repository and navigate to the directory:

Firstly, connect to your VPS via SSH. In the terminal, run the following commands to clone the repository and navigate to the directory:

```bash
ssh your-username@your-server-ip
```

Then run the following commands to clone the repository and navigate to the directory:

```bash
sudo apt update && sudo apt upgrade -y
git clone https://github.com/algovado/algoverify
cd algoverify
```

#### Step 4: Set domain records

You need to set up an A record pointing to your server's public IP address.
You can follow the guides below to set up an A record on your preferred domain provider:

- If you are using Cloudflare, you can follow [this guide](https://support.cloudflare.com/hc/en-us/articles/360019093151-Managing-DNS-records-in-Cloudflare).
- If you are using GoDaddy, you can follow [this guide](https://www.godaddy.com/help/add-an-a-record-19238).
- If you are using Namecheap, you can follow [this guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain).

#### Step 5: Install Docker

Run the following commands to install Docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
```

#### Step 6: Edit the config file

Open the config.conf file using a text editor. We recommend using Nano for simplicity:

```bash
nano config.conf
```

Fill in the required fields and save the file. Read the comments in the config file thoroughly to understand what each field does.

#### Step 7: Run the bot

Once you've configured the config.conf file, save and exit the text editor. Start the AlgoVerify bot using Docker Compose:

```bash
sudo docker compose --env-file ./config.conf up -d --build
```

This will start the bot in the background. First start can take around 10 minutes depending on your configuration. You can check the logs using the following command:

```bash
docker compose logs
```

If everything is configured correctly, you should visit your domain and see the AlgoVerify website. You can also check the status of the containers using the following command:

#### Step 8: Go to your bot's admin panel to add your projects

Go to `your-domain.com/panel` and login with credentials that you set in config.conf file.
Then go to projects page and add your projects. After adding projects must add creator wallets to your projects. You can also add project assets, which are assets that will have special roles in your Discord.

You can also set up blacklisted assets for projects as well. Look around and see what you can do.

### For Advanced Users

[config.conf](/config.conf) file contains some properties that we don't recommend normal users to change. Here we will explain what do they do and why they can be useful.

> **BASE_URL**: This base URL is used to create absolute URLs to website on Discord bot. We decoupled this from `DOMAIN` to make sure our bot also runs well behind an already existing reverse proxy. `DOMAIN` is only used on the Caddyfile, the config file of the reverse proxy. So in order to use our service behind already existing reverse proxy, you can set `DOMAIN` like `localhost:2314` and you can use your already existing reverse proxy to redirect the traffic to `localhost:2314`. [Here](https://caddyserver.com/docs/caddyfile/concepts#addresses) you can find more information about Caddyfile addresses and examples.

> **DATABASE_URL**: This is the connection URI of the database. This code only supports PostgreSQL by default. If you want to use another database, you should change the code. You can find the connection string format of PostgreSQL [here](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).

> **NODE_ENV**: This is the environment of the application. You should keep this in production mode. If you set this to development, the application will be in development mode. In development mode, the application will log more information and may cause some security risks. This is useful for debugging.

> **REVERSE_PROXY_COUNT**: This is the number of reverse proxies that are in front of the application. This is useful for detecting the real IP address of the user. Even if you are not using a reverse proxy, there is one (Caddy) included with AlgoVerify, so you should keep this at 1. If you are using another reverse proxy, you should set this to the `number of reverse proxies + 1`. For example, if you are using Nginx, you should set this to 2. If you are using Nginx and another reverse proxy, you should set this to 3. If you are not using a reverse proxy, you should set this to 1 as there is one (Caddy) included with AlgoVerify.

## Contributing

We are open to contributions. You can open up an issue or a pull request. We will be happy to review your contributions.

Feel free to open up an issue if you have any questions or suggestions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This project became open source thanks to the Algorand Foundation's [xGov](https://xgov.algorand.foundation) program.

![af](frontend/public/images/af_logo.svg)
