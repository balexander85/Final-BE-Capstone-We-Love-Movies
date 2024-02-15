const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceCritics = reduceProperties("review_id", {
  preferred_name: ["critic", null, "preferred_name"],
  surname: ["critic", null, "surname"],
  organization_name: ["critic", null, "organization_name"],
});

const tableName = "reviews";

async function destroy(reviewId) {
  return db(tableName).where( { review_id: reviewId }).del();
}

async function list(movie_id) {
  return db("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .where({ movie_id })
      .then(reduceCritics);
}

async function read(reviewId) {
  return db(tableName).select("*").where({ review_id: reviewId }).first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
