const router = require("../router")();
const dataprovider = require("../../utilities/dataprovider");

const Model = require("mongoose").model("UserShow");
const section = "performers";

const logger = require("../../utilities/logger");

router.get("/", (req, res) => {
  dataprovider.show(req, res, section, "show", Model);
});

router.get("/events", (req, res) => {
  dataprovider.show(req, res, section, "events", Model);
});

router.get("/events/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "events", Model);
});

router.get("/partnerships", (req, res) => {
  dataprovider.show(req, res, section, "partnerships", Model);
});

router.get("/partnerships/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "partnerships", Model);
});

router.get("/footage", (req, res) => {
  dataprovider.show(req, res, section, "footage", Model);
});

router.get("/footage/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "footage", Model);
});

router.get("/playlists", (req, res) => {
  dataprovider.show(req, res, section, "playlists", Model);
});

router.get("/playlists/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "playlists", Model);
});

router.get("/galleries", (req, res) => {
  dataprovider.show(req, res, section, "galleries", Model);
});

router.get("/galleries/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "galleries", Model);
});

router.get("/videos", (req, res) => {
  dataprovider.show(req, res, section, "videos", Model);
});

router.get("/videos/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "videos", Model);
});

router.get("/performances", (req, res) => {
  dataprovider.show(req, res, section, "performances", Model);
});

router.get("/performances/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "performances", Model);
});

router.get("/crews", (req, res) => {
  dataprovider.show(req, res, section, "crews", Model);
});

router.get("/crews/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "crews", Model);
});

router.get("/members", (req, res) => {
  dataprovider.show(req, res, section, "members", Model);
});

router.get("/members/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "members", Model);
});

router.get("/news", (req, res) => {
  dataprovider.show(req, res, section, "news", Model);
});

router.get("/news/page/:page", (req, res) => {
  dataprovider.show(req, res, section, "news", Model);
});

/* router.get("/*", (req, res) => {
  res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"lnr-warning"});
}); */

module.exports = router;
