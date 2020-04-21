/*----------Main JS----------*/
var hero;

const enemy = new Enemy();
var keyAllowed = {83: true, 65: true, 68: true};

window.onload = function() {
    //wait for dom to load
    console.log("Loaded");
    assignBindings();
    $.post("/character", function(data) {
      hero = new Hero();
      heroAnimation = setInterval(function() {
        hero.draw();
      }, 500);

      hero.shield.updateStatus();


    })

}

function assignBindings() {
  $("#begin").on('click', function() {
    enemy.enterCombat(hero);
    hero.enterCombat(function() {
      enemy.exitCombat();
    })
  })

  $("#attack").on("click", function(){
    hero.attack(enemy);
  });
  $("#defend").on("mousedown", function() {
    shieldOn(hero);
  }).on("mouseup mouseout", function() {
    shieldOff(hero);
  });
  $("#dodge").on('click', function() {
    hero.dodge();
  })

  $(document).keydown(function(e) {
    if(!keyAllowed[e.which]) {
      return false;
    }
    keyAllowed[e.which] = false;

    if(e.key == "a") {
      hero.attack(enemy);
    }
    if(e.key == "s") {
      // shield(hero);
      shieldOn(hero);
    }
    if(e.key == "d") {
      hero.dodge();
    }
  });

  $(document).keyup(function(e) {
    keyAllowed[e.which] = true;
    if(e.key == "s") {
      shieldOff(hero);
    }
  });

  $(document).focus(function(){
    keyAllowed = {};
  })
}
