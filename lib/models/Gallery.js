const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  slug: { type: String, unique: true },
  name: String,
  owner: {
    ref: 'User',
    type: Schema.ObjectId
  },
  assets: [{ type: Schema.ObjectId, ref: 'Asset' }],
  teaserImage: { type: Schema.ObjectId, ref: 'Asset' },
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


gallerySchema.pre('remove', function (next) {
  const gallery = this;
  gallery.model('User').update(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('Crew').update(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('Event').update(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('Performance').update(
        { $pull: { galleries: gallery._id } },
        next
    );
  gallery.model('User').update(
        { $pull: { galleries: gallery._id } },
        next
    );
});
const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
