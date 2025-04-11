import createRouter from "../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const User = mongoose.model('User');

router.get('/:token', (req, res) => {
  res.render('password/reset', {
    title: req.__('Reset password'),
    token: req.params.token
  });
});

router.post('/', async (req, res) => {
  let user;
  if (!req.body?.token || req.body.token?.length<5) {
    if (req.isApi) {
      return res.send({error: true, msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`})
    } else {
      req.flash('errors', {msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`});
      return res.redirect('/password/forgot');  
    }
  } else {
    try {
      user = await User.findOne({passwordResetToken: req.body.token}, "password passwordResetToken passwordResetExpires")      
    } catch (error) {
      if (req.isApi) {
        return res.send({error: error, msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`});
        return res.redirect('/password/forgot');  
      }
    }
    console.log("useruseruseruseruser")
    console.log(user)
    if (!user) {
      if (req.isApi) {
        return res.send({error: error, msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {token: { message: req.__('Link to change the password has expired or is not valid.')}}})}`});
        return res.redirect('/password/forgot');  
      }
    }
    // FIXME Validate password…
    if (!req.body.password || (req.body.password !== req.body.retypePassword)) {
      if (req.isApi) {
        return res.send({error: true, msg: `${JSON.stringify({errors: {token: { message: req.__('Password and Password confirm does not match. Try again...')}}})}`})
      } else {
        req.flash('errors', {msg: `${JSON.stringify({errors: {password: { message: req.__('Password and Password confirm does not match. Try again...')}}})}`});
        return res.redirect('/password/forgot');  
      }
    } else {
      user.passwordResetExpires = null;
      user.passwordResetToken = null;
      user.password = req.body.password;
      //res.redirect('/password/reset/'+req.body.token);
      try {
        //user.save()
      } catch (error) {
        if (req.isApi) {
          return res.send({error: true, msg: err})
        } else {
          req.flash('errors', {msg: err});
          res.redirect('/password/reset/'+req.body.token);
        }
      }
      if (req.isApi) {
        return res.send({error: true, msg: req.__('Your password has been reset.')})
      } else {
        req.flash('success', {msg: req.__('Your password has been reset.')});
          res.redirect('/login');  
      }
    }
  }
});

export default router;
