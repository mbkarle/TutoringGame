//class for objects that combine backend input
class DataObj {
  //helper function to easily append data to object
  appendStats(stats) {
    for(var key in stats) {
        this[key] = stats[key];
    }
  }
}

//class for cooldown actions
class Action {
    constructor(action_func, cooldown, sliderID) {
        this.available = true;
        this.cooldown = cooldown;
        this.action = action_func;
        this.sliderID = "#" + sliderID;
    }

    canAct() {
      return this.available;
    }

    disable(cooldown) {
      var time = cooldown || this.cooldown;
      this.available = false;
      var self = this;
      setTimeout(function() {
        self.available = true;
      }, time);
    }

    act(...args) {
      if(this.canAct()) {
        this.action(...args);
        this.animateSlider();
        this.disable();
      }
    }

    getCooldown() {
      return this.cooldown;
    }

    setCooldown(cooldown) {
      this.cooldown = cooldown;
    }

    animateSlider() {
      if(this.sliderID){
        $(this.sliderID).show().animate({width: "0px"}, this.cooldown, function() {
          $(this).hide().css({width: "100%"});
        });
      }
    }
}

function get(route, callback) {
  $.get(route, function(data){callback(data)})
}

//TODO improve shield class
class Shield {
  constructor(health, breakChance) {
    this.maxHealth = health;
    this.health = health;
    this.breakChance = breakChance;
    this.active = false;
    this.broken = false;
    this.repair = 5000;
  }

  isBroken() {
    if(!this.broken) {
      this.broken = (Math.random() < this.breakChance);
      if(this.broken) {
        this.setActive(false);

        let self = this;
        setTimeout(function() {
          self.broken = false;
        }, this.repair);
        this.animateSlider();
      }
    }
    return this.broken;

  }

  isActive() {
    return !this.isBroken() && this.active;
  }

  setActive(bool) {
    this.active = bool;
  }

  receiveDamage(damage) {
    this.health -= damage;
    this.updateStatus();
    if(this.health <= 0) {
      this.broken = true;
    }
  }

  updateStatus() {
    $("#defendText").html("Shield: " + this.health);
  }

  animateSlider() {
    $("#defendSlider").show().animate({width: "0px"}, this.repair, function() {
      $(this).hide().css({width: "100%"});
    });
  }

  reset() {
    this.health = this.maxHealth;
    this.broken = false;
    this.active = false;
  }

}
