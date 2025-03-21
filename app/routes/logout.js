import createRouter from "./router.js";
const router = createRouter();
import { logger, requestLogger, errorLogger } from '../utilities/logger.js';

router.get('/', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    // 🔹 Clear the session cookie across all subdomains
    res.clearCookie("connect.sid", {
      domain: process.env.NODE_ENV === "production" ? ".avnode.net" : ".avnode.local", // ✅ Ensures logout works across subdomains
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    req.session.destroy(() => {
      logger.info("req.body logout");
      logger.info(req.query.returnTo);
      if (req.isApi) {
        res.send({logout:true, returnTo: req.query.returnTo ? req.query.returnTo : "/login"});
      } else {
        res.redirect(req.get('Referrer') || '/login');
      }
    });
  });
});

export default router;
