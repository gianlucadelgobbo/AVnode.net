import createRouter from "./router.js";
const router = createRouter();

router.get('/', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect(req.get('Referrer') || '/login');
    });
  });
});

export default router;
