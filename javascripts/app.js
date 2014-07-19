var flintApp = Ember.Application.create({
  LOG_TRANSITIONS: true
});

flintApp.ApplicationAdapter = DS.FixtureAdapter.extend({});

flintApp.Router.map(function() {
  this.route('credits', {path: '/thanks'});
  this.resource('products', {path: '/items'}, function(){
    this.resource('product', {path: '/:product_id'});
  });
  this.resource('contacts', function(){
    this.resource('contact', {path: '/:contact_id'});
  });
});


flintApp.IndexController = Ember.ArrayController.extend({
  productCount: function() {
    return this.get('length')
  }.property('length'),
  logo: '/images/logo.png',
  onSale: function() {
    return this.filterBy('isOnSale', true).slice(0,3);
  }.property('@each.isOnSale'),
  time: function() {
    return (new Date()).toDateString();
  }.property()
});

flintApp.ProductsController = Ember.ArrayController.extend({
  sortProperties: ['title'],
  sortAscending: true
});

flintApp.ContactsController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true
});

flintApp.ContactIndexController = Ember.ObjectController.extend({
  contactName: Ember.computed.alias('name'),
  avatar: "/images/avatar.png",
  open: function() {
    var date = (new Date()).getDay()
    var str = date != 0 ? "The Store is Open!" : "The Store is Closed!"
    return str
  }.property()
});

flintApp.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('product');
  }
});

flintApp.ProductsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('product');
  }
});

flintApp.ProductRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('product', params.product_id);
  }
});

flintApp.ContactsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('contact');
  }
});

flintApp.ContactRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('contact', 200);
  }
});

flintApp.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('contact', params.contact_id);
  }
});

flintApp.Product = DS.Model.extend({
  title: DS.attr('string'),
  price: DS.attr('number'),
  description: DS.attr('string'),
  isOnSale: DS.attr('string'),
  image: DS.attr('string'),
  reviews: DS.hasMany('review', {async: true}),
  crafter: DS.belongsTo('contact', {async: true})
});

flintApp.Contact = DS.Model.extend({
  name: DS.attr('string'),
  avatar: DS.attr('string'),
  about: DS.attr('string'),
  products: DS.hasMany('product', {async: true})
});

flintApp.Review = DS.Model.extend({
  text: DS.attr('string'),
  reviewedAt: DS.attr('string'),
  product: DS.belongsTo('product')
});

flintApp.Product.FIXTURES = [
 {  id: 1,
    title: 'Flint',
    price: 99,
    description: 'Flint is a hard, sedimentary cryptocrystalline form of the mineral quartz, categorized as a variety of chert.',
    isOnSale: true,
    image: 'images/products/flint.png',
    reviews: [100,101],
    crafter: 200
  },
  {
    id: 2,
    title: 'Kindling',
    price: 249,
    description: 'Easily combustible small sticks or twigs used for starting a fire.',
    isOnSale: false,
    image: 'images/products/kindling.png',
    reviews: [],
    crafter: 201
  }
];


flintApp.Contact.FIXTURES = [
  {
    id: 200,
    name: "Rylan Bowers",
    avatar: "images/contacts/giamia.png",
    about: "This is Rylan",
    products: [1]
  },
  {
    id: 201,
    name: "Nico Valencia",
    avatar: "images/contacts/anostagia.png",
    about: "This is Nico",
    products: [2]
  }
];


flintApp.Review.FIXTURES = [
  {
    id: 100,
    product: 1,
    text: "Started a fire quickly!"
  },
  {
    id: 101,
    product: 1,
    text: "Not the brightest flame, but warm"
  }
];
