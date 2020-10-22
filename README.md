<p align="center"><h1>Job Scraper</h1></p>

## 📣 About this respository

Job scraper is a simple application to scrap some job offer website and aggregate them to a discord channel.

## 🛡 Requirements

Make sure you have installed [Node.js](https://nodejs.org/en/) (you will need **at least v12.0.0**) and [Git](https://git-scm.com/).

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/). 

## ⚙ Installation

Clone this repository 

```bash
git clone https://github.com/Kotus-s/job-scraper.git
```

Go to the application folder

```bash
cd job-scraper
```

Copy the .env.sample to .env

```bash
cp .env.sample .env
```

## ✏ Fill the .env

* `MONGO_URL` specify the url of your mongodb instance
* `MONGO_USER` user used to authenticate to mongodb
* `MONGO_PASSWORD` password for the mongodb user
* `DISCORD_TOKEN` token of your discord bot
* `DISCORD_CHANNEL` channel id where all jobs will be published

## 🐳 How to use docker-compose

Start the application
```bash
docker-compose up -d --build # Build and up the stack
```

Shutdown docker stack
```bash
docker-compose down
```

## 📌 Current features and roadmap

- [x] Publish job on a discord channel
- [x] Ability to delete job offer from discord
- [ ] Making a scorer system to publish only valuable job
- [x] Handle multiple job provider
  - [x] WelcomeToTheJungle
  - [ ] Linkedin
  - [ ] Indeed

## 📄 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
