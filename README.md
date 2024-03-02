# Lena

A simple flashcard app using express.js and minimal dependencies. It supports anonymous usage and JWT-based login. It uses the filesystem for flashcard storage (simple text files), without using any propriatery storage.

# Installation

* Download the source code
* Run npm install
* Create a configuration file with Dotenv, here is an example:

```
JWT_SECRET="jwt-secret-here"
PORT=8000
```

* Run the app (it is recommended to use a reverse proxy in front of the app)

# How to create a list

It's pretty easy. A list is just a small text file with the entries separated by newline characters (\n). Answers must come first then a \t character acts as a separator between answer and question.

Example (Hungarian kings and their reign):

```
1270-72	V. István
1272-1290	Kun László
1290-1301	III. András
```

# TODO

- Add a proper encoder and user system with mysql and sqlite3 support.
- Add the ability to use images on flashcards.
- Proper english and german translations.
- Rewrite the frontend using Vue.js.
- Add more study options and PWA support with offline storage.

# Thanks

Thanks to all of my friends for supporting me and giving me the inspiration to do amazing things.