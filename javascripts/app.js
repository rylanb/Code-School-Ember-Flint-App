var flintApp = Ember.Application.create({
  LOG_TRANSITIONS: true
});


flintApp.Router.map(function() {
  this.route('credits', {path: '/thanks'});
  this.resource('products', {path: '/items'}, function(){
    this.resource('product', {path: '/:title'});
  });
  this.resource('contacts', function(){
    this.resource('contact', {path: '/:name'});
  });
});


flintApp.IndexController = Ember.Controller.extend({
  productsCount: 6,
  logo: '/images/logo.png',
  time: function() {
    return (new Date()).toDateString();
  }.property()
});

flintApp.ContactsIndexController = Ember.Controller.extend({
  contactName: "Rylan",
  avatar: "/images/avatar.png",
  open: function() {
    var date = (new Date()).getDay()
    var str = date != 0 ? "The Store is Open!" : "The Store is Closed!"
    return str
  }.property()
});

flintApp.ProductsRoute = Ember.Route.extend({
  model: function() {
    return flintApp.PRODUCTS;
  }
});

flintApp.ProductRoute = Ember.Route.extend({
  model: function(params) {
    return flintApp.PRODUCTS.findBy('title', params.title);
  }
});

flintApp.ContactsRoute = Ember.Route.extend({
  model: function() {
    return flintApp.CONTACTS;
  }
});

flintApp.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return flintApp.CONTACTS.findBy('name', params.name);
  }
});


flintApp.PRODUCTS = [
  {
    title: 'Flint',
    price: 99,
    description: 'Flint is a hard, sedimentary cryptocrystalline form of the mineral quartz, categorized as a variety of chert.',
    isOnSale: true,
    image: 'images/products/flint.png'
  },
  {
    title: 'Kindling',
    price: 249,
    description: 'Easily combustible small sticks or twigs used for starting a fire.',
    isOnSale: false,
    image: 'images/products/kindling.png'
  }
 ]

flintApp.CONTACTS = [
  {
     name: "Rylan Bowers",
     avatar: "images/contacts/giamia.png",
     about: "This is Rylan"
  },
  {
     name: "Nico Valencia",
     avatar: "images/contacts/anostagia.png",
     about: "This is Nico"
  }
]
