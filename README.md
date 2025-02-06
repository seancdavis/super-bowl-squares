# Super Bowl Squares

A simple app to play the football squares game during Super Bowl LIX.

## How it works

The app is built with Astro and Tailwind CSS. It uses Supabase as the database service, allowing users to spin up a new squares game board or join an existing board.

### Setting up a new board

The app does not require authentication. Anyone can create a new board, and anyone with a link (or a lucky guess) can join an existing game.

When a new board is created, the creator first sets the name of the board, along with the maximum number of squares that each player can have. Once this is set, the game is in choosing mode.

### Choosing squares

Once the board is in choosing mode, the creator can choose their squares and/or share a link to the board with other players.

Players can join the game with a direct link, or by using the ID of the board from the home page. The ID for each board is shown in the URL of the board.

### Playing the game

Once all squares have been chosen, a button appears below the board to randomly assign the teams to an axis and the digits 0-9 to a row or column.

### Marking winners

Winners are set by the application admin (you). When a quarter ends, you set a variable and run the `update-winners` script. This is easiest to do locally while connected to your production database.

Let's say the first quarter ends and the Eagles are leading 13-7. You will set the `WINNER_Q1` variable to `3,7` (the trailing digits of the score) in your `.env` file.

```bash
WINNER_Q1="3,7"
```

Then run the script.

```bash
yarn update-winners
```

This will update the database with the winners for the first quarter. Refresh your board and you will see a 1️⃣ in the square that corresponds to the winning digits.

Subsequent quarters are updated in a similar manner, but **you must keep the previous quarters' variables** when setting the next quarter's winner variable. This is why we set them in the `.env` file as opposed to setting inline while running the script.

## Deploy your own app

Before you deploy your app, you'll need to create a new project in Supabase.

Once the database is created, go to the SQL Editor and run the queries found in the `supabase/migrations` directory in order, from oldest datestamp to newest.

Then you're ready to kick off the project creation in Netlify. Click the button below.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seancdavis/super-bowl-squares)

Before deploying, give you site a name, and set the Supabase environment variables:

- `SUPABASE_URL`
- `SUPABASE_KEY`

You can find these values in the Home tab of your Supabase project.

🎉 That's it! 🏈 Wait for the build to complete, and now you have your own Super Bowl Squares app!

## Local development

If you'd like to work locally before deploying, start by setting up the Supabase database by creating a new project in Supabase and running the migrations found in the `supabase/migrations` directory in order, from oldest datestamp to newest.

Then copy the `.env.sample` file to `.env` and set the Supabase environment variables.

Install your dependencies and start the development server.

```bash
yarn install
yarn dev
```

Now you can start playing the game locally or updating the code.

## Contributing

If you do make updates and want to contribute them back to the source project, please [create a pull request](https://github.com/seancdavis/super-bowl-squares/compare).

If you don't hear from me, please ping me on [Bluesky](https://bsky.app/profile/seancdavis.com) or [X](https://x.com/seancdavis29).
