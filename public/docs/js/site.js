window.addEvent('domready', function() {  
  initTypography();
  initBGScroll();
  observeNav();
  
  var form = new FlippingContactForm($('contact-wrapper'), {});
});

var FlippingContactForm = new Class({
  Implements: [Options, Events],
  
  options: {
    dropDelay: 2500,
    thanksDelay: 3500
  },
  senderName: '',
  senderEmail: '',
  
  initialize: function(container, options) { 
    this.setOptions(options);
    this.container = $(container);
    this.form = this.container.getElement('form');

    new Form.Validator.Inline(this.form);
    new Form.Request(this.form, null, {
        requestOptions: {
          useSpinner: false
        },
        onSend: function() {
          this.flipForm()
        }.bind(this),
        onSuccess: function(target, response) {
          var status = JSON.decode(response[0].data.clean(), true);
          if (status == null) {
            this.showErrorMessage()
          }
          else if (status.code == "1") {
            this.showThanks()
          }
          else {
            this.showErrorMessage()
          }
        }.bind(this),
        onFailure: function() {
          alert('failed');
        }.bind(this)
    });
    $$('#send-another').addEvent('click', function(e) {
      e.stop();
      this.resetForm();
    }.bind(this));
  },

  flipForm: function() {
    $('from').set('html', $('name').get('value'));
    this.senderName = $('name').get('value');
    this.senderEmail = $('email').get('value');
    $$('#mail-slot').show();
    this.container.addClass('flip'); 
    (function() { this.dropForm(); }).delay(this.options.dropDelay, this);
    if (!Modernizr.csstransforms3d) {
      $('form-wrapper').morph({opacity: 0});
      $('envelope').morph({opacity: 1});
    }
  },

  dropForm: function() {
    this.container.setStyle('overflow', 'hidden');
    this.container.getChildren('.inner').move({
      relativeTo: this.container,
      offset: {x: 0, y: 500},
      transition: Fx.Transitions.Quint.easeIn      
    });
  },

  showThanks: function() {
    (function() { $('thanks').reveal({duration: 1000}); }).delay(this.options.thanksDelay, this);
  },

  showErrorMessage: function() {
    (function() { $('error').reveal({duration: 1000}); }).delay(this.options.thanksDelay, this);
  },

  resetForm: function() {
    $$('#thanks').hide();
    $$('#mail-slot').hide();    
    this.container.setStyle('overflow', 'visible');
    this.container.removeClass('flip');     
    this.container.getChildren('.inner').move({
      relativeTo: this.container,
      offset: {x: 0, y: -500},
      transition: Fx.Transitions.Quint.easeOut        
    });
    if (!Modernizr.csstransforms3d) {
      $('form-wrapper').morph({opacity: 1});
      $('envelope').morph({opacity: 0});
    }
    $('name').set('value', this.senderName);
    $('email').set('value', this.senderEmail);
    $('message').set('value', '');
    (function() { $('message').focus(); }).delay(500, this);
  }
});

function observeNav() {
  $$('nav ul li a.section').addEvent('click', function(e) {
    e.stop();
    var myFx = new Fx.Scroll(window).toElement(this.get('data-nav-section'));    
  });
}

function initTypography() {
  try {
    Typekit.load({
      active: function() {
        $$('#content').tween('opacity', '1');
      },
      inactive: function() {
        $$('#content').tween('opacity', '1');
      }
    })
  } catch(e) {}  
}

function initBGScroll() {
  positionBG();
  window.addEvent('scroll', function(event) {
    positionBG();
  });  
}

function positionBG() {
  var scroll = window.getScroll();  
  $$('img#bg').setStyle('top', '-' + 0.3*scroll.y + 'px')    
}


/*
$$('#slide-out-trigger').addEvent('click', function(e) {
  e.stop();
  $('slider1').move({
    position: 'upperLeft',
    edge: 'upperRight'
  })
  $('slider2').move({
    position: 'upperRight',
    edge: 'upperLeft',
    // offset: {x: 100, y: 0}       
  })
});

$$('#slide-in-trigger').addEvent('click', function(e) {
  e.stop();
  $('slider1').move({
    relativeTo: $('content'),
    position: 'upperLeft',
    edge: 'upperLeft',
    transition: Fx.Transitions.Back.easeOut      
  })
  $('slider2').move({
    relativeTo: $('content'),      
    position: 'upperRight',
    edge: 'upperRight',
    transition: Fx.Transitions.Back.easeOut
  })
});
*/
