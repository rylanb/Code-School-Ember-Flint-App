var flintApp = Ember.Application.create({
  LOG_TRANSITIONS: true
});

flintApp.ApplicationAdapter = DS.FixtureAdapter.extend({});

flintApp.Router.map(function() {
  this.route('credits', {path: '/thanks'});
  this.resource('products', {path: '/items'}, function(){
    this.resource('product', {path: '/:product_id'});
    this.route('onsale');
    this.route('deals');
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

flintApp.ProductController = Ember.ObjectController.extend({
  text: '',
  ratings: [1, 2, 3, 4, 5],
  selectedRating: 5,
  actions: {
    createReview: function() {
      var review = this.store.createRecord('review', {
        text: this.get('text'),
        product: this.get('model'),
        reviewedAt: new Date()
      });
      var controller = this;
      review.save().then( function(review){
        controller.set('text', '');
        controller.get('model.reviews').addObject(review);
      } );
    },
    createRating: function() {
      var controller = this;
      var rating = controller.get('selectedRating');
      var product = controller.get('model');
      product.get('ratings').addObject(rating);
      product.save().then(function(){});
    }
  }
});


flintApp.ContactsController = Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true
});

flintApp.ReviewsController = Ember.ArrayController.extend({
  sortProperties: ['reviewedAt'],
  sortAscending: false
});

flintApp.ContactProductsController = Ember.ArrayController.extend({
  sortProperties: ['title'],
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

//Routes
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

flintApp.ProductsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('product');
  }
});

flintApp.ProductRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('product', params.product_id);
  }
});

flintApp.ProductsOnsaleRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('products').filterBy('isOnSale');
  }
});

flintApp.ProductsDealsRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('products').filter( function(product) {
      return product.get('price') < 500;
    });
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

//Models
flintApp.Product = DS.Model.extend({
  title: DS.attr('string'),
  price: DS.attr('number'),
  description: DS.attr('string'),
  isOnSale: DS.attr('string'),
  image: DS.attr('string'),
  reviews: DS.hasMany('review', {async: true}),
  crafter: DS.belongsTo('contact', {async: true}),
  ratings: DS.attr(),
  rating: function(){
    return this.get('ratings').reduce(function(previousValue, rating) {
      return previousValue + rating;
    }, 0) / this.get('ratings').length;
  }.property('ratings.@each')
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

//Views
flintApp.ProductView = Ember.View.extend({
  classNames: ['row'],
  classNameBindings: ['isOnSale'],
  isOnSale: Ember.computed.alias('controller.isOnSale')
});

//Components
flintApp.ProductDetailsComponent = Ember.Component.extend({
  reviewsCount: Ember.computed.alias('product.reviews.length'),
  hasReviews: function() {
    return this.get('reviewsCount') > 0;
  }.property('reviewsCount')
});

flintApp.ContactDetailsComponent = Ember.Component.extend({
  productsCount: Ember.computed.alias('contact.products.length'),
  isProductive: function() {
    return this.get('contact.products.length') > 3;
  }.property('productsCount')
});

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


flintApp.Product.FIXTURES = [
 {  id: 1,
    title: 'Flint',
    price: 99,
    description: 'Flint is a hard, sedimentary cryptocrystalline form of the mineral quartz, categorized as a variety of chert.',
    isOnSale: true,
    image: 'images/products/flint.png',
    reviews: [100,101],
    crafter: 200,
    ratings: [2,1,3,3]
  },
  {
    id: 2,
    title: 'Kindling',
    price: 249,
    description: 'Easily combustible small sticks or twigs used for starting a fire.',
    isOnSale: false,
    image: 'images/products/kindling.png',
    reviews: [],
    crafter: 201,
    ratings: [2,1,3,3]
  },
  {
    id: 3,
    title: 'Matches',
    price: 499,
    description: 'One end is coated with a material that can be ignited by frictional heat generated by striking the match against a suitable surface.',
    isOnSale: true,
    reviews: [],
    image: 'images/products/matches.png',
    crafter: 201,
    ratings: [2,1,3,3]
  },
  {
    id: 4,
    title: 'Bow Drill',
    price: 999,
    description: 'The bow drill is an ancient tool. While it was usually used to make fire, it was also used for primitive woodworking and dentistry.',
    isOnSale: false,
    reviews: [],
    image: 'images/products/bow-drill.png',
    crafter: 200,
    ratings: [1,3,3]
  },
  {
    id: 5,
    title: 'Tinder',
    price: 499,
    description: 'Tinder is easily combustible material used to ignite fires by rudimentary methods.',
    isOnSale: true,
    reviews: [],
    image: 'images/products/tinder.png',
    crafter: 201,
    ratings: [2,1,3]
  },
  {
    id: 6,
    title: 'Birch Bark Shaving',
    price: 999,
    description: 'Fresh and easily combustable',
    isOnSale: true,
    reviews: [],
    image: 'images/products/birch.png',
    crafter: 201,
    ratings: [2,3,5]
  }
];
