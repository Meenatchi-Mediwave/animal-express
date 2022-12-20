require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: "cat" }));

const animal = [
  { id: 1234567, name: "joe", species: "cat" },
  { id: 7890123, name: "benny", species: "dog" },
];

const PORT = process.env.PORT || 7890;
const APP_NAME = process.env.APP_NAME || "api";

// app.get("/animal", (req, res) => {
//   return res.send(animal);
// });

app.get("/animal", (req, res) => {
  let filteredAnimals = animal;
  if (req.query.species) {
    filteredAnimals = animal.filter(
      (a) => a.species === req.query.species.toLowerCase()
    );
  }

  return res.send(filteredAnimals);
});
app.post("/animal", (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "Animal must have a name",
    });
  }
  if (!req.body.species) {
    return res.status(400).send({
      message: "Animal must have a species",
    });
  }

  const newAnimal = {
    id: new Date().getTime(),
    name: req.body.name,
    species: req.body.species.toLowerCase(),
  };
  animal.push(newAnimal);
  return res.send(newAnimal);
});

app.put("/animal/:animalid", (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "Animal name not passed",
    });
  }
  const animalIndex = animal.findIndex(
    (a) => a.id === Number(req.params.animalid)
  );

  if (animalIndex === -1) {
    return res.status(400).send({
      message: "Animal not found",
    });
  }
  animal[animalIndex]["name"] = req.body.name;
  animal[animalIndex]["species"] = req.body.species.toLowerCase();
  return res.send({
    message: "Animal updated",
  });
});

app.get("/animal/:animalsid", (req, res) => {
  const animals = animal.find((a) => a.id === Number(req.params.animalsid));
  if (!animals) {
    return res.status(400).send({
      message: "Animal not found",
    });
  }
  return res.send(animals);
});

app.delete("/animal/:animalid", (req, res) => {
  const animalIndex = animal.findIndex(
    (a) => a.id === Number(req.params.animalid)
  );

  if (animalIndex === -1) {
    return res.status(400).send({
      message: "Animal not found",
    });
  }
  animal.splice(animalIndex, 1);
  return res.send({
    message: "Animal removed",
  });
});

app.use((req, res) => {
  return res.status(400).send({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server: ${APP_NAME} running on ${PORT}`);
});
